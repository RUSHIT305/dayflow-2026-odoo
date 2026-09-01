import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Building, CreditCard, Heart, Shield } from 'lucide-react';
import { Department, EmploymentType, WorkMode, UserRole } from '../../types';
import { useHR } from '../../context/HRContext';

interface AddEmployeeModalProps {
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
];

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose }) => {
  const { addEmployee } = useHR();

  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [location, setLocation] = useState('San Francisco HQ');

  // Job Details
  const [role, setRole] = useState<UserRole>('employee');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-Time');
  const [workMode, setWorkMode] = useState<WorkMode>('Office');
  const [joinDate, setJoinDate] = useState('2026-08-31');

  // Salary
  const [basic, setBasic] = useState<number>(6000);
  const [hra, setHra] = useState<number>(2400);
  const [specialAllowance, setSpecialAllowance] = useState<number>(1600);
  const [conveyance, setConveyance] = useState<number>(400);
  const [bankName, setBankName] = useState('JPMorgan Chase Bank');
  const [accountNumber, setAccountNumber] = useState('****-****-1284');
  const [ifscOrRouting, setIfscOrRouting] = useState('CHASUS33');
  const [panOrTaxId, setPanOrTaxId] = useState('TX-892104-D');

  // Emergency & Extras
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [skillsText, setSkillsText] = useState('React, TypeScript, Collaboration');
  const [bio, setBio] = useState('Dedicated professional focused on impactful cross-functional contributions.');

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !designation) {
      setErrorMsg('Please complete all required fields (First Name, Last Name, Email, Designation).');
      return;
    }

    const epfDeduction = Math.round(basic * 0.12);
    const professionalTax = 200;
    const incomeTaxTDS = Math.round((basic + hra + specialAllowance + conveyance) * 0.15);

    addEmployee({
      firstName,
      lastName,
      email,
      phone: phone || '+1 (555) 000-1122',
      role,
      designation,
      department,
      joinDate,
      employmentType,
      status: 'Active',
      workMode,
      avatar,
      location,
      emergencyContact: {
        name: emergencyName || 'Family Member',
        relationship: emergencyRelation || 'Spouse',
        phone: emergencyPhone || '+1 (555) 999-8877',
      },
      salary: {
        basic,
        hra,
        specialAllowance,
        conveyance,
        epfDeduction,
        professionalTax,
        incomeTaxTDS,
        bankName,
        accountNumber,
        ifscOrRouting,
        panOrTaxId,
      },
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      bio,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 bg-gray-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Onboard New Team Member</h3>
              <p className="text-xs text-gray-300">Create employee record, role assignment, and payroll structure</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveStep(1)}
            className={`py-3.5 text-center border-b-2 transition-colors cursor-pointer ${
              activeStep === 1 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            1. Identity & Contact
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`py-3.5 text-center border-b-2 transition-colors cursor-pointer ${
              activeStep === 2 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            2. Role & Department
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`py-3.5 text-center border-b-2 transition-colors cursor-pointer ${
              activeStep === 3 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            3. Compensation & Bank
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Personal */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hayes"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan.hayes@dayflow.internal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 345-6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Select Profile Avatar</label>
                <div className="flex items-center gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Preset"
                      onClick={() => setAvatar(preset)}
                      className={`w-11 h-11 rounded-xl object-cover cursor-pointer ring-2 transition-all ${
                        avatar === preset ? 'ring-blue-600 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Office Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Continue to Role & Dept →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Role & Department */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Designation / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white"
                  >
                    <option value="Office">Office</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Client Site">Client Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Joining Date</label>
                <input
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Continue to Compensation →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Compensation */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Basic ($)</label>
                  <input
                    type="number"
                    value={basic}
                    onChange={(e) => setBasic(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">HRA ($)</label>
                  <input
                    type="number"
                    value={hra}
                    onChange={(e) => setHra(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Special ($)</label>
                  <input
                    type="number"
                    value={specialAllowance}
                    onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Conveyance ($)</label>
                  <input
                    type="number"
                    value={conveyance}
                    onChange={(e) => setConveyance(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Complete Onboarding
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
