import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  Plus, 
  Users, 
  Check, 
  X,
  FileText,
  Building
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { formatDate, getStatusBadge } from '../../utils/formatters';
import { LeaveRequest } from '../../types';

interface LeaveViewProps {
  onOpenApplyLeave: () => void;
}

export const LeaveView: React.FC<LeaveViewProps> = ({ onOpenApplyLeave }) => {
  const {
    currentUser,
    isAdmin,
    isManager,
    leaveRequests,
    leaveBalances,
    reviewLeaveRequest,
    cancelLeaveRequest,
    employees,
  } = useHR();

  const [activeTab, setActiveTab] = useState<'my-leaves' | 'approvals' | 'calendar'>('my-leaves');
  const [reviewRequestModal, setReviewRequestModal] = useState<LeaveRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  const myBalance = leaveBalances[currentUser.id] || {
    employeeId: currentUser.id,
    annualTotal: 20,
    annualUsed: 0,
    sickTotal: 12,
    sickUsed: 0,
    casualTotal: 10,
    casualUsed: 0,
    unpaidUsed: 0,
  };

  const myRequests = leaveRequests.filter((r) => r.employeeId === currentUser.id);
  const pendingApprovals = leaveRequests.filter((r) => r.status === 'Pending');

  const handleReviewAction = (approved: boolean) => {
    if (reviewRequestModal) {
      reviewLeaveRequest(reviewRequestModal.id, approved, reviewRemarks);
      setReviewRequestModal(null);
      setReviewRemarks('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Leave Management</h2>
          <p className="text-xs text-gray-500">
            Submit leave requests, track quota balances, review team time-off, and monitor department schedules
          </p>
        </div>

        <button
          id="apply-leave-btn-main"
          onClick={onOpenApplyLeave}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Annual Leave */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Paid Annual Leave</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                {myBalance.annualTotal - myBalance.annualUsed} Available
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-gray-900">
                {myBalance.annualTotal - myBalance.annualUsed}
              </span>
              <span className="text-xs text-gray-500">/ {myBalance.annualTotal} days quota</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${(myBalance.annualUsed / myBalance.annualTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Sick Leave */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-green-700">Sick Leave</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-green-50 text-green-800">
                {myBalance.sickTotal - myBalance.sickUsed} Available
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-gray-900">
                {myBalance.sickTotal - myBalance.sickUsed}
              </span>
              <span className="text-xs text-gray-500">/ {myBalance.sickTotal} days quota</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-green-600 h-full rounded-full transition-all"
              style={{ width: `${(myBalance.sickUsed / myBalance.sickTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Casual Leave */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Casual Leave</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                {myBalance.casualTotal - myBalance.casualUsed} Available
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-gray-900">
                {myBalance.casualTotal - myBalance.casualUsed}
              </span>
              <span className="text-xs text-gray-500">/ {myBalance.casualTotal} days quota</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all"
              style={{ width: `${(myBalance.casualUsed / myBalance.casualTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white rounded-2xl px-3 shadow-sm">
        <button
          onClick={() => setActiveTab('my-leaves')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'my-leaves'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Leave Requests</span>
        </button>

        {(isAdmin || isManager) && (
          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Approvals Queue</span>
            {pendingApprovals.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('calendar')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'calendar'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Team Leave Schedule</span>
        </button>
      </div>

      {/* TAB 1: My Requests */}
      {activeTab === 'my-leaves' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">My Leave Request History</h3>
              <p className="text-xs text-gray-500">Track current status, reviewer comments, and cancel pending applications</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Applied On</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myRequests.map((req) => {
                  const statusBadge = getStatusBadge(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">{req.leaveType}</td>
                      <td className="py-3 px-4 font-semibold text-blue-700">
                        {req.totalDays} day(s) {req.isHalfDay && `(${req.halfDayPeriod})`}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {formatDate(req.startDate)} {req.startDate !== req.endDate ? `to ${formatDate(req.endDate)}` : ''}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate" title={req.reason}>
                        {req.reason}
                      </td>
                      <td className="py-3 px-4 text-gray-400">{formatDate(req.appliedAt.split(' ')[0])}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge.bg} ${statusBadge.text}`}>
                          {req.status}
                        </span>
                        {req.reviewComments && (
                          <span className="block text-[10px] text-gray-400 italic mt-0.5">
                            "{req.reviewComments}"
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => cancelLeaveRequest(req.id)}
                            className="text-red-600 hover:underline font-semibold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Approvals Queue */}
      {activeTab === 'approvals' && (isAdmin || isManager) && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Pending Team Leave Approvals</h3>
              <p className="text-xs text-gray-500">Review, approve, or reject employee time-off requests</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              {pendingApprovals.length} Pending
            </span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-800">No pending leave requests</p>
              <p className="text-[11px] text-gray-500 mt-0.5">All employee leave requests have been reviewed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingApprovals.map((req) => (
                <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{req.employeeName}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                        {req.department}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold text-blue-600">{req.leaveType} Leave</span> • {req.totalDays} day(s) ({formatDate(req.startDate)} to {formatDate(req.endDate)})
                    </p>
                    <p className="text-xs text-gray-500 italic mt-0.5">"{req.reason}"</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReviewRequestModal(req);
                        setReviewRemarks('');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Review & Decide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Team Calendar */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-base">August 2026 Team Leave Schedule</h3>
            <p className="text-xs text-gray-500">Scheduled time-off across all active departments</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveRequests
              .filter((r) => r.status === 'Approved')
              .map((req) => (
                <div key={req.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900">{req.employeeName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                      {req.leaveType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formatDate(req.startDate)} – {formatDate(req.endDate)} ({req.totalDays}d)
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">{req.department}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Leave Review Modal */}
      {reviewRequestModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Review Leave Request</h3>
              <button onClick={() => setReviewRequestModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5">
                <p><span className="text-gray-500">Applicant:</span> <strong className="text-gray-900">{reviewRequestModal.employeeName}</strong></p>
                <p><span className="text-gray-500">Leave Type:</span> <strong>{reviewRequestModal.leaveType}</strong> ({reviewRequestModal.totalDays} days)</p>
                <p><span className="text-gray-500">Duration:</span> {formatDate(reviewRequestModal.startDate)} to {formatDate(reviewRequestModal.endDate)}</p>
                <p><span className="text-gray-500">Reason:</span> "{reviewRequestModal.reason}"</p>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Manager Note / Comments:</label>
                <textarea
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="e.g. Approved. Please confirm coverage."
                  rows={2}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReviewAction(false)}
                className="flex-1 py-2.5 px-4 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => handleReviewAction(true)}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Approve Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
