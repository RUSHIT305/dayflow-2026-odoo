import React, { useState, useEffect } from 'react';
import { HRProvider, useHR } from './context/HRContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './components/Auth/LoginPage';
import { DashboardView } from './components/Dashboard/DashboardView';
import { EmployeesView } from './components/Employees/EmployeesView';
import { AttendanceView } from './components/Attendance/AttendanceView';
import { LeaveView } from './components/Leave/LeaveView';
import { PayrollView } from './components/Payroll/PayrollView';
import { AnnouncementsView } from './components/Announcements/AnnouncementsView';
import { EmployeeDetailModal } from './components/Employees/EmployeeDetailModal';
import { AddEmployeeModal } from './components/Employees/AddEmployeeModal';
import { ApplyLeaveModal } from './components/Leave/ApplyLeaveModal';
import { ToastContainer } from './components/Common/Toast';
import { CommandPalette } from './components/Common/CommandPalette';
import { AuditLogsModal } from './components/Common/AuditLogsModal';
import { DataManagementModal } from './components/Common/DataManagementModal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, toasts, dismissToast } = useHR();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'attendance' | 'leave' | 'payroll' | 'announcements'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If not logged in, ALWAYS show the Login Page with role options first
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex font-sans text-gray-900 overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenAuditLogs={() => setShowAuditLogsModal(true)}
        onOpenDataManagement={() => setShowDataModal(true)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Clean Header */}
        <Header
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={(tab) => setActiveTab(tab as any)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onOpenAuditLogs={() => setShowAuditLogsModal(true)}
          onOpenDataManagement={() => setShowDataModal(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                setActiveTab={(tab) => setActiveTab(tab as any)}
                onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
                onOpenAddEmployee={() => setShowAddEmployeeModal(true)}
                onViewEmployeeDetail={(id) => setSelectedEmployeeId(id)}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesView
                onOpenAddEmployee={() => setShowAddEmployeeModal(true)}
                onViewEmployeeDetail={(id) => setSelectedEmployeeId(id)}
                initialSearchQuery={searchQuery}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView />
            )}

            {activeTab === 'leave' && (
              <LeaveView
                onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
              />
            )}

            {activeTab === 'payroll' && (
              <PayrollView />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsView />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {selectedEmployeeId && (
        <EmployeeDetailModal
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}

      {showAddEmployeeModal && (
        <AddEmployeeModal
          onClose={() => setShowAddEmployeeModal(false)}
        />
      )}

      {showApplyLeaveModal && (
        <ApplyLeaveModal
          onClose={() => setShowApplyLeaveModal(false)}
        />
      )}

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
        onOpenAddEmployee={() => setShowAddEmployeeModal(true)}
        onOpenAuditLogs={() => setShowAuditLogsModal(true)}
      />

      <AuditLogsModal
        isOpen={showAuditLogsModal}
        onClose={() => setShowAuditLogsModal(false)}
      />

      <DataManagementModal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
      />

      {/* Global Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export function App() {
  return (
    <HRProvider>
      <MainAppContent />
    </HRProvider>
  );
}

export default App;


