import React from 'react';
import { X, Printer, Download, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Payslip } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface PayslipModalProps {
  payslip: Payslip | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ payslip, onClose }) => {
  if (!payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Top Control Bar */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Official Employee Payslip</span>
            <span className="text-xs font-mono text-gray-400">#{payslip.payslipNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-gray-900 font-sans">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-gray-900">DayFlow Technologies Inc.</h2>
                <p className="text-xs text-gray-500">Workforce Operations & Payroll Services</p>
                <p className="text-[11px] text-gray-400">500 Howard Street, Suite 400, San Francisco, CA</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block">Payslip For</span>
              <span className="text-base font-bold text-blue-600 block">{payslip.month} {payslip.year}</span>
              <span className="text-[11px] font-mono text-gray-400">Ref: {payslip.payslipNumber}</span>
            </div>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px]">Employee Name</span>
              <span className="font-bold text-gray-900">{payslip.employeeName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Employee Code</span>
              <span className="font-mono font-bold text-gray-900">{payslip.employeeCode}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Department</span>
              <span className="font-semibold text-gray-800">{payslip.department}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Designation</span>
              <span className="font-semibold text-gray-800">{payslip.designation}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Bank Name</span>
              <span className="font-semibold text-gray-800">{payslip.bankName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Account Number</span>
              <span className="font-mono font-semibold text-gray-800">{payslip.accountNumberMasked}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Tax ID / PAN</span>
              <span className="font-mono font-semibold text-gray-800">{payslip.panOrTaxId}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Payment Date</span>
              <span className="font-semibold text-gray-800">{formatDate(payslip.payDate)}</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Earnings */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-green-50 px-4 py-2.5 font-semibold text-green-800 flex justify-between border-b border-green-100">
                <span>Earnings Breakdown</span>
                <span>Amount</span>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-mono font-semibold text-gray-900">{formatCurrency(payslip.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold text-gray-900">{formatCurrency(payslip.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Special Allowance</span>
                  <span className="font-mono font-semibold text-gray-900">{formatCurrency(payslip.specialAllowance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conveyance Allowance</span>
                  <span className="font-mono font-semibold text-gray-900">{formatCurrency(payslip.conveyance)}</span>
                </div>
                {payslip.performanceBonus > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Performance Incentive</span>
                    <span className="font-mono">{formatCurrency(payslip.performanceBonus)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                  <span>Gross Earnings (A)</span>
                  <span className="font-mono text-sm">{formatCurrency(payslip.grossEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-red-50 px-4 py-2.5 font-semibold text-red-800 flex justify-between border-b border-red-100">
                <span>Deductions & Taxes</span>
                <span>Amount</span>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provident Fund (EPF)</span>
                  <span className="font-mono font-semibold text-red-600">{formatCurrency(payslip.epfDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Professional Tax (PT)</span>
                  <span className="font-mono font-semibold text-red-600">{formatCurrency(payslip.professionalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Income Tax (TDS)</span>
                  <span className="font-mono font-semibold text-red-600">{formatCurrency(payslip.incomeTaxTDS)}</span>
                </div>
                {payslip.unpaidLeaveDeduction > 0 && (
                  <div className="flex justify-between text-red-700 font-semibold">
                    <span>Unpaid Leave LOP</span>
                    <span className="font-mono">{formatCurrency(payslip.unpaidLeaveDeduction)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                  <span>Total Deductions (B)</span>
                  <span className="font-mono text-sm text-red-600">{formatCurrency(payslip.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Summary Box */}
          <div className="p-5 bg-gray-900 text-white rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400 block font-semibold">
                Net Pay (Take-Home = A - B)
              </span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
                {formatCurrency(payslip.netPay)}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment Disbursed</span>
              </span>
              <span className="text-[10px] text-gray-400 block mt-1">Transferred to Bank on {formatDate(payslip.payDate)}</span>
            </div>
          </div>

          {/* Signature & Disclaimer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Computer generated document. No signature required.</span>
            </div>
            <span>DayFlow HRMS • Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
};
