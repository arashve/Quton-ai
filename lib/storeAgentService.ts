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
const ACTIVE_WORKSPACE_KEY = 'autoflow_active_workspace_v1';
const AGENT_ENABLED_PREFIX = 'autoflow_agent_enabled_';

export interface StudioAgent {
  id: string; // 'shop' | 'code' | 'research'
  name: string;
  titleFa: string;
  badge: string;
  descriptionFa: string;
  icon: string;
  accentColor: string;
  glowGradient: string;
  isEnabled: boolean;
  capabilities: string[];
  description?: string;
  category?: string;
  version?: string;
}

export const ALL_STUDIO_AGENTS: Omit<StudioAgent, 'isEnabled'>[] = [
  {
    id: 'shop',
    name: 'StoreFlow AI',
    titleFa: 'فروشگاه و صدور فاکتور',
    badge: 'E-Commerce v2.4',
    category: 'فروشگاهی و حسابداری',
    version: '2.4',
    description: 'مدیریت محصولات انبار، صدور خودکار فاکتور رسمی دیجیتال و استعلام موجودی هوشمند.',
    descriptionFa: 'مدیریت محصولات انبار، صدور خودکار فاکتور رسمی دیجیتال و استعلام موجودی هوشمند.',
    icon: '🏪',
    accentColor: '#8B5CF6',
    glowGradient: 'from-purple-600/30 via-indigo-600/20 to-cyan-500/10',
    capabilities: ['ثبت کالا', 'کاتالوگ زنده', 'فاکتور رسمی', 'محاسبه تخفیف'],
  },
  {
    id: 'code',
    name: 'CodeFlow Architect',
    titleFa: 'معمار کد و توسعه',
    badge: 'Fullstack Dev v3.0',
    category: 'برنامه‌نویسی و کد',
    version: '3.0',
    description: 'معماری مایکروسرویس، بررسی امنیت API، دیباگ خط‌به‌خط و تولید کدهای تایپ‌اسکریپت بهینه‌شده.',
    descriptionFa: 'معماری مایکروسرویس، بررسی امنیت API، دیباگ خط‌به‌خط و تولید کدهای تایپ‌اسکریپت بهینه‌شده.',
    icon: '⚡',
    accentColor: '#06B6D4',
    glowGradient: 'from-cyan-600/30 via-blue-600/20 to-purple-500/10',
    capabilities: ['معماری سیستم', 'دیباگ سریع', 'تست واحد', 'بهینه‌سازی AST'],
  },
  {
    id: 'research',
    name: 'DeepInsight Agent',
    titleFa: 'پژوهش و تحلیل عمیق',
    badge: 'Deep Research v2.1',
    category: 'تحقیق و تحلیل داده',
    version: '2.1',
    description: 'سنتز اسناد پیچیده، ارزیابی داده‌های وب، مقایسه تخصصی مدل‌ها و استخراج رفرنس‌های معتبر.',
    descriptionFa: 'سنتز اسناد پیچیده، ارزیابی داده‌های وب، مقایسه تخصصی مدل‌ها و استخراج رفرنس‌های معتبر.',
    icon: '🔬',
    accentColor: '#F59E0B',
    glowGradient: 'from-amber-600/30 via-rose-600/20 to-purple-500/10',
    capabilities: ['استخراج رفرنس', 'سنتز داده‌ها', 'تحلیل بازار', 'چکیده‌سازی'],
  },
];

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

export function isStudioAgentEnabled(agentId: string): boolean {
  if (typeof window === 'undefined') return agentId === 'shop';
  try {
    const raw = localStorage.getItem(AGENT_ENABLED_PREFIX + agentId);
    if (raw === null) {
      // Default: if it's shop and store profile exists, true; others can be enabled as well
      if (agentId === 'shop') return isStoreAgentInstalled();
      return true; // enabled by default in studio
    }
    return raw === 'true';
  } catch {
    return true;
  }
}

export function setStudioAgentEnabled(agentId: string, enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AGENT_ENABLED_PREFIX + agentId, String(enabled));
    if (agentId === 'shop') {
      const profile = getStoreProfile();
      if (profile) {
        profile.isActive = enabled;
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      }
    }
    notifyStoreUpdate();
  } catch (e) {
    console.error('Failed to set agent enabled status:', e);
  }
}

export function toggleStudioAgent(agentId: string): boolean {
  const current = isStudioAgentEnabled(agentId);
  const next = !current;
  setStudioAgentEnabled(agentId, next);
  return next;
}

export function getStudioAgents(): StudioAgent[] {
  return ALL_STUDIO_AGENTS.map((agent) => ({
    ...agent,
    isEnabled: isStudioAgentEnabled(agent.id),
  }));
}

export function getActiveWorkspace(): string {
  if (typeof window === 'undefined') return 'default';
  try {
    return localStorage.getItem(ACTIVE_WORKSPACE_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function setActiveWorkspace(workspaceId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, workspaceId);
    notifyStoreUpdate();
  } catch (e) {
    console.error('Failed to set active workspace:', e);
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
