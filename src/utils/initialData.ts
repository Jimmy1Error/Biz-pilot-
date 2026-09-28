import { BusinessProfile, BusinessTemplate, FollowUp, KnowledgeItem, Lead, NotificationItem, ProductItem, SubscriptionPlan, UsageQuota, UserProfile } from '../types/index.ts';

export const initialUser: UserProfile = {
  id: 'usr_pak_01',
  name: 'Kashif Mehmood',
  email: 'kashif@kashifgarments.pk',
  role: 'super_admin', // Enables test admin toggle in settings/header
  phone: '+92 300 1234567',
  verified: true,
  createdAt: '2025-01-15T08:00:00Z',
};

export const initialBusiness: BusinessProfile = {
  id: 'biz_01',
  userId: 'usr_pak_01',
  name: 'Zahra Pret & Textiles',
  businessType: 'Boutique & Online Apparel',
  country: 'Pakistan',
  city: 'Lahore',
  currency: 'PKR',
  language: 'en',
  description: 'Premium pret-a-porter, lawn collection, unstitched party suits, and festive wedding collections for women across Pakistan and overseas.',
  contactPhone: '+92 321 9876543',
  contactEmail: 'orders@zahrapret.pk',
  address: 'Shop 14, Xinhua Mall, Gulberg III, Lahore, Pakistan',
  policies: {
    deliveryTime: '2-4 business days for major cities (Karachi, Lahore, Islamabad), 4-6 days for rest of Pakistan.',
    deliveryCharges: 'Standard shipping Rs. 250 across Pakistan. Free shipping on orders above Rs. 5,000.',
    returnPolicy: '7-day easy exchange for unworn items with original tags. Unstitched fabric once cut cannot be returned.',
    paymentMethods: 'Cash on Delivery (COD), JazzCash, EasyPaisa, Bank Transfer (Meezan/HBL), and Credit/Debit Cards.',
  }
};

export const initialQuota: UsageQuota = {
  aiRequestsUsed: 38,
  aiRequestsLimit: 150,
  contentGenerationsUsed: 14,
  contentGenerationsLimit: 50,
  customerRepliesUsed: 22,
  customerRepliesLimit: 100,
  leadsStored: 18,
  leadsLimit: 250,
  reportsGenerated: 4,
  reportsLimit: 20,
  billingCycleEnd: '2026-10-31',
};

export const initialLeads: Lead[] = [
  {
    id: 'lead_1',
    businessId: 'biz_01',
    customerName: 'Ayesha Khan',
    phone: '+92 301 4455667',
    email: 'ayesha.k@gmail.com',
    source: 'WhatsApp',
    productInterest: 'Embroidered Velvet 3-Piece Suite',
    status: 'Interested',
    notes: 'Asked about size Medium measurements and COD to Peshawar.',
    estimatedValue: 12500,
    createdAt: '2026-09-27T10:15:00Z',
    lastInteraction: '2026-09-28T03:30:00Z',
    followUpDate: '2026-09-29',
  },
  {
    id: 'lead_2',
    businessId: 'biz_01',
    customerName: 'Bilal Farooq',
    phone: '+92 322 8899112',
    email: 'bilal.f@yahoo.com',
    source: 'Instagram',
    productInterest: 'Kurta Shalwar Gift Set (Mens)',
    status: 'Negotiating',
    notes: 'Wants bulk order of 5 sets for family wedding in Karachi. Negotiating 10% discount.',
    estimatedValue: 24000,
    createdAt: '2026-09-26T14:20:00Z',
    lastInteraction: '2026-09-27T16:45:00Z',
    followUpDate: '2026-09-28',
  },
  {
    id: 'lead_3',
    businessId: 'biz_01',
    customerName: 'Fatima Noor',
    phone: '+92 333 7712345',
    source: 'Facebook',
    productInterest: 'Festive Chiffon Dupatta & Shirt',
    status: 'Won',
    notes: 'Order confirmed! Paid advance via EasyPaisa. Dispatched with TCS tracking #77412.',
    estimatedValue: 8900,
    createdAt: '2026-09-25T11:00:00Z',
    lastInteraction: '2026-09-27T09:00:00Z',
  },
  {
    id: 'lead_4',
    businessId: 'biz_01',
    customerName: 'Mariam Tariq',
    phone: '+92 345 5556789',
    source: 'WhatsApp',
    productInterest: 'Lawn Summer Digital Print Set',
    status: 'New',
    notes: 'Sent price query message at 2 AM. Needs reply with catalogue link.',
    estimatedValue: 5500,
    createdAt: '2026-09-28T04:10:00Z',
    lastInteraction: '2026-09-28T04:10:00Z',
    followUpDate: '2026-09-28',
  },
  {
    id: 'lead_5',
    businessId: 'biz_01',
    customerName: 'Zainab Siddiqui',
    phone: '+92 300 9988776',
    source: 'Walk-in',
    productInterest: 'Bridal Heavy Net Maxi',
    status: 'Contacted',
    notes: 'Came to shop with sister. Needs trial on Saturday at Xinhua Mall store.',
    estimatedValue: 45000,
    createdAt: '2026-09-24T18:00:00Z',
    lastInteraction: '2026-09-26T12:00:00Z',
    followUpDate: '2026-10-02',
  },
];

export const initialFollowUps: FollowUp[] = [
  {
    id: 'fol_1',
    businessId: 'biz_01',
    customerName: 'Bilal Farooq',
    customerPhone: '+92 322 8899112',
    leadId: 'lead_2',
    date: '2026-09-28',
    time: '15:00',
    reminderNote: 'Send finalized quote for 5 Kurta Shalwar gift sets with 10% wedding package discount.',
    messageDraft: 'Assalam-o-Alaikum Bilal bhai! As discussed yesterday, I have finalized your special wedding order discount for the 5 Kurta Shalwar sets. The total comes to Rs. 21,600 with free express delivery to Karachi. Should I prepare the parcel for you?',
    status: 'Pending',
    priority: 'high',
    createdAt: '2026-09-27T16:50:00Z',
  },
  {
    id: 'fol_2',
    businessId: 'biz_01',
    customerName: 'Mariam Tariq',
    customerPhone: '+92 345 5556789',
    leadId: 'lead_4',
    date: '2026-09-28',
    time: '12:00',
    reminderNote: 'Reply to WhatsApp query regarding Lawn print availability and size chart.',
    messageDraft: 'Assalam-o-Alaikum Mariam! Thank you for reaching out to Zahra Pret. Our Summer Digital Lawn print is currently in stock in Small, Medium, and Large. Here is our size guide and catalogue link!',
    status: 'Pending',
    priority: 'medium',
    createdAt: '2026-09-28T04:15:00Z',
  },
  {
    id: 'fol_3',
    businessId: 'biz_01',
    customerName: 'Ayesha Khan',
    customerPhone: '+92 301 4455667',
    leadId: 'lead_1',
    date: '2026-09-29',
    time: '11:00',
    reminderNote: 'Confirm delivery address in Peshawar and dispatch choice.',
    messageDraft: 'Assalam-o-Alaikum Ayesha, hope you are doing well! We have reserved the Velvet 3-Piece Suite for you. Kindly share your complete Peshawar street address so we can ship via COD today.',
    status: 'Pending',
    priority: 'medium',
    createdAt: '2026-09-27T11:00:00Z',
  }
];

export const initialProducts: ProductItem[] = [
  {
    id: 'prod_1',
    businessId: 'biz_01',
    name: 'Royal Velvet Embroidered 3-Piece',
    sku: 'VEL-091',
    category: 'Winter Festive',
    price: 12500,
    currency: 'PKR',
    description: 'Heavy tilla and resham embroidered micro-velvet shirt with pure silk organza dupatta and dyed silk trousers.',
    availability: 'In Stock',
    features: ['Micro-velvet fabric', 'Zari & Resham thread work', 'Pure organza dupatta with cutwork border', 'Custom stitching available'],
    notes: 'Best seller for winter weddings.'
  },
  {
    id: 'prod_2',
    businessId: 'biz_01',
    name: 'Premium Cotton Kurta Shalwar Set (Mens)',
    sku: 'MEN-KRT-04',
    category: 'Menswear',
    price: 4800,
    currency: 'PKR',
    description: 'Egyptian combed cotton wash-and-wear formal kurta with cuff stitching and classic tailored shalwar.',
    availability: 'In Stock',
    features: ['100% combed cotton blend', 'Wrinkle resistant', 'Mother-of-pearl buttons', 'Slim and regular fit'],
    notes: 'Popular for Eid and festive gifting.'
  },
  {
    id: 'prod_3',
    businessId: 'biz_01',
    name: 'Chiffon Party Wear Maxi with Pearl Embellishment',
    sku: 'CHF-MAX-12',
    category: 'Formal Wear',
    price: 18500,
    currency: 'PKR',
    description: 'Hand-embellished chiffon flared gown with pearls, sequins, and metallic beadwork.',
    availability: 'Low Stock',
    features: ['Floor length flare', 'Hand-stitched pearls', 'Crepe inner lining included', 'Dry clean only'],
  },
  {
    id: 'prod_4',
    businessId: 'biz_01',
    name: 'Luxury Digital Printed Lawn (Unstitched 3-Pc)',
    sku: 'LWN-SUM-01',
    category: 'Lawn Collection',
    price: 5500,
    currency: 'PKR',
    description: 'High-thread count Swiss lawn with jacquard woven dupatta and dyed cambric trouser.',
    availability: 'In Stock',
    features: ['100% Breathable lawn', 'Fast color guarantee', '3-piece complete set'],
  }
];

export const initialKnowledge: KnowledgeItem[] = [
  {
    id: 'kn_1',
    businessId: 'biz_01',
    category: 'Delivery',
    question: 'How much are the delivery charges and what is the delivery time?',
    answer: 'Delivery is Rs. 250 across all cities in Pakistan. Orders over Rs. 5,000 enjoy 100% FREE shipping! Standard delivery takes 2 to 4 working days via TCS / Leopards Courier.',
    updatedAt: '2026-09-20',
  },
  {
    id: 'kn_2',
    businessId: 'biz_01',
    category: 'Policy',
    question: 'Do you offer Cash on Delivery (COD) and can I check the parcel before payment?',
    answer: 'Yes! Cash on Delivery (COD) is available all across Pakistan up to Rs. 25,000. As per courier service policies in Pakistan, parcels cannot be opened before paying the rider, but we offer a hassle-free 7-day exchange warranty!',
    updatedAt: '2026-09-21',
  },
  {
    id: 'kn_3',
    businessId: 'biz_01',
    category: 'Refund',
    question: 'What is your exchange and return policy?',
    answer: 'We provide a 7-day exchange guarantee. If there is any size issue or defective item, WhatsApp our support at +92 321 9876543 with a photo and we will arrange an exchange immediately. Unstitched fabric that has been cut or stitched is non-returnable.',
    updatedAt: '2026-09-22',
  },
  {
    id: 'kn_4',
    businessId: 'biz_01',
    category: 'Pricing',
    question: 'Are your prices fixed or is there any discount?',
    answer: 'Our retail prices are fixed and offer the best direct-from-factory value. However, we offer 10% discount on orders of 3 or more suits, plus free shipping on orders above Rs. 5,000!',
    updatedAt: '2026-09-23',
  }
];

export const initialTemplates: BusinessTemplate[] = [
  {
    id: 'tmpl_1',
    businessId: 'biz_01',
    category: 'Customer Support',
    title: 'Price & COD Inquiry Reply (Urdu / Hinglish)',
    language: 'hinglish',
    content: 'Assalam-o-Alaikum {customer_name}! Ye suit Rs. {price} ka hai with complete 3-piece embroidery. Cash on Delivery poore Pakistan mein available hai (Rs. 250 charges, Rs. 5000 se upar free delivery). Kya apka order book kar lein?',
    tags: ['WhatsApp', 'Pricing', 'COD', 'Urdu']
  },
  {
    id: 'tmpl_2',
    businessId: 'biz_01',
    category: 'Follow-up',
    title: 'Abandoned Cart / Unanswered Inquiry Follow-up',
    language: 'en',
    content: 'Assalam-o-Alaikum {customer_name}! Just checking in to see if you would like us to reserve the {product_name} for you? We only have 2 pieces left in stock in your size and would love to dispatch it today!',
    tags: ['Followup', 'Urgent', 'WhatsApp']
  },
  {
    id: 'tmpl_3',
    businessId: 'biz_01',
    category: 'Promotions',
    title: 'Eid & Festive Flash Sale Announcement',
    language: 'en',
    content: '✨ Chand Raat Festive Special! Get Flat 15% OFF across our entire Luxury Pret & Unstitched Festive Collection. Use code: FESTIVE15. Order now for guaranteed delivery before Eid! 🌙 Order via WhatsApp or tap the link in bio.',
    tags: ['Instagram', 'Promotion', 'Eid', 'Sale']
  },
  {
    id: 'tmpl_4',
    businessId: 'biz_01',
    category: 'Customer Support',
    title: 'Delivery Delay Apology & Reassurance',
    language: 'hinglish',
    content: 'Moazzaz customer, apke order ke delay ke liye hum maazrat-khwah hain. Courier tracking check kar ke pata chala hai ke parcel aj delivery rider ke pass hai. InshaAllah aj sham tak apko receive ho jayega. Shukriya apke sabr ka!',
    tags: ['Apology', 'Delay', 'Urdu']
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'followup',
    title: 'Follow-up Due: Bilal Farooq',
    message: 'Wedding order discount follow-up scheduled for today at 3:00 PM.',
    time: '10 mins ago',
    read: false,
    linkTab: 'follow-ups'
  },
  {
    id: 'notif_2',
    type: 'lead',
    title: 'New WhatsApp Lead Added',
    message: 'Mariam Tariq inquired about Lawn Summer Digital Print.',
    time: '45 mins ago',
    read: false,
    linkTab: 'leads'
  },
  {
    id: 'notif_3',
    type: 'usage',
    title: 'Monthly AI Usage Update',
    message: 'You have used 38 of 150 AI requests in your current STARTER billing cycle.',
    time: '3 hours ago',
    read: true,
    linkTab: 'subscription'
  }
];
