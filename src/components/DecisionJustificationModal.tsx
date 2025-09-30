import { X, AlertCircle, CheckCircle, Info, TrendingUp, Package, Wrench, FileText } from 'lucide-react';
import type { TrainWithDetails } from '../types';

interface DecisionJustificationModalProps {
  train: TrainWithDetails;
  onClose: () => void;
}

export default function DecisionJustificationModal({ train, onClose }: DecisionJustificationModalProps) {
  const decision = train.latest_decision;

  if (!decision) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'warning':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'info':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const getDecisionColor = (dec: string) => {
    switch (dec) {
      case 'service':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-orange-500';
      case 'standby':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{train.train_number}</h2>
            <p className="text-blue-100 text-sm mt-1">AI Decision Explanation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`px-6 py-3 ${getDecisionColor(decision.decision)} text-white rounded-xl font-bold text-lg shadow-lg`}>
                {decision.decision.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-1">Confidence Score</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${decision.confidence_score}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-slate-900">{decision.confidence_score.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Decision Reasoning
              </h3>
              <ul className="space-y-2">
                {decision.justification.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {decision.conflicts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Conflicts & Issues
                </h3>
                {decision.conflicts.map((conflict, index) => (
                  <div
                    key={index}
                    className={`border rounded-xl p-4 ${getSeverityColor(conflict.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(conflict.severity)}
                      <div className="flex-1">
                        <div className="font-semibold mb-1 capitalize">{conflict.type.replace('_', ' ')}</div>
                        <div className="text-sm">{conflict.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border-2 ${decision.justification.fitness_check ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {decision.justification.fitness_check ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold text-sm">Fitness</span>
                </div>
                <div className={`text-xs ${decision.justification.fitness_check ? 'text-green-700' : 'text-red-700'}`}>
                  {decision.justification.fitness_check ? 'All Valid' : 'Issues Found'}
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${decision.justification.job_card_check ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {decision.justification.job_card_check ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold text-sm">Maintenance</span>
                </div>
                <div className={`text-xs ${decision.justification.job_card_check ? 'text-green-700' : 'text-red-700'}`}>
                  {decision.justification.job_card_check ? 'No Critical Jobs' : 'Pending Work'}
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${decision.justification.branding_check ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Package className={`w-5 h-5 ${decision.justification.branding_check ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className="font-semibold text-sm">Branding</span>
                </div>
                <div className={`text-xs ${decision.justification.branding_check ? 'text-green-700' : 'text-orange-700'}`}>
                  {decision.justification.branding_check ? 'On Track' : 'Behind Schedule'}
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${decision.justification.mileage_check ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-5 h-5 ${decision.justification.mileage_check ? 'text-green-600' : 'text-blue-600'}`} />
                  <span className="font-semibold text-sm">Mileage</span>
                </div>
                <div className={`text-xs ${decision.justification.mileage_check ? 'text-green-700' : 'text-blue-700'}`}>
                  {decision.justification.mileage_check ? 'Balanced' : 'Needs Adjustment'}
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${decision.justification.cleaning_check ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className={`w-5 h-5 ${decision.justification.cleaning_check ? 'text-green-600' : 'text-blue-600'}`} />
                  <span className="font-semibold text-sm">Cleaning</span>
                </div>
                <div className={`text-xs ${decision.justification.cleaning_check ? 'text-green-700' : 'text-blue-700'}`}>
                  {decision.justification.cleaning_check ? 'Scheduled' : 'Needs Slot'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Train Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Total Mileage</div>
                  <div className="text-lg font-semibold text-slate-900">{train.total_mileage.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Depot Location</div>
                  <div className="text-lg font-semibold text-slate-900">{train.depot_location}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Stabling Position</div>
                  <div className="text-lg font-semibold text-slate-900">{train.stabling_position || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Open Jobs</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {train.job_cards.filter(j => j.status === 'open').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}