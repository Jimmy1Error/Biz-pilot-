import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw, 
  Bookmark, 
  Edit3, 
  Share2, 
  Layers, 
  Instagram, 
  Facebook, 
  Video, 
  MessageCircle,
  Eye,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

type Platform = 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube Shorts' | 'WhatsApp Status';

type ContentType = 
  | 'Promotional post'
  | 'Educational post'
  | 'Product post'
  | 'Short-video script'
  | 'Caption'
  | 'Offer announcement'
  | 'Customer testimonial template';

export const ContentStudioTab: React.FC = () => {
  const { 
    business, 
    products, 
    addTemplate, 
    incrementAIUsage,
    setActiveTab 
  } = useApp();

  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [contentType, setContentType] = useState<ContentType>('Promotional post');
  const [productService, setProductService] = useState(products[0]?.name || 'Luxury Velvet & Festive Lawn');
  const [targetAudience, setTargetAudience] = useState('Pakistani women aged 22-45 shopping for Eid & wedding festivities');
  const [offer, setOffer] = useState('Flat 15% OFF + Free Courier Shipping on orders above Rs. 5,000');
  const [tone, setTone] = useState('Exciting & Elegant');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Generated Content Elements
  const [content, setContent] = useState({
    hook: "Looking for an outfit that turns heads this festive season without breaking your budget? ✨",
    caption: `Step into pure royalty with Zahra Pret’s brand new festive drop. Handcrafted embroidery, micro-velvet touch, and pure organza dupattas crafted to perfection for family gatherings and wedding dawats across Pakistan.\n\nEnjoy our limited-time special offer: Flat 15% OFF across the entire collection plus 100% FREE Cash on Delivery for orders above Rs. 5,000! Don't wait until sizes run out.`,
    cta: "📲 Tap the link in bio or WhatsApp +92 321 9876543 to secure your piece today before sold out!",
    hashtags: "#ZahraPret #PakistaniFashion #FestiveWear #LawnCollection #LahoreFashion #KarachiBoutique #CashOnDelivery #WeddingWearPakistan",
    visualConcept: "Start with an ultra close-up macro pan of the golden tilla and resham thread embroidery on deep emerald velvet, transitioning to a model wearing the completed 3-piece in natural golden hour sunlight, text overlay highlighting 'Flat 15% OFF'."
  });

  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const platforms: { name: Platform; icon: any }[] = [
    { name: 'Instagram', icon: Instagram },
    { name: 'Facebook', icon: Facebook },
    { name: 'TikTok', icon: Video },
    { name: 'YouTube Shorts', icon: Video },
    { name: 'WhatsApp Status', icon: MessageCircle },
  ];

  const contentTypes: ContentType[] = [
    'Promotional post',
    'Educational post',
    'Product post',
    'Short-video script',
    'Caption',
    'Offer announcement',
    'Customer testimonial template'
  ];

  const handleGenerate = () => {
    if (!incrementAIUsage('content')) return;
    setLoading(true);

    setTimeout(() => {
      if (contentType === 'Short-video script') {
        setContent({
          hook: "3 styling mistakes Pakistani women make with festive velvet suits (and how to fix them)! 🧵",
          caption: `Script:\n[0-3s] Hook: Host points to the camera smiling. 'Stop pairing heavy velvet with dark boring accessories!'\n[4-10s] Problem: Show regular draping vs modern organza pin-up.\n[11-20s] Solution: Present Zahra Pret's ${productService} with hand-stitched detailing.\n[21-30s] Call to Action: 'Grab yours with COD all over Pakistan before wedding season rushes!'`,
          cta: "Drop a 'YES' in the comments or WhatsApp us to get your tailored size guide!",
          hashtags: "#VelvetStyling #PakistaniDresses #ShortsTrend #BoutiqueHacks #ZahraPret",
          visualConcept: "Fast-paced TikTok/Reel cut, trendy upbeat desi lo-fi background music, high-contrast crisp studio lighting."
        });
      } else if (contentType === 'Offer announcement') {
        setContent({
          hook: "🚨 FLASH SALE ALERT: Flat 15% OFF is LIVE now! 🚨",
          caption: `Your wardrobe upgrade just arrived. For 48 hours only, get flat discounts on all ${productService}. Cash on Delivery available from Karachi to Khyber!\n\n🏷️ Code: FESTIVE15\n🚚 Free Shipping over Rs. 5,000`,
          cta: "🛒 Order now via WhatsApp link in bio before sizes sell out!",
          hashtags: "#FlashSalePakistan #SaleAlert #EidPreps #PakistanShopping #ZahraPret",
          visualConcept: "Bold red and gold graphic poster featuring the discount banner with luxury suit lifestyle mockup."
        });
      } else {
        setContent({
          hook: `Can’t decide what to wear this weekend? Let ${business.name} inspire your style! 💫`,
          caption: `Elevate every moment with the timeless grace of ${productService}. Designed specifically for ${targetAudience}.\n\n✨ Offer: ${offer}\n✨ Delivery: Safe COD delivery right to your doorstep anywhere in Pakistan!`,
          cta: "Send us a direct message or click the link in bio to order now.",
          hashtags: `#${business.name.replace(/\s+/g, '')} #DesiFashion #PakistaniTrends #CODOrder #WinterCollection`,
          visualConcept: "Carousel post: Slide 1 - Hero full model shot, Slide 2 - Embroidery texture, Slide 3 - Dupatta draping, Slide 4 - Customer review."
        });
      }

      setLoading(false);
    }, 700);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSaveToTemplates = () => {
    addTemplate({
      title: `${platform} - ${contentType} (${productService})`,
      category: 'Social Media',
      language: 'en',
      content: `${content.hook}\n\n${content.caption}\n\n${content.cta}\n\n${content.hashtags}`,
      tags: [platform, contentType],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            Social Media Content Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate viral hooks, high-retention video scripts, captions, and visual concepts for all Pakistani social channels.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>Generate Fresh Content</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Options (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            {/* Platform Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Target Platform</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setPlatform(p.name)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition ${
                        platform === p.name
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[10px] truncate max-w-full">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              >
                {contentTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Product / Service */}
            <div>
              <label className="block text-xs font-bold text-slate-700">Product / Service</label>
              <input
                type="text"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="e.g. Royal Embroidered Velvet 3-Piece"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Pakistani women looking for festive wedding pret"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Offer / Promotion */}
            <div>
              <label className="block text-xs font-bold text-slate-700">Offer / Promotion</label>
              <input
                type="text"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g. 15% off with code FESTIVE15 + Free COD"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-bold text-slate-700">Tone</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Exciting, Luxurious, Friendly, Urgent"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Generate Content Campaign</span>
            </button>
          </div>
        </div>

        {/* Right Output Generated Elements (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  {platform}
                </span>
                <span className="text-xs font-semibold text-slate-500">{contentType}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{isEditing ? 'Done' : 'Edit'}</span>
                </button>
                <button
                  onClick={handleSaveToTemplates}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => handleCopy(`${content.hook}\n\n${content.caption}\n\n${content.cta}\n\n${content.hashtags}`, 'all')}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  {copiedItem === 'all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedItem === 'all' ? 'Copied All!' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Post saved to your business template library!</span>
              </div>
            )}

            {/* Hook */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">1. Attention Hook</span>
                <button
                  onClick={() => handleCopy(content.hook, 'hook')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copiedItem === 'hook' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedItem === 'hook' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={content.hook}
                  onChange={(e) => setContent({ ...content, hook: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none"
                />
              ) : (
                <p className="text-sm font-bold text-slate-900">{content.hook}</p>
              )}
            </div>

            {/* Caption / Script */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">2. Caption / Script Body</span>
                <button
                  onClick={() => handleCopy(content.caption, 'cap')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copiedItem === 'cap' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedItem === 'cap' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              {isEditing ? (
                <textarea
                  rows={5}
                  value={content.caption}
                  onChange={(e) => setContent({ ...content, caption: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">{content.caption}</p>
              )}
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">3. Call to Action (CTA)</span>
                <button
                  onClick={() => handleCopy(content.cta, 'cta')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copiedItem === 'cta' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedItem === 'cta' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={content.cta}
                  onChange={(e) => setContent({ ...content, cta: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none"
                />
              ) : (
                <p className="text-xs font-semibold text-emerald-900">{content.cta}</p>
              )}
            </div>

            {/* Hashtags */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">4. High-Reach Hashtags</span>
                <button
                  onClick={() => handleCopy(content.hashtags, 'hash')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copiedItem === 'hash' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedItem === 'hash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-mono text-xs text-slate-600">{content.hashtags}</p>
            </div>

            {/* Visual Concept */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">5. Recommended Visual / Video Concept</span>
              <p className="text-xs text-purple-950 leading-relaxed">{content.visualConcept}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
