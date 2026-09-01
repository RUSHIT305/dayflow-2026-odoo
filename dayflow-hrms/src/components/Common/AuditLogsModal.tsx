import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Download, 
  X, 
  Filter, 
  Calendar, 
  User, 
  Activity, 
  FileText,
  Clock
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { downloadCSV } from '../../utils/formatters';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = useHR();
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    const matchesModule = selectedModule === 'All' || log.module === selectedModule;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Module', 'Action', 'Details'];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.actorName,
      log.actorRole,
      log.module,
      log.action,
      log.details,
    ]);
    downloadCSV(`dayflow_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const getModuleBadge = (mod: string) => {
    switch (mod) {
      case 'Employee':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Attendance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Leave':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Payroll':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'System':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">System Security & Audit Trail</h3>
              <p className="text-xs text-gray-500">Immutable chronological history of all organizational events</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit actions, actors, or details..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium">Module:</span>
            {['All', 'Employee', 'Attendance', 'Leave', 'Payroll', 'System'].map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedModule === mod
                    ? 'bg-purple-600 text-white font-semibold shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No audit logs matching current criteria</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-gray-600">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900">{log.action}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getModuleBadge(log.module)}`}>
                          {log.module}
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px] leading-relaxed break-words">{log.details}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 text-right gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <User className="w-3 h-3 text-gray-400" />
                      <span>{log.actorName}</span>
                      <span className="text-[10px] text-gray-400 uppercase">({log.actorRole})</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filteredLogs.length} of {auditLogs.length} audit entries</span>
          <span className="font-mono text-[11px] text-gray-400">DayFlow Security Protocol v2.6</span>
        </div>
      </div>
    </div>
  );
};
