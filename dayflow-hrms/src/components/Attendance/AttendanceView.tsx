import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  Plus, 
  Building, 
  Home, 
  Briefcase, 
  Coffee, 
  Play, 
  Square,
  Users,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { formatCurrency, formatDate, formatSecondsToTimer, getStatusBadge } from '../../utils/formatters';
import { AttendanceStatus, WorkMode } from '../../types';

export const AttendanceView: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    isManager,
    isEmployeeOnly,
    employees,
    attendanceRecords,
    isClockedIn,
    clockInTime,
    isOnBreak,
    workTimerSeconds,
    breakTimerSeconds,
    clockIn,
    clockOut,
    toggleBreak,
    requestRegularization,
    reviewRegularization,
    addManualAttendance,
  } = useHR();

  const [activeSubTab, setActiveSubTab] = useState<'my-attendance' | 'workforce-presence' | 'regularizations'>('my-attendance');
  const [selectedWorkMode, setSelectedWorkMode] = useState<'Office' | 'Remote' | 'Client Site'>('Office');
  const [selectedDateFilter, setSelectedDateFilter] = useState('2026-08-31');
  const [presenceFilter, setPresenceFilter] = useState<'All' | 'Office' | 'Remote' | 'On Leave' | 'Offline'>('All');

  // Modals state
  const [showRegularizeModal, setShowRegularizeModal] = useState(false);
  const [regularizeRecordId, setRegularizeRecordId] = useState('');
  const [regularizeReason, setRegularizeReason] = useState('');

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualEmpId, setManualEmpId] = useState(employees[0]?.id || '');
  const [manualDate, setManualDate] = useState('2026-08-31');
  const [manualClockIn, setManualClockIn] = useState('09:00:00');
  const [manualClockOut, setManualClockOut] = useState('17:30:00');
  const [manualStatus, setManualStatus] = useState<AttendanceStatus>('Present');
  const [manualMode, setManualMode] = useState<WorkMode>('Office');

  // Review modal state
  const [reviewRegRecord, setReviewRegRecord] = useState<any | null>(null);
  const [reviewRegNote, setReviewRegNote] = useState('');

  // My Attendance records (August 2026)
  const myRecords = attendanceRecords
    .filter((r) => r.employeeId === currentUser.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Compute My Attendance Metrics for current month
  const workingDays = myRecords.filter((r) => r.status !== 'Weekend').length;
  const presentDays = myRecords.filter((r) => r.status === 'Present').length;
  const lateDays = myRecords.filter((r) => r.status === 'Late').length;
  const halfDays = myRecords.filter((r) => r.status === 'Half Day').length;
  const leaveDays = myRecords.filter((r) => r.status === 'On Leave').length;
  const totalWorkHours = myRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);

  // Workforce presence for selected date
  const dateRecords = attendanceRecords.filter((r) => r.date === selectedDateFilter);
  const allEmployeesList = employees.filter((e) => e.status !== 'Terminated');

  const pendingRegularizations = attendanceRecords.filter((r) => r.regularizationStatus === 'Pending');

  const handleOpenRegularize = (recordId: string) => {
    setRegularizeRecordId(recordId);
    setRegularizeReason('');
    setShowRegularizeModal(true);
  };

  const handleSaveRegularization = (e: React.FormEvent) => {
    e.preventDefault();
    if (regularizeRecordId && regularizeReason) {
      requestRegularization(regularizeRecordId, regularizeReason);
      setShowRegularizeModal(false);
      setRegularizeReason('');
    }
  };

  const handleSaveManualAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    addManualAttendance(manualEmpId, manualDate, manualClockIn, manualClockOut, manualStatus, manualMode);
    setShowManualModal(false);
  };

  const handleExportCSV = () => {
    const headers = 'Employee ID,Date,Clock In,Clock Out,Total Hours,Break Minutes,Work Mode,Status\n';
    const rows = attendanceRecords
      .map((r) => `${r.employeeId},${r.date},${r.clockIn || ''},${r.clockOut || ''},${r.totalHours},${r.breakMinutes},${r.workMode},${r.status}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DayFlow_Attendance_Report_Aug2026.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Attendance & Timesheet</h2>
          <p className="text-xs text-gray-500">
            Real-time punch clock, monthly timesheets, regularization requests, and workforce presence oversight
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(isAdmin || isManager) && (
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setShowManualModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manual Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex border-b border-gray-200 bg-white rounded-2xl px-3 shadow-sm">
        <button
          onClick={() => setActiveSubTab('my-attendance')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'my-attendance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Daily Punch & Timesheet</span>
        </button>

        {(isAdmin || isManager) && (
          <button
            onClick={() => setActiveSubTab('workforce-presence')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'workforce-presence'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Workforce Live Presence</span>
          </button>
        )}

        {(isAdmin || isManager) && (
          <button
            onClick={() => setActiveSubTab('regularizations')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'regularizations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Regularization Queue</span>
            {pendingRegularizations.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                {pendingRegularizations.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* TAB 1: My Attendance & Timesheet */}
      {activeSubTab === 'my-attendance' && (
        <div className="space-y-6">
          {/* Live Punch Clock Widget */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Daily Punch Terminal</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  Monday, August 31, 2026
                </h3>
              </div>

              {/* Work Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 self-start">
                <button
                  onClick={() => setSelectedWorkMode('Office')}
                  disabled={isClockedIn}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedWorkMode === 'Office' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>In Office</span>
                </button>
                <button
                  onClick={() => setSelectedWorkMode('Remote')}
                  disabled={isClockedIn}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedWorkMode === 'Remote' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Remote</span>
                </button>
                <button
                  onClick={() => setSelectedWorkMode('Client Site')}
                  disabled={isClockedIn}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedWorkMode === 'Client Site' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Client Site</span>
                </button>
              </div>
            </div>

            {/* Metrics & Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                <span className="text-xs text-gray-500 block mb-1">Check-in Status</span>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm font-bold text-gray-900">
                    {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 block mt-1 font-mono">
                  {clockInTime ? `Punch Time: ${clockInTime}` : 'Punch in to record attendance'}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                <span className="text-xs text-gray-500 block mb-1">Active Working Time</span>
                <span className="text-2xl font-mono font-bold text-gray-900">
                  {formatSecondsToTimer(workTimerSeconds)}
                </span>
                <span className="text-[11px] text-gray-500 block mt-1">Expected: 8h 00m per workday</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                <span className="text-xs text-gray-500 block mb-1">Break Time Elapsed</span>
                <span className="text-2xl font-mono font-bold text-amber-600">
                  {formatSecondsToTimer(breakTimerSeconds)}
                </span>
                <span className="text-[11px] text-gray-500 block mt-1">
                  {isOnBreak ? 'On Break' : 'Standard 1 hour lunch & tea breaks'}
                </span>
              </div>
            </div>

            {/* Terminal Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {!isClockedIn ? (
                <button
                  id="att-clockin-btn"
                  onClick={() => clockIn(selectedWorkMode)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Clock In Now ({selectedWorkMode})</span>
                </button>
              ) : (
                <>
                  <button
                    id="att-break-btn"
                    onClick={toggleBreak}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      isOnBreak
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>{isOnBreak ? 'Resume Work' : 'Take Break'}</span>
                  </button>

                  <button
                    id="att-clockout-btn"
                    onClick={clockOut}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Clock Out For Day</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Monthly Timesheet Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">August 2026 Monthly Timesheet</h3>
                <p className="text-xs text-gray-500">Full logs of daily check-ins, check-outs, and hours worked</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                Total Work Hours: {totalWorkHours.toFixed(1)}h
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Work Mode</th>
                    <th className="py-3.5 px-4">Clock In</th>
                    <th className="py-3.5 px-4">Clock Out</th>
                    <th className="py-3.5 px-4">Total Hours</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Regularization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myRecords.map((rec) => {
                    const statusBadge = getStatusBadge(rec.status);
                    return (
                      <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {formatDate(rec.date)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{rec.workMode}</td>
                        <td className="py-3 px-4 font-mono text-gray-700">{rec.clockIn || '—'}</td>
                        <td className="py-3 px-4 font-mono text-gray-700">{rec.clockOut || '—'}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-gray-900">
                          {rec.totalHours ? `${rec.totalHours.toFixed(1)}h` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge.bg} ${statusBadge.text}`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {rec.regularizationStatus === 'Pending' ? (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                              Pending Review
                            </span>
                          ) : rec.regularizationStatus === 'Approved' ? (
                            <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                              Regularized
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenRegularize(rec.id)}
                              className="text-blue-600 hover:underline font-semibold text-xs cursor-pointer"
                            >
                              Request Correction
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
        </div>
      )}

      {/* TAB 2: Workforce Live Presence */}
      {activeSubTab === 'workforce-presence' && (isAdmin || isManager) && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Workforce Daily Presence Roster</h3>
              <p className="text-xs text-gray-500">Live attendance monitoring by date</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="text-xs p-2 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Work Mode</th>
                  <th className="py-3.5 px-4">Clock In</th>
                  <th className="py-3.5 px-4">Clock Out</th>
                  <th className="py-3.5 px-4">Hours</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allEmployeesList.map((emp) => {
                  const rec = dateRecords.find((r) => r.employeeId === emp.id);
                  const status = rec?.status || 'Absent';
                  const badge = getStatusBadge(status);

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.firstName} className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200" />
                        <div>
                          <span className="font-bold text-gray-900 block">{emp.firstName} {emp.lastName}</span>
                          <span className="text-[11px] font-mono text-gray-400">{emp.employeeCode}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{emp.department}</td>
                      <td className="py-3 px-4 text-gray-600">{rec?.workMode || '—'}</td>
                      <td className="py-3 px-4 font-mono text-gray-700">{rec?.clockIn || '—'}</td>
                      <td className="py-3 px-4 font-mono text-gray-700">{rec?.clockOut || '—'}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-gray-900">{rec?.totalHours ? `${rec.totalHours.toFixed(1)}h` : '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Regularizations Queue */}
      {activeSubTab === 'regularizations' && (isAdmin || isManager) && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-base">Attendance Regularization Queue</h3>
            <p className="text-xs text-gray-500">Employee correction requests for missed or faulty biometric punches</p>
          </div>

          {pendingRegularizations.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-800">No pending regularization requests</p>
              <p className="text-[11px] text-gray-500 mt-0.5">All attendance correction requests are resolved.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingRegularizations.map((rec) => {
                const emp = employees.find((e) => e.id === rec.employeeId);
                return (
                  <div key={rec.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={emp?.avatar} alt={emp?.firstName} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{emp?.firstName} {emp?.lastName} ({emp?.department})</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Date: <span className="font-semibold text-gray-800">{formatDate(rec.date)}</span> • Reason: "{rec.regularizationReason}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => reviewRegularization(rec.id, false, 'Rejected by manager')}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => reviewRegularization(rec.id, true, 'Approved correction')}
                        className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Regularization Request Modal */}
      {showRegularizeModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveRegularization} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Request Attendance Regularization</h3>
              <button type="button" onClick={() => setShowRegularizeModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Reason for Missed / Incorrect Punch:</label>
                <textarea
                  value={regularizeReason}
                  onChange={(e) => setRegularizeReason(e.target.value)}
                  placeholder="e.g. Biometric device offline at client site. Worked 09:00 - 17:30."
                  required
                  rows={3}
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRegularizeModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveManualAttendance} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Manual Attendance Entry</h3>
              <button type="button" onClick={() => setShowManualModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Select Employee:</label>
                <select
                  value={manualEmpId}
                  onChange={(e) => setManualEmpId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Date:</label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Clock In Time:</label>
                  <input
                    type="time"
                    step="1"
                    value={manualClockIn}
                    onChange={(e) => setManualClockIn(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Clock Out Time:</label>
                  <input
                    type="time"
                    step="1"
                    value={manualClockOut}
                    onChange={(e) => setManualClockOut(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Status:</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Work Mode:</label>
                  <select
                    value={manualMode}
                    onChange={(e) => setManualMode(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  >
                    <option value="Office">Office</option>
                    <option value="Remote">Remote</option>
                    <option value="Client Site">Client Site</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Attendance
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
