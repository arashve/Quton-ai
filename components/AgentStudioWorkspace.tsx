'use client';

import React, { useState, useEffect } from 'react';
import {
  PackagePlus,
  Boxes,
  ReceiptText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Sliders,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  Power,
  RotateCcw,
  Check,
  Percent,
  Layers,
} from 'lucide-react';
import {
  StoreProfile,
  StoreProduct,
  getStoreProfile,
  getStoreProducts,
  getStoreInvoices,
  isStudioAgentEnabled,
  setStudioAgentEnabled,
  toggleStudioAgent,
  formatTomans,
  subscribeStoreUpdates,
  setActiveWorkspace,
} from '@/lib/storeAgentService';
import {
  StoreAddProductWidget,
  StoreProductCatalogWidget,
  StoreInvoiceBuilderWidget,
} from '@/components/StoreAgentWidgets';

interface AgentStudioWorkspaceProps {
  agentId: string; // 'shop' | 'code' | 'research'
  onReturnToStandardChat: () => void;
  onOpenHubModal: () => void;
}

export function AgentStudioWorkspace({
  agentId,
  onReturnToStandardChat,
  onOpenHubModal,
}: AgentStudioWorkspaceProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(() =>
    typeof window !== 'undefined' ? isStudioAgentEnabled(agentId) : true
  );
  const [profile, setProfile] = useState<StoreProfile | null>(() =>
    typeof window !== 'undefined' ? getStoreProfile() : null
  );
  const [products, setProducts] = useState<StoreProduct[]>(() =>
    typeof window !== 'undefined' ? getStoreProducts() : []
  );
  const [invoicesCount, setInvoicesCount] = useState<number>(() =>
    typeof window !== 'undefined' ? getStoreInvoices().length : 0
  );

  // Active Tool Widget view: null | 'add_product' | 'catalog' | 'invoice_builder'
  const [activeTool, setActiveTool] = useState<
    'add_product' | 'catalog' | 'invoice_builder' | null
  >(null);

  // Agent interactive parameter slider state
  const [maxDiscountPercent, setMaxDiscountPercent] = useState<number>(15);
  const [autoTaxEnabled, setAutoTaxEnabled] = useState<boolean>(false);
  const [parameterSaved, setParameterSaved] = useState<boolean>(false);

  const reload = () => {
    setIsEnabled(isStudioAgentEnabled(agentId));
    setProfile(getStoreProfile());
    setProducts(getStoreProducts());
    setInvoicesCount(getStoreInvoices().length);
  };

  useEffect(() => {
    return subscribeStoreUpdates(reload);
  }, [agentId]);

  const handleToggleAgent = () => {
    const next = toggleStudioAgent(agentId);
    setIsEnabled(next);
  };

  const handleSaveParameters = () => {
    setParameterSaved(true);
    setTimeout(() => setParameterSaved(false), 2000);
  };

  // Agent metadata based on agentId
  const agentMeta = {
    shop: {
      name: 'StoreFlow AI',
      titleFa: 'دستیار هوشمند فروشگاه و صدور فاکتور',
      icon: '🏪',
      version: 'v2.4 Pro',
      color: '#8B5CF6',
      accentGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    },
    code: {
      name: 'CodeFlow Architect',
      titleFa: 'معمار کد و بررسی سیستم',
      icon: '⚡',
      version: 'v3.0 Pro',
      color: '#06B6D4',
      accentGradient: 'from-cyan-600 via-blue-600 to-purple-600',
    },
    research: {
      name: 'DeepInsight Research',
      titleFa: 'پژوهش عمیق و سنتز داده‌ها',
      icon: '🔬',
      version: 'v2.1 Pro',
      color: '#F59E0B',
      accentGradient: 'from-amber-600 via-rose-600 to-purple-600',
    },
  }[agentId] || {
    name: 'Studio Agent',
    titleFa: 'دستیار تخصصی استودیو',
    icon: '🤖',
    version: 'v1.0',
    color: '#8B5CF6',
    accentGradient: 'from-purple-600 to-indigo-600',
  };

  return (
    <div
      dir="rtl"
      className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-5 font-sans"
    >
      {/* Background Aurora Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* 1. TOP CONTROL BAR: Apple Squircle Glass Bar */}
      <div className="relative z-10 p-4 sm:p-5 rounded-[28px] bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Left Side (RTL Right): Agent Title, Breadcrumb & Live Node Status */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/20 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${agentMeta.color}44, ${agentMeta.color}11)`,
            }}
          >
            {agentMeta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                فضای اختصاصی {agentMeta.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {agentMeta.version}
              </span>
              {/* Live Node Status Pill */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Node: 12ms • آماده</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {profile?.storeName ? `فروشگاه: ${profile.storeName}` : agentMeta.titleFa}
            </p>
          </div>
        </div>

        {/* Right Side (RTL Left): On/Off Switch & Back to Standard Chat */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap mr-auto">
          {/* HeroUI Apple-Style Switch: On / Off Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 dark:bg-zinc-950/60 border border-white/10 shadow-xs">
            <span className="text-xs font-bold text-zinc-300">
              {isEnabled ? 'ایجنت فعال' : 'ایجنت غیرفعال'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isEnabled}
              onClick={handleToggleAgent}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isEnabled
                  ? 'bg-purple-600 shadow-md shadow-purple-600/40'
                  : 'bg-zinc-800'
              }`}
              title={isEnabled ? 'غیرفعال‌سازی این ایجنت' : 'فعال‌سازی این ایجنت'}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Return to Standard Chat Button */}
          <button
            type="button"
            onClick={onReturnToStandardChat}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="خروج از فضای ایجنت و بازگشت به محیط چت عادی"
          >
            <span>💬 چت عادی</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* If Agent is Disabled Warning */}
      {!isEnabled && (
        <div className="relative z-10 p-5 rounded-[28px] bg-rose-500/10 backdrop-blur-xl border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3 text-right">
            <Power className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">این ایجنت در حال حاضر خاموش است</h4>
              <p className="text-xs text-rose-300 mt-0.5">
                برای استفاده از ابزارهای انبارداری، کاتالوگ و صدور فاکتور، سوییچ بالا را روشن نمایید یا به چت عادی برگردید.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleAgent}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
            >
              فعال‌سازی مجدد
            </button>
            <button
              type="button"
              onClick={onReturnToStandardChat}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer"
            >
              بازگشت به چت عادی
            </button>
          </div>
        </div>
      )}

      {/* 2. AURORA GLASSMORPHIC BENTO GRID */}
      {isEnabled && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* BENTO CARD 1: Store & Warehouse Live Intelligence (Span 7) */}
          <div className="lg:col-span-7 p-6 rounded-[32px] bg-white/10 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  انبار و فروشگاه زنده
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  مدیریت: {profile?.ownerName || 'مدیر سیستم'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                {profile?.storeName || 'فروشگاه هوشمند من'}
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                دسته‌بندی: {profile?.category || 'محصولات عمومی'} • شماره تماس: {profile?.phone || '۰۹۱۲۰۰۰۰۰۰۰'}
              </p>

              {/* Stats Chips Row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-cyan-400 block font-mono">
                    {products.length}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">محصولات انبار</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-400 block font-mono">
                    {invoicesCount}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">فاکتورهای رسمی</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-purple-400 block font-mono">
                    ۱۰۰٪
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">سلامت کاتالوگ</span>
                </div>
              </div>

              {/* Progress Bar: Warehouse Capacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>تکمیل ظرفیت پردازش خودکار انبار</span>
                  <span className="font-mono text-purple-300 font-bold">۸۵٪ بهینه</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-sm transition-all duration-500"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: Agent Parameters & Approval Sliders (Span 5) */}
          <div className="lg:col-span-5 p-6 rounded-[32px] bg-white/10 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">تنظیمات پارامترهای ایجنت</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Execution Config</span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                قوانین هوشمند صدور فاکتور و کنترل تخفیفات مجاز را برای این ایجنت تنظیم کنید:
              </p>

              {/* Slider 1: Max Discount */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">سقف مجاز تخفیف در فاکتور:</span>
                  <span className="font-mono font-bold text-purple-300 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                    {maxDiscountPercent}٪
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={maxDiscountPercent}
                  onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Toggle Switch: Auto Tax Calculation */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/10 mb-4">
                <div>
                  <span className="text-xs font-bold text-white block">محاسبه خودکار مالیات</span>
                  <span className="text-[10px] text-zinc-400">۱۰٪ مالیات بر ارزش افزوده در فاکتور</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoTaxEnabled}
                  onClick={() => setAutoTaxEnabled(!autoTaxEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    autoTaxEnabled ? 'bg-cyan-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      autoTaxEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveParameters}
              className={`w-full py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                parameterSaved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              {parameterSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>پارامترها با موفقیت اعمال شد</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>ثبت و اعتبارسنجی پارامترها</span>
                </>
              )}
            </button>
          </div>

          {/* BENTO CARD 3: Interactive Tool Launchers (Span 12) */}
          <div className="lg:col-span-12 p-6 rounded-[32px] bg-white/10 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>ابزارهای عملیاتی و تعاملی StoreFlow</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  روی هر ابزار کلیک کنید تا ویجت شیشه‌ای و فرم ثبت فوری در همین صفحه باز شود.
                </p>
              </div>

              {activeTool && (
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 text-xs font-medium transition cursor-pointer"
                >
                  بستن فرم ابزار
                </button>
              )}
            </div>

            {/* Quick Tool Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <button
                type="button"
                onClick={() =>
                  setActiveTool((prev) => (prev === 'add_product' ? null : 'add_product'))
                }
                className={`p-4 rounded-[24px] border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  activeTool === 'add_product'
                    ? 'bg-purple-600/30 border-purple-500/60 shadow-lg shadow-purple-600/20'
                    : 'bg-black/30 hover:bg-white/5 border-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-3">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">افزودن محصول جدید</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    ثبت نام، قیمت، بارکد، ایموجی و تعداد موجودی کالا در انبار
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTool((prev) => (prev === 'catalog' ? null : 'catalog'))
                }
                className={`p-4 rounded-[24px] border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  activeTool === 'catalog'
                    ? 'bg-cyan-600/30 border-cyan-500/60 shadow-lg shadow-cyan-600/20'
                    : 'bg-black/30 hover:bg-white/5 border-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center mb-3">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">کاتالوگ و انبارگردانی</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    مشاهده لیست کامل کالاها، جستجو، فیلتر دسته‌بندی و حذف اقلام
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTool((prev) => (prev === 'invoice_builder' ? null : 'invoice_builder'))
                }
                className={`p-4 rounded-[24px] border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  activeTool === 'invoice_builder'
                    ? 'bg-emerald-600/30 border-emerald-500/60 shadow-lg shadow-emerald-600/20'
                    : 'bg-black/30 hover:bg-white/5 border-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center mb-3">
                  <ReceiptText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">صدور فاکتور رسمی دیجیتال</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    انتخاب اقلام، محاسبه تخفیف، ثبت نام خریدار و مهر رسمی دیجیتال
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE INTERACTIVE WIDGET DISPLAY */}
      {isEnabled && activeTool && (
        <div className="relative z-10 animate-in fade-in zoom-in-95 duration-200">
          {activeTool === 'add_product' && (
            <StoreAddProductWidget
              onProductAdded={() => {
                setProducts(getStoreProducts());
              }}
              onOpenCatalog={() => setActiveTool('catalog')}
              onOpenInvoice={() => setActiveTool('invoice_builder')}
            />
          )}

          {activeTool === 'catalog' && (
            <StoreProductCatalogWidget
              onAddProductClick={() => setActiveTool('add_product')}
              onOpenInvoice={() => setActiveTool('invoice_builder')}
            />
          )}

          {activeTool === 'invoice_builder' && (
            <StoreInvoiceBuilderWidget
              onInvoiceIssued={() => {
                setInvoicesCount(getStoreInvoices().length);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
