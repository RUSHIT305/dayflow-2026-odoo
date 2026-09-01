export type UserRole = 'admin' | 'manager' | 'employee';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Terminated';
export type Department = 'Engineering' | 'Human Resources' | 'Product & Design' | 'Marketing' | 'Sales' | 'Finance & Ops';
export type WorkMode = 'Office' | 'Remote' | 'Hybrid' | 'Client Site';

export interface SalaryStructure {
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  epfDeduction: number;
  professionalTax: number;
  incomeTaxTDS: number;
  bankName: string;
  accountNumber: string;
  ifscOrRouting: string;
  panOrTaxId: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  department: Department;
  managerId?: string;
  managerName?: string;
  joinDate: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  workMode: WorkMode;
  avatar: string;
  location: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  salary: SalaryStructure;
  skills: string[];
  bio: string;
  notes?: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave' | 'Holiday' | 'Weekend';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  clockIn?: string; // HH:MM:SS
  clockOut?: string; // HH:MM:SS
  workMode: 'Office' | 'Remote' | 'Client Site';
  totalHours: number;
  breakMinutes: number;
  status: AttendanceStatus;
  notes?: string;
  regularizationRequested?: boolean;
  regularizationReason?: string;
  regularizationStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export type LeaveType = 'Paid Annual' | 'Sick Leave' | 'Casual Leave' | 'Maternity/Paternity' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isHalfDay: boolean;
  halfDayPeriod?: 'First Half' | 'Second Half';
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComments?: string;
}

export interface LeaveBalance {
  employeeId: string;
  annualTotal: number;
  annualUsed: number;
  sickTotal: number;
  sickUsed: number;
  casualTotal: number;
  casualUsed: number;
  unpaidUsed: number;
}

export type PayrollStatus = 'Draft' | 'Processing' | 'Approved' | 'Disbursed';

export interface PayrollCycle {
  id: string;
  month: string; // "August 2026"
  monthIndex: number; // 0-11
  year: number;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: PayrollStatus;
  processedAt?: string;
  disbursedAt?: string;
  payDate: string;
}

export interface Payslip {
  id: string;
  payslipNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  department: Department;
  cycleId: string;
  month: string;
  year: number;
  payDate: string;
  
  // Earnings
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  performanceBonus: number;
  grossEarnings: number;
  
  // Deductions
  epfDeduction: number;
  professionalTax: number;
  incomeTaxTDS: number;
  unpaidLeaveDeduction: number;
  totalDeductions: number;
  
  netPay: number;
  paymentStatus: 'Paid' | 'Pending' | 'Hold';
  bankName: string;
  accountNumberMasked: string;
  panOrTaxId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Company Update' | 'Policy' | 'Holiday' | 'Event';
  priority: 'Normal' | 'High' | 'Urgent';
  author: string;
  authorRole: string;
  createdAt: string;
  pinned: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  module: 'Employee' | 'Attendance' | 'Leave' | 'Payroll' | 'System';
  details: string;
}

export interface CompanyHoliday {
  id: string;
  date: string;
  name: string;
  type: 'Public Holiday' | 'Optional' | 'Company Off';
  dayOfWeek: string;
}
