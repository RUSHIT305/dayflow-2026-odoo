import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  Bell, 
  Shield, 
  UserCheck, 
  Users, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Coffee,
  Play,
  Square,
  ChevronDown
} from 'lucide-react';
import { useHR } from '../context/HRContext';
import { formatSecondsToTimer } from '../utils/formatters';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    employees,
    switchRoleUser,
    isClockedIn,
    clockInTime,
    isOnBreak,
    workTimerSeconds,
    breakTimerSeconds,
    clockIn,
    clockOut,
    toggleBreak,
    leaveRequests,
    attendanceRecords,
    resetToSampleData,
  } = useHR();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Pending counts
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending').length;
  const pendingRegularizations = attendanceRecords.filter((r) => r.regularizationStatus === 'Pending').length;
  const totalPending = pendingLeaves + pendingRegularizations;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200"><Shield className="w-3 h-3" /> HR Admin</span>;
      case 'manager':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200"><UserCheck className="w-3 h-3" /> Manager</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"><Users className="w-3 h-3" /> Employee</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">DayFlow</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">HRMS</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Unified Workforce Platform</p>
            </div>
          </div>

          {/* Center Quick Clock In & Timer */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1.5 px-3">
            {isClockedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div className="text-xs">
                    <span className="text-slate-500">In since {clockInTime?.substring(0, 5)}: </span>
                    <span className="font-mono font-semibold text-slate-800">
                      {formatSecondsToTimer(workTimerSeconds)}
                    </span>
                  </div>
                </div>

                {isOnBreak && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    <Coffee className="w-3 h-3" /> Break: {formatSecondsToTimer(breakTimerSeconds)}
                  </span>
                )}

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  <button
                    id="nav-break-btn"
                    onClick={toggleBreak}
                    title={isOnBreak ? 'Resume Work' : 'Take a Break'}
                    className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      isOnBreak
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>{isOnBreak ? 'Resume' : 'Break'}</span>
                  </button>

                  <button
                    id="nav-clockout-btn"
                    onClick={clockOut}
                    className="p-1.5 px-2.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Square className="w-3 h-3" />
                    <span>Clock Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Not clocked in today</span>
                </div>
                <button
                  id="nav-clockin-btn"
                  onClick={() => clockIn('Office')}
                  className="p-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Clock In Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Action Controls: Role Switcher & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowRoleSwitcher(false);
                }}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {totalPending > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {totalPending}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Actions & Alerts</h4>
                    <span className="text-xs font-medium text-indigo-600">{totalPending} pending</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {pendingLeaves > 0 && (
                      <button
                        onClick={() => {
                          setActiveTab('leave');
                          setShowNotifications(false);
                        }}
                        className="w-full text-left p-3 hover:bg-slate-50 flex items-start gap-3 transition-colors cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{pendingLeaves} Leave Request(s) Pending</p>
                          <p className="text-[11px] text-slate-500">Requires review & approval</p>
                        </div>
                      </button>
                    )}
                    {pendingRegularizations > 0 && (
                      <button
                        onClick={() => {
                          setActiveTab('attendance');
                          setShowNotifications(false);
                        }}
                        className="w-full text-left p-3 hover:bg-slate-50 flex items-start gap-3 transition-colors cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{pendingRegularizations} Attendance Regularization(s)</p>
                          <p className="text-[11px] text-slate-500">Missed punch correction requested</p>
                        </div>
                      </button>
                    )}
                    {totalPending === 0 && (
                      <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        <span>All caught up! No pending HR actions.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill & Dropdown */}
            <div className="relative">
              <button
                id="role-switcher-btn"
                onClick={() => {
                  setShowRoleSwitcher(!showRoleSwitcher);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.firstName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
                />
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {currentUser.firstName} {currentUser.lastName}
                    </span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-[130px]">{currentUser.designation}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5" />
              </button>

              {/* Role Switcher Dropdown */}
              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Simulate User Role / Switch Account</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Test RBAC workflows across Admin, Manager & Employee views</p>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-50">
                    {employees.map((emp) => {
                      const isSelected = emp.id === currentUser.id;
                      return (
                        <button
                          key={emp.id}
                          id={`switch-user-${emp.id}`}
                          onClick={() => {
                            switchRoleUser(emp.id);
                            setShowRoleSwitcher(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-indigo-50/70 border-l-3 border-indigo-600' : ''
                          }`}
                        >
                          <img
                            src={emp.avatar}
                            alt={emp.firstName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900 truncate">
                                {emp.firstName} {emp.lastName}
                              </span>
                              {getRoleBadge(emp.role)}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{emp.designation}</p>
                            <p className="text-[10px] text-indigo-600 font-medium">{emp.department}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/80">
                    <button
                      id="reset-sample-data-btn"
                      onClick={() => {
                        setShowResetConfirm(true);
                        setShowRoleSwitcher(false);
                      }}
                      className="w-full text-xs font-medium text-slate-600 hover:text-rose-700 py-1.5 px-3 rounded-lg hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Clean Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset All DayFlow Data?</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              This will restore all default employee records, mock attendance logs, leave balances, and sample payroll runs.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-4 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 px-4 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
