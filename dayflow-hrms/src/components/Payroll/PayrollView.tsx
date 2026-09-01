import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  Plus, 
  TrendingUp, 
  ShieldCheck,
  Building,
  ExternalLink,
  Send
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import { Payslip, PayrollCycle } from '../../types';
import { PayslipModal } from './PayslipModal';
import { RunPayrollModal } from './RunPayrollModal';
import confetti from 'canvas-confetti';

export const PayrollView: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    payrollCycles,
    payslips,
    disbursePayrollCycle,
    employees,
  } = useHR();

  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [showRunPayrollModal, setShowRunPayrollModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-payroll' | 'payroll-runs' | 'salary-register'>(
    isAdmin ? 'payroll-runs' : 'my-payroll'
  );

  // Extract all payslips for current user
  const myPayslips = payslips.filter((p) => p.employeeId === currentUser.id);

  const handleDisburse = (cycleId: string) => {
    disbursePayrollCycle(cycleId);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleExportRegister = () => {
    const headers = 'Employee ID,Name,Department,Basic,HRA,Special,Conveyance,Gross,EPF,TDS,Net Pay\n';
    const rows = employees
      .map((e) => {
        const s = e.salary;
        const gross = s.basic + s.hra + s.specialAllowance + s.conveyance;
        const net = gross - (s.epfDeduction + s.professionalTax + s.incomeTaxTDS);
        return `${e.employeeCode},"${e.firstName} ${e.lastName}",${e.department},${s.basic},${s.hra},${s.specialAllowance},${s.conveyance},${gross},${s.epfDeduction},${s.incomeTaxTDS},${net}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DayFlow_Salary_Register_2026.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Payroll & Compensation</h2>
          <p className="text-xs text-gray-500">
            Automated salary calculations, EPF & tax withholdings, official printable payslips, and disbursement runs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={handleExportRegister}
                className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Register</span>
              </button>

              <button
                id="run-payroll-cycle-btn"
                onClick={() => setShowRunPayrollModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <DollarSign className="w-4 h-4" />
                <span>Process Cycle</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-2xl px-3 shadow-sm">
        <button
          onClick={() => setActiveTab('my-payroll')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'my-payroll'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>My Payslips & Compensation</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('payroll-runs')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'payroll-runs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Company Payroll Cycles</span>
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => setActiveTab('salary-register')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'salary-register'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Master Salary Register</span>
          </button>
        )}
      </div>

      {/* TAB 1: My Payslips */}
      {activeTab === 'my-payroll' && (
        <div className="space-y-6">
          {/* Salary Structure Overview Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">My Annual Compensation Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                <span className="text-xs text-gray-500 block mb-1">Monthly Gross Pay</span>
                <span className="text-xl font-bold font-mono text-gray-900">
                  {formatCurrency(
                    currentUser.salary.basic +
                    currentUser.salary.hra +
                    currentUser.salary.specialAllowance +
                    currentUser.salary.conveyance
                  )}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                <span className="text-xs text-gray-500 block mb-1">Basic Salary</span>
                <span className="text-xl font-bold font-mono text-gray-900">
                  {formatCurrency(currentUser.salary.basic)}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                <span className="text-xs text-gray-500 block mb-1">Total Deductions</span>
                <span className="text-xl font-bold font-mono text-red-600">
                  {formatCurrency(
                    currentUser.salary.epfDeduction +
                    currentUser.salary.professionalTax +
                    currentUser.salary.incomeTaxTDS
                  )}
                </span>
              </div>
              <div className="p-4 bg-green-50/60 rounded-xl border border-green-200">
                <span className="text-xs font-semibold text-green-800 block mb-1">Net Take-Home</span>
                <span className="text-xl font-bold font-mono text-green-700">
                  {formatCurrency(
                    (currentUser.salary.basic +
                      currentUser.salary.hra +
                      currentUser.salary.specialAllowance +
                      currentUser.salary.conveyance) -
                    (currentUser.salary.epfDeduction +
                      currentUser.salary.professionalTax +
                      currentUser.salary.incomeTaxTDS)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Payslip History Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Generated Payslips & Slips</h3>
                <p className="text-xs text-gray-500">Official monthly payroll receipts and breakdown statements</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Pay Period</th>
                    <th className="py-3.5 px-4">Disbursement Date</th>
                    <th className="py-3.5 px-4">Gross Earnings</th>
                    <th className="py-3.5 px-4">Total Deductions</th>
                    <th className="py-3.5 px-4">Net Take-Home</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myPayslips.map((slip) => {
                    const statusBadge = getStatusBadge(slip.paymentStatus);
                    return (
                      <tr key={slip.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">{slip.month} {slip.year}</td>
                        <td className="py-3 px-4 text-gray-600">{formatDate(slip.payDate)}</td>
                        <td className="py-3 px-4 font-mono font-medium text-gray-800">{formatCurrency(slip.grossEarnings)}</td>
                        <td className="py-3 px-4 font-mono text-red-600">{formatCurrency(slip.totalDeductions)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">{formatCurrency(slip.netPay)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge.bg} ${statusBadge.text}`}>
                            {slip.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedPayslip(slip)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Payslip</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Payroll Runs (Admin) */}
      {activeTab === 'payroll-runs' && isAdmin && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Monthly Payroll Cycles & Disbursements</h3>
              <p className="text-xs text-gray-500">Track cycle progress, review total expenditures, and trigger automated payouts</p>
            </div>
          </div>

          <div className="space-y-4">
            {payrollCycles.map((cycle) => (
              <div key={cycle.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{cycle.month} {cycle.year} Cycle</h4>
                      <p className="text-xs text-gray-500">{cycle.totalEmployees} Employees Included • Pay Date: {formatDate(cycle.payDate)}</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    cycle.status === 'Disbursed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {cycle.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Total Gross:</span>
                    <span className="font-bold font-mono text-gray-900 text-sm">{formatCurrency(cycle.totalGross)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total Deductions:</span>
                    <span className="font-bold font-mono text-red-600 text-sm">{formatCurrency(cycle.totalDeductions)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total Net Disbursed:</span>
                    <span className="font-bold font-mono text-green-700 text-sm">{formatCurrency(cycle.totalNet)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Cycle ID:</span>
                    <span className="font-mono text-gray-600 text-xs">{cycle.id}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200/60">
                  {cycle.status !== 'Disbursed' && (
                    <button
                      onClick={() => handleDisburse(cycle.id)}
                      className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Disburse Payouts</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Master Salary Register (Admin) */}
      {activeTab === 'salary-register' && isAdmin && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Employee Salary Register</h3>
              <p className="text-xs text-gray-500">Base CTC and component structures for workforce</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Basic</th>
                  <th className="py-3.5 px-4">HRA</th>
                  <th className="py-3.5 px-4">Special</th>
                  <th className="py-3.5 px-4">Gross Pay</th>
                  <th className="py-3.5 px-4">EPF</th>
                  <th className="py-3.5 px-4">Tax (TDS)</th>
                  <th className="py-3.5 px-4 font-bold text-gray-900">Net Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => {
                  const s = emp.salary;
                  const gross = s.basic + s.hra + s.specialAllowance + s.conveyance;
                  const net = gross - (s.epfDeduction + s.professionalTax + s.incomeTaxTDS);

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <img src={emp.avatar} alt={emp.firstName} className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200" />
                        <div>
                          <span className="font-bold text-gray-900 block">{emp.firstName} {emp.lastName}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{emp.employeeCode}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{formatCurrency(s.basic)}</td>
                      <td className="py-3 px-4 font-mono">{formatCurrency(s.hra)}</td>
                      <td className="py-3 px-4 font-mono">{formatCurrency(s.specialAllowance)}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-gray-800">{formatCurrency(gross)}</td>
                      <td className="py-3 px-4 font-mono text-red-600">{formatCurrency(s.epfDeduction)}</td>
                      <td className="py-3 px-4 font-mono text-red-600">{formatCurrency(s.incomeTaxTDS)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-green-700">{formatCurrency(net)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}

      {/* Process Payroll Cycle Modal */}
      {showRunPayrollModal && (
        <RunPayrollModal
          onClose={() => setShowRunPayrollModal(false)}
        />
      )}
    </div>
  );
};
