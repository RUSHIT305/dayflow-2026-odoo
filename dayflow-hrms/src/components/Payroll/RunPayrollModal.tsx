import React, { useState } from 'react';
import { X, Play, DollarSign, Calculator, Users, CheckCircle2 } from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { formatCurrency } from '../../utils/formatters';

interface RunPayrollModalProps {
  onClose: () => void;
}

export const RunPayrollModal: React.FC<RunPayrollModalProps> = ({ onClose }) => {
  const { employees, createPayrollCycle } = useHR();

  const [month, setMonth] = useState('September');
  const [year, setYear] = useState(2026);
  const [bonuses, setBonuses] = useState<Record<string, number>>({});

  const activeEmployees = employees.filter((e) => e.status !== 'Terminated');

  const handleBonusChange = (empId: string, val: number) => {
    setBonuses((prev) => ({ ...prev, [empId]: val }));
  };

  // Calculate totals
  let totalGross = 0;
  let totalDeductions = 0;
  let totalNet = 0;

  activeEmployees.forEach((emp) => {
    const s = emp.salary;
    const bonus = bonuses[emp.id] || 0;
    const gross = s.basic + s.hra + s.specialAllowance + s.conveyance + bonus;
    const deductions = s.epfDeduction + s.professionalTax + s.incomeTaxTDS;
    const net = gross - deductions;

    totalGross += gross;
    totalDeductions += deductions;
    totalNet += net;
  });

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    createPayrollCycle(month, year, bonuses);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-gray-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Process & Run Payroll Cycle</h3>
              <p className="text-xs text-gray-300">Compute monthly salary, EPF, TDS, and generate employee payslips</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Pay Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Calendar Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Body: Active Employees Salary Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-900">Workforce Compensation Calculation Table</h4>
            <span className="text-gray-500 font-semibold">{activeEmployees.length} Eligible Employees</span>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Base CTC</th>
                  <th className="py-2.5 px-3">Bonus / Incentive</th>
                  <th className="py-2.5 px-3">Deductions</th>
                  <th className="py-2.5 px-3 text-right">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeEmployees.map((emp) => {
                  const s = emp.salary;
                  const bonus = bonuses[emp.id] || 0;
                  const gross = s.basic + s.hra + s.specialAllowance + s.conveyance + bonus;
                  const deductions = s.epfDeduction + s.professionalTax + s.incomeTaxTDS;
                  const net = gross - deductions;

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <span className="font-bold text-gray-900 block">{emp.firstName} {emp.lastName}</span>
                        <span className="text-[10px] font-mono text-gray-400">{emp.employeeCode}</span>
                      </td>
                      <td className="py-2 px-3 font-mono">{formatCurrency(s.basic + s.hra + s.specialAllowance + s.conveyance)}</td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          placeholder="0"
                          value={bonuses[emp.id] || ''}
                          onChange={(e) => handleBonusChange(emp.id, Number(e.target.value))}
                          className="w-24 p-1 border border-gray-300 rounded-lg text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono text-red-600">-{formatCurrency(deductions)}</td>
                      <td className="py-2 px-3 font-mono font-bold text-green-700 text-right">{formatCurrency(net)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary & Process */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-gray-400 block">Total Gross Outlay:</span>
              <span className="font-mono font-bold text-gray-900">{formatCurrency(totalGross)}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Withholdings & Tax:</span>
              <span className="font-mono font-bold text-red-600">{formatCurrency(totalDeductions)}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Total Net Disbursement:</span>
              <span className="font-mono font-bold text-green-700 text-sm">{formatCurrency(totalNet)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProcess}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Generate Cycle & Payslips</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
