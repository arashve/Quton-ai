'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  LogOut,
  Check,
  Loader2,
  Sparkles,
  ExternalLink,
  Shield,
  Upload,
  Link as LinkIcon,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DitherShader } from '@/components/ui/dither-shader';

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
];

function UserProfileCardContent({ onClose }: { onClose: () => void }) {
  const { user, signOutUser, updateUserProfile } = useAuth();
  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Click outside and Escape key to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!user) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('حجم تصویر نباید بیشتر از ۲ مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoURL(reader.result);
        setIsEditing(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateUserProfile({
        displayName: displayName.trim() || undefined,
        photoURL: photoURL.trim() || undefined,
      });
      setSuccessMessage('اطلاعات با موفقیت ذخیره شد');
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMessage('');
      }, 1200);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'خطا در ویرایش اطلاعات';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const initialLetter = (user.displayName || user.email || 'U')[0].toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-5 pt-20 pointer-events-none">
      {/* Subtle backdrop on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto sm:hidden"
      />

      {/* Google Account Style Card */}
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.92, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -12 }}
        transition={{ type: 'spring', damping: 26, stiffness: 350 }}
        className="relative pointer-events-auto w-full max-w-[380px] bg-[#1F2023]/95 backdrop-blur-xl border border-white/10 text-white rounded-[28px] shadow-2xl shadow-black/80 overflow-hidden flex flex-col z-10"
        dir="rtl"
      >
        {/* Header with User Email & Close Button */}
        <div className="relative flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono truncate max-w-[280px]" dir="ltr">
            <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{user.email || 'حساب کاربری'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Content Body */}
        <div className="p-5 flex flex-col items-center text-center">
          {/* Avatar Centerpiece with Camera Edit Button */}
          <div className="relative group my-2">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-[#2A2B2F] relative flex items-center justify-center">
              {photoURL ? (
                <DitherShader
                  src={photoURL}
                  gridSize={1}
                  ditherMode="bayer"
                  colorMode="duotone"
                  primaryColor="#254EAF"
                  secondaryColor="#4d6cb3"
                  threshold={0.45}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white select-none">
                  {initialLetter}
                </span>
              )}
            </div>

            {/* Camera Overlay button */}
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                fileInputRef.current?.click();
              }}
              className="absolute bottom-0 left-0 w-7 h-7 rounded-full bg-[#254EAF] hover:bg-blue-600 text-white flex items-center justify-center shadow-md border border-white/20 transition-transform active:scale-90 cursor-pointer"
              title="تغییر عکس پروفایل"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />
          </div>

          {/* User Name & Greeting */}
          {!isEditing ? (
            <>
              <h3 className="text-base font-bold text-white mt-1">
                سلام، {user.displayName || 'کاربر گرامی'}!
              </h3>
              <p className="text-xs text-white/50 font-mono mt-0.5" dir="ltr">
                {user.email}
              </p>

              {/* Manage / Edit Profile Pill Button (Google style) */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-4 px-5 py-2 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 text-xs font-semibold text-white/90 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>ویرایش اطلاعات حساب</span>
              </button>
            </>
          ) : (
            /* Edit Profile Form */
            <form onSubmit={handleSave} className="w-full mt-3 text-right">
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    نام نمایشی
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="نام شما"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/15 focus:border-blue-500 focus:outline-none text-white transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-white/70">
                      عکس پروفایل
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <LinkIcon className="w-2.5 h-2.5" />
                      {showUrlInput ? 'انتخاب از لیست' : 'آدرس اینترنتی (URL)'}
                    </button>
                  </div>

                  {showUrlInput ? (
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      dir="ltr"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/15 focus:border-blue-500 focus:outline-none text-white transition"
                    />
                  ) : (
                    <div className="flex items-center gap-2 justify-center py-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-white/90 transition border border-white/10"
                      >
                        <Upload className="w-3 h-3 text-blue-400" />
                        <span>آپلود از دستگاه</span>
                      </button>

                      {/* Quick avatar choices */}
                      <div className="flex items-center gap-1.5">
                        {PRESET_AVATARS.slice(0, 3).map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setPhotoURL(url)}
                            className={`w-6 h-6 rounded-full overflow-hidden border transition ${
                              photoURL === url ? 'border-blue-500 scale-110 ring-2 ring-blue-500/40' : 'border-white/20 hover:border-white/60'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                        {photoURL && (
                          <button
                            type="button"
                            onClick={() => setPhotoURL('')}
                            className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center text-[10px]"
                            title="حذف عکس"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback messages */}
              {errorMessage && (
                <p className="text-[11px] text-red-400 mt-2 text-center">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-[11px] text-emerald-400 mt-2 text-center flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{successMessage}</span>
                </p>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 rounded-xl bg-[#254EAF] hover:bg-blue-600 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>ذخیره تغییرات</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs transition cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Links & Service Integration */}
        <div className="px-5 py-3 border-t border-white/5 bg-black/20 flex flex-col gap-1.5">
          <a
            href="/chat"
            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-xs text-white/80 transition"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>ورود به محیط استودیو چت</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-white/40" />
          </a>
        </div>

        {/* Sign Out & Footer */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between">
          <button
            type="button"
            onClick={async () => {
              onClose();
              await signOutUser();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از حساب</span>
          </button>

          <span className="text-[10px] text-white/30 px-3">
            Quton Account
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function UserProfilePopup({ isOpen, onClose }: UserProfilePopupProps) {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <UserProfileCardContent
        key={`${user.uid}-${user.displayName || ''}-${user.photoURL || ''}`}
        onClose={onClose}
      />
    </AnimatePresence>
  );
}
