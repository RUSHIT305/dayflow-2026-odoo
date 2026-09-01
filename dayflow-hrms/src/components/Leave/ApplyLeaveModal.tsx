import React, { useState } from 'react';
import { X, CalendarCheck, AlertCircle, Info, Calendar } from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { LeaveType } from '../../types';

interface ApplyLeaveModalProps {
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ onClose }) => {
  const { currentUser, leaveBalances, submitLeaveRequest } = useHR();

  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Annual');
  const [startDate, setStartDate] = useState('2026-09-08');
  const [endDate, setEndDate] = useState('2026-09-09');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState<'First Half' | 'Second Half'>('First Half');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentBalance = leaveBalances[currentUser.id] || {
    employeeId: currentUser.id,
    annualTotal: 20,
    annualUsed: 0,
    sickTotal: 12,
    sickUsed: 0,
    casualTotal: 10,
    casualUsed: 0,
    unpaidUsed: 0,
  };

  // Compute available balance for selected type
  let available = 0;
  if (leaveType === 'Paid Annual') available = currentBalance.annualTotal - currentBalance.annualUsed;
  if (leaveType === 'Sick Leave') available = currentBalance.sickTotal - currentBalance.sickUsed;
  if (leaveType === 'Casual Leave') available = currentBalance.casualTotal - currentBalance.casualUsed;
  if (leaveType === 'Unpaid Leave') available = 99;

  // Calculate working days
  const start = new Date(startDate);
  const end = new Date(endDate);
  let calculatedDays = 0;

  if (endDate >= startDate) {
    if (isHalfDay) {
      calculatedDays = 0.5;
    } else {
      let cur = new Date(start);
      while (cur <= end) {
        const d = cur.getDay();
        if (d !== 0 && d !== 6) calculatedDays++;
        cur.setDate(cur.getDate() + 1);
      }
      if (calculatedDays === 0) calculatedDays = 1;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please specify a reason for your leave request.');
      return;
    }

    const result = submitLeaveRequest({
      leaveType,
      startDate,
      endDate: isHalfDay ? startDate : endDate,
      isHalfDay,
      halfDayPeriod: isHalfDay ? halfDayPeriod : undefined,
      reason,
    });

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Submit Leave Request</h3>
              <p className="text-xs text-gray-500">Apply for time off with automated quota validation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Leave Category:</label>
            <select
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value as LeaveType);
                setErrorMsg('');
              }}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Paid Annual">Paid Annual Leave (Available: {currentBalance.annualTotal - currentBalance.annualUsed}d)</option>
              <option value="Sick Leave">Sick Leave (Available: {currentBalance.sickTotal - currentBalance.sickUsed}d)</option>
              <option value="Casual Leave">Casual Leave (Available: {currentBalance.casualTotal - currentBalance.casualUsed}d)</option>
              <option value="Unpaid Leave">Unpaid Leave (Loss of Pay)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">From Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">To Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isHalfDay}
                required
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          {/* Half day checkbox */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="half-day"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="half-day" className="font-semibold text-gray-700">Apply as Half Day</label>
            </div>

            {isHalfDay && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHalfDayPeriod('First Half')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                    halfDayPeriod === 'First Half' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  1st Half
                </button>
                <button
                  type="button"
                  onClick={() => setHalfDayPeriod('Second Half')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                    halfDayPeriod === 'Second Half' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  2nd Half
                </button>
              </div>
            )}
          </div>

          {/* Duration Summary */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
            <span className="text-blue-800 font-semibold">Total Days Requested:</span>
            <span className="font-bold text-blue-900 text-sm font-mono">{calculatedDays} Day(s)</span>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Reason for Leave:</label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Please provide details for your manager to review..."
              rows={3}
              required
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
