'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar12, Mobile3 } from '@/components/reactbits';
import {
  Store,
  Search,
  Bot,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  User,
  Phone,
  Tag,
  ShieldCheck,
  Boxes,
  ReceiptText,
  Sliders,
  Settings2,
  Trash2,
} from 'lucide-react';
import {
  StoreProfile,
  getStoreProfile,
  saveStoreProfile,
  isStoreAgentInstalled,
  uninstallStoreAgent,
  getStoreProducts,
  subscribeStoreUpdates,
} from '@/lib/storeAgentService';

const STORE_CATEGORIES = [
  'کالای دیجیتال و جانبی موبایل',
  'پوشاک، کفش و مد',
  'لوازم آرایشی، بهداشتی و عطر',
  'خانه، آشپزخانه و دکوراسیون',
  'ساعت، طلا و اکسسوری',
  'کتاب، لوازم‌تحریر و آموزش',
  'سوپرمارکت و خوراکی',
  'سایر خدمات و محصولات',
];

export default function MarketplacePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'explore' | 'installed'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInstalled, setIsInstalled] = useState(() => (typeof window !== 'undefined' ? isStoreAgentInstalled() : false));
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(() => (typeof window !== 'undefined' ? getStoreProfile() : null));
  const [productsCount, setProductsCount] = useState(() => (typeof window !== 'undefined' ? getStoreProducts().length : 0));

  // Setup modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeNameInput, setStoreNameInput] = useState(() => (typeof window !== 'undefined' ? getStoreProfile()?.storeName || '' : ''));
  const [ownerNameInput, setOwnerNameInput] = useState(() => (typeof window !== 'undefined' ? getStoreProfile()?.ownerName || '' : ''));
  const [phoneInput, setPhoneInput] = useState(() => (typeof window !== 'undefined' ? getStoreProfile()?.phone || '' : ''));
  const [categoryInput, setCategoryInput] = useState(() => (typeof window !== 'undefined' ? getStoreProfile()?.category || STORE_CATEGORIES[0] : STORE_CATEGORIES[0]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);

  const reloadData = () => {
    const installed = isStoreAgentInstalled();
    const profile = getStoreProfile();
    const products = getStoreProducts();
    setIsInstalled(installed);
    setStoreProfile(profile);
    setProductsCount(products.length);

    if (profile) {
      setStoreNameInput(profile.storeName || '');
      setOwnerNameInput(profile.ownerName || '');
      setPhoneInput(profile.phone || '');
      setCategoryInput(profile.category || STORE_CATEGORIES[0]);
    }
  };

  useEffect(() => {
    return subscribeStoreUpdates(reloadData);
  }, []);

  const handleOpenActivation = () => {
    if (storeProfile) {
      setStoreNameInput(storeProfile.storeName || '');
      setOwnerNameInput(storeProfile.ownerName || '');
      setPhoneInput(storeProfile.phone || '');
      setCategoryInput(storeProfile.category || STORE_CATEGORIES[0]);
    }
    setActivationSuccess(false);
    setIsModalOpen(true);
  };

  const handleSaveActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeNameInput.trim() || !ownerNameInput.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      saveStoreProfile({
        storeName: storeNameInput.trim(),
        ownerName: ownerNameInput.trim(),
        phone: phoneInput.trim() || '۰۹۱۲۰۰۰۰۰۰۰',
        category: categoryInput,
        createdAt: storeProfile?.createdAt || Date.now(),
        isActive: true,
      });

      setIsSubmitting(false);
      setActivationSuccess(true);
      setIsInstalled(true);
    }, 450);
  };

  const handleUninstall = () => {
    if (confirm('آیا از غیرفعال‌سازی این ایجنت در استودیو اطمینان دارید؟ اطلاعات محصولات ذخیره می‌ماند.')) {
      uninstallStoreAgent();
      setIsInstalled(false);
    }
  };

  const matchesSearch =
    'ایجنت فروشگاهی storeflow shop store فروشگاه فاکتور محصول'
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

  return (
    <div
      dir="rtl"
      className="min-h-screen relative w-full overflow-x-clip bg-zinc-950 text-zinc-100 selection:bg-zinc-800 pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-[calc(env(safe-area-inset-bottom)+3rem)] flex flex-col justify-between font-sans"
    >
      {/* Background Subtle Monochrome Mesh & Aurora Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* 1. Desktop Navbar */}
      <div dir="ltr">
        <Navbar12 />
      </div>

      {/* 2. Main Marketplace Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs mb-3 shadow-xs">
            <Store className="w-3.5 h-3.5 text-purple-400" />
            <span>مارکت‌پلیس و مخزن ایجنت‌های تخصصی • Agent Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            مارکت‌پلیس ایجنت‌های هوشمند
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            ایجنت‌های تخصصی دلخواهتان را از مارکت‌پلیس انتخاب و با یک کلیک روی چت استودیوی خود فعال کنید.
          </p>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-[28px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl mb-8">
          {/* Tabs: Explore vs Installed */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'explore'
                  ? 'bg-white text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
              }`}
            >
              <span>مشاهده و جستجوی ایجنت‌ها</span>
              <span className="px-1.5 py-0.2 rounded-md bg-zinc-800 text-[10px] text-zinc-300">۱</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('installed')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'installed'
                  ? 'bg-white text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
              }`}
            >
              <span>نصب‌شده در استودیوی من</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${isInstalled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                {isInstalled ? '1' : '0'}
              </span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در میان ایجنت‌ها..."
              className="w-full pr-10 pl-4 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-500"
            />
          </div>
        </div>

        {/* TAB 1: EXPLORE AGENTS */}
        {activeTab === 'explore' && (
          <div>
            {matchesSearch ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. The Shop & Sales Agent Card */}
                <div className="group relative overflow-hidden rounded-[32px] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
                  {/* Subtle Card Glow */}
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/25 transition" />

                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          رایگان • FREE
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                          v1.0 • E-Commerce
                        </span>
                      </div>

                      {isInstalled ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>فعال در استودیو</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700">
                          <span>در حالت عادی غیرفعال</span>
                        </span>
                      )}
                    </div>

                    {/* Agent Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-600/30 shrink-0">
                        🏪
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                          <span>StoreFlow • ایجنت هوشمند فروشگاهی</span>
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          دستیار فوق‌هوشمند مدیریت کاتالوگ، انبارداری سریع و صدور فاکتور رسمی به صورت تعاملی در محیط چت استودیو.
                        </p>
                      </div>
                    </div>

                    {/* Agent Capabilities Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-5 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>تعریف و انبارداری سریع محصولات</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReceiptText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>محاسبه تخفیف و صدور فاکتور رسمی</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>مهر دیجیتال و پرینت/اشتراک فاکتور</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>کامپوننت‌های تعاملی جنریتیو در چت</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    {isInstalled ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          href="/chat?agent=shop"
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>ورود به چت با ایجنت</span>
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </Link>
                        <button
                          type="button"
                          onClick={handleOpenActivation}
                          className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                          <span>ویرایش اطلاعات</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenActivation}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>فعال‌سازی و اتصال به استودیو</span>
                      </button>
                    )}

                    <div className="text-[11px] text-zinc-500 font-mono">
                      توسعه‌داده شده برای AUTOFLOW
                    </div>
                  </div>
                </div>

                {/* Coming Soon Teaser for Next Agents */}
                <div className="relative rounded-[32px] bg-zinc-900/30 backdrop-blur-xl border border-dashed border-zinc-800 p-6 sm:p-7 flex flex-col justify-between text-center items-center">
                  <div className="my-auto py-8">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto flex items-center justify-center mb-3">
                      <Bot className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      ایجنت‌های بعدی در راه هستند...
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      ایجنت‌های تخصصی پشتیبانی هوشمند، تحلیلگر داده مالی، و دستیار سئو به زودی در مارکت‌پلیس قابل نصب خواهند بود.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-600">
                    Next update • Agent Ecosystem
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-zinc-900/30 border border-zinc-800">
                <p className="text-xs text-zinc-400">هیچ ایجنتی با این عبارت پیدا نشد.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INSTALLED AGENTS */}
        {activeTab === 'installed' && (
          <div>
            {isInstalled && storeProfile ? (
              <div className="max-w-2xl mx-auto rounded-[32px] bg-zinc-900/80 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
                      🏪
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-white">
                          {storeProfile.storeName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          آنلاین و متصل
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        مدیریت: <span className="text-white">{storeProfile.ownerName}</span> • دسته‌بندی: {storeProfile.category}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/chat?agent=shop"
                    className="px-5 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>باز کردن در استودیو</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[11px] text-zinc-400 block mb-1">کالاهای ثبت شده</span>
                    <span className="text-lg font-bold font-mono text-purple-300">{productsCount} محصول</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[11px] text-zinc-400 block mb-1">شماره تماس پشتیبان</span>
                    <span className="text-xs font-bold font-mono text-zinc-200">{storeProfile.phone}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-zinc-400 block mb-1">وضعیت سرویس</span>
                    <span className="text-xs font-bold text-emerald-400">آماده صدور فاکتور</span>
                  </div>
                </div>

                {/* Settings & Uninstall */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleOpenActivation}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition cursor-pointer"
                  >
                    ویرایش مشخصات فروشگاه
                  </button>

                  <button
                    type="button"
                    onClick={handleUninstall}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-300 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>غیرفعال‌سازی ایجنت</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-[36px] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 mx-auto flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">هنوز هیچ ایجنتی فعال نکرده‌اید</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto mb-5">
                  برای اینکه ایجنت فروشگاهی در چت استودیوی شما اضافه شود، از تب «مشاهده و جستجوی ایجنت‌ها» روی دکمه فعال‌سازی کلیک کنید.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 rounded-2xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition cursor-pointer"
                >
                  مشاهده ایجنت‌های مارکت‌پلیس
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Apple-Style Aurora Glassmorphic Activation Modal */}
      {isModalOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative overflow-hidden w-full max-w-lg p-6 sm:p-8 rounded-[32px] bg-zinc-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-zinc-100">
            {/* Ambient Aurora Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {activationSuccess ? (
              <div className="relative z-10 text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  ایجنت فروشگاهی با موفقیت فعال شد!
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  فروشگاه <span className="text-white font-bold">{storeNameInput}</span> ثبت شد. اکنون می‌توانید به چت استودیو بروید و محصولاتتان را اضافه کرده یا فاکتور رسمی صادر نمایید.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-4">
                  <Link
                    href="/chat?agent=shop"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ورود به چت با ایجنت در استودیو</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-300 text-xs font-semibold transition cursor-pointer"
                  >
                    بستن پنجره
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xl shadow-sm">
                    🏪
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      راه‌اندازی و فعال‌سازی ایجنت فروشگاهی
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      اطلاعات فروشگاه و فردی خود را برای صدور فاکتور رسمی وارد کنید:
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveActivation} className="space-y-3.5">
                  {/* Store Name */}
                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                      نام فروشگاه / کسب‌وکار <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={storeNameInput}
                      onChange={(e) => setStoreNameInput(e.target.value)}
                      placeholder="مثال: فروشگاه دیجی‌استایل یا آراش شاپ"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  {/* Owner Name */}
                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                      نام و نام خانوادگی مدیر / مالک <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerNameInput}
                      onChange={(e) => setOwnerNameInput(e.target.value)}
                      placeholder="مثال: آرش وفایی"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                      شماره تماس و پشتیبانی فروشگاه
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500 font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                      دسته‌بندی اصلی فروشگاه
                    </label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white focus:outline-hidden focus:border-purple-500 cursor-pointer"
                    >
                      {STORE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-zinc-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !storeNameInput.trim() || !ownerNameInput.trim()}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isSubmitting ? 'در حال فعال‌سازی...' : 'تایید و فعال‌سازی در استودیو'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Floating Mobile Bottom Dock */}
      <Mobile3 />
    </div>
  );
}
