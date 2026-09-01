import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  PayrollCycle,
  Payslip,
  Announcement,
  AuditLog,
  CompanyHoliday,
  UserRole,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_BALANCES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_HOLIDAYS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PAYROLL_CYCLES,
  generateInitialAttendance,
  generateInitialPayslips,
} from '../data/initialData';
import { ToastItem } from '../components/Common/Toast';

interface HRContextType {
  // Auth & Roles
  currentUser: Employee;
  setCurrentUser: (employee: Employee) => void;
  switchRoleUser: (employeeId: string) => void;
  isAuthenticated: boolean;
  login: (employeeId: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isManager: boolean;
  isEmployeeOnly: boolean;

  // Toast Notifications
  toasts: ToastItem[];
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => void;
  dismissToast: (id: string) => void;

  // Data Collections
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  leaveBalances: Record<string, LeaveBalance>;
  payrollCycles: PayrollCycle[];
  payslips: Payslip[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  holidays: CompanyHoliday[];

  // Clock & Attendance State for active user
  todayAttendance: AttendanceRecord | undefined;
  isClockedIn: boolean;
  clockInTime: string | null;
  isOnBreak: boolean;
  breakStartTime: string | null;
  workTimerSeconds: number;
  breakTimerSeconds: number;

  // Actions
  clockIn: (mode?: 'Office' | 'Remote' | 'Client Site') => void;
  clockOut: () => void;
  toggleBreak: (category?: string) => void;
  requestRegularization: (recordId: string, reason: string) => void;
  reviewRegularization: (recordId: string, approved: boolean, note?: string) => void;
  addManualAttendance: (employeeId: string, date: string, clockIn: string, clockOut: string, status: any, workMode: any) => void;

  // Employee CRUD
  addEmployee: (employeeData: Omit<Employee, 'id' | 'employeeCode'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Leave Actions
  submitLeaveRequest: (data: {
    leaveType: any;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDayPeriod?: 'First Half' | 'Second Half';
    reason: string;
  }) => { success: boolean; message: string };
  reviewLeaveRequest: (requestId: string, approved: boolean, reviewComments?: string) => void;
  cancelLeaveRequest: (requestId: string) => void;

  // Payroll Actions
  createPayrollCycle: (month: string, year: number, bonusMap?: Record<string, number>) => PayrollCycle;
  disbursePayrollCycle: (cycleId: string) => void;
  updateSalaryStructure: (employeeId: string, salary: any) => void;

  // Announcements & Audit
  addAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt' | 'author' | 'authorRole'>) => void;
  deleteAnnouncement: (id: string) => void;
  addAuditLog: (module: AuditLog['module'], action: string, details: string) => void;

  // Data Import/Export
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;

  // Utilities
  resetToSampleData: () => void;
  triggerCelebration: () => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMPLOYEES: 'dayflow_employees_v1',
  ATTENDANCE: 'dayflow_attendance_v1',
  LEAVE_REQUESTS: 'dayflow_leave_requests_v1',
  LEAVE_BALANCES: 'dayflow_leave_balances_v1',
  PAYROLL_CYCLES: 'dayflow_payroll_cycles_v1',
  PAYSLIPS: 'dayflow_payslips_v1',
  ANNOUNCEMENTS: 'dayflow_announcements_v1',
  AUDIT_LOGS: 'dayflow_audit_logs_v1',
  CURRENT_USER_ID: 'dayflow_current_user_id_v1',
};

export const HRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Toast notifications state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastItem = { id, type, message, title };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initialize Employees
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EMPLOYEES;
  });

  // Current active logged-in employee (defaults to Eleanor Vance - HR Director)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'emp-101';
  });

  // Authentication state - first page is always the login page with role options
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const currentUser = employees.find((e) => e.id === currentUserId) || employees[0] || INITIAL_EMPLOYEES[0];

  // 2. Initialize Attendance
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return generateInitialAttendance();
  });

  // 3. Initialize Leave Requests & Balances
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEAVE_REQUESTS;
  });

  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVE_BALANCES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEAVE_BALANCES;
  });

  // 4. Initialize Payroll
  const [payrollCycles, setPayrollCycles] = useState<PayrollCycle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYROLL_CYCLES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PAYROLL_CYCLES;
  });

  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYSLIPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return generateInitialPayslips();
  });

  // 5. Initialize Announcements & Audit Logs
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const holidays = INITIAL_HOLIDAYS;

  // Active Break and Live Timers state
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null);
  const [workTimerSeconds, setWorkTimerSeconds] = useState<number>(0);
  const [breakTimerSeconds, setBreakTimerSeconds] = useState<number>(0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVE_BALANCES, JSON.stringify(leaveBalances));
  }, [leaveBalances]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYROLL_CYCLES, JSON.stringify(payrollCycles));
  }, [payrollCycles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYSLIPS, JSON.stringify(payslips));
  }, [payslips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Today's date reference
  const todayDateStr = '2026-08-31';

  // Find active attendance record for current user today
  const todayAttendance = attendanceRecords.find(
    (r) => r.employeeId === currentUser.id && r.date === todayDateStr
  );

  const isClockedIn = Boolean(todayAttendance && todayAttendance.clockIn && !todayAttendance.clockOut);
  const clockInTime = todayAttendance?.clockIn || null;

  // Real-time ticking work stopwatch
  useEffect(() => {
    let interval: any = null;
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setWorkTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isOnBreak]);

  useEffect(() => {
    let interval: any = null;
    if (isOnBreak) {
      interval = setInterval(() => {
        setBreakTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak]);

  // Role checks
  const isAdmin = currentUser.role === 'admin';
  const isManager = currentUser.role === 'manager' || currentUser.role === 'admin';
  const isEmployeeOnly = currentUser.role === 'employee';

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const addAuditLog = (module: AuditLog['module'], action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      actorRole: currentUser.role,
      module,
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = (employeeId: string) => {
    const target = employees.find((e) => e.id === employeeId) || employees[0];
    if (target) {
      setCurrentUserId(target.id);
      setIsAuthenticated(true);
      setIsOnBreak(false);
      setWorkTimerSeconds(0);
      setBreakTimerSeconds(0);
      addAuditLog('System', 'Employee Signed In', `Authenticated as ${target.firstName} ${target.lastName} (${target.role.toUpperCase()})`);
      showToast('success', `Welcome back, ${target.firstName}! Signed in as ${target.designation}.`, 'Session Authenticated');
      triggerCelebration();
    }
  };

  const logout = () => {
    addAuditLog('System', 'Employee Signed Out', `User ${currentUser.firstName} ${currentUser.lastName} logged out`);
    setIsAuthenticated(false);
    setIsOnBreak(false);
    setWorkTimerSeconds(0);
    setBreakTimerSeconds(0);
    showToast('info', 'You have been securely signed out.', 'Session Ended');
  };

  const switchRoleUser = (employeeId: string) => {
    const target = employees.find((e) => e.id === employeeId);
    if (target) {
      setCurrentUserId(target.id);
      setIsAuthenticated(true);
      setIsOnBreak(false);
      setWorkTimerSeconds(0);
      setBreakTimerSeconds(0);
      addAuditLog('System', 'Role Switched', `Switched active workspace user to ${target.firstName} ${target.lastName}`);
      showToast('info', `Switched active user to ${target.firstName} (${target.role.toUpperCase()})`, 'Workspace Role Changed');
    }
  };

  // Clock in action
  const clockIn = (mode: 'Office' | 'Remote' | 'Client Site' = 'Office') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const recordId = `att-${currentUser.id}-${todayDateStr}`;

    setAttendanceRecords((prev) => {
      const existing = prev.find((r) => r.id === recordId);
      if (existing) {
        return prev.map((r) =>
          r.id === recordId
            ? { ...r, clockIn: timeStr, clockOut: undefined, workMode: mode, status: 'Present' }
            : r
        );
      } else {
        const newRecord: AttendanceRecord = {
          id: recordId,
          employeeId: currentUser.id,
          date: todayDateStr,
          clockIn: timeStr,
          workMode: mode,
          totalHours: 0,
          breakMinutes: 0,
          status: 'Present',
        };
        return [...prev, newRecord];
      }
    });

    addAuditLog('Attendance', 'Clock In', `Clocked in as ${mode} at ${timeStr}`);
    showToast('success', `Clocked in successfully as ${mode} at ${timeStr}. Have a productive day!`, 'Shift Started');
    triggerCelebration();
  };

  // Clock out action
  const clockOut = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const recordId = `att-${currentUser.id}-${todayDateStr}`;

    setAttendanceRecords((prev) => {
      return prev.map((r) => {
        if (r.id === recordId) {
          const calcHours = Math.max(1, Math.round((workTimerSeconds / 3600) * 10) / 10) || 8.0;
          return {
            ...r,
            clockOut: timeStr,
            totalHours: calcHours,
            breakMinutes: Math.round(breakTimerSeconds / 60) + (r.breakMinutes || 0),
          };
        }
        return r;
      });
    });

    setIsOnBreak(false);
    addAuditLog('Attendance', 'Clock Out', `Clocked out for today at ${timeStr}`);
    showToast('info', `Clocked out at ${timeStr}. Attendance logged for today.`, 'Shift Completed');
  };

  const toggleBreak = (category: string = 'Standard Break') => {
    if (!isOnBreak) {
      setIsOnBreak(true);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setBreakStartTime(timeStr);
      addAuditLog('Attendance', 'Break Started', `Started ${category} at ${timeStr}`);
      showToast('warning', `Break mode active (${category}). Work timer paused.`, 'On Break');
    } else {
      setIsOnBreak(false);
      setBreakStartTime(null);
      addAuditLog('Attendance', 'Break Resumed', 'Resumed working from break');
      showToast('success', 'Break finished. Work timer resumed.', 'Back to Work');
    }
  };

  const requestRegularization = (recordId: string, reason: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              regularizationRequested: true,
              regularizationReason: reason,
              regularizationStatus: 'Pending',
            }
          : r
      )
    );
    addAuditLog('Attendance', 'Regularization Requested', `Requested attendance correction: ${reason}`);
    showToast('info', 'Attendance regularization request submitted to manager for review.', 'Regularization Submitted');
  };

  const reviewRegularization = (recordId: string, approved: boolean, note?: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            regularizationStatus: approved ? 'Approved' : 'Rejected',
            status: approved ? 'Present' : r.status,
            notes: note ? `Review note: ${note}` : r.notes,
          };
        }
        return r;
      })
    );
    addAuditLog(
      'Attendance',
      approved ? 'Regularization Approved' : 'Regularization Rejected',
      `Attendance regularization ${approved ? 'approved' : 'rejected'} for record #${recordId}`
    );
    showToast(
      approved ? 'success' : 'error',
      `Regularization request ${approved ? 'approved' : 'rejected'}.`,
      'Regularization Reviewed'
    );
  };

  const addManualAttendance = (
    employeeId: string,
    date: string,
    clockIn: string,
    clockOut: string,
    status: any,
    workMode: any
  ) => {
    const id = `att-${employeeId}-${date}`;
    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      const newRec: AttendanceRecord = {
        id,
        employeeId,
        date,
        clockIn,
        clockOut,
        status,
        workMode,
        totalHours: 8.0,
        breakMinutes: 45,
      };
      return [...filtered, newRec];
    });
    addAuditLog('Attendance', 'Manual Attendance Marked', `Admin updated attendance for ${employeeId} on ${date}`);
    showToast('success', `Attendance updated for date ${date}.`, 'Attendance Saved');
  };

  // Employee CRUD
  const addEmployee = (employeeData: Omit<Employee, 'id' | 'employeeCode'>): Employee => {
    const count = employees.length + 1;
    const codeNumber = 1000 + count;
    const newId = `emp-${codeNumber}`;
    const employeeCode = `DF-${codeNumber}`;

    const newEmp: Employee = {
      ...employeeData,
      id: newId,
      employeeCode,
    };

    setEmployees((prev) => [newEmp, ...prev]);

    // Initialize leave balances for new employee
    setLeaveBalances((prev) => ({
      ...prev,
      [newId]: {
        employeeId: newId,
        annualTotal: 20,
        annualUsed: 0,
        sickTotal: 12,
        sickUsed: 0,
        casualTotal: 10,
        casualUsed: 0,
        unpaidUsed: 0,
      },
    }));

    addAuditLog('Employee', 'Employee Created', `Added new team member: ${newEmp.firstName} ${newEmp.lastName} (${newEmp.employeeCode})`);
    showToast('success', `Onboarded ${newEmp.firstName} ${newEmp.lastName} (${newEmp.employeeCode}).`, 'Employee Registered');
    triggerCelebration();
    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    addAuditLog('Employee', 'Profile Updated', `Updated profile information for employee #${id}`);
    showToast('success', 'Employee profile records updated successfully.', 'Profile Saved');
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Terminated' } : e))
    );
    addAuditLog('Employee', 'Employee Status Changed', `Marked employee #${id} as Terminated`);
    showToast('warning', `Employee record marked as Terminated.`, 'Status Updated');
  };

  // Leave Management
  const submitLeaveRequest = (data: {
    leaveType: any;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDayPeriod?: 'First Half' | 'Second Half';
    reason: string;
  }) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    
    if (end < start) {
      const msg = 'End date cannot be prior to start date.';
      showToast('error', msg, 'Validation Error');
      return { success: false, message: msg };
    }

    let diffDays = 0;
    if (data.isHalfDay) {
      diffDays = 0.5;
    } else {
      let cur = new Date(start);
      while (cur <= end) {
        const d = cur.getDay();
        if (d !== 0 && d !== 6) {
          diffDays++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      if (diffDays === 0) diffDays = 1;
    }

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

    let available = 0;
    if (data.leaveType === 'Paid Annual') available = currentBalance.annualTotal - currentBalance.annualUsed;
    if (data.leaveType === 'Sick Leave') available = currentBalance.sickTotal - currentBalance.sickUsed;
    if (data.leaveType === 'Casual Leave') available = currentBalance.casualTotal - currentBalance.casualUsed;
    if (data.leaveType === 'Unpaid Leave') available = 999;

    if (data.leaveType !== 'Unpaid Leave' && available < diffDays) {
      const msg = `Insufficient leave balance! You have ${available} days available for ${data.leaveType}, but requested ${diffDays} day(s).`;
      showToast('error', msg, 'Quota Exceeded');
      return { success: false, message: msg };
    }

    const newRequest: LeaveRequest = {
      id: `lr-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: `${currentUser.firstName} ${currentUser.lastName}`,
      employeeCode: currentUser.employeeCode,
      department: currentUser.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      isHalfDay: data.isHalfDay,
      halfDayPeriod: data.halfDayPeriod,
      totalDays: diffDays,
      reason: data.reason,
      status: 'Pending',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    addAuditLog('Leave', 'Leave Submitted', `Applied for ${diffDays} day(s) of ${data.leaveType} (${data.startDate} to ${data.endDate})`);
    showToast('success', `Submitted request for ${diffDays} day(s) of ${data.leaveType}.`, 'Leave Applied');
    triggerCelebration();

    return { success: true, message: 'Leave request submitted successfully for approval.' };
  };

  const reviewLeaveRequest = (requestId: string, approved: boolean, reviewComments?: string) => {
    let targetRequest: LeaveRequest | undefined;
    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          targetRequest = req;
          return {
            ...req,
            status: approved ? 'Approved' : 'Rejected',
            reviewedBy: `${currentUser.firstName} ${currentUser.lastName}`,
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            reviewComments: reviewComments || (approved ? 'Approved by reviewer.' : 'Rejected by reviewer.'),
          };
        }
        return req;
      })
    );

    if (approved && targetRequest) {
      const empId = targetRequest.employeeId;
      const days = targetRequest.totalDays;
      const lType = targetRequest.leaveType;

      setLeaveBalances((prev) => {
        const bal = prev[empId] || {
          employeeId: empId,
          annualTotal: 20,
          annualUsed: 0,
          sickTotal: 12,
          sickUsed: 0,
          casualTotal: 10,
          casualUsed: 0,
          unpaidUsed: 0,
        };

        const updated = { ...bal };
        if (lType === 'Paid Annual') updated.annualUsed += days;
        if (lType === 'Sick Leave') updated.sickUsed += days;
        if (lType === 'Casual Leave') updated.casualUsed += days;
        if (lType === 'Unpaid Leave') updated.unpaidUsed += days;

        return { ...prev, [empId]: updated };
      });
    }

    addAuditLog(
      'Leave',
      approved ? 'Leave Approved' : 'Leave Rejected',
      `${approved ? 'Approved' : 'Rejected'} leave request #${requestId} for ${targetRequest?.employeeName || 'employee'}`
    );
    showToast(
      approved ? 'success' : 'error',
      `Leave request ${approved ? 'approved' : 'rejected'} for ${targetRequest?.employeeName || 'employee'}.`,
      'Leave Decision Recorded'
    );
  };

  const cancelLeaveRequest = (requestId: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Cancelled' } : req))
    );
    addAuditLog('Leave', 'Leave Cancelled', `Cancelled leave request #${requestId}`);
    showToast('info', 'Leave request has been withdrawn.', 'Leave Cancelled');
  };

  // Payroll Processing
  const createPayrollCycle = (month: string, year: number, bonusMap: Record<string, number> = {}): PayrollCycle => {
    const cycleId = `cycle-${year}-${month.toLowerCase().substring(0, 3)}`;
    const payDate = `${year}-${String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0')}-28`;

    let cycleGross = 0;
    let cycleDeductions = 0;
    let cycleNet = 0;
    const newPayslips: Payslip[] = [];

    const activeEmployees = employees.filter((e) => e.status !== 'Terminated');

    activeEmployees.forEach((emp, index) => {
      const bonus = bonusMap[emp.id] || 0;
      const basic = emp.salary.basic;
      const hra = emp.salary.hra;
      const spec = emp.salary.specialAllowance;
      const conv = emp.salary.conveyance;
      const gross = basic + hra + spec + conv + bonus;

      const epf = emp.salary.epfDeduction;
      const pt = emp.salary.professionalTax;
      const tds = emp.salary.incomeTaxTDS;
      const totalDed = epf + pt + tds;
      const net = gross - totalDed;

      cycleGross += gross;
      cycleDeductions += totalDed;
      cycleNet += net;

      newPayslips.push({
        id: `ps-${emp.id}-${year}-${month.toLowerCase()}`,
        payslipNumber: `DF-PAY-${year}${String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0')}-${1000 + index + 1}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeCode: emp.employeeCode,
        designation: emp.designation,
        department: emp.department,
        cycleId,
        month,
        year,
        payDate,
        basicSalary: basic,
        hra,
        specialAllowance: spec,
        conveyance: conv,
        performanceBonus: bonus,
        grossEarnings: gross,
        epfDeduction: epf,
        professionalTax: pt,
        incomeTaxTDS: tds,
        unpaidLeaveDeduction: 0,
        totalDeductions: totalDed,
        netPay: net,
        paymentStatus: 'Pending',
        bankName: emp.salary.bankName,
        accountNumberMasked: emp.salary.accountNumber,
        panOrTaxId: emp.salary.panOrTaxId,
      });
    });

    const newCycle: PayrollCycle = {
      id: cycleId,
      month: `${month} ${year}`,
      monthIndex: new Date(`${month} 1, ${year}`).getMonth(),
      year,
      totalEmployees: activeEmployees.length,
      totalGross: cycleGross,
      totalDeductions: cycleDeductions,
      totalNet: cycleNet,
      status: 'Processing',
      processedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      payDate,
    };

    setPayrollCycles((prev) => [newCycle, ...prev.filter((c) => c.id !== cycleId)]);
    setPayslips((prev) => [...newPayslips, ...prev.filter((p) => p.cycleId !== cycleId)]);

    addAuditLog('Payroll', 'Payroll Cycle Created', `Generated payroll run for ${month} ${year} (${activeEmployees.length} employees, Net: $${cycleNet.toLocaleString()})`);
    showToast('success', `Generated payroll cycle for ${month} ${year} with ${activeEmployees.length} payslips.`, 'Payroll Run Generated');
    triggerCelebration();

    return newCycle;
  };

  const disbursePayrollCycle = (cycleId: string) => {
    setPayrollCycles((prev) =>
      prev.map((c) =>
        c.id === cycleId
          ? {
              ...c,
              status: 'Disbursed',
              disbursedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    setPayslips((prev) =>
      prev.map((p) => (p.cycleId === cycleId ? { ...p, paymentStatus: 'Paid' } : p))
    );

    addAuditLog('Payroll', 'Payroll Disbursed', `Direct salary deposits disbursed for cycle #${cycleId}`);
    showToast('success', `Direct deposit payments disbursed for cycle #${cycleId}.`, 'Funds Disbursed');
    triggerCelebration();
  };

  const updateSalaryStructure = (employeeId: string, salary: any) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, salary: { ...e.salary, ...salary } } : e))
    );
    addAuditLog('Payroll', 'Salary Structure Updated', `Updated compensation structure for employee #${employeeId}`);
    showToast('success', 'Compensation and tax breakdown updated.', 'Salary Updated');
  };

  // Announcements
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt' | 'author' | 'authorRole'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      author: `${currentUser.firstName} ${currentUser.lastName}`,
      authorRole: currentUser.designation,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog('System', 'Announcement Published', `Published announcement: "${data.title}"`);
    showToast('success', `Notice published to bulletin: "${data.title}"`, 'Notice Published');
    triggerCelebration();
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addAuditLog('System', 'Announcement Removed', `Removed announcement #${id}`);
    showToast('info', 'Notice removed from bulletin.', 'Notice Deleted');
  };

  // Data Export / Import JSON
  const exportDatabaseJSON = () => {
    const backupData = {
      version: '2.6',
      exportedAt: new Date().toISOString(),
      employees,
      attendanceRecords,
      leaveRequests,
      leaveBalances,
      payrollCycles,
      payslips,
      announcements,
      auditLogs,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dayflow_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Database backup JSON downloaded successfully.', 'Backup Created');
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.employees && Array.isArray(data.employees)) setEmployees(data.employees);
      if (data.attendanceRecords && Array.isArray(data.attendanceRecords)) setAttendanceRecords(data.attendanceRecords);
      if (data.leaveRequests && Array.isArray(data.leaveRequests)) setLeaveRequests(data.leaveRequests);
      if (data.leaveBalances && typeof data.leaveBalances === 'object') setLeaveBalances(data.leaveBalances);
      if (data.payrollCycles && Array.isArray(data.payrollCycles)) setPayrollCycles(data.payrollCycles);
      if (data.payslips && Array.isArray(data.payslips)) setPayslips(data.payslips);
      if (data.announcements && Array.isArray(data.announcements)) setAnnouncements(data.announcements);
      if (data.auditLogs && Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      
      showToast('success', 'Database state restored successfully from backup.', 'Restore Complete');
      triggerCelebration();
      return true;
    } catch (e) {
      showToast('error', 'Failed to parse backup JSON file. Ensure valid DayFlow format.', 'Import Failed');
      return false;
    }
  };

  // Reset to default mock
  const resetToSampleData = () => {
    localStorage.clear();
    setEmployees(INITIAL_EMPLOYEES);
    setCurrentUserId('emp-101');
    setAttendanceRecords(generateInitialAttendance());
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setLeaveBalances(INITIAL_LEAVE_BALANCES);
    setPayrollCycles(INITIAL_PAYROLL_CYCLES);
    setPayslips(generateInitialPayslips());
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setIsOnBreak(false);
    setWorkTimerSeconds(0);
    setBreakTimerSeconds(0);
    showToast('info', 'DayFlow demo sandbox restored to pristine factory state.', 'Data Reset');
  };

  return (
    <HRContext.Provider
      value={{
        currentUser,
        setCurrentUser: (emp) => setCurrentUserId(emp.id),
        switchRoleUser,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        isManager,
        isEmployeeOnly,
        toasts,
        showToast,
        dismissToast,
        employees,
        attendanceRecords,
        leaveRequests,
        leaveBalances,
        payrollCycles,
        payslips,
        announcements,
        auditLogs,
        holidays,
        todayAttendance,
        isClockedIn,
        clockInTime,
        isOnBreak,
        breakStartTime,
        workTimerSeconds,
        breakTimerSeconds,
        clockIn,
        clockOut,
        toggleBreak,
        requestRegularization,
        reviewRegularization,
        addManualAttendance,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        submitLeaveRequest,
        reviewLeaveRequest,
        cancelLeaveRequest,
        createPayrollCycle,
        disbursePayrollCycle,
        updateSalaryStructure,
        addAnnouncement,
        deleteAnnouncement,
        addAuditLog,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToSampleData,
        triggerCelebration,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = (): HRContextType => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};

