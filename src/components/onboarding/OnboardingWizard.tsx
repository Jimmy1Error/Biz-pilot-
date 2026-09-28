import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingBag, 
  Users, 
  Clock, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  X,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const OnboardingWizard: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    business, 
    updateBusinessProfile,
    setActiveTab 
  } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: business.name || '',
    businessType: business.businessType || 'Retail Shop / Boutique',
    city: business.city || 'Lahore',
    productsSold: 'Luxury Pret, Unstitched lawn suits, and festive wedding wear',
    targetAudience: 'Women aged 20-45 across Pakistan and overseas looking for high quality eastern wear',
    timeConsumingTasks: [
      'Customer replies',
      'Social media',
      'Sales follow-ups',
    ] as string[],
    contactPhone: business.contactPhone || '+92 300 1234567',
  });

  if (!isOnboardingOpen) return null;

  const taskOptions = [
    'Customer replies',
    'Social media',
    'Lead management',
    'Sales follow-ups',
    'Reports',
    'Product descriptions',
    'Marketing',
    'Other'
  ];

  const toggleTask = (task: string) => {
    setFormData(prev => ({
      ...prev,
      timeConsumingTasks: prev.timeConsumingTasks.includes(task)
        ? prev.timeConsumingTasks.filter(t => t !== task)
        : [...prev.timeConsumingTasks, task]
    }));
  };

  const handleFinish = () => {
    updateBusinessProfile({
      name: formData.businessName,
      businessType: formData.businessType,
      city: formData.city,
      description: `${formData.productsSold}. Serving ${formData.targetAudience}.`,
      contactPhone: formData.contactPhone,
    });
    setIsOnboardingOpen(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setIsOnboardingOpen(false)} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">BizPilot Setup Wizard</h2>
              <p className="text-[11px] text-slate-500">Step {step} of 5 — Personalize your AI Business Workspace</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOnboardingOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex h-1.5 w-full bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Forms */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">What is your business?</h3>
                <p className="text-xs text-slate-500">Tell BizPilot your official brand or company name.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Zahra Pret, Karachi Biryani House, TechSpark Studio"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Business Category</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option>Retail Shop / Boutique</option>
                    <option>Online E-commerce Seller</option>
                    <option>Freelancer / Solopreneur</option>
                    <option>Salon / Spa / Wellness</option>
                    <option>Restaurant / Cafe</option>
                    <option>Service Business / Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">City in Pakistan</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">What do you sell?</h3>
                <p className="text-xs text-slate-500">Describe your main products, services, or offerings.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Products or Services Offered</label>
                <textarea
                  rows={4}
                  value={formData.productsSold}
                  onChange={(e) => setFormData({ ...formData, productsSold: e.target.value })}
                  placeholder="e.g. Ready-to-wear formal kurtas, digital printed lawn, unstitched party suits with Cash on Delivery..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Contact / WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+92 300 0000000"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Who are your customers?</h3>
                <p className="text-xs text-slate-500">Understanding your target market helps BizPilot choose the ideal tone.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Target Audience Description</label>
                <textarea
                  rows={4}
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g. Women aged 20 to 45 looking for premium festive fashion, college students buying affordable daily wear, families buying wedding gifts..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>BizPilot will tailor WhatsApp customer responses and social media hooks for this audience.</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">What tasks consume most of your time?</h3>
                <p className="text-xs text-slate-500">Select the routine bottlenecks you want BizPilot AI to handle.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {taskOptions.map((task) => {
                  const isSelected = formData.timeConsumingTasks.includes(task);
                  return (
                    <button
                      key={task}
                      type="button"
                      onClick={() => toggleTask(task)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold' 
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">{task}</span>
                      {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-center py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <Rocket className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Your AI Workspace is Ready!</h3>
                <p className="mt-1 text-xs text-slate-600 max-w-sm mx-auto">
                  BizPilot AI has initialized memory and customized rules for <strong>{formData.businessName || 'your business'}</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2">
                <div className="font-bold text-slate-800">Workspace Highlights:</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Configured for <strong>PKR (Rs)</strong> and Pakistan Courier COD</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Trained on English, Urdu & Roman Urdu WhatsApp reply patterns</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Prioritizing: {formData.timeConsumingTasks.join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white transition hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20"
            >
              <span>Launch BizPilot Dashboard</span>
              <Rocket className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
