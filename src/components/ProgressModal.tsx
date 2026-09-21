import React, { useState } from 'react';
import { X, TrendingUp, AlertCircle, Upload, History, Check } from 'lucide-react';
import { ActionPlan, Activity, Language, User } from '../types';
import { translations } from '../services/i18n';
import { db } from '../services/db';

interface ProgressModalProps {
  entityType: 'action_plan' | 'activity';
  item: ActionPlan | Activity;
  currentUser: User;
  lang: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  entityType,
  item,
  currentUser,
  lang,
  onClose,
  onSuccess,
}) => {
  const t = translations[lang];
  const initialPct = entityType === 'action_plan' 
    ? (item as ActionPlan).completionPercentage 
    : (item as Activity).progressPercentage;

  const [newPercentage, setNewPercentage] = useState<number>(initialPct);
  const [description, setDescription] = useState<string>('');
  const [completedWork, setCompletedWork] = useState<string>('');
  const [problemsObstacles, setProblemsObstacles] = useState<string>('');
  const [nextActions, setNextActions] = useState<string>('');
  const [actualKpiResult, setActualKpiResult] = useState<string>(item.actualResult || '');
  const [evidenceName, setEvidenceName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const history = db.getProgressUpdates(item.id);
  const users = db.getUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError(lang === 'km' ? 'សូមបញ្ជាក់ការពិពណ៌នាអំពីវឌ្ឍនភាព។' : 'Please provide a description of the progress update.');
      return;
    }

    try {
      db.addProgressUpdate({
        entityType,
        entityId: item.id,
        previousPercentage: initialPct,
        newPercentage: Number(newPercentage),
        description,
        completedWork,
        problemsObstacles,
        nextActions,
        actualKpiResult,
        supportingEvidence: evidenceName || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || (lang === 'km' ? 'មិនអាចកត់ត្រាវឌ្ឍនភាពបានទេ។' : 'Failed to record progress update.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.updateProgress}
              </h3>
              <p className="text-xs text-slate-500">
                {'planNumber' in item ? item.planNumber : item.code}: {item.title}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form id="progress-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Slider / Percentage */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t.completionPct}: <span className="text-blue-600 font-mono text-sm">{newPercentage}%</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {lang === 'km' ? `មុន៖ ${initialPct}%` : `Previous: ${initialPct}%`}
                </span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                step="5"
                value={newPercentage}
                onChange={e => setNewPercentage(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% ({t.notStarted})</span>
                <span>50% ({t.inProgress})</span>
                <span>100% ({t.completed})</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'km' ? 'ការពិពណ៌នាវឌ្ឍនភាព *' : 'Progress Description *'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={lang === 'km' ? 'សេចក្តីសង្ខេបអំពីដំណាក់កាលសម្រេច ឬស្ថានភាព...' : 'Brief summary of milestones or status...'}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Completed Work */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.completedWork}
              </label>
              <textarea
                rows={2}
                value={completedWork}
                onChange={e => setCompletedWork(e.target.value)}
                placeholder={lang === 'km' ? 'លទ្ធផលជាក់ស្តែង កិច្ចការ ឬកូដដែលបានបង្កើត...' : 'Specific deliverables, tasks, or code delivered...'}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Problems or Obstacles */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.problemsObstacles}
              </label>
              <input
                type="text"
                value={problemsObstacles}
                onChange={e => setProblemsObstacles(e.target.value)}
                placeholder={lang === 'km' ? 'ឧបសគ្គ ភាពអាស្រ័យ ឬកម្រិតថវិកា (បើមាន)...' : 'Blockers, dependencies, or budget limits if any...'}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Next Actions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.nextActions}
              </label>
              <input
                type="text"
                value={nextActions}
                onChange={e => setNextActions(e.target.value)}
                placeholder={lang === 'km' ? 'សកម្មភាពបន្តសម្រាប់រយៈពេលរាយការណ៍បន្ទាប់...' : 'Upcoming steps for the next reporting period...'}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Actual KPI Measured */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.actualKpiResult}
              </label>
              <input
                type="text"
                value={actualKpiResult}
                onChange={e => setActualKpiResult(e.target.value)}
                placeholder={lang === 'km' ? 'ឧ. ដំណើរការ ៩៩.៩៥% / បានត្រួតពិនិត្យ ៤២ ធាតុ...' : 'e.g. 99.95% uptime / 42 items checked...'}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Evidence File Attachment Simulation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'km' ? 'ឯកសារភស្តុតាង / ឯកសារភ្ជាប់' : 'Supporting Evidence / Attachment'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={evidenceName}
                  onChange={e => setEvidenceName(e.target.value)}
                  placeholder={lang === 'km' ? 'ឈ្មោះឯកសារ (ឧ. Q1_Audit_Verification.pdf)' : 'Document name (e.g. Q1_Audit_Verification.pdf)'}
                  className="flex-1 rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setEvidenceName('Report_Signoff_' + new Date().toISOString().split('T')[0] + '.pdf')}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center space-x-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ភ្ជាប់ឯកសារសាកល្បង' : 'Attach Demo Doc'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Historical Log */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-1.5 mb-3 text-xs font-bold text-slate-800">
              <History className="w-4 h-4 text-slate-500" />
              <span>
                {lang === 'km' ? `${t.progressHistory} (${history.length} កំណត់ត្រា)` : `${t.progressHistory} (${history.length} logged entries)`}
              </span>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                {lang === 'km' ? 'មិនទាន់មានកំណត់ត្រាវឌ្ឍនភាពកន្លងមកទេ។' : 'No historical updates recorded yet.'}
              </p>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {history.map(item => {
                  const author = users.find(u => u.id === item.updatedById);
                  return (
                    <div key={item.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                        <span className="font-semibold text-slate-700">{author?.name || (lang === 'km' ? 'បុគ្គលិក' : 'Staff')}</span>
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="font-bold text-blue-700 font-mono">{item.previousPercentage}% &rarr; {item.newPercentage}%</span>
                        {item.actualKpiResult && (
                          <span className="text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            KPI: {item.actualKpiResult}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium">{item.description}</p>
                      {item.completedWork && (
                        <p className="text-slate-600 text-[11px] mt-1"><span className="font-semibold">{lang === 'km' ? 'ការងារ៖' : 'Work:'}</span> {item.completedWork}</p>
                      )}
                      {item.problemsObstacles && (
                        <p className="text-amber-700 text-[11px] mt-0.5"><span className="font-semibold">{lang === 'km' ? 'ឧបសគ្គ៖' : 'Obstacles:'}</span> {item.problemsObstacles}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            {t.cancel}
          </button>
          <button
            form="progress-form"
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
          >
            {lang === 'km' ? 'រក្សាទុកវឌ្ឍនភាព' : `${t.save} Progress Update`}
          </button>
        </div>
      </div>
    </div>
  );
};
