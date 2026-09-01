import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  Users, 
  DollarSign, 
  Megaphone, 
  Shield, 
  ShieldAlert,
  Database,
  UserCheck, 
  User, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  X,
  LogOut
} from 'lucide-react';
import { useHR } from '../context/HRContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAuditLogs?: () => void;
  onOpenDataManagement?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenAuditLogs,
  onOpenDataManagement,
}) => {
  const {
    currentUser,
    isAdmin,
    employees,
    switchRoleUser,
    logout,
    leaveRequests,
    attendanceRecords,
    resetToSampleData,
  } = useHR();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending').length;
  const pendingRegs = attendanceRecords.filter((r) => r.regularizationStatus === 'Pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: Clock, badge: pendingRegs > 0 ? `${pendingRegs}` : undefined },
    { id: 'leave', label: 'Leave Requests', icon: CalendarDays, badge: pendingLeaves > 0 ? `${pendingLeaves}` : undefined },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'announcements', label: 'Notices & Bulletin', icon: Megaphone },
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator View';
      case 'manager':
        return 'Team Manager View';
      default:
        return 'Staff Employee View';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-gray-900">DayFlow</span>
            </div>
          </div>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin Utilities
              </div>
              {onOpenAuditLogs && (
                <button
                  onClick={() => {
                    onOpenAuditLogs();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>Security Audit Logs</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 font-mono">SOC2</span>
                </button>
              )}
              {onOpenDataManagement && (
                <button
                  onClick={() => {
                    onOpenDataManagement();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>Data & Backups</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 font-mono">JSON</span>
                </button>
              )}
            </div>
          )}
        </nav>

        {/* User Card / Role Indicator Bottom Card */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            id="sidebar-role-card-btn"
            onClick={() => setShowRoleModal(true)}
            className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl p-4 text-white text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="text-xs text-gray-400 mb-1 flex items-center justify-between">
              <span>{getRoleLabel(currentUser.role)}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.firstName} 
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-700" 
                />
                <span className="text-sm font-medium truncate text-white">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0"></div>
            </div>
          </button>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-left text-[11px] font-medium text-gray-400 hover:text-gray-700 py-1 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>

            <button
              id="sidebar-logout-btn"
              onClick={() => logout()}
              className="text-right text-[11px] font-semibold text-red-500 hover:text-red-700 py-1 transition-colors cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Role Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Switch User Role</h3>
                <p className="text-xs text-gray-500">Test role-based views and permissions</p>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {employees.map((emp) => {
                const isSelected = emp.id === currentUser.id;
                return (
                  <button
                    key={emp.id}
                    onClick={() => {
                      switchRoleUser(emp.id);
                      setShowRoleModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={emp.avatar} 
                      alt={emp.firstName} 
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">
                          {emp.firstName} {emp.lastName}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          emp.role === 'admin'
                            ? 'bg-purple-50 text-purple-700'
                            : emp.role === 'manager'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {emp.role === 'admin' ? 'HR Admin' : emp.role === 'manager' ? 'Manager' : 'Employee'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{emp.designation}</p>
                      <p className="text-[10px] text-blue-600 font-medium">{emp.department}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Want to exit to login?</span>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  logout();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out to Login Page</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Reset DayFlow Demo Data?</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              This will restore all default mock employee profiles, attendance punches, leave balances, and sample payroll runs.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
