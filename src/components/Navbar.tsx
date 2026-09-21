import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  RotateCcw, 
  ShieldCheck, 
  User as UserIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search,
  ChevronDown,
  LogOut,
  KeyRound,
  Shield,
  Menu,
  X,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Mic
} from 'lucide-react';
import { User, Language, UserRole } from '../types';
import { translations } from '../services/i18n';
import { db } from '../services/db';
import { NavTab } from './Sidebar';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onResetData: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onNavigateTab?: (tab: NavTab) => void;
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
  onOpenSearch?: () => void;
  onOpenFeedback?: () => void;
  onOpenHelp?: () => void;
  onOpenRbacMatrix?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  lang,
  onLanguageChange,
  onResetData,
  onLogout,
  onOpenProfile,
  onNavigateTab,
  isMobileNavOpen,
  onToggleMobileNav,
  onOpenSearch,
  onOpenFeedback,
  onOpenHelp,
  onOpenRbacMatrix,
  onOpenVoiceAssistant,
}) => {
  const t = translations[lang];
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const users = db.getUsers();
  const notifications = db.getNotifications(currentUser.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const todayAttendance = db.getTodayAttendance(currentUser.id);

  const roleBadgeColors: Record<UserRole, string> = {
    'Super Admin': 'bg-purple-100 text-purple-800 border-purple-300',
    'Administrator': 'bg-blue-100 text-blue-800 border-blue-300',
    'Department Manager': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Team Leader': 'bg-amber-100 text-amber-800 border-amber-300',
    'Employee': 'bg-slate-100 text-slate-800 border-slate-300',
    'Executive / Viewer': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };

  const handleMarkAllRead = () => {
    db.markAllNotificationsAsRead(currentUser.id);
    onUserChange(currentUser);
  };

  const handleSwitchUser = (userId: string) => {
    const newUser = db.switchUser(userId);
    onUserChange(newUser);
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {onToggleMobileNav && (
              <button
                type="button"
                onClick={onToggleMobileNav}
                className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {isMobileNavOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg sm:text-xl tracking-tight shrink-0">
              AP
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none truncate max-w-[140px] sm:max-w-xs md:max-w-none">
                  {t.systemTitle}
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  Laravel 12 / MySQL 8
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block truncate mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right tools */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Quick Global Search (Ctrl+K) */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-xs text-slate-600 transition"
                title={lang === 'km' ? 'ស្វែងរកផែនការសកម្មភាព ភារកិច្ច បុគ្គលិក (Ctrl+K)' : 'Search action plans, tasks, staff (Ctrl+K)'}
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline text-slate-500">{lang === 'km' ? 'ស្វែងរក...' : 'Search...'}</span>
                <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono text-slate-400 bg-slate-200/60 rounded-xs">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Voice-Activated Plan Assistant */}
            {onOpenVoiceAssistant && (
              <button
                onClick={onOpenVoiceAssistant}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 transition shadow-2xs group"
                title={lang === 'km' ? 'ប្រព័ន្ធបញ្ជាដោយសំឡេង (Voice Assistant)' : 'Voice-Activated Plan System (Voice Assistant)'}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <Mic className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition" />
                <span className="hidden sm:inline">{lang === 'km' ? 'សំឡេង' : 'Voice'}</span>
              </button>
            )}

            {/* Mobile Hub Shortcut */}
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('employee-hub')}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition"
                title={lang === 'km' ? 'បើកមជ្ឈមណ្ឌលបទពិសោធន៍បុគ្គលិក' : 'Open Employee Mobile Experience Hub'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === 'km' ? 'មជ្ឈមណ្ឌល' : 'Employee Hub'}</span>
              </button>
            )}

            {/* Quick Attendance Widget */}
            <button
              onClick={() => onNavigateTab && onNavigateTab('attendance')}
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                todayAttendance?.checkOutTime
                  ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  : todayAttendance?.checkInTime
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
              }`}
              title={lang === 'km' ? 'ស្ថានភាពវត្តមាន និងការតាមដានម៉ោងធ្វើការ' : 'Attendance Status & Time Tracking'}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {todayAttendance?.checkOutTime
                  ? (lang === 'km' ? 'បានបញ្ចប់វេន' : 'Shift Closed')
                  : todayAttendance?.checkInTime
                  ? `${lang === 'km' ? 'ចូល៖' : 'In:'} ${todayAttendance.checkInTime}`
                  : (lang === 'km' ? 'កត់ត្រាចូល' : 'Clock In')}
              </span>
            </button>

            {/* RBAC Security Policy Button - Excluded for Employee role */}
            {onOpenRbacMatrix && currentUser.role !== 'Employee' && (
              <button
                onClick={onOpenRbacMatrix}
                className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs"
                title={lang === 'km' ? 'ពិនិត្យតារាងសិទ្ធិអនុញ្ញាតតាមតួនាទី (RBAC)' : 'Inspect Role-Based Access Control (RBAC) Matrix'}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'km' ? 'គោលការណ៍សិទ្ធិ' : 'RBAC Policy'}</span>
              </button>
            )}

            {/* Feedback Button */}
            {onOpenFeedback && (
              <button
                onClick={onOpenFeedback}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition flex items-center space-x-1"
                title={lang === 'km' ? 'បញ្ជូនមតិកែលម្អ និងសំណើបុគ្គលិក' : 'Submit Employee Feedback & Suggestions'}
              >
                <MessageSquare className="w-4 h-4 text-rose-500" />
                <span className="hidden xl:inline text-slate-700">{lang === 'km' ? 'មតិកែលម្អ' : 'Feedback'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(lang === 'en' ? 'km' : 'en')}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">{lang === 'en' ? 'ខ្មែរ (KM)' : 'English (EN)'}</span>
              <span className="sm:hidden font-semibold">{lang === 'en' ? 'KM' : 'EN'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                title={t.notifications}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">{t.notifications}</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t.markAllRead}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        {t.noNotifications}
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            db.markNotificationAsRead(n.id);
                            onUserChange(currentUser);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start space-x-2">
                            {n.type === 'approval_request' && <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                            {n.type === 'approved' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                            {n.type === 'rejected' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                            {n.type === 'assignment' && <UserIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                            {n.type === 'deadline' && <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />}
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{n.title}</p>
                              <p className="text-slate-600 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Menu (Simulate all 6 roles) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <span className={`px-1.5 py-0.2 rounded border font-medium ${roleBadgeColors[currentUser.role]}`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenProfile();
                      }}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200 flex items-center space-x-1"
                    >
                      <Shield className="w-3 h-3" />
                      <span>{t.userProfile}</span>
                    </button>
                  </div>

                  {currentUser.role !== 'Employee' && (
                    <>
                      <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-600">{t.switchRole}</span>
                        <span className="text-[10px] text-slate-400">
                          {lang === 'km' ? 'តួនាទីប្រព័ន្ធទាំង ៦' : 'All 6 System Roles'}
                        </span>
                      </div>

                      <div className="max-h-56 overflow-y-auto py-1">
                        {users.map(u => (
                          <button
                            key={u.id}
                            onClick={() => handleSwitchUser(u.id)}
                            className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${u.id === currentUser.id ? 'bg-blue-50 font-semibold' : ''}`}
                          >
                            <div>
                              <div className="text-slate-900 font-medium">{u.name}</div>
                              <div className="text-[11px] text-slate-500">{u.position}</div>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${roleBadgeColors[u.role]}`}>
                              {u.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <div className={`px-4 pt-2 space-y-1.5 ${currentUser.role !== 'Employee' ? 'mt-1 border-t border-slate-100' : ''}`}>
                    {onOpenRbacMatrix && currentUser.role !== 'Employee' && (
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          onOpenRbacMatrix();
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{lang === 'km' ? 'ពិនិត្យតារាងសិទ្ធិ RBAC' : 'Inspect RBAC Matrix'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onResetData();
                      }}
                      className="w-full flex items-center justify-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'កំណត់ទិន្នន័យគំរូឡើងវិញ' : 'Reset to Clean Demo Data'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center space-x-1 px-3 py-1.5 rounded-md text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
