import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  CreditCard, 
  Shield, 
  Edit3, 
  Save, 
  Clock, 
  CalendarCheck, 
  Heart,
  Award,
  Building
} from 'lucide-react';
import { Employee, Department, EmploymentType, WorkMode, UserRole } from '../../types';
import { useHR } from '../../context/HRContext';
import { formatCurrency, formatDate, getDepartmentColor } from '../../utils/formatters';

interface EmployeeDetailModalProps {
  employeeId: string | null;
  onClose: () => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employeeId,
  onClose,
}) => {
  const { employees, updateEmployee, isAdmin, attendanceRecords, leaveBalances, leaveRequests } = useHR();

  const employee = employees.find((e) => e.id === employeeId);

  const [activeTab, setActiveTab] = useState<'profile' | 'compensation' | 'attendance' | 'leaves'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState<Partial<Employee>>({});

  if (!employee) return null;

  const startEditing = () => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      designation: employee.designation,
      department: employee.department,
      role: employee.role,
      employmentType: employee.employmentType,
      workMode: employee.workMode,
      location: employee.location,
      bio: employee.bio,
      salary: { ...employee.salary },
      emergencyContact: { ...employee.emergencyContact },
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (employeeId) {
      updateEmployee(employeeId, formData);
      setIsEditing(false);
    }
  };

  const empBalance = leaveBalances[employee.id] || {
    employeeId: employee.id,
    annualTotal: 20,
    annualUsed: 0,
    sickTotal: 12,
    sickUsed: 0,
    casualTotal: 10,
    casualUsed: 0,
    unpaidUsed: 0,
  };

  const empAttendance = attendanceRecords.filter((r) => r.employeeId === employee.id).slice(-10).reverse();
  const empLeaves = leaveRequests.filter((r) => r.employeeId === employee.id);

  const deptColors = getDepartmentColor(employee.department);

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header with clean dark container */}
        <div className="relative bg-gray-900 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={employee.avatar}
              alt={employee.firstName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gray-700 shadow-md shrink-0"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">
                  {employee.firstName} {employee.lastName}
                </h2>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                  {employee.employeeCode}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium">{employee.designation}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <span>{employee.department}</span>
                <span>•</span>
                <span>Joined {formatDate(employee.joinDate)}</span>
              </p>
            </div>

            {isAdmin && !isEditing && (
              <button
                onClick={startEditing}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6 bg-gray-50 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('compensation')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'compensation'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Compensation & Bank
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'attendance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Attendance Logs
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'leaves'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Leave History
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Profile & Details */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Phone</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Designation</label>
                      <input
                        type="text"
                        value={formData.designation || ''}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                        className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance & Ops">Finance & Ops</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Professional Summary</h4>
                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                      {employee.bio}
                    </p>
                  </div>

                  {/* Contact & Location */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Contact & Workplace</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-gray-400 block text-[10px]">Email Address</span>
                          <span className="font-semibold text-gray-900">{employee.email}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-gray-400 block text-[10px]">Phone Number</span>
                          <span className="font-semibold text-gray-900">{employee.phone}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-gray-400 block text-[10px]">Office Location</span>
                          <span className="font-semibold text-gray-900">{employee.location}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                        <Building className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-gray-400 block text-[10px]">Work Mode</span>
                          <span className="font-semibold text-gray-900">{employee.workMode} ({employee.employmentType})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Emergency Contact</h4>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-gray-900">{employee.emergencyContact.name}</p>
                        <p className="text-gray-500">{employee.emergencyContact.relationship}</p>
                      </div>
                      <span className="font-mono font-semibold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200">
                        {employee.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Compensation */}
          {activeTab === 'compensation' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Salary Structure</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Basic Pay:</span>
                    <span className="font-bold font-mono text-gray-900">{formatCurrency(employee.salary.basic)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">House Rent Allowance (HRA):</span>
                    <span className="font-bold font-mono text-gray-900">{formatCurrency(employee.salary.hra)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Special Allowance:</span>
                    <span className="font-bold font-mono text-gray-900">{formatCurrency(employee.salary.specialAllowance)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">EPF Deduction:</span>
                    <span className="font-bold font-mono text-red-600">{formatCurrency(employee.salary.epfDeduction)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Bank Account Information</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Bank Name:</span>
                    <span className="font-semibold text-gray-900">{employee.salary.bankName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Account Number:</span>
                    <span className="font-mono text-gray-900">{employee.salary.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">IFSC / Routing Code:</span>
                    <span className="font-mono text-gray-900">{employee.salary.ifscOrRouting}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">PAN / Tax ID:</span>
                    <span className="font-mono text-gray-900">{employee.salary.panOrTaxId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Attendance Logs */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Recent Attendance Logs</h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {empAttendance.map((rec) => (
                  <div key={rec.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{formatDate(rec.date)}</span>
                      <span className="text-gray-500 ml-2">({rec.workMode})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gray-600">{rec.clockIn || '—'} - {rec.clockOut || '—'}</span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-700">
                        {rec.totalHours ? `${rec.totalHours.toFixed(1)}h` : rec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Leave History */}
          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Leave Quota & Past Requests</h4>
              <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-blue-800 font-semibold block">Annual Quota</span>
                  <span className="text-lg font-bold text-blue-900">{empBalance.annualTotal - empBalance.annualUsed} left</span>
                </div>
                <div className="p-3 bg-green-50/60 rounded-xl border border-green-100">
                  <span className="text-green-800 font-semibold block">Sick Quota</span>
                  <span className="text-lg font-bold text-green-900">{empBalance.sickTotal - empBalance.sickUsed} left</span>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                  <span className="text-amber-800 font-semibold block">Casual Quota</span>
                  <span className="text-lg font-bold text-amber-900">{empBalance.casualTotal - empBalance.casualUsed} left</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden text-xs">
                {empLeaves.map((req) => (
                  <div key={req.id} className="p-3 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{req.leaveType} Leave</span>
                      <span className="text-gray-500 ml-2">({formatDate(req.startDate)} to {formatDate(req.endDate)})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      req.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
