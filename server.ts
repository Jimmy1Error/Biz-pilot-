import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing with size limiting
app.use(express.json({ limit: '1mb' }));

// Simple in-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 req/min

const rateLimiter = (req: Request, res: Response, next: () => void) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests. Please slow down.',
    });
  }

  entry.count += 1;
  next();
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BizPilot AI Backend', timestamp: new Date().toISOString() });
});

// AI Worker Orchestration Endpoint
app.post('/api/ai/worker', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { prompt, language = 'en', businessProfile, knowledge = [], products = [], context = {} } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be text.' });
    }

    // Truncate input to avoid runaway token costs
    const safePrompt = prompt.slice(0, 1500);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if API key is not configured in local environment
      return res.json({
        intent: 'General Business Assistant',
        toolUsed: 'general_business_assistant',
        suggestedOutput: `Assalam-o-Alaikum! Received your request for "${safePrompt}". (Local mode active: Configure GEMINI_API_KEY in your environment for live LLM responses).`,
        language,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format grounded business context
    const storeName = businessProfile?.name || 'Pakistani Retail Business';
    const storeType = businessProfile?.businessType || 'Retail Store';
    const storeCity = businessProfile?.city || 'Lahore';
    const storeCurrency = businessProfile?.currency || 'PKR';

    const policySummary = businessProfile?.policies 
      ? `Delivery: ${businessProfile.policies.deliveryCharges || 'Rs 250 with COD'}. Return: ${businessProfile.policies.returnPolicy || '7-day exchange'}.`
      : 'Cash on delivery available across Pakistan.';

    const knowledgeList = knowledge.map((k: any) => `Q: ${k.question} -> A: ${k.answer}`).join('\n');
    const productList = products.map((p: any) => `${p.name} (PKR ${p.price}): ${p.description || ''} [${p.availability}]`).join('\n');

    const systemInstruction = `You are BizPilot AI, an autonomous digital business worker specifically built for Pakistani businesses, solo entrepreneurs, retail shops, salons, and online sellers.
Business Context:
- Store: ${storeName} (${storeType} in ${storeCity}, Pakistan)
- Currency: ${storeCurrency} (PKR)
- Store Policies: ${policySummary}
- Verified Knowledge:
${knowledgeList}
- Catalog Products:
${productList}

Rules:
1. Always route to one of these internal tools:
   - customer_reply()
   - generate_social_content()
   - generate_product_description()
   - create_follow_up()
   - create_business_report()
   - lead_summary()
   - marketing_campaign()
   - general_business_assistant()
2. Language Support:
   - If language is 'ur', reply in natural Urdu script.
   - If language is 'hinglish', reply in fluent Pakistani Roman Urdu (e.g. "Assalam-o-Alaikum, delivery charges Rs. 250 hain Cash on Delivery ke sath...").
   - If language is 'en', reply in clear, professional English with respectful Pakistani business etiquette ("Assalam-o-Alaikum").
3. NEVER fabricate prices, availability, or return policies not listed in the context.
4. NEVER claim that an external message was dispatched. Always present the output as a draft ready for the user to review or copy.
5. Return JSON format:
{
  "intent": "Short Intent Name (e.g. Customer Support Reply, Festive Campaign)",
  "toolUsed": "name of internal tool",
  "suggestedOutput": "The complete message or content ready to use",
  "shortOutput": "optional quick one-liner",
  "detailedOutput": "optional detailed version",
  "disclaimer": "Safety note"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: safePrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    });

    const textOutput = response.text?.trim() || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(textOutput);
    } catch {
      parsedResult = {
        intent: 'AI Business Output',
        toolUsed: 'general_business_assistant',
        suggestedOutput: textOutput,
      };
    }

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('AI Worker error:', error?.message);
    // Never expose stack trace or secret keys
    return res.status(500).json({
      error: 'An error occurred while processing the AI request. Please try again.',
    });
  }
});

// Setup Vite middlewares in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BizPilot AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
