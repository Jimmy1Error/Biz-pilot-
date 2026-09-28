export type Language = 'en' | 'ur' | 'hinglish';

export type UserRole = 'user' | 'support_admin' | 'super_admin';

export type SubscriptionPlan = 'FREE' | 'STARTER' | 'BUSINESS' | 'PRO';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  name: string;
  businessType: string; // e.g. "Clothing Store", "Salon", "Online Retail", "Restaurant", "Freelance Agency"
  country: string; // Default: "Pakistan"
  city: string; // Default: "Lahore"
  currency: string; // Default: "PKR"
  language: Language;
  description: string;
  contactPhone: string;
  contactEmail: string;
  address?: string;
  logoUrl?: string;
  policies?: {
    deliveryTime?: string;
    deliveryCharges?: string;
    returnPolicy?: string;
    paymentMethods?: string;
  };
}

export interface UsageQuota {
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  contentGenerationsUsed: number;
  contentGenerationsLimit: number;
  customerRepliesUsed: number;
  customerRepliesLimit: number;
  leadsStored: number;
  leadsLimit: number;
  reportsGenerated: number;
  reportsLimit: number;
  billingCycleEnd: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Negotiating' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  businessId: string;
  customerName: string;
  phone: string;
  email?: string;
  source: string; // 'WhatsApp' | 'Instagram' | 'Facebook' | 'Walk-in' | 'Website' | 'Referral';
  productInterest: string;
  status: LeadStatus;
  notes: string;
  estimatedValue?: number;
  createdAt: string;
  lastInteraction: string;
  followUpDate?: string;
}

export type FollowUpStatus = 'Pending' | 'Completed' | 'Skipped';

export interface FollowUp {
  id: string;
  businessId: string;
  customerName: string;
  customerPhone?: string;
  leadId?: string;
  date: string;
  time: string;
  reminderNote: string;
  messageDraft: string;
  status: FollowUpStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ProductItem {
  id: string;
  businessId: string;
  name: string;
  sku?: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre-order';
  features: string[];
  notes?: string;
  imageUrl?: string;
}

export interface KnowledgeItem {
  id: string;
  businessId: string;
  category: 'FAQ' | 'Policy' | 'Pricing' | 'Delivery' | 'General' | 'Refund';
  question: string;
  answer: string;
  updatedAt: string;
}

export interface BusinessTemplate {
  id: string;
  businessId: string;
  category: 'Customer Support' | 'Sales' | 'Follow-up' | 'Promotions' | 'Social Media' | 'Product Description';
  title: string;
  language: Language;
  content: string;
  tags: string[];
}

export interface NotificationItem {
  id: string;
  type: 'followup' | 'lead' | 'usage' | 'subscription' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  linkTab?: string;
}

export interface AIIntentResult {
  intent: string;
  toolUsed: string;
  suggestedOutput: string;
  shortOutput?: string;
  detailedOutput?: string;
  structuredDetails?: {
    hook?: string;
    caption?: string;
    cta?: string;
    hashtags?: string[];
    visualConcept?: string;
  };
  language: Language;
  disclaimer?: string;
}

export type NavTab = 
  | 'dashboard'
  | 'ai-worker'
  | 'customer-reply'
  | 'content-studio'
  | 'leads'
  | 'follow-ups'
  | 'products'
  | 'reports'
  | 'knowledge'
  | 'templates'
  | 'subscription'
  | 'admin'
  | 'settings';
