import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  KeyRound,
  Globe,
  Briefcase,
  Phone,
  HelpCircle,
  X
} from 'lucide-react';
import { User, Language, UserRole } from '../types';
import { db } from '../services/db';
import { translations } from '../services/i18n';

interface AuthPortalProps {
  onLoginSuccess: (user: User) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  onLoginSuccess,
  lang,
  onLanguageChange,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'signin' | 'quick' | 'register'>('signin');
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('sokha.superadmin@enterprise.com');
  const [signInPassword, setSignInPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDeptId, setRegDeptId] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Employee');
  const [regPosition, setRegPosition] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const departments = db.getDepartments();
  const allUsers = db.getUsers();

  const roleDetails: Record<UserRole, { badge: string; desc: string; sampleId: string }> = {
    'Super Admin': {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      desc: 'Complete administrative authority, user management, audit trails & system settings.',
      sampleId: 'usr-1',
    },
    'Administrator': {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      desc: 'Oversees organizational units, strategic objectives, and multi-department plans.',
      sampleId: 'usr-2',
    },
    'Department Manager': {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Creates & approves department action plans, assigns team leaders & monitors budgets.',
      sampleId: 'usr-3',
    },
    'Team Leader': {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Manages operational activities, verifies deliverables & guides team members.',
      sampleId: 'usr-4',
    },
    'Employee': {
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
      desc: 'Executes assigned activities, records progress updates & logs completion metrics.',
      sampleId: 'usr-5',
    },
    'Executive / Viewer': {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      desc: 'Read-only strategic oversight, executive reports, and performance visual analytics.',
      sampleId: 'usr-6',
    },
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    if (!signInEmail.trim()) {
      setSignInError('Please enter your corporate email.');
      return;
    }
    setSignInLoading(true);

    setTimeout(() => {
      const result = db.login(signInEmail, signInPassword);
      setSignInLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setSignInError(result.error || t.invalidCredentials);
      }
    }, 300);
  };

  const handleQuickLogin = (userId: string) => {
    const user = db.quickLoginAs(userId);
    onLoginSuccess(user);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Please complete all required fields.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must contain at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError(t.passwordsDoNotMatch);
      return;
    }

    setRegLoading(true);
    setTimeout(() => {
      const result = db.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        departmentId: regDeptId || (departments[0]?.id ?? 'dept-1'),
        role: regRole,
        position: regPosition || 'Enterprise Staff',
        phone: regPhone,
      });
      setRegLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setRegError(result.error || 'Failed to create account.');
      }
    }, 400);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    const res = db.resetPassword(forgotEmail);
    setForgotSuccess(res.success);
    setForgotMessage(res.message);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white ${lang === 'km' ? 'font-khmer' : ''}`}>
      {/* Top Floating Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>{t.systemTitle}</span>
              <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                v2.6 Enterprise
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              lang === 'en' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => onLanguageChange('km')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition font-khmer ${
              lang === 'km' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ភាសាខ្មែរ
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
            <button
              onClick={() => { setActiveTab('signin'); setSignInError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'signin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{t.signIn}</span>
            </button>

            <button
              onClick={() => { setActiveTab('quick'); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'quick'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.quickAccess}</span>
            </button>

            <button
              onClick={() => { setActiveTab('register'); setRegError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>{t.signUp}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: STANDARD SIGN IN */}
            {activeTab === 'signin' && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-1.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {t.welcomeBack}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t.welcomeBackSubtitle}
                  </p>
                </div>

                {signInError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-300 text-xs animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{signInError}</span>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.emailAddress}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={e => setSignInEmail(e.target.value)}
                        placeholder="your.name@enterprise.com"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {t.password}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(signInEmail);
                          setShowForgotModal(true);
                          setForgotMessage('');
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300 transition"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={e => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span className="text-[11px]">{t.rememberMe}</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                  >
                    {signInLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{t.signIn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{t.defaultPasswordHint}</span>
                    <button
                      type="button"
                      onClick={() => setSignInPassword('Password@123')}
                      className="text-blue-400 hover:underline font-mono text-[10px]"
                    >
                      Fill
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: QUICK 1-CLICK ROLE ACCESS */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div className="text-center max-w-md mx-auto space-y-1">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {t.quickAccess}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t.quickAccessDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {(Object.keys(roleDetails) as UserRole[]).map(roleName => {
                    const sampleUser = allUsers.find(u => u.role === roleName) || allUsers[0];
                    const dept = departments.find(d => d.id === sampleUser.departmentId);
                    const info = roleDetails[roleName];

                    return (
                      <div
                        key={roleName}
                        onClick={() => handleQuickLogin(sampleUser.id)}
                        className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 hover:border-blue-500/50 cursor-pointer transition flex flex-col justify-between group relative overflow-hidden shadow-xs hover:shadow-blue-500/10"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${info.badge}`}>
                              {roleName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {sampleUser.employeeId || 'EMP'}
                            </span>
                          </div>

                          <div>
                            <p className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                              {sampleUser.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {sampleUser.position}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-600 shrink-0" />
                              <span className="truncate">{dept?.name || 'Enterprise Unit'}</span>
                            </p>
                          </div>

                          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                            {info.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition">
                          <span>Sign in as {sampleUser.name.split(' ')[0]}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: REGISTER NEW USER */}
            {activeTab === 'register' && (
              <div className="max-w-xl mx-auto space-y-5">
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {t.createAccountTitle}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t.createAccountSubtitle}
                  </p>
                </div>

                {regError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Sokha Chan"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="name@enterprise.gov.kh"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password (min 6 chars) *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Department
                      </label>
                      <select
                        value={regDeptId}
                        onChange={e => setRegDeptId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Assigned Role
                      </label>
                      <select
                        value={regRole}
                        onChange={e => setRegRole(e.target.value as UserRole)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                      >
                        <option value="Employee">Employee (Task Execution)</option>
                        <option value="Team Leader">Team Leader (Task Oversight)</option>
                        <option value="Department Manager">Department Manager (Plan Approval)</option>
                        <option value="Administrator">Administrator (System Governance)</option>
                        <option value="Executive / Viewer">Executive / Viewer (Reports & Audit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Position / Job Title
                      </label>
                      <input
                        type="text"
                        value={regPosition}
                        onChange={e => setRegPosition(e.target.value)}
                        placeholder="e.g. Senior Project Specialist"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="+855 12 345 678"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                  >
                    {regLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Create & Enter System</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* System Footer Badges */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center sm:flex sm:items-center sm:justify-between border-t border-slate-900 text-[11px] text-slate-500">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-2 sm:mb-0">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Laravel 12 / Livewire 3 API Ready</span>
          </span>
          <span>•</span>
          <span>Spatie RBAC Guarded</span>
          <span>•</span>
          <span>UTF-8 Khmer Unicode Battambang</span>
        </div>
        <div>
          Action Plan Management System &copy; 2026
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <span>{t.forgotPassword}</span>
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter your corporate email to reset your credentials to the default system password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="corporate.email@enterprise.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500"
              />

              {forgotMessage && (
                <div className={`p-2.5 rounded-lg text-xs ${
                  forgotSuccess 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {forgotMessage}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
