import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Clock, 
  Coffee, 
  Play, 
  Square, 
  CheckCircle2, 
  AlertCircle,
  X,
  LogOut,
  User,
  Shield,
  ShieldAlert,
  Database,
  ChevronDown
} from 'lucide-react';
import { useHR } from '../context/HRContext';
import { formatSecondsToTimer } from '../utils/formatters';

interface HeaderProps {
  activeTab: string;
  onOpenMobileSidebar: () => void;
  onNavigate: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenCommandPalette?: () => void;
  onOpenAuditLogs?: () => void;
  onOpenDataManagement?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onNavigate,
  searchQuery,
  setSearchQuery,
  onOpenCommandPalette,
  onOpenAuditLogs,
  onOpenDataManagement,
}) => {
  const {
    currentUser,
    isAdmin,
    logout,
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
  } = useHR();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending').length;
  const pendingRegs = attendanceRecords.filter((r) => r.regularizationStatus === 'Pending').length;
  const totalPending = pendingLeaves + pendingRegs;

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Workforce Overview';
      case 'attendance':
        return 'Attendance & Time Tracking';
      case 'leave':
        return 'Leave Management & Approvals';
      case 'employees':
        return 'Employee Directory';
      case 'payroll':
        return 'Payroll & Compensation';
      case 'announcements':
        return 'Company Notices & Bulletin';
      default:
        return 'Overview';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { text: 'HR Admin', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'manager':
        return { text: 'Manager', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { text: 'Employee', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  const roleBadge = getRoleBadge(currentUser.role);

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left: Mobile hamburger & View Titles */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Monday, August 31, 2026
          </p>
        </div>
      </div>

      {/* Right: Search, Clock Pill, Notifications & User Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search operations / Command Palette trigger */}
        <div className="relative hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search staff, actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-14 py-2 bg-gray-100 border-none rounded-full text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 w-48 lg:w-56 focus:bg-white focus:outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 text-gray-400" />
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="absolute right-2 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
                title="Open Command Palette (Ctrl+K)"
              >
                ⌘K
              </button>
            )}
          </div>
        </div>

        {/* Quick Punch Clock Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700">
          {isClockedIn ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono font-medium text-gray-900">
                {formatSecondsToTimer(workTimerSeconds)}
              </span>
              <div className="flex items-center gap-1 pl-1 border-l border-gray-200">
                <button
                  onClick={toggleBreak}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    isOnBreak
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isOnBreak ? 'Resume' : 'Break'}
                </button>
                <button
                  onClick={clockOut}
                  className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold cursor-pointer"
                >
                  Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-gray-500">Offline</span>
              <button
                onClick={() => clockIn('Office')}
                className="px-2.5 py-0.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Punch In</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            id="header-notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {totalPending > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Notifications & Alerts</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {totalPending} pending
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 text-xs">
                {pendingLeaves > 0 && (
                  <button
                    onClick={() => {
                      onNavigate('leave');
                      setShowNotifications(false);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 flex items-start gap-3 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{pendingLeaves} Leave Request(s) Pending</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">Manager review and approval required</p>
                    </div>
                  </button>
                )}
                {pendingRegs > 0 && (
                  <button
                    onClick={() => {
                      onNavigate('attendance');
                      setShowNotifications(false);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 flex items-start gap-3 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-700 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{pendingRegs} Attendance Regularization(s)</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">Correction requests from employees</p>
                    </div>
                  </button>
                )}
                {totalPending === 0 && (
                  <div className="p-6 text-center text-gray-500 flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                    <span>All caught up! No pending HR actions.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Quick Logout Menu */}
        <div className="relative">
          <button
            id="header-user-menu-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.firstName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
            />
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="text-[10px] text-gray-500 font-medium block">
                {roleBadge.text}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {/* User Popover */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl mb-2">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.firstName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 truncate">
                      {currentUser.firstName} {currentUser.lastName}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.designation}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60 text-[11px]">
                  <span className="font-mono text-gray-400">{currentUser.employeeCode}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold border ${roleBadge.bg}`}>
                    {roleBadge.text}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate('employees');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>My Profile & Records</span>
                </button>

                {isAdmin && onOpenAuditLogs && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuditLogs();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>Security Audit Trail</span>
                  </button>
                )}

                {isAdmin && onOpenDataManagement && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenDataManagement();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>Database Backup & Export</span>
                  </button>
                )}

                <button
                  id="header-logout-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer border-t border-gray-100 mt-1 pt-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out to Role Selection</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

