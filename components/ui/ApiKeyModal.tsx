'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Key, Eye, EyeOff, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';
import { Button } from './Button';
import { validateCustomApiKey } from '@/lib/validation/eventBriefSchema';

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
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      const validation = validateCustomApiKey(trimmed);
      if (!validation.isValid) {
        setErrorMsg(validation.error || 'Invalid API key format.');
        return;
      }
    }
    setErrorMsg('');
    onSave(trimmed);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
  };

  const handleClear = () => {
    setApiKeyInput('');
    setErrorMsg('');
    onSave('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      aria-describedby="api-key-modal-desc"
      className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#e5e5ea] animate-in fade-in zoom-in-95 duration-200"
    >
      <button
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3.5 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-[#e8f2fe] flex items-center justify-center text-[#0071e3] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h2 id="api-key-modal-title" className="text-lg font-bold text-[#1d1d1f] tracking-tight">
            BYO Gemini API Key
          </h2>
          <p className="text-xs text-[#86868b]">Custom Google AI Studio Integration</p>
        </div>
      </div>

      <p id="api-key-modal-desc" className="text-sm text-[#515154] mb-5 leading-relaxed">
        Supply your personal Google Gemini API key to run real-time celebration planning with dedicated quotas.
        If omitted, CelebrationPilot AI automatically utilizes the server-side environment engine or high-fidelity deterministic fallback.
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="gemini-api-key-input"
            className="block text-xs font-semibold text-[#1d1d1f] tracking-wide"
          >
            Google Gemini API Key
          </label>
          <div className="relative">
            <input
              id="gemini-api-key-input"
              ref={inputRef}
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="AIzaSy... or AQ.Ab8..."
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={errorMsg ? 'api-key-error' : undefined}
              className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] font-mono tracking-tight"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? 'Hide key' : 'Show key'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-lg"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errorMsg && (
            <p id="api-key-error" role="alert" className="text-xs text-[#d70015] font-medium mt-1">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-[#e5e5ea] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#248a3d] shrink-0 mt-0.5" />
          <div className="text-xs text-[#515154] space-y-1 leading-relaxed">
            <p className="font-semibold text-[#1d1d1f]">Transparent Privacy & Security</p>
            <p>
              Your key is saved exclusively in your browser&apos;s local storage and transmitted via secure HTTPS headers to our API route, which forwards it to Google&apos;s Gemini API for plan generation. We never persist, database, or log your key.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#86868b] flex items-center justify-between pt-1">
          <span>Need a free API key?</span>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0071e3] hover:underline inline-flex items-center gap-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded"
          >
            Get a free key at Google AI Studio
            <Sparkles className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="mt-7 pt-4 border-t border-[#e5e5ea] flex items-center justify-between gap-3">
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-md animate-in fade-in duration-200"
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
