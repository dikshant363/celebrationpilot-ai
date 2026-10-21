'use client';

import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';
import { Button } from './Button';

function ApiKeyDialogContent({
  initialKey,
  onClose,
  onSave,
}: {
  initialKey: string;
  onClose: () => void;
  onSave: (val: string) => void;
}) {
  const [apiKeyInput, setApiKeyInput] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSave(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKeyInput('');
    onSave('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="relative w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl border border-[#d2d2d7] animate-in fade-in zoom-in-95 duration-200"
    >
      <button
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute top-5 right-5 p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-[#e8f2fe] flex items-center justify-center text-[#0071e3]">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h2 id="api-key-modal-title" className="text-lg font-semibold text-[#1d1d1f]">
            BYO Gemini API Key
          </h2>
          <p className="text-xs text-[#86868b]">Custom Google AI Studio Integration</p>
        </div>
      </div>

      <p className="text-sm text-[#555555] mb-5 leading-relaxed">
        Supply your personal Google Gemini API key to run real-time celebration planning with dedicated quotas.
        If omitted, CelebrationPilot AI automatically utilizes the server-side environment engine or high-fidelity deterministic fallback.
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="gemini-api-key-input"
            className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase"
          >
            Google Gemini API Key
          </label>
          <div className="relative">
            <input
              id="gemini-api-key-input"
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy... or AQ.Ab8..."
              className="w-full pl-4 pr-11 py-2.5 text-sm bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? 'Hide key' : 'Show key'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] p-1"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="bg-[#f5f5f7] rounded-xl p-3.5 border border-[#e5e5ea] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#34c759] shrink-0 mt-0.5" />
          <div className="text-xs text-[#555555] space-y-1 leading-relaxed">
            <p className="font-semibold text-[#1d1d1f]">Privacy & Security Guarantee</p>
            <p>
              Your key is saved exclusively in your browser&apos;s local storage and transmitted solely to our Next.js API route via secure HTTPS headers for model inference.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#86868b] flex items-center justify-between pt-1">
          <span>Need a free API key?</span>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0071e3] hover:underline inline-flex items-center gap-1 font-medium"
          >
            Get a free key at Google AI Studio
            <Sparkles className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#e5e5ea] flex items-center justify-between gap-3">
        {apiKeyInput ? (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear Key
          </Button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            {savedSuccess ? 'Saved!' : 'Save Key'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ApiKeyModal() {
  const { userApiKey, setUserApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen } = useEvent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isApiKeyModalOpen) {
        setIsApiKeyModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isApiKeyModalOpen, setIsApiKeyModalOpen]);

  if (!isApiKeyModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsApiKeyModalOpen(false);
        }
      }}
    >
      <ApiKeyDialogContent
        initialKey={userApiKey || ''}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={setUserApiKey}
      />
    </div>
  );
}
