'use client';

import React, { useState, useEffect } from 'react';
import {
  PackagePlus,
  Boxes,
  ReceiptText,
  CheckCircle2,
  Trash2,
  Search,
  Plus,
  Minus,
  Printer,
  Copy,
  Check,
  Store,
  Sparkles,
  Phone,
  User,
  ShieldCheck,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  StoreProduct,
  StoreInvoice,
  StoreProfile,
  getStoreProfile,
  getStoreProducts,
  addStoreProduct,
  deleteStoreProduct,
  createStoreInvoice,
  formatTomans,
  subscribeStoreUpdates,
} from '@/lib/storeAgentService';

const CATEGORIES = [
  'کالای دیجیتال و موبایل',
  'پوشاک و مد',
  'آرایشی و بهداشتی',
  'خانه و آشپزخانه',
  'اکسسوری و ساعت',
  'کتاب و فرهنگ',
  'سایر محصولات',
];

const SAMPLE_EMOJIS = ['🎧', '⌚', '🎒', '📱', '👟', '👕', '☕', '🕶️', '💻', '📦', '✨'];

// ============================================================================
// 1. Interactive Generative Widget: ADD PRODUCT FORM
// ============================================================================
interface StoreAddProductWidgetProps {
  onProductAdded?: (product: StoreProduct) => void;
  onOpenCatalog?: () => void;
  onOpenInvoice?: () => void;
}

export function StoreAddProductWidget({
  onProductAdded,
  onOpenCatalog,
  onOpenInvoice,
}: StoreAddProductWidgetProps) {
  const [profile, setProfile] = useState<StoreProfile | null>(() => (typeof window !== 'undefined' ? getStoreProfile() : null));
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [emoji, setEmoji] = useState('📦');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAddedProduct, setJustAddedProduct] = useState<StoreProduct | null>(null);

  useEffect(() => {
    return subscribeStoreUpdates(() => {
      setProfile(getStoreProfile());
    });
  }, []);

  const parsedPrice = parseInt(price.replace(/,/g, ''), 10) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || parsedPrice <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newProd = addStoreProduct({
        title: title.trim(),
        price: parsedPrice,
        stock: parseInt(stock, 10) || 1,
        category,
        emoji,
        description: description.trim() || undefined,
      });

      setJustAddedProduct(newProd);
      setIsSubmitting(false);
      setTitle('');
      setPrice('');
      setDescription('');
      onProductAdded?.(newProd);
    }, 400);
  };

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden w-full my-3 p-5 sm:p-6 rounded-[28px] bg-zinc-900/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/15 dark:border-white/10 shadow-2xl text-zinc-100 font-sans"
    >
      {/* Aurora glowing background mesh */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                افزودن محصول جدید به انبار
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Store Agent Tool
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              فروشگاه:{' '}
              <span className="text-white font-medium">
                {profile?.storeName || 'فروشگاه من'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification if just added */}
      {justAddedProduct && (
        <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="truncate text-xs">
              <span className="font-bold text-emerald-300 ml-1">
                {justAddedProduct.emoji} {justAddedProduct.title}
              </span>
              <span className="text-zinc-300">با موفقیت به کاتالوگ فروشگاه اضافه شد.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium cursor-pointer transition"
              >
                مشاهده در کاتالوگ
              </button>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Emoji Selector */}
          <div className="sm:col-span-3">
            <label className="block text-xs text-zinc-400 font-medium mb-1.5">
              آیکون / نشان
            </label>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-xl px-2">{emoji}</span>
              <div className="flex-1 flex gap-1 overflow-x-auto py-1 scrollbar-none">
                {SAMPLE_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`px-1.5 py-0.5 rounded-lg text-sm hover:bg-white/10 transition cursor-pointer ${
                      emoji === e ? 'bg-white/20 ring-1 ring-white/30' : ''
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Title */}
          <div className="sm:col-span-9">
            <label className="block text-xs text-zinc-400 font-medium mb-1.5">
              نام و عنوان محصول <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: هندزفری بلوتوث پرو سری جدید"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Price */}
          <div>
            <label className="block text-xs text-zinc-400 font-medium mb-1.5">
              قیمت واحد (تومان) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={price}
              onChange={(e) => {
                const numeric = e.target.value.replace(/\D/g, '');
                setPrice(numeric ? parseInt(numeric, 10).toLocaleString('en-US') : '');
              }}
              placeholder="مثال: 1,250,000"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono transition"
            />
            {parsedPrice > 0 && (
              <p className="text-[11px] text-purple-400 mt-1 font-medium">
                {formatTomans(parsedPrice)}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs text-zinc-400 font-medium mb-1.5">
              موجودی اولیه انبار
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-zinc-400 font-medium mb-1.5">
              دسته‌بندی
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-zinc-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-zinc-400 font-medium mb-1.5">
            توضیحات یا ویژگی‌های کلیدی (اختیاری)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: گارانتی ۱۸ ماهه شرکتی، رنگ مشکی مات"
            className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500 transition"
          />
        </div>

        {/* Submit and action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || parsedPrice <= 0}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'در حال ثبت...' : 'ثبت محصول در انبار'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>مشاهده کاتالوگ انبار</span>
              </button>
            )}
            {onOpenInvoice && (
              <button
                type="button"
                onClick={onOpenInvoice}
                className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <ReceiptText className="w-3.5 h-3.5" />
                <span>صدور فاکتور</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// 2. Interactive Generative Widget: PRODUCT CATALOG BENTO GRID
// ============================================================================
interface StoreProductCatalogWidgetProps {
  onAddProductClick?: () => void;
  onSelectForInvoice?: (product: StoreProduct) => void;
  onOpenInvoice?: () => void;
}

export function StoreProductCatalogWidget({
  onAddProductClick,
  onSelectForInvoice,
  onOpenInvoice,
}: StoreProductCatalogWidgetProps) {
  const [products, setProducts] = useState<StoreProduct[]>(() => (typeof window !== 'undefined' ? getStoreProducts() : []));
  const [profile, setProfile] = useState<StoreProfile | null>(() => (typeof window !== 'undefined' ? getStoreProfile() : null));
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');

  const reload = () => {
    setProducts(getStoreProducts());
    setProfile(getStoreProfile());
  };

  useEffect(() => {
    return subscribeStoreUpdates(reload);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این محصول از کاتالوگ انبار اطمینان دارید؟')) {
      deleteStoreProduct(id);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'همه' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['همه', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden w-full my-3 p-5 sm:p-6 rounded-[28px] bg-zinc-900/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/15 dark:border-white/10 shadow-2xl text-zinc-100 font-sans"
    >
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                کاتالوگ و لیست محصولات فعال
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {products.length} محصول در انبار
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              فروشگاه: <span className="text-white font-medium">{profile?.storeName || 'فروشگاه من'}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {onAddProductClick && (
            <button
              type="button"
              onClick={onAddProductClick}
              className="px-3.5 py-2 rounded-2xl bg-purple-600/80 hover:bg-purple-600 border border-purple-500/30 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن محصول</span>
            </button>
          )}
          {onOpenInvoice && (
            <button
              type="button"
              onClick={onOpenInvoice}
              className="px-3.5 py-2 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-500/30 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ReceiptText className="w-3.5 h-3.5" />
              <span>صدور فاکتور</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام کالا..."
            className="w-full pr-9 pl-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'bg-black/30 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid of Products */}
      {filtered.length === 0 ? (
        <div className="relative z-10 p-8 text-center rounded-2xl bg-black/30 border border-white/5">
          <p className="text-xs text-zinc-400 mb-3">هیچ محصولی مطابق جستجو یافت نشد.</p>
          {onAddProductClick && (
            <button
              type="button"
              onClick={onAddProductClick}
              className="px-4 py-2 rounded-2xl bg-white text-zinc-950 text-xs font-bold transition cursor-pointer"
            >
              ثبت اولین محصول
            </button>
          )}
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="group relative p-4 rounded-[22px] bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                    {prod.emoji || '📦'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-zinc-300 border border-white/10">
                      انبار: {prod.stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer opacity-0 group-hover:opacity-100"
                      title="حذف از انبار"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white mb-1 leading-snug line-clamp-2">
                  {prod.title}
                </h4>
                {prod.description && (
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
                    {prod.description}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-cyan-300 font-mono">
                  {formatTomans(prod.price)}
                </span>

                {onSelectForInvoice ? (
                  <button
                    type="button"
                    onClick={() => onSelectForInvoice(prod)}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>افزودن به فاکتور</span>
                  </button>
                ) : onOpenInvoice ? (
                  <button
                    type="button"
                    onClick={onOpenInvoice}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 text-[11px] font-medium transition cursor-pointer"
                  >
                    انتخاب در فاکتور
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. Interactive Generative Widget: INVOICE BUILDER & CHECKOUT
// ============================================================================
interface StoreInvoiceBuilderWidgetProps {
  initialProduct?: StoreProduct;
  onInvoiceCreated?: (invoice: StoreInvoice) => void;
  onOpenCatalog?: () => void;
}

export function StoreInvoiceBuilderWidget({
  initialProduct,
  onInvoiceCreated,
  onOpenCatalog,
}: StoreInvoiceBuilderWidgetProps) {
  const [profile, setProfile] = useState<StoreProfile | null>(() => (typeof window !== 'undefined' ? getStoreProfile() : null));
  const [products, setProducts] = useState<StoreProduct[]>(() => (typeof window !== 'undefined' ? getStoreProducts() : []));
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ [productId: string]: number }>(() => {
    if (initialProduct) return { [initialProduct.id]: 1 };
    if (typeof window !== 'undefined') {
      const prods = getStoreProducts();
      if (prods.length > 0) return { [prods[0].id]: 1 };
    }
    return {};
  });
  const [discount, setDiscount] = useState('0');
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedInvoice, setIssuedInvoice] = useState<StoreInvoice | null>(null);

  useEffect(() => {
    return subscribeStoreUpdates(() => {
      setProfile(getStoreProfile());
      setProducts(getStoreProducts());
    });
  }, []);

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const invoiceItemList = Object.entries(selectedItems)
    .map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      if (!p) return null;
      return {
        productId: p.id,
        title: `${p.emoji || ''} ${p.title}`.trim(),
        price: p.price,
        quantity: qty,
      };
    })
    .filter(Boolean) as { productId: string; title: string; price: number; quantity: number }[];

  const subtotal = invoiceItemList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const parsedDiscount = parseInt(discount.replace(/\D/g, ''), 10) || 0;
  const total = Math.max(0, subtotal - parsedDiscount);

  const handleIssueInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || invoiceItemList.length === 0) return;

    setIsIssuing(true);
    setTimeout(() => {
      const inv = createStoreInvoice(
        customerName.trim(),
        invoiceItemList,
        parsedDiscount,
        customerPhone.trim() || undefined
      );
      setIssuedInvoice(inv);
      setIsIssuing(false);
      onInvoiceCreated?.(inv);
    }, 500);
  };

  if (issuedInvoice) {
    return (
      <StoreOfficialInvoiceWidget
        invoice={issuedInvoice}
        onNewInvoice={() => {
          setIssuedInvoice(null);
          setCustomerName('');
          setCustomerPhone('');
          setDiscount('0');
        }}
      />
    );
  }

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden w-full my-3 p-5 sm:p-6 rounded-[28px] bg-zinc-900/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/15 dark:border-white/10 shadow-2xl text-zinc-100 font-sans"
    >
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <ReceiptText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                صدور فاکتور و پیش‌فاکتور رسمی
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Invoice Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              فروشگاه:{' '}
              <span className="text-white font-medium">
                {profile?.storeName || 'فروشگاه من'}
              </span>
            </p>
          </div>
        </div>

        {onOpenCatalog && (
          <button
            type="button"
            onClick={onOpenCatalog}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition cursor-pointer"
          >
            مشاهده کاتالوگ
          </button>
        )}
      </div>

      <form onSubmit={handleIssueInvoice} className="relative z-10 space-y-4">
        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-black/30 border border-white/10">
          <div>
            <label className="block text-xs text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>نام و نام خانوادگی خریدار</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: سارا محمدی"
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>شماره موبایل خریدار (اختیاری)</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Product selection list for invoice */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-zinc-300">
              اقلام انتخابی فاکتور ({invoiceItemList.length} قلم کالا)
            </span>
            <span className="text-[11px] text-zinc-500">
              برای کم و زیاد کردن، از دکمه‌های + و - استفاده کنید
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {products.map((prod) => {
              const qty = selectedItems[prod.id] || 0;
              return (
                <div
                  key={prod.id}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition ${
                    qty > 0
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-black/20 border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{prod.emoji || '📦'}</span>
                    <div className="truncate">
                      <h5 className="text-xs font-bold text-white truncate">{prod.title}</h5>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {formatTomans(prod.price)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    {qty > 0 ? (
                      <div className="flex items-center gap-1 bg-black/50 border border-white/15 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-bold text-emerald-300">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateQuantity(prod.id, 1)}
                        className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-zinc-300 cursor-pointer transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>افزودن</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Summary & Discounts */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>جمع اقلام:</span>
            <span className="font-mono text-white font-semibold">{formatTomans(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-rose-400" />
              <span>تخفیف ویژه فروشگاه (تومان):</span>
            </span>
            <input
              type="text"
              value={discount}
              onChange={(e) => {
                const numeric = e.target.value.replace(/\D/g, '');
                setDiscount(numeric ? parseInt(numeric, 10).toLocaleString('en-US') : '0');
              }}
              className="w-32 px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-xs text-right font-mono text-rose-400 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm sm:text-base font-extrabold text-emerald-300">
            <span>مبلغ نهایی قابل پرداخت:</span>
            <span className="font-mono">{formatTomans(total)}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isIssuing || !customerName.trim() || invoiceItemList.length === 0}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ReceiptText className="w-4 h-4" />
          <span>{isIssuing ? 'در حال صدور فاکتور نهایی...' : 'ثبت خرید و صدور فاکتور رسمی'}</span>
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// 4. Interactive Generative Widget: OFFICIAL DIGITAL INVOICE
// ============================================================================
interface StoreOfficialInvoiceWidgetProps {
  invoice: StoreInvoice;
  onNewInvoice?: () => void;
}

export function StoreOfficialInvoiceWidget({
  invoice,
  onNewInvoice,
}: StoreOfficialInvoiceWidgetProps) {
  const [profile, setProfile] = useState<StoreProfile | null>(() => (typeof window !== 'undefined' ? getStoreProfile() : null));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return subscribeStoreUpdates(() => {
      setProfile(getStoreProfile());
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `🧾 فاکتور رسمی فروشگاه ${profile?.storeName || 'AUTOFLOW'}
شماره فاکتور: ${invoice.invoiceNumber}
خریدار: ${invoice.customerName} ${invoice.customerPhone ? `(${invoice.customerPhone})` : ''}
اقلام:
${invoice.items.map((i, idx) => `${idx + 1}. ${i.title} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString()} تومان`).join('\n')}
جمع کل: ${invoice.subtotal.toLocaleString()} تومان
تخفیف: ${invoice.discount.toLocaleString()} تومان
مبلغ پرداختی نهایی: ${invoice.total.toLocaleString()} تومان
وضعیت: پرداخت و تایید شده ✅`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const invoiceDate = new Date(invoice.createdAt).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden w-full my-4 p-6 sm:p-8 rounded-[32px] bg-zinc-900/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-zinc-100 font-sans print:bg-white print:text-black print:border-none"
    >
      {/* Aurora glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none print:hidden" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none print:hidden" />

      {/* Official Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10 print:border-zinc-300">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-teal-500/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold block mb-0.5">
              فاکتور فروش کالا و خدمات
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight print:text-black">
              {profile?.storeName || 'فروشگاه رسمی هوشمند'}
            </h2>
            <p className="text-xs text-zinc-400 print:text-zinc-600 mt-0.5">
              مدیریت: {profile?.ownerName || 'مدیر فروشگاه'} • پشتیبانی:{' '}
              {profile?.phone || '۰۹۱۲۰۰۰۰۰۰۰'}
            </p>
          </div>
        </div>

        {/* Invoice Metadata Badge */}
        <div className="flex flex-col sm:items-end gap-1 font-mono text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>شماره فاکتور: {invoice.invoiceNumber}</span>
          </div>
          <span className="text-zinc-400 print:text-zinc-600 text-[11px]">
            تاریخ صدور: {invoiceDate}
          </span>
        </div>
      </div>

      {/* Customer Info Bar */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 print:bg-zinc-100 print:border-zinc-300 mb-6">
        <div>
          <span className="text-[11px] text-zinc-400 block mb-0.5">مشخصات خریدار:</span>
          <span className="text-sm font-bold text-white print:text-black">
            {invoice.customerName}
          </span>
        </div>
        {invoice.customerPhone && (
          <div>
            <span className="text-[11px] text-zinc-400 block mb-0.5">شماره تماس:</span>
            <span className="text-sm font-mono font-semibold text-zinc-300 print:text-zinc-800">
              {invoice.customerPhone}
            </span>
          </div>
        )}
      </div>

      {/* Itemized Table */}
      <div className="relative z-10 overflow-x-auto rounded-2xl border border-white/10 print:border-zinc-300 mb-6">
        <table className="w-full text-right text-xs sm:text-sm">
          <thead className="bg-white/5 print:bg-zinc-200 text-zinc-400 print:text-zinc-700 text-xs font-semibold">
            <tr>
              <th className="py-3 px-3 w-12 text-center">ردیف</th>
              <th className="py-3 px-4">شرح کالا یا خدمات</th>
              <th className="py-3 px-3 text-center">تعداد</th>
              <th className="py-3 px-4 text-left">قیمت واحد</th>
              <th className="py-3 px-4 text-left">مبلغ کل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 print:divide-zinc-200">
            {invoice.items.map((item, idx) => (
              <tr key={item.productId} className="hover:bg-white/5 transition">
                <td className="py-3 px-3 text-center font-mono text-zinc-500">{idx + 1}</td>
                <td className="py-3 px-4 font-medium text-white print:text-black">
                  {item.title}
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-zinc-300 print:text-zinc-800">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-left font-mono text-zinc-400 print:text-zinc-700">
                  {formatTomans(item.price)}
                </td>
                <td className="py-3 px-4 text-left font-mono font-bold text-emerald-300 print:text-black">
                  {formatTomans(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Official Digital Stamp */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end pb-4 border-b border-white/10 print:border-zinc-300 mb-6">
        {/* Digital Verification Stamp */}
        <div className="sm:col-span-6 flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-300 block">
              تاییدیه دیجیتال ثبت خرید
            </span>
            <span className="text-[10px] text-zinc-400 leading-tight block">
              این فاکتور با مهر دیجیتال سامانه هوشمند AUTOFLOW ثبت و پرداخت گردید.
            </span>
          </div>
        </div>

        {/* Financial Numbers */}
        <div className="sm:col-span-6 space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>مجموع ناخالص:</span>
            <span className="font-mono text-white font-medium">
              {formatTomans(invoice.subtotal)}
            </span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-xs text-rose-400">
              <span>تخفیف اعمال شده:</span>
              <span className="font-mono">-{formatTomans(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-extrabold text-emerald-300 print:text-black pt-2 border-t border-white/10 print:border-zinc-300">
            <span>مبلغ نهایی پرداختی:</span>
            <span className="font-mono">{formatTomans(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Print & Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ / ذخیره فاکتور</span>
          </button>
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'کپی شد!' : 'کپی مشخصات'}</span>
          </button>
        </div>

        {onNewInvoice && (
          <button
            type="button"
            onClick={onNewInvoice}
            className="px-4 py-2 rounded-2xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>صدور فاکتور جدید</span>
          </button>
        )}
      </div>
    </div>
  );
}
