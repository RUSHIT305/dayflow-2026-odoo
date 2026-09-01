import React, { useRef, useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  FileSpreadsheet, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  FileCode,
  HardDrive
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { downloadCSV } from '../../utils/formatters';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const { 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    resetToSampleData,
    employees,
    attendanceRecords,
    leaveRequests,
    payslips,
    auditLogs
  } = useHR();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetPrompt, setShowResetPrompt] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importDatabaseJSON(content);
        if (success) {
          setImportStatus('success');
          setTimeout(() => {
            setImportStatus('idle');
            onClose();
          }, 1200);
        } else {
          setImportStatus('error');
          setErrorMessage('Invalid DayFlow backup file format.');
        }
      } catch (err) {
        setImportStatus('error');
        setErrorMessage('Failed to read or parse file.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportAllStaffCSV = () => {
    const headers = ['Employee Code', 'Full Name', 'Email', 'Department', 'Designation', 'Role', 'Status', 'Join Date', 'Basic Pay', 'HRA'];
    const rows = employees.map(e => [
      e.employeeCode,
      `${e.firstName} ${e.lastName}`,
      e.email,
      e.department,
      e.designation,
      e.role,
      e.status,
      e.joinDate,
      `₹${e.salary.basic.toLocaleString()}`,
      `₹${e.salary.hra.toLocaleString()}`,
    ]);
    downloadCSV(`dayflow_employees_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const handleExportAttendanceCSV = () => {
    const headers = ['Date', 'Employee ID', 'Clock In', 'Clock Out', 'Status', 'Total Hours', 'Regularization Status'];
    const rows = attendanceRecords.map(a => [
      a.date,
      a.employeeId,
      a.clockIn || 'N/A',
      a.clockOut || 'N/A',
      a.status,
      `${a.totalHours} hrs`,
      a.regularizationStatus || 'None'
    ]);
    downloadCSV(`dayflow_attendance_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const handleExportLeaveCSV = () => {
    const headers = ['Request ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Applied At', 'Reason'];
    const rows = leaveRequests.map(l => [
      l.id,
      l.employeeName,
      l.leaveType,
      l.startDate,
      l.endDate,
      l.totalDays,
      l.status,
      l.appliedAt,
      l.reason
    ]);
    downloadCSV(`dayflow_leave_requests_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Database & Data Management</h3>
              <p className="text-xs text-gray-500">Backup, restore, and export full organization data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">Employees</span>
              <span className="text-lg font-bold text-gray-900">{employees.length}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">Attendance Logs</span>
              <span className="text-lg font-bold text-gray-900">{attendanceRecords.length}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">Leave Records</span>
              <span className="text-lg font-bold text-gray-900">{leaveRequests.length}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">Audit Logs</span>
              <span className="text-lg font-bold text-gray-900">{auditLogs.length}</span>
            </div>
          </div>

          {/* Backup & Restore JSON */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              <span>Full System Snapshot (JSON)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Backup Card */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-900 text-sm">
                    <FileCode className="w-4 h-4 text-blue-600" />
                    <span>Download Backup JSON</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    Download a full encrypted state snapshot of all staff, rosters, payroll, and logs.
                  </p>
                </div>
                <button
                  onClick={exportDatabaseJSON}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download JSON Backup</span>
                </button>
              </div>

              {/* Restore Card */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-900 text-sm">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span>Restore from JSON</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    Upload a previously exported DayFlow JSON backup to instantly restore system state.
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload & Restore Backup</span>
                </button>
              </div>
            </div>

            {importStatus === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Database restored successfully! State reloaded.</span>
              </div>
            )}

            {importStatus === 'error' && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Granular CSV Exports */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Production CSV Data Exports</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handleExportAllStaffCSV}
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-gray-900 block">Employees CSV</span>
                  <span className="text-[11px] text-gray-500">Roster & Salaries</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
              </button>

              <button
                onClick={handleExportAttendanceCSV}
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-gray-900 block">Attendance CSV</span>
                  <span className="text-[11px] text-gray-500">Logs & Punches</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
              </button>

              <button
                onClick={handleExportLeaveCSV}
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-gray-900 block">Leaves CSV</span>
                  <span className="text-[11px] text-gray-500">Approvals & Balance</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Reset Danger Zone */}
          <div className="p-4 bg-red-50/60 border border-red-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-red-900 text-xs block">Reset to Factory Sandbox State</span>
              <p className="text-red-700 text-[11px]">Clear current cache and restore initial seed workforce records.</p>
            </div>
            {showResetPrompt ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResetPrompt(false)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetToSampleData();
                    setShowResetPrompt(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetPrompt(true)}
                className="px-3 py-1.5 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
