import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Layers, 
  AlertCircle,
  HelpCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { SubscriptionPlan } from '../../types/index.ts';

export const SubscriptionTab: React.FC = () => {
  const { plan, quota, upgradePlan } = useApp();

  const [selectedPlanModal, setSelectedPlanModal] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Card' | 'Bank'>('JazzCash');
  const [paymentRef, setPaymentRef] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const planConfigs: Record<SubscriptionPlan, {
    name: string;
    pricePKR: string;
    period: string;
    description: string;
    badge?: string;
    limits: {
      aiRequests: number;
      contentGenerations: number;
      customerReplies: number;
      leads: number;
      reports: number;
    };
    features: string[];
  }> = {
    FREE: {
      name: 'Free Trial',
      pricePKR: 'Rs. 0',
      period: 'forever',
      description: 'Ideal for testing BizPilot on a single WhatsApp channel or shop.',
      limits: {
        aiRequests: 50,
        contentGenerations: 20,
        customerReplies: 30,
        leads: 50,
        reports: 5,
      },
      features: [
        '50 AI requests per month',
        '20 Social media post generations',
        '30 Customer replies with COD',
        'Up to 50 active leads in CRM',
        'English & Roman Urdu support',
      ]
    },
    STARTER: {
      name: 'Starter Plan',
      pricePKR: 'Rs. 2,999',
      period: 'per month',
      description: 'Designed for individual shop owners, salons, and solo online sellers.',
      badge: 'Current Plan',
      limits: {
        aiRequests: 200,
        contentGenerations: 75,
        customerReplies: 150,
        leads: 300,
        reports: 25,
      },
      features: [
        '200 AI requests per month',
        '75 Social media posts & reels',
        '150 Fast WhatsApp replies',
        'Store up to 300 active leads',
        'Daily AI business summaries',
        'Full Urdu & Hinglish language support',
        'Standard email & WhatsApp support',
      ]
    },
    BUSINESS: {
      name: 'Business Pro',
      pricePKR: 'Rs. 6,999',
      period: 'per month',
      description: 'For growing retail chains, e-commerce boutiques, and agencies.',
      badge: 'Most Popular',
      limits: {
        aiRequests: 600,
        contentGenerations: 250,
        customerReplies: 500,
        leads: 1000,
        reports: 100,
      },
      features: [
        '600 AI requests per month',
        '250 High-retention video scripts & posts',
        '500 Automated customer responses',
        'Store up to 1,000 active leads',
        'Weekly & Monthly business reports',
        'Custom template saving',
        'Priority response processing',
      ]
    },
    PRO: {
      name: 'Enterprise Agency',
      pricePKR: 'Rs. 14,999',
      period: 'per month',
      description: 'High-volume retailers and marketing agencies managing multiple brands.',
      limits: {
        aiRequests: 2000,
        contentGenerations: 1000,
        customerReplies: 2000,
        leads: 5000,
        reports: 500,
      },
      features: [
        '2,000 AI requests per month',
        'Unlimited content & templates',
        '2,000 Customer replies',
        'Store up to 5,000 leads',
        'Custom AI fine-tuning for your brand',
        'Dedicated account manager in Pakistan',
        'Early access to voice & autonomous integrations',
      ]
    }
  };

  const handleConfirmUpgrade = () => {
    if (!selectedPlanModal) return;
    upgradePlan(selectedPlanModal);
    setSuccessNotice(`Successfully upgraded to ${selectedPlanModal} Plan! Your new limits are active immediately.`);
    setSelectedPlanModal(null);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const calcPercentage = (used: number, limit: number) => Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-emerald-600" />
            Plans, Billing & Usage Quota
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Transparent pricing tailored for Pakistani businesses with seamless payment gateway abstraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Current Plan:</span>
          <span className="rounded-xl bg-emerald-100 px-3 py-1 font-bold text-xs text-emerald-800">
            {plan}
          </span>
        </div>
      </div>

      {successNotice && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Monthly Usage Meters Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="font-bold text-sm text-slate-900">Your Monthly Usage</h2>
          </div>
          <span className="text-xs text-slate-500">
            Billing cycle resets on: <strong>{quota.billingCycleEnd}</strong>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* AI Requests */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">AI Requests</span>
              <span className="text-slate-900 font-bold">{quota.aiRequestsUsed} / {quota.aiRequestsLimit}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${calcPercentage(quota.aiRequestsUsed, quota.aiRequestsLimit)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              {calcPercentage(quota.aiRequestsUsed, quota.aiRequestsLimit)}% used
            </span>
          </div>

          {/* Content Generations */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Content Studio Posts</span>
              <span className="text-slate-900 font-bold">{quota.contentGenerationsUsed} / {quota.contentGenerationsLimit}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${calcPercentage(quota.contentGenerationsUsed, quota.contentGenerationsLimit)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              {calcPercentage(quota.contentGenerationsUsed, quota.contentGenerationsLimit)}% used
            </span>
          </div>

          {/* Customer Replies */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Customer Replies</span>
              <span className="text-slate-900 font-bold">{quota.customerRepliesUsed} / {quota.customerRepliesLimit}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className="h-full bg-teal-500 rounded-full transition-all"
                style={{ width: `${calcPercentage(quota.customerRepliesUsed, quota.customerRepliesLimit)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              {calcPercentage(quota.customerRepliesUsed, quota.customerRepliesLimit)}% used
            </span>
          </div>

          {/* Stored Leads */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Stored CRM Leads</span>
              <span className="text-slate-900 font-bold">{quota.leadsStored} / {quota.leadsLimit}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${calcPercentage(quota.leadsStored, quota.leadsLimit)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              {calcPercentage(quota.leadsStored, quota.leadsLimit)}% used
            </span>
          </div>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(planConfigs) as SubscriptionPlan[]).map((planKey) => {
          const cfg = planConfigs[planKey];
          const isCurrent = plan === planKey;

          return (
            <div 
              key={planKey}
              className={`flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all ${
                isCurrent 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900">{cfg.name}</h3>
                  {isCurrent && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Active
                    </span>
                  )}
                  {!isCurrent && cfg.badge && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                      {cfg.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-2xl font-black text-slate-900">{cfg.pricePKR}</div>
                  <span className="text-xs text-slate-400">{cfg.period}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                  {cfg.description}
                </p>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Includes:</span>
                  {cfg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-500 cursor-default"
                  >
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlanModal(planKey)}
                    className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
                  >
                    Upgrade to {cfg.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway Abstraction & Local Pakistani Rail Notes */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900">Payment Gateway Abstraction Layer</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          BizPilot AI features an decoupled payment connector. When payment processing is enabled, users can subscribe via <strong>JazzCash, EasyPaisa, Safepay, PayFast, Meezan Bank, or Visa/MasterCard</strong> without vendor lock-in. No credit card secrets are stored in the client.
        </p>
      </div>

      {/* Upgrade Confirmation Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedPlanModal(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-black text-base text-slate-900">
              Upgrade to {planConfigs[selectedPlanModal].name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Total due: <strong>{planConfigs[selectedPlanModal].pricePKR}</strong> {planConfigs[selectedPlanModal].period}
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['JazzCash', 'EasyPaisa', 'Card', 'Bank'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border p-2.5 text-xs font-bold text-center transition ${
                        paymentMethod === method 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Account / Transaction Ref</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. 03001234567 or TID-998811"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpgrade}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Confirm & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
