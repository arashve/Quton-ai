'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/shell';
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
  getStudioAgents,
  toggleStudioAgent,
  setStudioAgentEnabled,
  StudioAgent,
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
  const [agents, setAgents] = useState<StudioAgent[]>(() => (typeof window !== 'undefined' ? getStudioAgents() : []));

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
    const allAgents = getStudioAgents();
    setIsInstalled(installed);
    setStoreProfile(profile);
    setProductsCount(products.length);
    setAgents(allAgents);

    if (profile) {
      setStoreNameInput(profile.storeName || '');
      setOwnerNameInput(profile.ownerName || '');
      setPhoneInput(profile.phone || '');
      setCategoryInput(profile.category || STORE_CATEGORIES[0]);
    }
  };

  const handleToggleAgent = (agentId: string) => {
    const newState = toggleStudioAgent(agentId);
    setAgents(getStudioAgents());
    if (agentId === 'shop') {
      setIsInstalled(newState);
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
    <PageContainer variant="public" maxWidth="xl">
      <div dir="rtl" className="w-full">
        {/* Background Subtle Monochrome Mesh */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        </div>

        {/* 2. Main Marketplace Container */}
        <div className="relative z-10 w-full">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs mb-3 shadow-xs">
            <Store className="w-3.5 h-3.5 text-zinc-400" />
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-[28px] bg-zinc-900 border border-zinc-800 shadow-2xl mb-8">
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
              <span className="px-1.5 py-0.2 rounded-md bg-zinc-800 text-[10px] text-zinc-300">{agents.length}</span>
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
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${agents.some((a) => a.isEnabled) ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-zinc-800 text-zinc-400'}`}>
                {agents.filter((a) => a.isEnabled).length}
              </span>
            </button>
            <Link
              href="/chat"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 transition"
              title="ورود مستقیم به چت عادی هوش مصنوعی بدون ایجنت"
            >
              <span>💬</span>
              <span>چت عادی</span>
            </Link>
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
            {agents.filter((a) => {
              const q = searchQuery.toLowerCase();
              return (
                (a.name || '').toLowerCase().includes(q) ||
                (a.titleFa || '').toLowerCase().includes(q) ||
                (a.descriptionFa || a.description || '').toLowerCase().includes(q) ||
                (a.category || a.badge || '').toLowerCase().includes(q)
              );
            }).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents
                  .filter((a) => {
                    const q = searchQuery.toLowerCase();
                    return (
                      (a.name || '').toLowerCase().includes(q) ||
                      (a.titleFa || '').toLowerCase().includes(q) ||
                      (a.descriptionFa || a.description || '').toLowerCase().includes(q) ||
                      (a.category || a.badge || '').toLowerCase().includes(q)
                    );
                  })
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="group relative overflow-hidden rounded-[32px] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 p-6 sm:p-7 shadow-2xl flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Badges & Switch */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
                              رایگان • FREE
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
                              {agent.badge || agent.category || 'Agent'}
                            </span>
                          </div>

                          {/* Apple-Style Switch */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-zinc-400 font-mono">
                              {agent.isEnabled ? 'فعال' : 'غیرفعال'}
                            </span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={agent.isEnabled}
                              onClick={() => handleToggleAgent(agent.id)}
                              className={`w-12 h-6.5 p-0.5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer relative ${
                                agent.isEnabled
                                  ? 'bg-white'
                                  : 'bg-zinc-800 hover:bg-zinc-700'
                              }`}
                              title={agent.isEnabled ? 'خاموش کردن ایجنت' : 'روشن کردن ایجنت'}
                            >
                              <div
                                className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                                  agent.isEnabled ? '-translate-x-5.5 bg-zinc-950' : 'translate-x-0 bg-zinc-400'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Agent Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-2xl shadow-md shrink-0">
                            {agent.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                              <span>{agent.name}</span>
                              <Sparkles className="w-4 h-4 text-zinc-400" />
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                              {agent.descriptionFa || agent.description}
                            </p>
                          </div>
                        </div>

                        {/* Agent Capabilities Checklist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-5 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                          {agent.capabilities.map((cap, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/chat?agent=${agent.id}`}
                            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>ورود به فضای استودیو</span>
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                          </Link>
                          {agent.id === 'shop' && (
                            <button
                              type="button"
                              onClick={handleOpenActivation}
                              className="px-3.5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                            >
                              <Settings2 className="w-3.5 h-3.5" />
                              <span>تنظیمات فروشگاه</span>
                            </button>
                          )}
                        </div>

                        <div className="text-[11px] text-zinc-500 font-mono">
                          نسخه {agent.version || '1.0'} • AUTOFLOW
                        </div>
                      </div>
                    </div>
                  ))}
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
            {agents.filter((a) => a.isEnabled).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents
                  .filter((a) => a.isEnabled)
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="rounded-[32px] bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-2xl shadow-md shrink-0">
                            {agent.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-extrabold text-white">
                                {agent.id === 'shop' && storeProfile?.storeName
                                  ? storeProfile.storeName
                                  : agent.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-800 text-white border border-zinc-700">
                                فعال در استودیو
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                              {agent.descriptionFa || agent.description}
                            </p>
                          </div>
                        </div>

                        {/* Switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={agent.isEnabled}
                          onClick={() => handleToggleAgent(agent.id)}
                          className="w-12 h-6.5 p-0.5 rounded-full bg-white transition cursor-pointer self-start sm:self-center"
                          title="خاموش کردن ایجنت"
                        >
                          <div className="w-5 h-5 rounded-full bg-zinc-950 shadow-md transform -translate-x-5.5 transition-transform duration-200" />
                        </button>
                      </div>

                      {/* Quick Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                          <span className="text-[11px] text-zinc-400 block mb-1">دسته‌بندی</span>
                          <span className="text-xs font-bold text-zinc-200">{agent.badge || agent.category || 'Agent'}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                          <span className="text-[11px] text-zinc-400 block mb-1">نسخه</span>
                          <span className="text-xs font-bold font-mono text-zinc-200">v{agent.version || '1.0'}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center col-span-2 sm:col-span-1">
                          <span className="text-[11px] text-zinc-400 block mb-1">وضعیت</span>
                          <span className="text-xs font-bold text-white">آماده تعامل</span>
                        </div>
                      </div>

                      {/* Settings & Direct Open */}
                      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                        <Link
                          href={`/chat?agent=${agent.id}`}
                          className="px-5 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>ورود به فضای استودیو</span>
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </Link>

                        {agent.id === 'shop' && (
                          <button
                            type="button"
                            onClick={handleOpenActivation}
                            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
                          >
                            ویرایش مشخصات
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-[36px] bg-zinc-900 border border-zinc-800 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-white mx-auto flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">هنوز هیچ ایجنتی فعال نیست</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto mb-5">
                  برای فعال‌سازی ایجنت‌ها، از تب «مشاهده و جستجوی ایجنت‌ها» سوئیچ هر ایجنت را روشن کنید.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 rounded-2xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition cursor-pointer shadow-md"
                >
                  مشاهده ایجنت‌های مارکت‌پلیس
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Monochrome Activation Modal */}
      {isModalOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative overflow-hidden w-full max-w-lg p-6 sm:p-8 rounded-[32px] bg-zinc-900 border border-zinc-800 shadow-2xl text-zinc-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {activationSuccess ? (
              <div className="relative z-10 text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-3xl bg-zinc-800 border border-zinc-700 text-white mx-auto flex items-center justify-center shadow-lg">
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
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ورود به چت با ایجنت در استودیو</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold transition cursor-pointer"
                  >
                    بستن پنجره
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xl shadow-sm">
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
                      نام فروشگاه / کسب‌وکار <span className="text-zinc-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={storeNameInput}
                      onChange={(e) => setStoreNameInput(e.target.value)}
                      placeholder="مثال: فروشگاه دیجی‌استایل یا آراش شاپ"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-400"
                    />
                  </div>

                  {/* Owner Name */}
                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                      نام و نام خانوادگی مدیر / مالک <span className="text-zinc-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerNameInput}
                      onChange={(e) => setOwnerNameInput(e.target.value)}
                      placeholder="مثال: آرش وفایی"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-400"
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
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-400 font-mono"
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
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-hidden focus:border-zinc-400 cursor-pointer"
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
                      className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </PageContainer>
  );
}
