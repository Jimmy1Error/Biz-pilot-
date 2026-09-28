import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  Search, 
  Tag, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { BusinessTemplate } from '../../types/index.ts';

export const TemplateLibraryTab: React.FC = () => {
  const { templates, addTemplate, deleteTemplate, business } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Customer Support' as BusinessTemplate['category'],
    language: 'hinglish' as BusinessTemplate['language'],
    content: '',
    tagsText: 'WhatsApp, Urgent, Price',
  });

  const categories = [
    'All',
    'Customer Support',
    'Sales',
    'Follow-up',
    'Promotions',
    'Social Media',
    'Product Description'
  ];

  const filtered = templates.filter(t => {
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    // Replace placeholders with real business data
    const replaced = text
      .replace('{customer_name}', 'Customer')
      .replace('{price}', '12,500')
      .replace('{product_name}', 'Luxury 3-Piece Suite')
      .replace('{store_name}', business.name);

    navigator.clipboard.writeText(replaced);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const tags = formData.tagsText.split(',').map(t => t.trim()).filter(Boolean);

    addTemplate({
      title: formData.title,
      category: formData.category,
      language: formData.language,
      content: formData.content,
      tags,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-600" />
            Template Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            One-click reusable message templates for customer support, sales, follow-ups, and marketing.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              category: 'Customer Support',
              language: 'hinglish',
              content: '',
              tagsText: 'WhatsApp, Quick Reply',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by title, keyword, or tag..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                categoryFilter === c 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((t) => (
          <div 
            key={t.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700">
                  {t.category}
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 uppercase">
                  {t.language}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">{t.title}</h3>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                {t.content}
              </div>

              {t.tags && t.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {t.tags.map((tag, idx) => (
                    <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                onClick={() => handleCopy(t.content, t.id)}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                {copiedId === t.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedId === t.id ? 'Copied' : 'Copy Template'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Delete this template?')) deleteTemplate(t.id);
                }}
                className="p-1 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                title="Delete Template"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Create Custom Business Template</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700">Template Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Eid Discount Inquiry Response"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="ur">اردو (Urdu)</option>
                    <option value="hinglish">Hinglish / Roman Urdu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Template Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Use variables like {customer_name}, {price}, {product_name}..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tagsText}
                  onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                  placeholder="WhatsApp, Promo, Urdu, Urgent"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
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
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
