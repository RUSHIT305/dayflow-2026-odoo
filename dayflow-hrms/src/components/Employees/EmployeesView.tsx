import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Grid, 
  List, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  ExternalLink,
  X
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { Department, EmployeeStatus } from '../../types';
import { formatDate, getDepartmentColor, getStatusBadge } from '../../utils/formatters';

interface EmployeesViewProps {
  onOpenAddEmployee: () => void;
  onViewEmployeeDetail: (employeeId: string) => void;
  initialSearchQuery?: string;
}

const DEPARTMENTS: (Department | 'All')[] = [
  'All',
  'Engineering',
  'Human Resources',
  'Product & Design',
  'Marketing',
  'Sales',
  'Finance & Ops',
];

const STATUSES: (EmployeeStatus | 'All')[] = ['All', 'Active', 'Probation', 'On Leave', 'Terminated'];

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  onOpenAddEmployee,
  onViewEmployeeDetail,
  initialSearchQuery = '',
}) => {
  const { employees, isAdmin } = useHR();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-gray-500">
            Workforce roster, departmental assignments, and verified profiles ({employees.length} total)
          </p>
        </div>

        {isAdmin && (
          <button
            id="add-employee-btn"
            onClick={onOpenAddEmployee}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              id="employee-search-input"
              placeholder="Search by name, employee code (DF-1001), designation, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-36 text-gray-700"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-gray-400 mr-1 uppercase">Department:</span>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedDept === dept
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Showing {filteredEmployees.length} of {employees.length} team members</span>
        {(selectedDept !== 'All' || selectedStatus !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedDept('All');
              setSelectedStatus('All');
              setSearchQuery('');
            }}
            className="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* View Mode: GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => {
            const deptColor = getDepartmentColor(emp.department);
            const statusBadge = getStatusBadge(emp.status);

            return (
              <div
                key={emp.id}
                id={`emp-card-${emp.id}`}
                className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Code & Role */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {emp.employeeCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                      {emp.status}
                    </span>
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={emp.avatar}
                      alt={emp.firstName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{emp.designation}</p>
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded mt-1 ${deptColor.bg} ${deptColor.text}`}>
                        {emp.department}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3 mb-4">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{emp.workMode} • {emp.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{emp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <button
                  id={`view-profile-${emp.id}`}
                  onClick={() => onViewEmployeeDetail(emp.id)}
                  className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-xs font-semibold transition-colors border border-gray-200 hover:border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Profile</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode: TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Work Mode</th>
                  <th className="py-3.5 px-4">Join Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => {
                  const deptColor = getDepartmentColor(emp.department);
                  const statusBadge = getStatusBadge(emp.status);

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.firstName}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">
                              {emp.firstName} {emp.lastName}
                            </span>
                            <span className="font-mono text-[11px] text-gray-400">{emp.employeeCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${deptColor.bg} ${deptColor.text}`}>
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">{emp.designation}</td>
                      <td className="py-3 px-4 text-gray-600">{emp.workMode}</td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(emp.joinDate)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge.bg} ${statusBadge.text}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewEmployeeDetail(emp.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800">No employees match your search criteria</h3>
          <p className="text-xs text-gray-500 mt-1">Try resetting the department or status filters.</p>
        </div>
      )}
    </div>
  );
};
