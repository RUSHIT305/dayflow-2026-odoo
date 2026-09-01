import { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  LeaveBalance, 
  PayrollCycle, 
  Payslip, 
  Announcement, 
  CompanyHoliday, 
  AuditLog 
} from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    employeeCode: 'DF-1001',
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'eleanor.vance@dayflow.internal',
    phone: '+1 (555) 234-5678',
    role: 'admin',
    designation: 'Director of People & Operations',
    department: 'Human Resources',
    joinDate: '2022-03-15',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Hybrid',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco HQ (Floor 4)',
    emergencyContact: {
      name: 'Thomas Vance',
      relationship: 'Spouse',
      phone: '+1 (555) 234-9988',
    },
    salary: {
      basic: 7500,
      hra: 3000,
      specialAllowance: 2200,
      conveyance: 500,
      epfDeduction: 900,
      professionalTax: 200,
      incomeTaxTDS: 1800,
      bankName: 'JPMorgan Chase Bank',
      accountNumber: '****-****-4821',
      ifscOrRouting: 'CHASUS33',
      panOrTaxId: 'TX-982314-E',
    },
    skills: ['Talent Strategy', 'People Analytics', 'Compensation & Benefits', 'Conflict Resolution', 'Labor Law'],
    bio: 'Experienced HR leader with 10+ years driving organizational culture, talent growth, and operational excellence at high-growth tech firms.',
  },
  {
    id: 'emp-102',
    employeeCode: 'DF-1002',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.chen@dayflow.internal',
    phone: '+1 (555) 345-6789',
    role: 'manager',
    designation: 'Engineering Manager',
    department: 'Engineering',
    managerId: 'emp-101',
    managerName: 'Eleanor Vance',
    joinDate: '2022-06-01',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Office',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco HQ (Floor 3)',
    emergencyContact: {
      name: 'Li Wei Chen',
      relationship: 'Brother',
      phone: '+1 (555) 345-1122',
    },
    salary: {
      basic: 8200,
      hra: 3200,
      specialAllowance: 2400,
      conveyance: 500,
      epfDeduction: 980,
      professionalTax: 200,
      incomeTaxTDS: 2100,
      bankName: 'Bank of America',
      accountNumber: '****-****-7732',
      ifscOrRouting: 'BOFAUS3N',
      panOrTaxId: 'TX-445891-C',
    },
    skills: ['Distributed Systems', 'Go', 'TypeScript', 'Agile Team Mentorship', 'Cloud Architecture'],
    bio: 'Passionate engineering leader focusing on scalable cloud platforms, resilient microservices, and fostering engineering team health.',
  },
  {
    id: 'emp-103',
    employeeCode: 'DF-1003',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@dayflow.internal',
    phone: '+1 (555) 456-7890',
    role: 'employee',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    managerId: 'emp-102',
    managerName: 'Marcus Chen',
    joinDate: '2023-01-10',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Hybrid',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco HQ (Floor 3)',
    emergencyContact: {
      name: 'Robert Jenkins',
      relationship: 'Father',
      phone: '+1 (555) 456-3344',
    },
    salary: {
      basic: 6200,
      hra: 2400,
      specialAllowance: 1800,
      conveyance: 400,
      epfDeduction: 740,
      professionalTax: 200,
      incomeTaxTDS: 1400,
      bankName: 'Wells Fargo',
      accountNumber: '****-****-9104',
      ifscOrRouting: 'WFBIUS6S',
      panOrTaxId: 'TX-773290-J',
    },
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Design Systems', 'Web Accessibility (a11y)'],
    bio: 'UI enthusiast specializing in design systems, reactive workflows, and high-performance frontend interfaces.',
  },
  {
    id: 'emp-104',
    employeeCode: 'DF-1004',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.miller@dayflow.internal',
    phone: '+1 (555) 567-8901',
    role: 'employee',
    designation: 'Growth Marketing Lead',
    department: 'Marketing',
    managerId: 'emp-101',
    managerName: 'Eleanor Vance',
    joinDate: '2023-04-18',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Remote',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Austin, TX (Remote)',
    emergencyContact: {
      name: 'Clara Miller',
      relationship: 'Spouse',
      phone: '+1 (555) 567-9090',
    },
    salary: {
      basic: 5800,
      hra: 2200,
      specialAllowance: 1500,
      conveyance: 400,
      epfDeduction: 690,
      professionalTax: 200,
      incomeTaxTDS: 1250,
      bankName: 'Citibank',
      accountNumber: '****-****-3312',
      ifscOrRouting: 'CITIUS33',
      panOrTaxId: 'TX-109283-M',
    },
    skills: ['SEO/SEM', 'Product-Led Growth', 'Lifecycle Marketing', 'Google Analytics', 'A/B Experimentation'],
    bio: 'Data-driven marketing specialist experienced in scaling B2B SaaS adoption and optimizing multi-channel acquisition funnels.',
  },
  {
    id: 'emp-105',
    employeeCode: 'DF-1005',
    firstName: 'Amara',
    lastName: 'Okonkwo',
    email: 'amara.okonkwo@dayflow.internal',
    phone: '+1 (555) 678-9012',
    role: 'manager',
    designation: 'Product Design Lead',
    department: 'Product & Design',
    managerId: 'emp-101',
    managerName: 'Eleanor Vance',
    joinDate: '2023-02-01',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Office',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco HQ (Floor 2)',
    emergencyContact: {
      name: 'Emeka Okonkwo',
      relationship: 'Brother',
      phone: '+1 (555) 678-4321',
    },
    salary: {
      basic: 7000,
      hra: 2800,
      specialAllowance: 2000,
      conveyance: 500,
      epfDeduction: 840,
      professionalTax: 200,
      incomeTaxTDS: 1700,
      bankName: 'Chase Bank',
      accountNumber: '****-****-6641',
      ifscOrRouting: 'CHASUS33',
      panOrTaxId: 'TX-665219-O',
    },
    skills: ['Product Discovery', 'Figma', 'Design Systems', 'Usability Testing', 'Service Design'],
    bio: 'Human-centered designer passionate about crafting intuitive enterprise software with clarity, speed, and elegance.',
  },
  {
    id: 'emp-106',
    employeeCode: 'DF-1006',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@dayflow.internal',
    phone: '+1 (555) 789-0123',
    role: 'employee',
    designation: 'HR & Talent Specialist',
    department: 'Human Resources',
    managerId: 'emp-101',
    managerName: 'Eleanor Vance',
    joinDate: '2023-08-14',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Office',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco HQ (Floor 4)',
    emergencyContact: {
      name: 'Anil Sharma',
      relationship: 'Father',
      phone: '+1 (555) 789-9876',
    },
    salary: {
      basic: 5200,
      hra: 2000,
      specialAllowance: 1300,
      conveyance: 400,
      epfDeduction: 620,
      professionalTax: 200,
      incomeTaxTDS: 1050,
      bankName: 'PNC Bank',
      accountNumber: '****-****-1983',
      ifscOrRouting: 'PNCUS33',
      panOrTaxId: 'TX-338291-S',
    },
    skills: ['HR Operations', 'Employee Onboarding', 'Leave Administration', 'Compliance', 'Workplace Culture'],
    bio: 'Dedicated HR operations specialist driving frictionless employee onboarding, leave management, and company benefits administration.',
  },
  {
    id: 'emp-107',
    employeeCode: 'DF-1007',
    firstName: 'Lucas',
    lastName: 'Santoro',
    email: 'lucas.santoro@dayflow.internal',
    phone: '+1 (555) 890-1234',
    role: 'employee',
    designation: 'Backend & Cloud Engineer',
    department: 'Engineering',
    managerId: 'emp-102',
    managerName: 'Marcus Chen',
    joinDate: '2024-01-15',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Remote',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'Seattle, WA (Remote)',
    emergencyContact: {
      name: 'Maria Santoro',
      relationship: 'Mother',
      phone: '+1 (555) 890-5544',
    },
    salary: {
      basic: 6000,
      hra: 2300,
      specialAllowance: 1700,
      conveyance: 400,
      epfDeduction: 720,
      professionalTax: 200,
      incomeTaxTDS: 1350,
      bankName: 'US Bank',
      accountNumber: '****-****-8209',
      ifscOrRouting: 'USBKUS44',
      panOrTaxId: 'TX-884019-L',
    },
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'REST/GraphQL APIs'],
    bio: 'Backend systems engineer focused on secure APIs, database optimization, and CI/CD automation.',
  },
  {
    id: 'emp-108',
    employeeCode: 'DF-1008',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@dayflow.internal',
    phone: '+1 (555) 901-2345',
    role: 'employee',
    designation: 'Financial Analyst',
    department: 'Finance & Ops',
    managerId: 'emp-101',
    managerName: 'Eleanor Vance',
    joinDate: '2023-11-01',
    employmentType: 'Full-Time',
    status: 'Active',
    workMode: 'Hybrid',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco HQ (Floor 4)',
    emergencyContact: {
      name: 'Sergei Rostov',
      relationship: 'Spouse',
      phone: '+1 (555) 901-7788',
    },
    salary: {
      basic: 5600,
      hra: 2100,
      specialAllowance: 1400,
      conveyance: 400,
      epfDeduction: 670,
      professionalTax: 200,
      incomeTaxTDS: 1180,
      bankName: 'Silicon Valley Bank',
      accountNumber: '****-****-5521',
      ifscOrRouting: 'SVBKUS6S',
      panOrTaxId: 'TX-551029-R',
    },
    skills: ['Payroll Accounting', 'Financial Modeling', 'Budget Forecasting', 'Audit & Compliance', 'Excel/SQL'],
    bio: 'Finance professional handling corporate payroll modeling, operational budgets, and financial reporting accuracy.',
  }
];

export const INITIAL_LEAVE_BALANCES: Record<string, LeaveBalance> = {
  'emp-101': { employeeId: 'emp-101', annualTotal: 24, annualUsed: 6, sickTotal: 12, sickUsed: 2, casualTotal: 10, casualUsed: 3, unpaidUsed: 0 },
  'emp-102': { employeeId: 'emp-102', annualTotal: 24, annualUsed: 8, sickTotal: 12, sickUsed: 1, casualTotal: 10, casualUsed: 2, unpaidUsed: 0 },
  'emp-103': { employeeId: 'emp-103', annualTotal: 20, annualUsed: 4, sickTotal: 12, sickUsed: 3, casualTotal: 10, casualUsed: 1, unpaidUsed: 0 },
  'emp-104': { employeeId: 'emp-104', annualTotal: 20, annualUsed: 10, sickTotal: 12, sickUsed: 0, casualTotal: 10, casualUsed: 4, unpaidUsed: 0 },
  'emp-105': { employeeId: 'emp-105', annualTotal: 22, annualUsed: 5, sickTotal: 12, sickUsed: 2, casualTotal: 10, casualUsed: 2, unpaidUsed: 0 },
  'emp-106': { employeeId: 'emp-106', annualTotal: 20, annualUsed: 3, sickTotal: 12, sickUsed: 1, casualTotal: 10, casualUsed: 1, unpaidUsed: 0 },
  'emp-107': { employeeId: 'emp-107', annualTotal: 18, annualUsed: 2, sickTotal: 12, sickUsed: 0, casualTotal: 10, casualUsed: 0, unpaidUsed: 0 },
  'emp-108': { employeeId: 'emp-108', annualTotal: 20, annualUsed: 5, sickTotal: 12, sickUsed: 2, casualTotal: 10, casualUsed: 1, unpaidUsed: 0 },
};

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr-201',
    employeeId: 'emp-103',
    employeeName: 'Sarah Jenkins',
    employeeCode: 'DF-1003',
    department: 'Engineering',
    leaveType: 'Paid Annual',
    startDate: '2026-09-07',
    endDate: '2026-09-09',
    isHalfDay: false,
    totalDays: 3,
    reason: 'Attending family reunion and annual personal travel.',
    status: 'Pending',
    appliedAt: '2026-08-30 14:20:00',
  },
  {
    id: 'lr-202',
    employeeId: 'emp-107',
    employeeName: 'Lucas Santoro',
    employeeCode: 'DF-1007',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2026-09-02',
    endDate: '2026-09-02',
    isHalfDay: false,
    totalDays: 1,
    reason: 'Scheduled medical appointment and recovery.',
    status: 'Pending',
    appliedAt: '2026-08-31 09:15:00',
  },
  {
    id: 'lr-203',
    employeeId: 'emp-104',
    employeeName: 'David Miller',
    employeeCode: 'DF-1004',
    department: 'Marketing',
    leaveType: 'Casual Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-25',
    isHalfDay: true,
    halfDayPeriod: 'Second Half',
    totalDays: 0.5,
    reason: 'Attending residential apartment handover inspection.',
    status: 'Approved',
    appliedAt: '2026-08-22 11:00:00',
    reviewedBy: 'Eleanor Vance',
    reviewedAt: '2026-08-22 16:30:00',
    reviewComments: 'Approved. Please ensure marketing campaigns are scheduled.',
  },
  {
    id: 'lr-204',
    employeeId: 'emp-108',
    employeeName: 'Elena Rostova',
    employeeCode: 'DF-1008',
    department: 'Finance & Ops',
    leaveType: 'Paid Annual',
    startDate: '2026-08-14',
    endDate: '2026-08-18',
    isHalfDay: false,
    totalDays: 5,
    reason: 'Summer vacation trip.',
    status: 'Approved',
    appliedAt: '2026-08-01 10:15:00',
    reviewedBy: 'Eleanor Vance',
    reviewedAt: '2026-08-02 09:45:00',
    reviewComments: 'Approved. Enjoy your vacation!',
  },
  {
    id: 'lr-205',
    employeeId: 'emp-103',
    employeeName: 'Sarah Jenkins',
    employeeCode: 'DF-1003',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '2026-08-05',
    endDate: '2026-08-05',
    isHalfDay: false,
    totalDays: 1,
    reason: 'Personal errands and DMV appointment.',
    status: 'Approved',
    appliedAt: '2026-08-02 17:00:00',
    reviewedBy: 'Marcus Chen',
    reviewedAt: '2026-08-03 08:30:00',
    reviewComments: 'Approved.',
  }
];

export const INITIAL_HOLIDAYS: CompanyHoliday[] = [
  { id: 'hol-1', date: '2026-01-01', name: "New Year's Day", type: 'Public Holiday', dayOfWeek: 'Thursday' },
  { id: 'hol-2', date: '2026-01-19', name: 'Martin Luther King Jr. Day', type: 'Public Holiday', dayOfWeek: 'Monday' },
  { id: 'hol-3', date: '2026-05-25', name: 'Memorial Day', type: 'Public Holiday', dayOfWeek: 'Monday' },
  { id: 'hol-4', date: '2026-06-19', name: 'Juneteenth National Independence Day', type: 'Public Holiday', dayOfWeek: 'Friday' },
  { id: 'hol-5', date: '2026-07-03', name: 'Independence Day (Observed)', type: 'Public Holiday', dayOfWeek: 'Friday' },
  { id: 'hol-6', date: '2026-09-07', name: 'Labor Day', type: 'Public Holiday', dayOfWeek: 'Monday' },
  { id: 'hol-7', date: '2026-10-12', name: 'Indigenous Peoples / Columbus Day', type: 'Optional', dayOfWeek: 'Monday' },
  { id: 'hol-8', date: '2026-11-26', name: 'Thanksgiving Day', type: 'Public Holiday', dayOfWeek: 'Thursday' },
  { id: 'hol-9', date: '2026-11-27', name: 'Day After Thanksgiving', type: 'Company Off', dayOfWeek: 'Friday' },
  { id: 'hol-10', date: '2026-12-25', name: 'Christmas Day', type: 'Public Holiday', dayOfWeek: 'Friday' },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Upcoming Labor Day Office Closure & Payroll Schedule',
    content: 'Please note that the corporate offices will be closed on Monday, September 7th in observance of Labor Day. The September payroll cycle cutoff has been updated accordingly to ensure early processing.',
    category: 'Holiday',
    priority: 'High',
    author: 'Eleanor Vance',
    authorRole: 'Director of People & Operations',
    createdAt: '2026-08-28 10:00:00',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'Annual Health & Wellness Benefit Window Opens',
    content: 'The open enrollment period for the annual health, dental, and wellness allowance program is now active. Review your updated plan options in the benefits section before September 20th.',
    category: 'Policy',
    priority: 'Normal',
    author: 'Priya Sharma',
    authorRole: 'HR & Talent Specialist',
    createdAt: '2026-08-26 15:30:00',
    pinned: true,
  },
  {
    id: 'ann-3',
    title: 'Q3 All-Hands Meeting & Product Roadmap Showcase',
    content: 'Join us in the Main Hall or via the virtual stream for our Q3 company-wide town hall on Friday, September 11th at 3:00 PM PST. Snacks and refreshments will be provided at all hub locations.',
    category: 'Company Update',
    priority: 'Normal',
    author: 'Eleanor Vance',
    authorRole: 'Director of People & Operations',
    createdAt: '2026-08-20 11:15:00',
    pinned: false,
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-31 09:00:12',
    actorId: 'emp-101',
    actorName: 'Eleanor Vance',
    actorRole: 'admin',
    module: 'Attendance',
    action: 'Clock In',
    details: 'Clocked in at San Francisco HQ at 09:00 AM.',
  },
  {
    id: 'log-2',
    timestamp: '2026-08-30 14:20:00',
    actorId: 'emp-103',
    actorName: 'Sarah Jenkins',
    actorRole: 'employee',
    module: 'Leave',
    action: 'Leave Request Submitted',
    details: 'Submitted Paid Annual Leave request for 2026-09-07 to 2026-09-09 (3 days).',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-28 17:45:00',
    actorId: 'emp-101',
    actorName: 'Eleanor Vance',
    actorRole: 'admin',
    module: 'Payroll',
    action: 'Payroll Disbursed',
    details: 'Disbursed August 2026 payroll cycle totaling $48,720 across 8 active employees.',
  },
  {
    id: 'log-4',
    timestamp: '2026-08-22 16:30:00',
    actorId: 'emp-101',
    actorName: 'Eleanor Vance',
    actorRole: 'admin',
    module: 'Leave',
    action: 'Leave Approved',
    details: 'Approved Casual Leave for David Miller (0.5 days on 2026-08-25).',
  }
];

export const INITIAL_PAYROLL_CYCLES: PayrollCycle[] = [
  {
    id: 'cycle-2026-08',
    month: 'August 2026',
    monthIndex: 7,
    year: 2026,
    totalEmployees: 8,
    totalGross: 68100,
    totalDeductions: 19380,
    totalNet: 48720,
    status: 'Disbursed',
    processedAt: '2026-08-27 16:00:00',
    disbursedAt: '2026-08-28 10:00:00',
    payDate: '2026-08-31',
  },
  {
    id: 'cycle-2026-07',
    month: 'July 2026',
    monthIndex: 6,
    year: 2026,
    totalEmployees: 8,
    totalGross: 68100,
    totalDeductions: 19380,
    totalNet: 48720,
    status: 'Disbursed',
    processedAt: '2026-07-28 15:00:00',
    disbursedAt: '2026-07-30 09:30:00',
    payDate: '2026-07-31',
  },
  {
    id: 'cycle-2026-06',
    month: 'June 2026',
    monthIndex: 5,
    year: 2026,
    totalEmployees: 8,
    totalGross: 68100,
    totalDeductions: 19380,
    totalNet: 48720,
    status: 'Disbursed',
    processedAt: '2026-06-27 14:00:00',
    disbursedAt: '2026-06-29 11:00:00',
    payDate: '2026-06-30',
  }
];

// Generate attendance records for current month up to today (August 31, 2026)
export function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const daysInAugust = 31;
  
  INITIAL_EMPLOYEES.forEach((emp) => {
    for (let day = 1; day <= daysInAugust; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `2026-08-${dayStr}`;
      const dateObj = new Date(2026, 7, day);
      const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        records.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          workMode: emp.workMode === 'Remote' ? 'Remote' : 'Office',
          totalHours: 0,
          breakMinutes: 0,
          status: 'Weekend',
        });
        continue;
      }

      // Specific mock patterns:
      // Check if on leave
      if (emp.id === 'emp-108' && day >= 14 && day <= 18) {
        records.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          workMode: 'Office',
          totalHours: 0,
          breakMinutes: 0,
          status: 'On Leave',
          notes: 'Approved Paid Annual Leave',
        });
        continue;
      }

      if (emp.id === 'emp-103' && day === 5) {
        records.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          workMode: 'Office',
          totalHours: 0,
          breakMinutes: 0,
          status: 'On Leave',
          notes: 'Approved Casual Leave',
        });
        continue;
      }

      if (emp.id === 'emp-104' && day === 25) {
        records.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          clockIn: '09:00:00',
          clockOut: '13:00:00',
          workMode: 'Remote',
          totalHours: 4.0,
          breakMinutes: 0,
          status: 'Half Day',
          notes: 'Half Day Casual Leave (Second half)',
        });
        continue;
      }

      // Today is August 31, 2026
      if (day === 31) {
        // Sarah Jenkins & David Miller are currently clocked in
        if (emp.id === 'emp-103') {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            clockIn: '08:55:10',
            workMode: 'Office',
            totalHours: 7.8,
            breakMinutes: 45,
            status: 'Present',
          });
        } else if (emp.id === 'emp-101') {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            clockIn: '09:00:00',
            workMode: 'Office',
            totalHours: 8.0,
            breakMinutes: 50,
            status: 'Present',
          });
        } else if (emp.id === 'emp-102') {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            clockIn: '09:12:00',
            workMode: 'Office',
            totalHours: 7.7,
            breakMinutes: 40,
            status: 'Present',
          });
        } else if (emp.id === 'emp-104') {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            clockIn: '08:45:00',
            workMode: 'Remote',
            totalHours: 8.2,
            breakMinutes: 30,
            status: 'Present',
          });
        } else {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            clockIn: '09:05:00',
            clockOut: '17:35:00',
            workMode: emp.workMode === 'Remote' ? 'Remote' : 'Office',
            totalHours: 8.0,
            breakMinutes: 45,
            status: 'Present',
          });
        }
        continue;
      }

      // Past regular work days
      const isLate = (day % 7 === 2 && emp.id === 'emp-107');
      const clockIn = isLate ? '09:42:00' : '08:58:00';
      const clockOut = isLate ? '18:15:00' : '17:30:00';
      const totalHours = isLate ? 8.1 : 8.0;

      records.push({
        id: `att-${emp.id}-${dateStr}`,
        employeeId: emp.id,
        date: dateStr,
        clockIn,
        clockOut,
        workMode: emp.workMode === 'Remote' ? 'Remote' : 'Office',
        totalHours,
        breakMinutes: 45,
        status: isLate ? 'Late' : 'Present',
      });
    }
  });

  return records;
}

// Generate payslips for the historical cycles
export function generateInitialPayslips(): Payslip[] {
  const payslips: Payslip[] = [];
  const cycles = [
    { cycleId: 'cycle-2026-08', month: 'August', year: 2026, payDate: '2026-08-31' },
    { cycleId: 'cycle-2026-07', month: 'July', year: 2026, payDate: '2026-07-31' },
    { cycleId: 'cycle-2026-06', month: 'June', year: 2026, payDate: '2026-06-30' },
  ];

  cycles.forEach((c) => {
    INITIAL_EMPLOYEES.forEach((emp, index) => {
      const gross = emp.salary.basic + emp.salary.hra + emp.salary.specialAllowance + emp.salary.conveyance;
      const deductions = emp.salary.epfDeduction + emp.salary.professionalTax + emp.salary.incomeTaxTDS;
      const net = gross - deductions;
      
      payslips.push({
        id: `ps-${emp.id}-${c.year}-${c.month.toLowerCase()}`,
        payslipNumber: `DF-PAY-${c.year}${(c.cycleId.slice(-2))}-${1000 + index + 1}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeCode: emp.employeeCode,
        designation: emp.designation,
        department: emp.department,
        cycleId: c.cycleId,
        month: c.month,
        year: c.year,
        payDate: c.payDate,
        basicSalary: emp.salary.basic,
        hra: emp.salary.hra,
        specialAllowance: emp.salary.specialAllowance,
        conveyance: emp.salary.conveyance,
        performanceBonus: 0,
        grossEarnings: gross,
        epfDeduction: emp.salary.epfDeduction,
        professionalTax: emp.salary.professionalTax,
        incomeTaxTDS: emp.salary.incomeTaxTDS,
        unpaidLeaveDeduction: 0,
        totalDeductions: deductions,
        netPay: net,
        paymentStatus: 'Paid',
        bankName: emp.salary.bankName,
        accountNumberMasked: emp.salary.accountNumber,
        panOrTaxId: emp.salary.panOrTaxId,
      });
    });
  });

  return payslips;
}
