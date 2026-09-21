import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Shield, 
  KeyRound, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Check, 
  AlertCircle,
  Calendar,
  Lock,
  BadgeCheck,
  Edit3,
  Eye,
  EyeOff,
  Sparkles,
  Save
} from 'lucide-react';
import { User, Language, UserRole } from '../types';
import { db } from '../services/db';
import { translations } from '../services/i18n';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  lang: Language;
  onUserUpdated?: (user: User) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  lang,
  onUserUpdated,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'permissions'>('profile');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editPosition, setEditPosition] = useState(user.position || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const departments = db.getDepartments();
  const dept = departments.find(d => d.id === user.departmentId);

  const permissionsMap: Record<UserRole, string[]> = {
    'Super Admin': [
      'Manage all organizational departments and units',
      'Create, edit, and delete any employee account & assign roles',
      'Manage corporate strategic objectives & KPIs',
      'Approve and reject action plans across all departments',
      'Oversee all operational activities and milestones',
      'Access security audit logs & export historical trails',
      'Configure system parameters and database schemas'
    ],
    'Administrator': [
      'Create and update departments and organizational units',
      'Create and manage employee profiles and role assignments',
      'Manage strategic objectives and alignment indicators',
      'Approve and manage multi-department action plans',
      'Generate enterprise PDF, Excel, and CSV performance reports'
    ],
    'Department Manager': [
      'Create and submit action plans for own department',
      'Approve and review action plans for own department',
      'Assign activities to team leaders and employees',
      'Monitor departmental budget allocation & KPI progress',
      'Submit action plans for final completion review'
    ],
    'Team Leader': [
      'Supervise assigned activities and milestones',
      'Validate deliverables and dependency completions',
      'Log activity progress updates and obstacles',
      'Coordinate team members within assigned action plans'
    ],
    'Employee': [
      'View assigned action plans and activities',
      'Record task progress %, hours spent, and obstacles',
      'Mark deliverables as completed for review'
    ],
    'Executive / Viewer': [
      'Read-only access to all dashboard KPI metrics',
      'View annual strategic objective progress',
      'Generate and download enterprise analytical reports',
      'Inspect calendar timelines and Gantt visual milestones'
    ]
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!editName.trim()) {
      setProfileError('Full Name is required.');
      return;
    }

    try {
      const updated = db.saveUser({
        id: user.id,
        name: editName.trim(),
        email: user.email,
        phone: editPhone.trim(),
        position: editPosition.trim(),
        departmentId: user.departmentId,
        role: user.role,
        employeeId: user.employeeId,
      });
      setProfileSuccess('Profile details successfully updated.');
      setIsEditingProfile(false);
      if (onUserUpdated) {
        onUserUpdated(updated);
      }
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = 'Pass#';
    for (let i = 0; i < 7; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setConfirmPassword(pass);
    setShowNewPass(true);
    setShowConfirmPass(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordsDoNotMatch);
      return;
    }

    const res = db.changePassword(user.id, currentPassword, newPassword);
    if (res.success) {
      setPasswordSuccess(t.passwordChangedSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } else {
      setPasswordError(res.error || 'Failed to change password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">{user.name}</h2>
              <p className="text-xs text-slate-300 font-mono flex items-center space-x-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>{user.role}</span>
                <span>•</span>
                <span>{user.employeeId || 'EMP'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'permissions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Role Permissions
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {profileError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center space-x-2 text-xs">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-xs">
                  {isEditingProfile ? 'Edit Profile Details' : 'Personal & Employment Records'}
                </span>
                {!isEditingProfile ? (
                  <button
                    onClick={() => {
                      setEditName(user.name);
                      setEditPhone(user.phone || '');
                      setEditPosition(user.position || '');
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="text-slate-500 hover:text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-3.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Corporate Email (Institutional ID)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2 text-xs text-slate-500 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Email address is managed by system administrator</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Designation / Position</label>
                      <input
                        type="text"
                        value={editPosition}
                        onChange={e => setEditPosition(e.target.value)}
                        placeholder="e.g. Senior Specialist"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        placeholder="+855 12 345 678"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>Corporate Email</span>
                    </span>
                    <p className="font-semibold text-slate-900 break-all">{user.email}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Designation / Position</span>
                    </span>
                    <p className="font-semibold text-slate-900">{user.position || 'Staff Member'}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <Building2 className="w-3 h-3" />
                      <span>Department</span>
                    </span>
                    <p className="font-semibold text-slate-900">{dept?.name || 'Enterprise'}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>Contact Phone</span>
                    </span>
                    <p className="font-semibold text-slate-900">{user.phone || 'Not recorded'}</p>
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-start space-x-3 text-blue-900">
                <BadgeCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Authentication Status: Verified</p>
                  <p className="text-[11px] text-blue-700">
                    Account active under Spatie RBAC policy with full institutional audit logging.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Authorized capabilities for role <strong className="text-slate-900">{user.role}</strong>:
              </p>
              <ul className="space-y-2">
                {(permissionsMap[user.role] || []).map((perm, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              {passwordError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center space-x-2 text-xs">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (default: Password@123)"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-9 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    New Password (min 6 characters)
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="flex items-center space-x-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-9 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-9 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Update Account Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
