import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  ShieldCheck, 
  Database, 
  User, 
  Bot, 
  Building2, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { KnowledgeItem } from '../../types/index.ts';

export const KnowledgeBaseTab: React.FC = () => {
  const { 
    knowledge, 
    addKnowledgeItem, 
    updateKnowledgeItem, 
    deleteKnowledgeItem, 
    business, 
    user 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'knowledge' | 'memory'>('knowledge');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);

  const [formData, setFormData] = useState({
    category: 'FAQ' as KnowledgeItem['category'],
    question: '',
    answer: '',
  });

  const categories = ['All', 'FAQ', 'Policy', 'Delivery', 'Refund', 'Pricing', 'General'];

  const filteredKnowledge = knowledge.filter(k => 
    categoryFilter === 'All' || k.category === categoryFilter
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      category: 'FAQ',
      question: '',
      answer: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      question: item.question,
      answer: item.answer,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;

    if (editingItem) {
      updateKnowledgeItem(editingItem.id, formData);
    } else {
      addKnowledgeItem(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            Business Knowledge & AI Memory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define accurate policies, FAQs, and delivery terms. BizPilot AI references this verified data and never fabricates terms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tab toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('knowledge')}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                activeSubTab === 'knowledge' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Knowledge & FAQs
            </button>
            <button
              onClick={() => setActiveSubTab('memory')}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                activeSubTab === 'memory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scoped AI Memory
            </button>
          </div>

          {activeSubTab === 'knowledge' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Knowledge</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'knowledge' ? (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  categoryFilter === c 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredKnowledge.map((item) => (
              <div 
                key={item.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400">Updated: {item.updatedAt}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.question}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {item.answer}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this knowledge item?')) deleteKnowledgeItem(item.id);
                    }}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Scoped AI Memory Architecture View (Requirement 13) */
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Strict Architecture Privacy Separation</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                BizPilot AI enforces cryptographic and architectural segregation across <strong>User Identity</strong>, <strong>Business Catalog/Rules</strong>, and transient <strong>AI Conversation Context</strong>. You can inspect or purge any tier independently.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Tier 1: User Profile Data */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <User className="h-4 w-4 text-blue-600" />
                <span>1. User Profile Data</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Personal credentials, roles, and session tokens. Strictly isolated from public AI context.
              </p>
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1 font-mono text-slate-700">
                <div>ID: {user?.id}</div>
                <div>Name: {user?.name}</div>
                <div>Role: {user?.role}</div>
                <div>Email: {user?.email}</div>
              </div>
            </div>

            {/* Tier 2: Business Data & Policies */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Building2 className="h-4 w-4 text-emerald-600" />
                <span>2. Business Knowledge Base</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Brand description, delivery fees, return warranties, and catalog prices injected as grounding prompts.
              </p>
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1 font-mono text-slate-700">
                <div>Store: {business.name}</div>
                <div>City: {business.city}, {business.country}</div>
                <div>Currency: {business.currency}</div>
                <div>Knowledge Items: {knowledge.length}</div>
              </div>
            </div>

            {/* Tier 3: AI Conversation History */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Bot className="h-4 w-4 text-purple-600" />
                <span>3. Transient AI History</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ephemeral token window to prevent hallucination and respect user privacy limits.
              </p>
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1 font-mono text-slate-700">
                <div>Status: Truncated per request</div>
                <div>Token Budget: Max 2048 ctx</div>
                <div>Provider Key: Protected Server-side</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding/editing Knowledge Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingItem ? 'Edit Knowledge Item' : 'Add Business Knowledge / Policy'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option>FAQ</option>
                  <option>Policy</option>
                  <option>Delivery</option>
                  <option>Refund</option>
                  <option>Pricing</option>
                  <option>General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Question / Topic *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Do you offer Cash on Delivery to Peshawar?"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Official Policy Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="e.g. Yes, COD is supported across all major cities with Rs. 250 standard shipping..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Save to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
