import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Award, 
  Compass, 
  AlertCircle,
  FileCheck,
  Star,
  History,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ActionPlan, User, Language, Objective } from '../types';
import { db } from '../services/db';

interface PlanReviewAlignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ActionPlan | null;
  currentUser: User;
  lang: Language;
  onSuccess?: (msg: string) => void;
}

export const PlanReviewAlignmentModal: React.FC<PlanReviewAlignmentModalProps> = ({
  isOpen,
  onClose,
  plan,
  currentUser,
  lang,
  onSuccess,
}) => {
  if (!isOpen || !plan) return null;

  const [activeTab, setActiveTab] = useState<'review' | 'history'>('review');
  const [cadence, setCadence] = useState<'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly'>(
    plan.reviewCadence || 'Bi-Weekly'
  );
  const [alignmentScore, setAlignmentScore] = useState<number>(5);
  const [alignmentAssessment, setAlignmentAssessment] = useState<string>(
    `Directly contributes to strategic deliverables through measurable KPI milestones and team velocity.`
  );
  const [progressSummary, setProgressSummary] = useState<string>(
    plan.actualResult || ''
  );
  const [roadblocks, setRoadblocks] = useState<string>('');
  const [nextMilestones, setNextMilestones] = useState<string>('');
  const [adjustmentsMade, setAdjustmentsMade] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Parent objective
  const objective = db.getObjectives().find(o => o.id === plan.objectiveId);

  // Compute next review projection date
  const computeNextDate = (cad: 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly') => {
    const d = new Date();
    const days = cad === 'Weekly' ? 7 : cad === 'Bi-Weekly' ? 14 : cad === 'Monthly' ? 30 : 90;
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const projectedNextDate = computeNextDate(cadence);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alignmentAssessment.trim() || !progressSummary.trim()) {
      alert(lang === 'km' ? 'សូមបំពេញព័ត៌មានវាយតម្លៃឱ្យបានពេញលេញ' : 'Please fill in both the alignment assessment and progress summary.');
      return;
    }

    setIsSubmitting(true);
    try {
      db.recordPlanReview(plan.id, {
        cadence,
        alignmentScore,
        alignmentAssessment,
        progressSummary,
        roadblocks,
        nextMilestones,
        adjustmentsMade,
      });

      const successMsg = lang === 'km'
        ? `បានកត់ត្រាការត្រួតពិនិត្យទៀងទាត់សម្រាប់ ${plan.planNumber} ដោយជោគជ័យ`
        : `Regular review & goal alignment recorded for ${plan.planNumber}!`;

      if (onSuccess) onSuccess(successMsg);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to record review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="plan-review-alignment-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        id="plan-review-alignment-modal-content"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  {plan.planNumber}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {lang === 'km' ? 'ការត្រួតពិនិត្យទៀងទាត់ និងតម្រឹមគោលដៅយុទ្ធសាស្ត្រ' : 'Regular Plan Review & Strategic Alignment'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs sm:max-w-md">
                {plan.title}
              </p>
            </div>
          </div>
          <button
            id="close-review-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 pt-2">
          <button
            id="tab-conduct-review"
            type="button"
            onClick={() => setActiveTab('review')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'review'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ធ្វើការត្រួតពិនិត្យទៀងទាត់' : 'Conduct Regular Review'}</span>
          </button>

          <button
            id="tab-review-history"
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'history'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>
              {lang === 'km' ? 'ប្រវត្តិនៃការត្រួតពិនិត្យ' : 'Review History'} ({plan.reviewHistory?.length || 0})
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'review' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Linked Strategic Objective Card */}
              <div className="p-3.5 bg-gradient-to-r from-purple-50/70 to-blue-50/70 rounded-xl border border-purple-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-900 flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-600" />
                    <span>{lang === 'km' ? 'គោលដៅយុទ្ធសាស្ត្ររបស់ស្ថាប័ន' : 'Linked Company Objective'}</span>
                  </span>
                  {objective && (
                    <span className="text-[10px] font-mono font-bold bg-white/80 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                      {objective.code}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {objective ? objective.title : 'General Corporate Operational Alignment'}
                </p>
                {objective && (
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {objective.description}
                  </p>
                )}
              </div>

              {/* Review Cadence & Alignment Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Review Cadence */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'km' ? 'វដ្តនៃការត្រួតពិនិត្យ' : 'Review Cadence'}</span>
                  </label>
                  <select
                    id="review-cadence-select"
                    value={cadence}
                    onChange={e => setCadence(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition"
                  >
                    <option value="Weekly">Weekly Review (រៀងរាល់សប្តាហ៍)</option>
                    <option value="Bi-Weekly">Bi-Weekly Review (រៀងរាល់ ២ សប្តាហ៍)</option>
                    <option value="Monthly">Monthly Review (រៀងរាល់ខែ)</option>
                    <option value="Quarterly">Quarterly Review (រៀងរាល់ត្រីមាស)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {lang === 'km' ? 'កាលបរិច្ឆេទបន្ទាប់៖ ' : 'Next review target: '}
                    <span className="font-bold text-purple-600">{projectedNextDate}</span>
                  </p>
                </div>

                {/* Alignment Score */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'km' ? 'កម្រិតតម្រឹមជាមួយគោលដៅ' : 'Alignment Score'}</span>
                    </span>
                    <span className="text-xs font-bold text-purple-700">{alignmentScore} / 5</span>
                  </label>
                  <div className="flex items-center space-x-2 pt-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        id={`score-star-${star}`}
                        onClick={() => setAlignmentScore(star)}
                        className={`p-1.5 rounded-lg border transition ${
                          alignmentScore >= star
                            ? 'bg-amber-50 border-amber-300 text-amber-500'
                            : 'bg-white border-slate-200 text-slate-300 hover:text-amber-300'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
                    <span className="text-[11px] font-semibold text-slate-500">
                      {alignmentScore === 5 ? 'Perfect Fit' : alignmentScore >= 4 ? 'Strong' : 'Moderate'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Strategic Alignment Assessment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'km' ? 'ការវាយតម្លៃការតម្រឹមជាមួយគោលដៅស្ថាប័ន' : 'Strategic Goal Alignment Assessment'}</span>
                </label>
                <textarea
                  id="review-alignment-assessment"
                  rows={2}
                  value={alignmentAssessment}
                  onChange={e => setAlignmentAssessment(e.target.value)}
                  placeholder={lang === 'km' 
                    ? 'ពន្យល់ពីរបៀបដែលលទ្ធផលនៃផែនការនេះ ជួយជំរុញគោលដៅរួមរបស់ក្រុមហ៊ុន...' 
                    : 'Explain how this action plan supports the company objective and strategic key results...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition resize-none"
                  required
                />
              </div>

              {/* Progress Summary & Accomplishments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'km' ? 'វឌ្ឍនភាព និងសមិទ្ធផលដែលសម្រេចបាន' : 'Progress & Accomplishments This Cycle'}</span>
                </label>
                <textarea
                  id="review-progress-summary"
                  rows={2}
                  value={progressSummary}
                  onChange={e => setProgressSummary(e.target.value)}
                  placeholder={lang === 'km' 
                    ? 'បញ្ជាក់លម្អិតពីការងារដែលបានបញ្ចប់ និងសូចនាករ KPI ជាក់ស្តែង...' 
                    : 'Summary of milestones delivered and measurable KPI progress made since last review...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition resize-none"
                  required
                />
              </div>

              {/* Roadblocks & Next Milestones in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'km' ? 'បញ្ហាប្រឈម / ឧបសគ្គ' : 'Roadblocks / Dependencies'}</span>
                  </label>
                  <textarea
                    id="review-roadblocks"
                    rows={2}
                    value={roadblocks}
                    onChange={e => setRoadblocks(e.target.value)}
                    placeholder={lang === 'km' ? 'ឧបសគ្គដែលត្រូវការការដោះស្រាយ...' : 'Any blocking issues or resource dependencies...'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{lang === 'km' ? 'គោលដៅវដ្តបន្ទាប់' : 'Upcoming Milestones'}</span>
                  </label>
                  <textarea
                    id="review-next-milestones"
                    rows={2}
                    value={nextMilestones}
                    onChange={e => setNextMilestones(e.target.value)}
                    placeholder={lang === 'km' ? 'គោលដៅសំខាន់ត្រូវសម្រេចនៅវដ្តបន្ទាប់...' : 'Key deliverables planned for the upcoming cycle...'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition resize-none"
                  />
                </div>
              </div>

              {/* Adjustments Made to Stay on Track */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>{lang === 'km' ? 'ការកែសម្រួលដើម្បីធានាភាពជោគជ័យ' : 'Adjustments Made to Scope, Deadlines or Resources'}</span>
                </label>
                <input
                  type="text"
                  id="review-adjustments-made"
                  value={adjustmentsMade}
                  onChange={e => setAdjustmentsMade(e.target.value)}
                  placeholder={lang === 'km' 
                    ? 'ឧទាហរណ៍៖ បានបន្ថែមអាទិភាពលើការធ្វើតេស្តសុវត្ថិភាព...' 
                    : 'e.g., Reprioritized API documentation and scheduled 2 additional testing pairs...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  id="cancel-review-btn"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  id="save-review-btn"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (lang === 'km' ? 'កំពុងកត់ត្រា...' : 'Saving...')
                      : (lang === 'km' ? 'កត់ត្រាការត្រួតពិនិត្យ' : 'Submit Regular Review')}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Historical Reviews Timeline */
            <div className="space-y-4">
              {(!plan.reviewHistory || plan.reviewHistory.length === 0) ? (
                <div className="py-12 text-center text-slate-400">
                  <Compass className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">
                    {lang === 'km' ? 'មិនទាន់មានប្រវត្តិត្រួតពិនិត្យនៅឡើយទេ' : 'No review records yet'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === 'km' 
                      ? 'ធ្វើការត្រួតពិនិត្យដំបូងរបស់អ្នក ដើម្បីតាមដានភាពស្របគ្នានឹងគោលដៅក្រុមហ៊ុន' 
                      : 'Conduct regular reviews to keep milestones aligned with corporate strategy.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {plan.reviewHistory.map((rev, idx) => (
                    <div 
                      key={rev.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-900">{rev.reviewerName}</span>
                            <span className="text-[10px] text-slate-400">({rev.reviewerRole})</span>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-purple-100 text-purple-800">
                              {rev.cadence}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {lang === 'km' ? 'កាលបរិច្ឆេទពិនិត្យ៖ ' : 'Reviewed on: '}
                            <span className="font-semibold text-slate-700">{rev.reviewDate}</span>
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span>{rev.alignmentScore} / 5</span>
                        </div>
                      </div>

                      {/* Alignment assessment quote */}
                      <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100 text-xs text-purple-900 leading-relaxed">
                        <span className="font-bold block text-[10px] text-purple-600 uppercase mb-0.5">Strategic Alignment:</span>
                        "{rev.alignmentAssessment}"
                      </div>

                      {/* Progress summary */}
                      <div className="text-xs text-slate-700 space-y-1">
                        <span className="font-bold block text-[10px] text-slate-400 uppercase">Progress Summary:</span>
                        <p>{rev.progressSummary}</p>
                      </div>

                      {/* Roadblocks & Next Milestones */}
                      {(rev.roadblocks || rev.nextMilestones) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                          {rev.roadblocks && (
                            <div className="text-amber-800 bg-amber-50/60 p-2 rounded-lg">
                              <span className="font-bold block text-[10px] text-amber-600 uppercase mb-0.5">Roadblocks:</span>
                              {rev.roadblocks}
                            </div>
                          )}
                          {rev.nextMilestones && (
                            <div className="text-blue-800 bg-blue-50/60 p-2 rounded-lg">
                              <span className="font-bold block text-[10px] text-blue-600 uppercase mb-0.5">Next Deliverables:</span>
                              {rev.nextMilestones}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
