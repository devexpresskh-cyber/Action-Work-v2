import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Flag, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Activity, PriorityLevel, Language } from '../types';
import { db } from '../services/db';

interface TaskPrioritizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Activity | null;
  lang: Language;
  onSuccess?: (msg: string) => void;
}

export const TaskPrioritizationModal: React.FC<TaskPrioritizationModalProps> = ({
  isOpen,
  onClose,
  task,
  lang,
  onSuccess,
}) => {
  if (!isOpen || !task) return null;

  const [dueDate, setDueDate] = useState<string>(task.dueDate || '');
  const [priority, setPriority] = useState<PriorityLevel>(task.priority || 'Medium');
  const [progressPercentage, setProgressPercentage] = useState<number>(task.progressPercentage || 0);
  const [adjustmentNote, setAdjustmentNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = dueDate < todayStr && progressPercentage < 100;

  // Calculate days remaining
  const calculateDaysLeft = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - new Date(todayStr).getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const daysLeft = calculateDaysLeft(dueDate);

  // Quick deadline adjustments
  const handleQuickExtend = (days: number) => {
    const baseDate = dueDate ? new Date(dueDate) : new Date();
    baseDate.setDate(baseDate.getDate() + days);
    setDueDate(baseDate.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      db.adjustTaskDeadlineAndPriority(task.id, {
        dueDate,
        priority,
        progressPercentage,
        adjustmentNote,
      });

      if (onSuccess) {
        onSuccess(
          lang === 'km'
            ? `បានកែសម្រួលភារកិច្ច ${task.code} ដោយជោគជ័យ`
            : `Successfully adjusted deadline & priority for ${task.code}`
        );
      }
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="task-prioritization-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        id="task-prioritization-modal-content"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  {task.code}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {lang === 'km' ? 'កំណត់អាទិភាព និងកាលបរិច្ឆេទភារកិច្ច' : 'Prioritize & Adjust Task'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px] sm:max-w-sm">
                {task.title}
              </p>
            </div>
          </div>
          <button
            id="close-task-prioritization-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'km' ? 'កម្រិតអាទិភាព' : 'Task Priority Level'}</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                {lang === 'km' ? 'ជួយក្នុងការបែងចែកពេលវេលា' : 'Determines order of urgency'}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map(lvl => {
                const isSelected = priority === lvl;
                const colors = {
                  Critical: isSelected ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-200' : 'hover:bg-rose-50 border-slate-200 text-slate-700',
                  High: isSelected ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-200' : 'hover:bg-amber-50 border-slate-200 text-slate-700',
                  Medium: isSelected ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200' : 'hover:bg-blue-50 border-slate-200 text-slate-700',
                  Low: isSelected ? 'bg-slate-600 text-white border-slate-600 ring-2 ring-slate-200' : 'hover:bg-slate-50 border-slate-200 text-slate-700',
                };
                return (
                  <button
                    key={lvl}
                    type="button"
                    id={`priority-btn-${lvl.toLowerCase()}`}
                    onClick={() => setPriority(lvl)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition text-center flex flex-col items-center justify-center ${colors[lvl]}`}
                  >
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deadline / Due Date Adjustment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'km' ? 'កាលបរិច្ឆេទផុតកំណត់' : 'Due Date & Deadline'}</span>
              </span>
              <span className={`text-[11px] font-semibold ${
                isOverdue ? 'text-rose-600' : daysLeft <= 2 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {isOverdue 
                  ? (lang === 'km' ? 'ហួសកំណត់' : `Overdue by ${Math.abs(daysLeft)}d`)
                  : daysLeft === 0 
                  ? (lang === 'km' ? 'ផុតកំណត់ថ្ងៃនេះ' : 'Due today') 
                  : (lang === 'km' ? `នៅសល់ ${daysLeft} ថ្ងៃ` : `${daysLeft} days left`)}
              </span>
            </label>

            <div className="space-y-2.5">
              <input
                type="date"
                id="task-due-date-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition"
                required
              />

              {/* Quick Deadline Extensions */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  {lang === 'km' ? 'បន្ថែមពេលរហ័ស៖' : 'Quick extend:'}
                </span>
                <button
                  type="button"
                  id="extend-3-days-btn"
                  onClick={() => handleQuickExtend(3)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  id="extend-7-days-btn"
                  onClick={() => handleQuickExtend(7)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  +1 Week
                </button>
                <button
                  type="button"
                  id="extend-14-days-btn"
                  onClick={() => handleQuickExtend(14)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  +2 Weeks
                </button>
              </div>
            </div>
          </div>

          {/* Progress Slider & Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'km' ? 'វឌ្ឍនភាពការងារ' : 'Current Task Progress'}</span>
              </label>
              <span className="text-sm font-mono font-black text-blue-600">
                {progressPercentage}%
              </span>
            </div>

            <input
              type="range"
              id="task-progress-slider"
              min="0"
              max="100"
              step="5"
              value={progressPercentage}
              onChange={e => setProgressPercentage(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            {/* Presets */}
            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {[0, 25, 50, 75, 100].map(val => (
                <button
                  key={val}
                  type="button"
                  id={`progress-preset-${val}`}
                  onClick={() => setProgressPercentage(val)}
                  className={`py-1 rounded-lg text-xs font-bold border transition ${
                    progressPercentage === val
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-black'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {val === 100 ? '✓ 100%' : `${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Adjustment Reason / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'km' ? 'មូលហេតុ ឬកំណត់សម្គាល់កែសម្រួល' : 'Adjustment Notes / Progress Summary'}</span>
            </label>
            <textarea
              id="task-adjustment-notes"
              rows={2}
              value={adjustmentNote}
              onChange={e => setAdjustmentNote(e.target.value)}
              placeholder={lang === 'km' 
                ? 'ឧទាហរណ៍៖ បានពន្យារពេល ៣ ថ្ងៃ ដើម្បីសម្របសម្រួលជាមួយក្រុម API...' 
                : 'e.g., Adjusted deadline by 3 days to coordinate cross-department API tests...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              id="cancel-task-adjust-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              {lang === 'km' ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              id="save-task-adjust-btn"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? (lang === 'km' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (lang === 'km' ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'Save Adjustments')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
