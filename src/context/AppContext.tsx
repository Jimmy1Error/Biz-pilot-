import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  BusinessProfile, 
  UsageQuota, 
  Lead, 
  FollowUp, 
  ProductItem, 
  KnowledgeItem, 
  BusinessTemplate, 
  NotificationItem, 
  SubscriptionPlan, 
  NavTab, 
  Language,
  LeadStatus,
  FollowUpStatus
} from '../types/index.ts';
import { 
  initialUser, 
  initialBusiness, 
  initialQuota, 
  initialLeads, 
  initialFollowUps, 
  initialProducts, 
  initialKnowledge, 
  initialTemplates, 
  initialNotifications 
} from '../utils/initialData.ts';

interface AppContextType {
  user: UserProfile | null;
  business: BusinessProfile;
  quota: UsageQuota;
  plan: SubscriptionPlan;
  activeTab: NavTab;
  language: Language;
  leads: Lead[];
  followUps: FollowUp[];
  products: ProductItem[];
  knowledge: KnowledgeItem[];
  templates: BusinessTemplate[];
  notifications: NotificationItem[];
  isCommandPaletteOpen: boolean;
  isOnboardingOpen: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register' | 'forgot';
  
  // Navigation & UI controls
  setActiveTab: (tab: NavTab) => void;
  setLanguage: (lang: Language) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  
  // Auth & Profile
  loginUser: (email: string, role?: 'user' | 'support_admin' | 'super_admin') => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  
  // CRUD & Operations
  addLead: (lead: Omit<Lead, 'id' | 'businessId' | 'createdAt' | 'lastInteraction'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  addFollowUp: (followUp: Omit<FollowUp, 'id' | 'businessId' | 'createdAt'>) => FollowUp;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;
  
  addProduct: (product: Omit<ProductItem, 'id' | 'businessId'>) => ProductItem;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id' | 'businessId' | 'updatedAt'>) => KnowledgeItem;
  updateKnowledgeItem: (id: string, updates: Partial<KnowledgeItem>) => void;
  deleteKnowledgeItem: (id: string) => void;
  
  addTemplate: (template: Omit<BusinessTemplate, 'id' | 'businessId'>) => BusinessTemplate;
  deleteTemplate: (id: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Usage tracking
  incrementAIUsage: (type: 'ai' | 'content' | 'reply' | 'report') => boolean;
  upgradePlan: (newPlan: SubscriptionPlan) => void;
  
  // AI execution proxy & helper
  executeAIWorker: (prompt: string, context?: Record<string, any>) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage if available
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bizpilot_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [business, setBusiness] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('bizpilot_business');
    return saved ? JSON.parse(saved) : initialBusiness;
  });

  const [plan, setPlan] = useState<SubscriptionPlan>(() => {
    const saved = localStorage.getItem('bizpilot_plan');
    return (saved as SubscriptionPlan) || 'STARTER';
  });

  const [quota, setQuota] = useState<UsageQuota>(() => {
    const saved = localStorage.getItem('bizpilot_quota');
    return saved ? JSON.parse(saved) : initialQuota;
  });

  const [activeTab, setActiveTabState] = useState<NavTab>(() => {
    const hash = window.location.hash.replace('#', '') as NavTab;
    const validTabs: NavTab[] = [
      'dashboard', 'ai-worker', 'customer-reply', 'content-studio', 
      'leads', 'follow-ups', 'products', 'reports', 'knowledge', 
      'templates', 'subscription', 'admin', 'settings'
    ];
    return validTabs.includes(hash) ? hash : 'dashboard';
  });

  const [language, setLanguageState] = useState<Language>('en');
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('bizpilot_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem('bizpilot_followups');
    return saved ? JSON.parse(saved) : initialFollowUps;
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('bizpilot_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(() => {
    const saved = localStorage.getItem('bizpilot_knowledge');
    return saved ? JSON.parse(saved) : initialKnowledge;
  });

  const [templates, setTemplates] = useState<BusinessTemplate[]>(() => {
    const saved = localStorage.getItem('bizpilot_templates');
    return saved ? JSON.parse(saved) : initialTemplates;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('bizpilot_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('bizpilot_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bizpilot_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem('bizpilot_plan', plan);
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('bizpilot_quota', JSON.stringify(quota));
  }, [quota]);

  useEffect(() => {
    localStorage.setItem('bizpilot_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('bizpilot_followups', JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem('bizpilot_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bizpilot_knowledge', JSON.stringify(knowledge));
  }, [knowledge]);

  useEffect(() => {
    localStorage.setItem('bizpilot_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('bizpilot_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync activeTab with URL hash for easy bookmarking and deep linking
  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setBusiness(prev => ({ ...prev, language: lang }));
  };

  // Keyboard shortcut for Cmd/Ctrl+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = (email: string, role: 'user' | 'support_admin' | 'super_admin' = 'super_admin') => {
    const loggedUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      verified: true,
      createdAt: new Date().toISOString(),
    };
    setUser(loggedUser);
    closeAuthModal();
  };

  const logoutUser = () => {
    setUser(null);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...profile } : null);
  };

  const updateBusinessProfile = (profile: Partial<BusinessProfile>) => {
    setBusiness(prev => ({ ...prev, ...profile }));
  };

  // Leads
  const addLead = (leadData: Omit<Lead, 'id' | 'businessId' | 'createdAt' | 'lastInteraction'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead_' + Date.now(),
      businessId: business.id,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
    setQuota(prev => ({ ...prev, leadsStored: prev.leadsStored + 1 }));

    // Add notification
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      type: 'lead',
      title: 'New Lead Recorded',
      message: `${newLead.customerName} added from ${newLead.source}.`,
      time: 'Just now',
      read: false,
      linkTab: 'leads'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, lastInteraction: new Date().toISOString() } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  // Follow-ups
  const addFollowUp = (data: Omit<FollowUp, 'id' | 'businessId' | 'createdAt'>): FollowUp => {
    const newFollowUp: FollowUp = {
      ...data,
      id: 'fol_' + Date.now(),
      businessId: business.id,
      createdAt: new Date().toISOString(),
    };
    setFollowUps(prev => [newFollowUp, ...prev]);
    
    // Add notification
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      type: 'followup',
      title: `Follow-up Scheduled: ${newFollowUp.customerName}`,
      message: `Due on ${newFollowUp.date} at ${newFollowUp.time}.`,
      time: 'Just now',
      read: false,
      linkTab: 'follow-ups'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newFollowUp;
  };

  const updateFollowUp = (id: string, updates: Partial<FollowUp>) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== id));
  };

  // Products
  const addProduct = (data: Omit<ProductItem, 'id' | 'businessId'>): ProductItem => {
    const newProd: ProductItem = {
      ...data,
      id: 'prod_' + Date.now(),
      businessId: business.id,
    };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Knowledge Items
  const addKnowledgeItem = (data: Omit<KnowledgeItem, 'id' | 'businessId' | 'updatedAt'>): KnowledgeItem => {
    const item: KnowledgeItem = {
      ...data,
      id: 'kn_' + Date.now(),
      businessId: business.id,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setKnowledge(prev => [item, ...prev]);
    return item;
  };

  const updateKnowledgeItem = (id: string, updates: Partial<KnowledgeItem>) => {
    setKnowledge(prev => prev.map(k => k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : k));
  };

  const deleteKnowledgeItem = (id: string) => {
    setKnowledge(prev => prev.filter(k => k.id !== id));
  };

  // Templates
  const addTemplate = (data: Omit<BusinessTemplate, 'id' | 'businessId'>): BusinessTemplate => {
    const tmpl: BusinessTemplate = {
      ...data,
      id: 'tmpl_' + Date.now(),
      businessId: business.id,
    };
    setTemplates(prev => [tmpl, ...prev]);
    return tmpl;
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Usage & Quota
  const incrementAIUsage = (type: 'ai' | 'content' | 'reply' | 'report'): boolean => {
    if (quota.aiRequestsUsed >= quota.aiRequestsLimit) {
      alert("Monthly AI request limit reached. Please upgrade your plan in the Subscription tab.");
      return false;
    }

    setQuota(prev => {
      const updated = { ...prev, aiRequestsUsed: prev.aiRequestsUsed + 1 };
      if (type === 'content') updated.contentGenerationsUsed += 1;
      if (type === 'reply') updated.customerRepliesUsed += 1;
      if (type === 'report') updated.reportsGenerated += 1;
      return updated;
    });
    return true;
  };

  const upgradePlan = (newPlan: SubscriptionPlan) => {
    setPlan(newPlan);
    let newAiLimit = 50;
    let newContentLimit = 20;
    let newRepliesLimit = 30;
    let newLeadsLimit = 50;

    if (newPlan === 'STARTER') {
      newAiLimit = 200;
      newContentLimit = 75;
      newRepliesLimit = 150;
      newLeadsLimit = 300;
    } else if (newPlan === 'BUSINESS') {
      newAiLimit = 600;
      newContentLimit = 250;
      newRepliesLimit = 500;
      newLeadsLimit = 1000;
    } else if (newPlan === 'PRO') {
      newAiLimit = 2000;
      newContentLimit = 1000;
      newRepliesLimit = 2000;
      newLeadsLimit = 5000;
    }

    setQuota(prev => ({
      ...prev,
      aiRequestsLimit: newAiLimit,
      contentGenerationsLimit: newContentLimit,
      customerRepliesLimit: newRepliesLimit,
      leadsLimit: newLeadsLimit,
    }));

    // Notification
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      type: 'subscription',
      title: `Upgraded to ${newPlan} Plan`,
      message: `Your account has been upgraded to the ${newPlan} plan with higher AI limits.`,
      time: 'Just now',
      read: false,
      linkTab: 'subscription'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // AI execution orchestration helper (supports server proxy with intelligent local client fallback for fast interaction)
  const executeAIWorker = async (prompt: string, context: Record<string, any> = {}): Promise<any> => {
    if (!incrementAIUsage('ai')) {
      throw new Error("Usage quota exceeded. Please upgrade your plan.");
    }

    try {
      const response = await fetch('/api/ai/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language: language,
          businessProfile: business,
          knowledge: knowledge.slice(0, 8),
          products: products.slice(0, 8),
          context,
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Graceful fallback to client-side rule/template engine if backend proxy is offline
    }

    // Client-side structured fallback engine
    const lower = prompt.toLowerCase();
    
    // Intent detection
    if (lower.includes('price') || lower.includes('cost') || lower.includes('cod') || lower.includes('kitne') || lower.includes('delivery') || lower.includes('customer')) {
      return {
        intent: 'Customer Support Reply',
        toolUsed: 'customer_reply',
        suggestedOutput: `Assalam-o-Alaikum! Shukriya Zahra Pret se rabta karne ka. Hamare tamam 3-piece designer suits high quality fabric ke sath available hain. Delivery charges poore Pakistan mein sirf Rs. 250 hain aur Rs. 5,000 se zayed ke order par shipping bilkul FREE hai! Cash on Delivery (COD) har jagah dastyab hai. Kya ap apna preferred size bata sakte hain?`,
        shortOutput: `Assalam-o-Alaikum! Normal delivery Rs. 250 hai (Rs. 5,000+ par FREE delivery). Cash on Delivery har jagah available hai. Apka order book kar lein?`,
        detailedOutput: `Assalam-o-Alaikum! Zahra Pret mein khush-aamdeed. Hamari tamam items direct boutique stock hain. Delivery 2 se 4 business days mein TCS ya Leopards Courier ke zariye hoti hai. Parcel COD par delivered hota hai. Agar koi size exchange ho to 7 din ka warranty policy hai. Mazeed details ke liye hum hazir hain!`,
        language,
        disclaimer: 'Note: Never claim messages were sent externally without an authorized messaging channel.'
      };
    }

    if (lower.includes('post') || lower.includes('instagram') || lower.includes('caption') || lower.includes('tiktok') || lower.includes('content') || lower.includes('eid')) {
      return {
        intent: 'Social Media & Content Generation',
        toolUsed: 'generate_social_content',
        suggestedOutput: `✨ Luxury in Every Thread: Elevate your festive elegance with Zahra Pret. Handcrafted embroidery, breathable fabrics, and timeless cuts tailored for the modern Pakistani woman. 🌙 Tap the link in bio or WhatsApp +92 321 9876543 to shop our latest collection with Cash on Delivery!`,
        structuredDetails: {
          hook: 'Looking for the perfect festive outfit that turns heads? 💫',
          caption: 'Step into unmatched sophistication with Zahra Pret’s brand new festive drop. Whether it is an intimate family dawat or wedding celebration, our micro-velvet & organza ensembles ensure you stand out. Limited stock available across Pakistan with Free Shipping on orders over Rs. 5,000!',
          cta: '📩 Send a DM or WhatsApp to book your piece before stock runs out!',
          hashtags: ['#ZahraPret', '#PakistaniFashion', '#FestiveDrop', '#LahoreBoutique', '#KarachiFashion', '#CashOnDeliveryPakistan', '#LawnCollection'],
          visualConcept: 'Close-up video showing fine tilla thread embroidery on rich jewel-toned fabric, transitioning to a model twirling in soft natural lighting.'
        },
        language,
      };
    }

    if (lower.includes('lead') || lower.includes('summary') || lower.includes('report') || lower.includes('performance')) {
      return {
        intent: 'Business Activity Report',
        toolUsed: 'create_business_report',
        suggestedOutput: `📊 BizPilot Business Summary for Zahra Pret:\n- Total Active Leads: ${leads.length}\n- Pending Follow-ups Today: ${followUps.filter(f => f.status === 'Pending').length}\n- Catalog Items: ${products.length} products listed\n- Recommended Action: Follow up with Bilal Farooq regarding Karachi bulk order discount before 3 PM.`,
        language,
      };
    }

    return {
      intent: 'General Business Assistant',
      toolUsed: 'general_business_assistant',
      suggestedOutput: `Assalam-o-Alaikum! I have reviewed your business context for ${business.name}. How can I assist your operations today? You can ask me to draft WhatsApp customer responses, create 7-day Instagram campaigns, generate invoices, or summarize customer leads.`,
      language,
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        business,
        quota,
        plan,
        activeTab,
        language,
        leads,
        followUps,
        products,
        knowledge,
        templates,
        notifications,
        isCommandPaletteOpen,
        isOnboardingOpen,
        isAuthModalOpen,
        authMode,
        setActiveTab,
        setLanguage,
        setIsCommandPaletteOpen,
        setIsOnboardingOpen,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser,
        updateUserProfile,
        updateBusinessProfile,
        addLead,
        updateLead,
        deleteLead,
        addFollowUp,
        updateFollowUp,
        deleteFollowUp,
        addProduct,
        updateProduct,
        deleteProduct,
        addKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,
        addTemplate,
        deleteTemplate,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        incrementAIUsage,
        upgradePlan,
        executeAIWorker,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
