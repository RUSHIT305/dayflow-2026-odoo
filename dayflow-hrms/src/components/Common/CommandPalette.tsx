import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Clock, 
  CalendarDays, 
  Users, 
  DollarSign, 
  Megaphone, 
  UserCheck, 
  FileSpreadsheet, 
  RotateCcw, 
  LogOut, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  X,
  Play,
  Square,
  Coffee
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any) => void;
  onOpenApplyLeave: () => void;
  onOpenAddEmployee: () => void;
  onOpenAuditLogs: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenApplyLeave,
  onOpenAddEmployee,
  onOpenAuditLogs,
}) => {
  const { 
    employees, 
    currentUser, 
    isAdmin, 
    isClockedIn, 
    clockIn, 
    clockOut, 
    toggleBreak, 
    isOnBreak, 
    logout 
  } = useHR();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If closed, open handler is passed in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(query.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(query.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(query.toLowerCase()) ||
      emp.department.toLowerCase().includes(query.toLowerCase()) ||
      emp.designation.toLowerCase().includes(query.toLowerCase())
  );

  const quickActions = [
    {
      id: 'clock-action',
      title: isClockedIn ? 'Clock Out for Today' : 'Clock In to Shift',
      desc: isClockedIn ? 'End active workday session' : 'Begin daily attendance session',
      icon: isClockedIn ? Square : Play,
      category: 'Attendance',
      action: () => {
        if (isClockedIn) clockOut();
        else clockIn('Office');
        onClose();
      },
    },
    {
      id: 'break-action',
      title: isOnBreak ? 'Resume Work (End Break)' : 'Take a Break',
      desc: 'Pause/resume active work timer',
      icon: Coffee,
      category: 'Attendance',
      hidden: !isClockedIn,
      action: () => {
        toggleBreak();
        onClose();
      },
    },
    {
      id: 'apply-leave',
      title: 'Apply for Leave',
      desc: 'Submit time-off request (Paid, Sick, Casual)',
      icon: CalendarDays,
      category: 'Leave',
      action: () => {
        onOpenApplyLeave();
        onClose();
      },
    },
    {
      id: 'view-employees',
      title: 'Open Employee Directory',
      desc: 'Browse team roster, job titles, and salaries',
      icon: Users,
      category: 'Navigation',
      action: () => {
        onNavigate('employees');
        onClose();
      },
    },
    {
      id: 'view-payroll',
      title: 'Payroll & Payslips',
      desc: 'View salary slips, tax TDS, and pay cycles',
      icon: DollarSign,
      category: 'Navigation',
      action: () => {
        onNavigate('payroll');
        onClose();
      },
    },
    {
      id: 'view-bulletin',
      title: 'Company Notices & Bulletin',
      desc: 'Read internal policies and announcements',
      icon: Megaphone,
      category: 'Navigation',
      action: () => {
        onNavigate('announcements');
        onClose();
      },
    },
    ...(isAdmin
      ? [
          {
            id: 'add-emp',
            title: 'Onboard New Employee',
            desc: 'Create new personnel record and assign compensation',
            icon: UserCheck,
            category: 'Admin Tools',
            action: () => {
              onOpenAddEmployee();
              onClose();
            },
          },
          {
            id: 'audit-logs',
            title: 'View System Audit Logs',
            desc: 'Security log trail of changes and approvals',
            icon: ShieldAlert,
            category: 'Admin Tools',
            action: () => {
              onOpenAuditLogs();
              onClose();
            },
          },
        ]
      : []),
    {
      id: 'sign-out',
      title: 'Sign Out of Workspace',
      desc: 'Return to login credentials screen',
      icon: LogOut,
      category: 'Account',
      action: () => {
        onClose();
        logout();
      },
    },
  ].filter((a) => !a.hidden && (a.title.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-start justify-center z-50 p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search staff, or jump to page... (Esc to exit)"
            className="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-gray-400 bg-gray-100 rounded border border-gray-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 flex-1">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
                Commands & Shortcuts
              </div>
              <div className="space-y-1">
                {quickActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-gray-100 flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">{item.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 bg-gray-50 rounded border border-gray-100">
                          {item.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employees Match */}
          {query.trim().length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span>Matching Employees ({filteredEmployees.length})</span>
                <span className="text-[10px] lowercase font-normal">Click to view in directory</span>
              </div>
              {filteredEmployees.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4">No staff members found matching "{query}"</div>
              ) : (
                <div className="space-y-1">
                  {filteredEmployees.slice(0, 5).map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        onNavigate('employees');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-gray-100 flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={emp.avatar}
                          alt={emp.firstName}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">
                            {emp.designation} • <span className="text-blue-600">{emp.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {emp.employeeCode}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↓</kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↵</kbd>
          </div>
          <span className="font-mono text-gray-500">DayFlow Corporate Engine</span>
        </div>
      </div>
    </div>
  );
};
