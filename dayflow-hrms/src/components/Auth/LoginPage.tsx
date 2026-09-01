import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Fingerprint,
  Building2,
  CheckCircle2,
  BadgeCheck,
  UserCheck
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

export const LoginPage: React.FC = () => {
  const { employees, login } = useHR();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('emp-101');
  const [emailOrCode, setEmailOrCode] = useState('DF-1001');
  const [password, setPassword] = useState('dayflow2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample role presets for quick demo credentials testing
  const adminUser = employees.find((e) => e.role === 'admin') || employees[0];
  const managerUser = employees.find((e) => e.role === 'manager') || employees[1];
  const employeeUser = employees.find((e) => e.role === 'employee') || employees[2];

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const trimmed = emailOrCode.trim().toLowerCase();
      // Match by ID, Staff Employee Code (e.g., DF-1001), or corporate Email
      const matched = employees.find(
        (emp) =>
          emp.id.toLowerCase() === trimmed ||
          emp.employeeCode.toLowerCase() === trimmed ||
          emp.email.toLowerCase() === trimmed
      );

      if (matched) {
        login(matched.id);
        setIsLoading(false);
      } else {
        // Fallback to selected dropdown if input matches nothing
        const fallback = employees.find((emp) => emp.id === selectedEmployeeId);
        if (fallback && !emailOrCode.trim()) {
          login(fallback.id);
          setIsLoading(false);
        } else {
          setErrorMessage('Invalid credentials. Please enter a valid Corporate Email or Staff ID (e.g., DF-1001, DF-1002, DF-1003).');
          setIsLoading(false);
        }
      }
    }, 300);
  };

  const quickAutofill = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setSelectedEmployeeId(emp.id);
      setEmailOrCode(emp.employeeCode);
      setPassword('dayflow2026');
      setErrorMessage('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans text-gray-900 selection:bg-blue-600 selection:text-white">
      {/* Top Brand Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-gray-900">DayFlow</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider border border-blue-200/60">
                HRMS v2.6
              </span>
            </div>
            <p className="text-xs text-gray-500">Human Resource Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-medium hidden sm:inline">Role-Based Access Control</span>
          <span className="font-mono text-gray-400">• Secure SSO</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Staff Sign In</h1>
            <p className="text-xs text-gray-500 mt-1">
              Enter your Staff ID or Corporate Email to access your workspace
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium mb-4">
              {errorMessage}
            </div>
          )}

          {/* Quick Demo Role Fill Helpers */}
          <div className="mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Quick Staff Autofill:
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Demo Accounts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {adminUser && (
                <button
                  type="button"
                  id="autofill-admin-btn"
                  onClick={() => quickAutofill(adminUser.id)}
                  className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    selectedEmployeeId === adminUser.id
                      ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-300'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="font-bold text-purple-700 block truncate">HR Admin</span>
                  <span className="text-[10px] text-gray-500 font-mono block truncate">DF-1001</span>
                </button>
              )}
              {managerUser && (
                <button
                  type="button"
                  id="autofill-manager-btn"
                  onClick={() => quickAutofill(managerUser.id)}
                  className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    selectedEmployeeId === managerUser.id
                      ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="font-bold text-blue-700 block truncate">Manager</span>
                  <span className="text-[10px] text-gray-500 font-mono block truncate">DF-1002</span>
                </button>
              )}
              {employeeUser && (
                <button
                  type="button"
                  id="autofill-employee-btn"
                  onClick={() => quickAutofill(employeeUser.id)}
                  className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    selectedEmployeeId === employeeUser.id
                      ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300'
                      : 'bg-white border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="font-bold text-emerald-700 block truncate">Employee</span>
                  <span className="text-[10px] text-gray-500 font-mono block truncate">DF-1003</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-4 text-xs">
            {/* Select Employee Account Dropdown (Optional Helper) */}
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Select Employee Account
              </label>
              <select
                id="login-employee-select"
                value={selectedEmployeeId}
                onChange={(e) => quickAutofill(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} — {emp.employeeCode} ({emp.designation})
                  </option>
                ))}
              </select>
            </div>

            {/* Corporate Email or Staff ID */}
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Staff ID or Corporate Email
              </label>
              <div className="relative">
                <input
                  id="login-staff-id-input"
                  type="text"
                  required
                  value={emailOrCode}
                  onChange={(e) => setEmailOrCode(e.target.value)}
                  placeholder="e.g. DF-1001 or eleanor.vance@dayflow.internal"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Accepts Staff Code (e.g. <span className="font-mono text-gray-600">DF-1001</span>) or corporate email
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-gray-700">Security Password</label>
                <span className="text-[10px] text-gray-400 font-mono">Demo: dayflow2026</span>
              </div>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
        <p>© 2026 DayFlow Technologies Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Security Compliant</span>
          <span>•</span>
          <span>Role Guard Enforced</span>
          <span>•</span>
          <span>Confidential Payroll</span>
        </div>
      </footer>
    </div>
  );
};
