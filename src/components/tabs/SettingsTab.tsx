import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Globe, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const SettingsTab: React.FC = () => {
  const { 
    business, 
    updateBusinessProfile, 
    user, 
    updateUserProfile,
    setLanguage 
  } = useApp();

  const [activeSection, setActiveSection] = useState<'profile' | 'privacy' | 'terms' | 'deletion'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: business.name,
    businessType: business.businessType,
    city: business.city,
    currency: business.currency,
    contactPhone: business.contactPhone,
    contactEmail: business.contactEmail,
    address: business.address || '',
    deliveryCharges: business.policies?.deliveryCharges || 'Standard Rs. 250 with Cash on Delivery across Pakistan.',
    returnPolicy: business.policies?.returnPolicy || '7-day easy exchange for unworn items with tags.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      name: formData.businessName,
      businessType: formData.businessType,
      city: formData.city,
      currency: formData.currency,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      address: formData.address,
      policies: {
        deliveryCharges: formData.deliveryCharges,
        returnPolicy: formData.returnPolicy,
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePurgeData = () => {
    if (confirm('Are you sure you want to delete all stored business information, leads, follow-ups, and AI history? This action is irreversible.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-700" />
            Settings, Privacy & Business Legal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure your Pakistan store parameters, audit data retention, and review user privacy safeguards.
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
          {(['profile', 'privacy', 'terms', 'deletion'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`rounded-lg px-3 py-1.5 capitalize font-bold transition ${
                activeSection === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'profile' ? 'Store Profile' : tab === 'privacy' ? 'Privacy Policy' : tab === 'terms' ? 'Terms' : 'Data Control'}
            </button>
          ))}
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Business settings updated successfully. AI prompts will now reference your updated policies.</span>
        </div>
      )}

      {/* Section 1: Store Profile & Settings */}
      {activeSection === 'profile' && (
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Business Profile & Store Identity
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Business Name</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Business Category</label>
              <input
                type="text"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Country</label>
              <input
                type="text"
                disabled
                value="Pakistan"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Currency</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Contact / WhatsApp Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Official Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">Delivery Policy</label>
            <input
              type="text"
              value={formData.deliveryCharges}
              onChange={(e) => setFormData({ ...formData, deliveryCharges: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">Return & Exchange Policy</label>
            <input
              type="text"
              value={formData.returnPolicy}
              onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Business Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Section 2: Privacy Policy */}
      {activeSection === 'privacy' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">BizPilot AI Privacy Policy</h2>
          </div>

          <p>
            <strong>Last Updated: September 2026</strong>. BizPilot AI is dedicated to safeguarding the privacy and commercial proprietary data of Pakistani small businesses, sole proprietors, retailers, and agencies.
          </p>

          <h3 className="font-bold text-slate-900 text-xs">1. What Business Data We Store</h3>
          <p>
            We strictly store only the information required to run your business assistant: your business name, store contact details, catalog SKUs with PKR pricing, client CRM records (names, inquiry products, notes), scheduled follow-ups, and custom reply templates.
          </p>

          <h3 className="font-bold text-slate-900 text-xs">2. We Never Sell Your Data</h3>
          <p>
            Your business leads, customer inquiries, and pricing details are <strong>100% confidential</strong>. We never sell, rent, or distribute your customer list to third-party advertisers or competing businesses.
          </p>

          <h3 className="font-bold text-slate-900 text-xs">3. Use of AI Models</h3>
          <p>
            Prompts processed by BizPilot AI are passed securely via server-side Google Gemini interfaces. Your private customer records are not used to train global public foundational models without your express authorization.
          </p>

          <h3 className="font-bold text-slate-900 text-xs">4. Data Deletion Right</h3>
          <p>
            You retain absolute ownership of your workspace data. You may delete any lead, product, or template at any moment, or purge your entire business account under the <em>Data Control</em> tab.
          </p>
        </div>
      )}

      {/* Section 3: Terms of Service */}
      {activeSection === 'terms' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="h-5 w-5 text-purple-600" />
            <h2 className="font-bold text-sm text-slate-900">Terms of Service</h2>
          </div>

          <p>
            By using BizPilot AI, you agree to these Terms. BizPilot AI provides an autonomous productivity assistant for drafting responses, tracking sales leads, and generating marketing material.
          </p>

          <h3 className="font-bold text-slate-900 text-xs">1. Draft Message Verification</h3>
          <p>
            BizPilot generates drafts based on your saved business knowledge. Unless you have connected an explicit authorized WhatsApp Business API or SMS integration, messages are not transmitted automatically to external clients. You are responsible for reviewing and confirming quotes, availability, and delivery charges before sending.
          </p>

          <h3 className="font-bold text-slate-900 text-xs">2. Usage Limits and Anti-Abuse</h3>
          <p>
            Subscribers must adhere to monthly quota allowances. Automated scrapers, spam bots, and unauthorized reselling of API access are prohibited and subject to immediate account termination.
          </p>
        </div>
      )}

      {/* Section 4: Data Deletion & Purge */}
      {activeSection === 'deletion' && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-200 pb-3 text-rose-900">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h2 className="font-bold text-sm">Data Control & Complete Workspace Deletion</h2>
          </div>

          <p className="text-xs text-rose-800 leading-relaxed">
            In compliance with international data privacy laws and zero-retention principles, you have the right to permanently purge all data associated with <strong>{business.name}</strong>.
          </p>

          <div className="rounded-2xl border border-rose-200 bg-white p-4 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-rose-900">This will permanently delete:</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>All active CRM leads and customer contact information</li>
              <li>Scheduled follow-ups and reminder drafts</li>
              <li>Products, categories, and SKU price lists</li>
              <li>Knowledge items, delivery policies, and return warranties</li>
              <li>AI conversation transcripts and generation histories</li>
            </ul>
          </div>

          <button
            onClick={handlePurgeData}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>Permanently Delete All Workspace Data</span>
          </button>
        </div>
      )}
    </div>
  );
};
