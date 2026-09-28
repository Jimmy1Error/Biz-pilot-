import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw, 
  Bookmark, 
  Send, 
  Layers, 
  MessageCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Language } from '../../types/index.ts';

type ToneOption = 'Professional' | 'Friendly' | 'Short' | 'Persuasive' | 'Apologetic';

export const CustomerReplyTab: React.FC = () => {
  const { 
    business, 
    products, 
    knowledge, 
    language, 
    setLanguage, 
    addTemplate, 
    incrementAIUsage,
    setActiveTab 
  } = useApp();

  const [customerMessage, setCustomerMessage] = useState(
    'Assalam-o-Alaikum, is the Royal Velvet 3-Piece suit available? What is the price and how much are delivery charges to Multan on Cash on Delivery?'
  );
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.name || '');
  const [selectedPolicy, setSelectedPolicy] = useState('Standard shipping Rs. 250 with COD across Pakistan. 7-day exchange.');
  const [selectedTone, setSelectedTone] = useState<ToneOption>('Friendly');
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Generated outputs: Recommended, Short, Detailed
  const [replies, setReplies] = useState<{
    recommended: string;
    short: string;
    detailed: string;
  }>({
    recommended: `Walaikum Assalam! Yes, the ${products[0]?.name || 'Royal Velvet 3-Piece'} is currently in stock in standard sizes. The price is Rs. 12,500. Standard delivery to Multan is Rs. 250 with safe Cash on Delivery (COD) via TCS within 2-4 working days. Would you like me to book your parcel today?`,
    short: `Walaikum Assalam! Yes, it is in stock for Rs. 12,500. Delivery to Multan is Rs. 250 with Cash on Delivery. Should we book your order?`,
    detailed: `Walaikum Assalam! Thank you for reaching out to Zahra Pret. The ${products[0]?.name || 'Royal Velvet 3-Piece'} is available. Price is Rs. 12,500 (micro-velvet embroidered shirt, organza dupatta & trousers). We offer Cash on Delivery to Multan for Rs. 250, taking 2 to 4 business days. We also provide a 7-day hassle-free exchange warranty. Please share your complete delivery address and phone number to reserve your suit today!`
  });

  const tones: ToneOption[] = ['Professional', 'Friendly', 'Short', 'Persuasive', 'Apologetic'];

  const handleGenerate = () => {
    if (!customerMessage.trim()) return;
    if (!incrementAIUsage('reply')) return;

    setLoading(true);

    setTimeout(() => {
      // Craft response based on tone, language and products
      const prodName = selectedProduct || 'item';
      const isUrdu = language === 'ur';
      const isHinglish = language === 'hinglish';

      let rec = '';
      let sh = '';
      let det = '';

      if (isUrdu) {
        rec = `وعلیکم السلام! شکریہ ہم سے رابطہ کرنے کا۔ ${prodName} اس وقت دستیاب ہے۔ کیش آن ڈیلیوری کی سہولت پورے پاکستان میں موجود ہے۔ ڈیلیوری 2 سے 4 دن میں ہوگی۔ کیا ہم آپ کا آرڈر بک کر لیں؟`;
        sh = `وعلیکم السلام! جی بالکل دستیاب ہے کیش آن ڈیلیوری کے ساتھ۔ آپ کا آرڈر بک کر لیں؟`;
        det = `وعلیکم السلام! زہرا پریٹ میں خوش آمدید۔ ${prodName} مکمل کوالٹی اور گارنٹی کے ساتھ دستیاب ہے۔ کیش آن ڈیلیوری ملتان سمیت پورے پاکستان میں دستیاب ہے۔ ہمارا 7 دن کا آسان ایکسچینج پالیسی بھی ہے۔ اپنا مکمل پتہ اور فون نمبر بھیج دیں تاکہ ہم آج ہی پارسل روانہ کر سکیں۔`;
      } else if (isHinglish) {
        if (selectedTone === 'Apologetic') {
          rec = `Walaikum Assalam! Bohat maazrat ke apko takleef hui. Hum apke order ki courier tracking check kar rahe hain aur InshaAllah aj sham tak parcel deliver karwayenge. Shukriya apke sabr ka!`;
          sh = `Walaikum Assalam! Delay ke liye maazrat, aj parcel deliver ho jayega InshaAllah.`;
          det = `Walaikum Assalam! Zahra Pret ki taraf se dili maazrat. TCS/Leopards rider se rabta ho chuka hai aur unhon ne priority delivery ka bola hai. Hum musalsal track kar rahe hain. Kisi bhi mazeed sawal ke liye hum 24/7 hazir hain.`;
        } else {
          rec = `Walaikum Assalam! Shukriya Zahra Pret se rabta karne ka. ${prodName} bilkul in-stock hai. Poore Pakistan mein Cash on Delivery (COD) available hai sirf Rs. 250 delivery charges ke sath. Kya apka order confirm kar dein?`;
          sh = `Walaikum Assalam! In-stock hai with COD. Kya parcel dispatch kar dein?`;
          det = `Walaikum Assalam! Ji bilkul, ${prodName} available hai with 100% genuine fabric. Delivery 2 se 4 din mein ho jayegi aur 7 din ka exchange policy bhi hai. Apna naam, city, aur complete shipping address share kar dein please!`;
        }
      } else {
        if (selectedTone === 'Professional') {
          rec = `Dear Customer, thank you for contacting ${business.name}. Regarding your query on ${prodName}, the item is available for immediate dispatch. We support Cash on Delivery across Pakistan. Please provide your shipping details to proceed.`;
          sh = `Thank you for your inquiry. The item is available with Cash on Delivery. Would you like to confirm the booking?`;
          det = `Dear Customer, thank you for reaching out to ${business.name}. The ${prodName} is currently available in our inventory. As per our store policy, standard delivery takes 2-4 business days via verified courier services with full Cash on Delivery (COD) support. Furthermore, all orders are covered under our 7-day exchange window. Kindly provide your recipient name, address, and mobile number.`;
        } else if (selectedTone === 'Apologetic') {
          rec = `Assalam-o-Alaikum, we sincerely apologize for the inconvenience caused. We have escalated this issue with our courier partners immediately to ensure your satisfaction. Thank you for your patience!`;
          sh = `We apologize for the delay and are resolving it right now. Thank you for your patience!`;
          det = `Assalam-o-Alaikum, thank you for bringing this to our attention. At ${business.name}, customer satisfaction is our top priority, and we deeply regret this delay. We are actively in touch with the courier operations hub to prioritize your delivery today. If you need any immediate assistance, our management team is on standby.`;
        } else {
          rec = `Assalam-o-Alaikum! Thank you for reaching out to ${business.name}. Yes, the ${prodName} is in stock. Delivery is available with Cash on Delivery across Pakistan. Would you like us to prepare your order?`;
          sh = `Assalam-o-Alaikum! Yes, in stock with Cash on Delivery. Should we book your order?`;
          det = `Assalam-o-Alaikum! Thank you for checking with ${business.name}. The ${prodName} is available in our boutique stock with high quality craftsmanship. We dispatch via courier with Cash on Delivery (COD). All orders feature a 7-day exchange guarantee. Please share your delivery address and contact number so we can ship today!`;
        }
      }

      setReplies({ recommended: rec, short: sh, detailed: det });
      setLoading(false);
    }, 600);
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveAsTemplate = (text: string) => {
    addTemplate({
      title: `${selectedTone} Customer Reply (${selectedProduct})`,
      category: 'Customer Support',
      language,
      content: text,
      tags: ['WhatsApp', selectedTone, language],
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
            <MessageSquareQuote className="h-6 w-6 text-emerald-600" />
            Customer Reply Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate high-converting, accurate customer responses aligned with your real products and policies.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Language:</span>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                language === 'ur' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                language === 'hinglish' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Inputs (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Customer Message / Inquiry</label>
              <textarea
                rows={3}
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                placeholder="Paste customer WhatsApp message, DM, or inquiry..."
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Product / Service Referenced</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              >
                <option value="">General Store Inquiry (No Specific Product)</option>
                {products.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name} — Rs. {p.price.toLocaleString()} ({p.availability})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Business Policy to Apply</label>
              <textarea
                rows={2}
                value={selectedPolicy}
                onChange={(e) => setSelectedPolicy(e.target.value)}
                placeholder="Delivery charges, exchange window, COD details..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Response Tone</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={`rounded-xl border py-2 text-center text-xs font-bold transition ${
                      selectedTone === t 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !customerMessage.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Generate 3 Reply Variations</span>
            </button>

            {savedSuccess && (
              <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Saved to your Business Template Library!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Outputs: 3 variations (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Variation 1: Recommended */}
          <div className="rounded-3xl border border-emerald-300 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Recommended Choice
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="font-bold text-xs text-slate-900">Balanced & Friendly Response</span>
              <span className="text-[11px] text-slate-400">• Tone: {selectedTone}</span>
            </div>

            <div className={`rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-xs sm:text-sm leading-relaxed text-slate-800 font-normal ${
              language === 'ur' ? 'urdu-text' : ''
            }`}>
              {replies.recommended}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(replies.recommended, 'rec')}
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                >
                  {copiedSection === 'rec' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSection === 'rec' ? 'Copied' : 'Copy Response'}</span>
                </button>

                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveAsTemplate(replies.recommended)}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                  <span>Save as Template</span>
                </button>
              </div>
            </div>
          </div>

          {/* Variation 2: Short / Rapid */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Short & Crisp (WhatsApp Fast Reply)</span>
                <span className="text-[11px] text-slate-400">• For quick chats</span>
              </div>

              <button
                onClick={() => handleCopy(replies.short, 'short')}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copiedSection === 'short' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSection === 'short' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 leading-relaxed ${
              language === 'ur' ? 'urdu-text' : ''
            }`}>
              {replies.short}
            </div>
          </div>

          {/* Variation 3: Detailed / Policy */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Detailed & Formal (All Policies & Warranties)</span>
                <span className="text-[11px] text-slate-400">• High-value leads</span>
              </div>

              <button
                onClick={() => handleCopy(replies.detailed, 'det')}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copiedSection === 'det' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSection === 'det' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 leading-relaxed whitespace-pre-line ${
              language === 'ur' ? 'urdu-text' : ''
            }`}>
              {replies.detailed}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
