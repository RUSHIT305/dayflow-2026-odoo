import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Building,
  Home,
  Briefcase,
  Megaphone,
  PlusCircle,
  CalendarCheck,
  CalendarDays,
  FileText,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { formatCurrency, formatDate, formatSecondsToTimer, getDepartmentColor } from '../../utils/formatters';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  onOpenApplyLeave: () => void;
  onOpenAddEmployee: () => void;
  onViewEmployeeDetail: (employeeId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenApplyLeave,
  onOpenAddEmployee,
  onViewEmployeeDetail,
}) => {
  const {
    currentUser,
    isAdmin,
    isManager,
    isEmployeeOnly,
    employees,
    attendanceRecords,
    leaveRequests,
    leaveBalances,
    payrollCycles,
    payslips,
    announcements,
    holidays,
    isClockedIn,
    clockInTime,
    isOnBreak,
    workTimerSeconds,
    breakTimerSeconds,
    clockIn,
    clockOut,
    toggleBreak,
    reviewLeaveRequest,
  } = useHR();

  const [selectedWorkMode, setSelectedWorkMode] = useState<'Office' | 'Remote' | 'Client Site'>('Office');
  const [reviewModalRequest, setReviewModalRequest] = useState<any | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const todayDateStr = '2026-08-31';

  // Stats calculation
  const activeEmployees = employees.filter((e) => e.status !== 'Terminated');
  const todayRecords = attendanceRecords.filter((r) => r.date === todayDateStr);

  const presentCount = todayRecords.filter((r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Half Day').length;
  const inOfficeCount = todayRecords.filter((r) => (r.status === 'Present' || r.status === 'Late') && r.workMode === 'Office').length;
  const remoteCount = todayRecords.filter((r) => (r.status === 'Present' || r.status === 'Late') && r.workMode === 'Remote').length;
  const onLeaveToday = todayRecords.filter((r) => r.status === 'On Leave').length;
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending');
  const pendingRegularizations = attendanceRecords.filter((r) => r.regularizationStatus === 'Pending');

  // Breakdown for Team Status
  const onDutyCount = presentCount;
  const onBreakCount = isOnBreak ? 1 : 2;
  const offDutyCount = Math.max(0, activeEmployees.length - onDutyCount);

  // Attendance rate %
  const attendanceRate = activeEmployees.length > 0 ? ((presentCount / activeEmployees.length) * 100).toFixed(1) : '100';

  // User leave balance
  const userBalance = leaveBalances[currentUser.id] || {
    employeeId: currentUser.id,
    annualTotal: 20,
    annualUsed: 0,
    sickTotal: 12,
    sickUsed: 0,
    casualTotal: 10,
    casualUsed: 0,
    unpaidUsed: 0,
  };

  // User latest payslip
  const userPayslips = payslips.filter((p) => p.employeeId === currentUser.id);
  const latestPayslip = userPayslips[0];

  // Upcoming holidays
  const upcomingHolidays = holidays.slice(5, 8);

  const handleReview = (approved: boolean) => {
    if (reviewModalRequest) {
      reviewLeaveRequest(reviewModalRequest.id, approved, reviewNote);
      setReviewModalRequest(null);
      setReviewNote('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics (Clean Minimalism style) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Headcount */}
        <div 
          onClick={() => setActiveTab('employees')}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all cursor-pointer"
        >
          <div className="text-sm text-gray-500 mb-2">Total Headcount</div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900">{activeEmployees.length}</span>
            <span className="text-green-600 text-sm font-medium flex items-center gap-0.5">
              +4% <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Leave Pending */}
        <div 
          onClick={() => setActiveTab('leave')}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all cursor-pointer"
        >
          <div className="text-sm text-gray-500 mb-2">Leave Pending</div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900">
              {String(pendingLeaves.length).padStart(2, '0')}
            </span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded">
              {pendingLeaves.length > 0 ? 'Review Required' : 'All Clear'}
            </span>
          </div>
        </div>

        {/* Today's Attendance */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all cursor-pointer"
        >
          <div className="text-sm text-gray-500 mb-2">Today's Attendance</div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900">{attendanceRate}%</span>
            <span className="text-gray-400 text-sm">{presentCount}/{activeEmployees.length} In</span>
          </div>
        </div>

        {/* Payroll Cycle */}
        <div 
          onClick={() => setActiveTab('payroll')}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all cursor-pointer"
        >
          <div className="text-sm text-gray-500 mb-2">Payroll Cycle</div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900">5d</span>
            <span className="text-gray-400 text-sm italic">Until Disbursement</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid: 3-column / 1-column layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Leave Requests Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-800 text-base">Recent Leave Requests</h2>
                <p className="text-xs text-gray-500">Employee time-off applications pending review</p>
              </div>
              <button 
                onClick={() => setActiveTab('leave')}
                className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Employee</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Duration</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveRequests.slice(0, 4).map((req) => (
                    <tr key={req.id} className="text-sm hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                          {req.employeeName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{req.employeeName}</p>
                          <p className="text-xs text-gray-500">{req.department}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          req.leaveType === 'Paid Annual'
                            ? 'bg-blue-50 text-blue-700'
                            : req.leaveType === 'Sick Leave'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-teal-50 text-teal-700'
                        }`}>
                          {req.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {formatDate(req.startDate)} - {formatDate(req.endDate)} ({req.totalDays}d)
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setReviewModalRequest(req)}
                              className="text-blue-600 font-semibold px-3 py-1 hover:bg-blue-50 rounded transition-colors text-xs cursor-pointer"
                            >
                              Review
                            </button>
                          </div>
                        ) : (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            req.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {req.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Attendance / Presence Board */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Workforce Presence Today</h3>
                <p className="text-xs text-gray-500">Live roster for August 31, 2026</p>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Timesheet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {employees.slice(0, 6).map((emp) => {
                const rec = todayRecords.find((r) => r.employeeId === emp.id);
                const isPresent = rec?.status === 'Present' || rec?.status === 'Late';
                const isOnLeave = rec?.status === 'On Leave';
                const deptColor = getDepartmentColor(emp.department);

                return (
                  <div
                    key={emp.id}
                    onClick={() => onViewEmployeeDetail(emp.id)}
                    className="p-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-white transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={emp.avatar}
                          alt={emp.firstName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                            isPresent ? 'bg-green-500' : isOnLeave ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <span className={`inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.2 rounded ${deptColor.bg} ${deptColor.text}`}>
                          {emp.department}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-xs">
                      {isPresent ? (
                        <div>
                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">
                            {rec?.workMode === 'Remote' ? 'Remote' : 'Office'}
                          </span>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">{rec?.clockIn?.substring(0, 5)}</p>
                        </div>
                      ) : isOnLeave ? (
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                          On Leave
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          Offline
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          {/* Dark Clock In / Out Widget */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Clock In / Out</p>
                <span className="text-[11px] text-gray-400 font-mono">Aug 31, 2026</span>
              </div>
              <h3 className="text-4xl font-mono mb-4 text-white">
                {isClockedIn ? formatSecondsToTimer(workTimerSeconds) : '08:42:15'}
              </h3>

              {/* Work Mode Toggle if not clocked in */}
              {!isClockedIn ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1 bg-gray-800 p-1 rounded-xl text-xs">
                    <button
                      onClick={() => setSelectedWorkMode('Office')}
                      className={`py-1.5 rounded-lg font-medium transition-colors ${
                        selectedWorkMode === 'Office' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Office
                    </button>
                    <button
                      onClick={() => setSelectedWorkMode('Remote')}
                      className={`py-1.5 rounded-lg font-medium transition-colors ${
                        selectedWorkMode === 'Remote' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Remote
                    </button>
                    <button
                      onClick={() => setSelectedWorkMode('Client Site')}
                      className={`py-1.5 rounded-lg font-medium transition-colors ${
                        selectedWorkMode === 'Client Site' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Client
                    </button>
                  </div>

                  <button
                    id="dash-punch-in-btn"
                    onClick={() => clockIn(selectedWorkMode)}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-white cursor-pointer"
                  >
                    Punch In Now
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={toggleBreak}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        isOnBreak ? 'bg-amber-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      {isOnBreak ? 'Resume Work' : 'Take Break'}
                    </button>
                    <button
                      onClick={clockOut}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Clock Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-5 rounded-full pointer-events-none"></div>
          </div>

          {/* Team Status Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 text-base">Team Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">On Duty</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{onDutyCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">On Break</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{onBreakCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-700">Off Duty</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{offDutyCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Notices & Holidays */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-bold text-gray-800 text-base">Notices & Holidays</h2>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatDate(ann.createdAt.split(' ')[0])}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">{ann.title}</h4>
                  <p className="text-[11px] text-gray-600 line-clamp-2 mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leave Review Modal */}
      {reviewModalRequest && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Review Leave Request</h3>
                <p className="text-xs text-gray-500">Submitted by {reviewModalRequest.employeeName}</p>
              </div>
              <button
                onClick={() => setReviewModalRequest(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-gray-500 block">Leave Type:</span>
                  <span className="font-bold text-gray-900">{reviewModalRequest.leaveType}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Duration:</span>
                  <span className="font-bold text-blue-600">{reviewModalRequest.totalDays} day(s)</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Date Range:</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(reviewModalRequest.startDate)} to {formatDate(reviewModalRequest.endDate)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Department:</span>
                  <span className="font-medium text-gray-800">{reviewModalRequest.department}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-gray-700 block mb-1">Reason:</span>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {reviewModalRequest.reason}
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Remarks (Optional):</label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Approved. Please hand over active tickets."
                  rows={2}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReview(false)}
                className="flex-1 py-2.5 px-4 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleReview(true)}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Leave</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
