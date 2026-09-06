'use client';

export interface StoreProfile {
  storeName: string;
  ownerName: string;
  phone: string;
  category: string;
  createdAt: number;
  isActive: boolean;
}

export interface StoreProduct {
  id: string;
  title: string;
  price: number; // In Tomans
  stock: number;
  category: string;
  emoji?: string;
  description?: string;
  createdAt: number;
}

export interface InvoiceItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface StoreInvoice {
  id: string;
  invoiceNumber: string;
  createdAt: number;
  customerName: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending' | 'issued';
}

const PROFILE_KEY = 'autoflow_store_profile_v1';
const PRODUCTS_KEY = 'autoflow_store_products_v1';
const INVOICES_KEY = 'autoflow_store_invoices_v1';
const AGENTS_KEY = 'autoflow_installed_agents_v1';

// Default initial starter products when a store is activated
const DEFAULT_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod_1',
    title: 'ایرپاد پرو بی‌سیم نسخه ۳',
    price: 3450000,
    stock: 12,
    category: 'دیجیتال و لوازم جانبی',
    emoji: '🎧',
    description: 'نویز کنسلینگ فعال، صدای سه‌بعدی و باتری با دوام بالا',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'prod_2',
    title: 'ساعت هوشمند الترا اولد',
    price: 5200000,
    stock: 8,
    category: 'دیجیتال و لوازم جانبی',
    emoji: '⌚',
    description: 'صفحه نمایش امولد، حسگر ضربان قلب و بند تیتانیومی',
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'prod_3',
    title: 'کوله پشتی ضدآب مسافرتی',
    price: 1890000,
    stock: 20,
    category: 'پوشاک و اکسسوری',
    emoji: '🎒',
    description: 'طراحی ارگونومیک، پورت شارژ USB و مقاوم در برابر باران',
    createdAt: Date.now() - 21600000,
  },
];

// Profile helpers
export function getStoreProfile(): StoreProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoreProfile(profile: StoreProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    // Also record in installed agents list
    const agents = getInstalledAgents();
    if (!agents.includes('shop_agent')) {
      agents.push('shop_agent');
      localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
    }
    // Pre-populate default products if empty
    const existingProducts = getStoreProducts();
    if (existingProducts.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    }
    notifyStoreUpdate();
  } catch (e) {
    console.error('Failed to save store profile:', e);
  }
}

export function isStoreAgentInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const profile = getStoreProfile();
    return Boolean(profile && profile.isActive);
  } catch {
    return false;
  }
}

export function uninstallStoreAgent(): void {
  if (typeof window === 'undefined') return;
  try {
    const profile = getStoreProfile();
    if (profile) {
      profile.isActive = false;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
    const agents = getInstalledAgents().filter((id) => id !== 'shop_agent');
    localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
    notifyStoreUpdate();
  } catch (e) {
    console.error('Failed to uninstall store agent:', e);
  }
}

export function getInstalledAgents(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AGENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Product helpers
export function getStoreProducts(): StoreProduct[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addStoreProduct(product: Omit<StoreProduct, 'id' | 'createdAt'>): StoreProduct {
  const current = getStoreProducts();
  const newProduct: StoreProduct = {
    ...product,
    id: `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: Date.now(),
  };
  const updated = [newProduct, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    notifyStoreUpdate();
  }
  return newProduct;
}

export function deleteStoreProduct(id: string): void {
  const current = getStoreProducts();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    notifyStoreUpdate();
  }
}

// Invoices
export function getStoreInvoices(): StoreInvoice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function createStoreInvoice(
  customerName: string,
  items: InvoiceItem[],
  discount: number = 0,
  customerPhone?: string
): StoreInvoice {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const now = Date.now();
  const serialNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInvoice: StoreInvoice = {
    id: `inv_${now}_${Math.floor(Math.random() * 1000)}`,
    invoiceNumber: serialNumber,
    createdAt: now,
    customerName,
    customerPhone,
    items,
    subtotal,
    discount,
    total,
    status: 'paid',
  };

  const current = getStoreInvoices();
  const updated = [newInvoice, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));
    notifyStoreUpdate();
  }
  return newInvoice;
}

// Custom event subscription for real-time reactivity between components
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeStoreUpdates(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyStoreUpdate(): void {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Store update listener error:', e);
    }
  });
}

// Persian Currency Number Formatter
export function formatTomans(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}
