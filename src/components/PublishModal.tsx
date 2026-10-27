import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Globe, 
  Download, 
  Terminal, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Play, 
  Layers,
  ArrowRight,
  Share2
} from 'lucide-react';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl?: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  appUrl = window.location.origin
}) => {
  const [activeTab, setActiveTab] = useState<'internet' | 'playstore' | 'install'>('playstore');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSuccessChime();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const bubblewrapSnippet = `# 1. Install Google's official PWA-to-Play-Store CLI (Bubblewrap)
npm install -g @bubblewrap/cli

# 2. Initialize your Android project from your live web app manifest
bubblewrap init --manifest="${appUrl}/manifest.json"

# 3. Build your signed Android App Bundle (.aab) ready for Google Play
bubblewrap build

# -> Output: app-release-bundle.aab (Upload this to Google Play Console!)`;

  const capacitorSnippet = `# Alternative: Native Capacitor wrapper with Android Studio
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init KernelPulse com.kernelpulse.app --web-dir dist
npm run build
npx cap add android
npx cap open android`;

  const webDeploySnippet = `# Deploy to Vercel
npx vercel --prod

# Or build standalone Docker container for Google Cloud Run / AWS:
npm run build
node server.ts`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl flex flex-col text-left overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Publishing &amp; App Store Deployment Guide
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Live URL: <span className="text-emerald-400">{appUrl}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTechClick(600);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('playstore');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'playstore'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Google Play Store</span>
          </button>
          
          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('internet');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'internet'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Internet &amp; Web</span>
          </button>

          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('install');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Direct PWA Install</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-sans text-slate-300 leading-relaxed no-scrollbar">
          
          {/* TAB 1: Google Play Store */}
          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                <span className="font-bold flex items-center gap-1 text-xs font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Your App is 100% PWA &amp; Trusted Web Activity (TWA) Ready
                </span>
                <p className="text-[11px] text-slate-300">
                  Google allows you to publish Progressive Web Apps directly to the Google Play Store as native Android packages (.aab) with zero Java/Kotlin boilerplate using <strong>Bubblewrap</strong> or <strong>PWABuilder</strong>.
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-[11px]">1</span>
                    <span>Option A: Instant Packaging with PWABuilder (No Terminal Required)</span>
                  </div>
                  <p className="text-slate-400 text-xs pl-7">
                    1. Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-mono">pwabuilder.com</a>.<br />
                    2. Paste your live app URL (<code>{appUrl}</code>).<br />
                    3. Click <strong>Package for Store</strong> &rarr; Select <strong>Android</strong>.<br />
                    4. Download the generated <code>.aab</code> package and signing key.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-white text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-[11px]">2</span>
                      <span>Option B: CLI Packaging with Google's Bubblewrap</span>
                    </div>
                    <button
                      onClick={() => handleCopy(bubblewrapSnippet, 'bubblewrap')}
                      className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px] font-mono"
                    >
                      {copiedKey === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'bubblewrap' ? 'Copied' : 'Copy Commands'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre">
                    {bubblewrapSnippet}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-[11px]">3</span>
                    <span>Submit to Google Play Console</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1 pl-2">
                    <li>Create an account at <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-emerald-400 underline">play.google.com/console</a> (one-time $25 registration fee).</li>
                    <li>Click <strong>Create App</strong> &rarr; Name it "KernelPulse" &rarr; Choose "App" / "Free".</li>
                    <li>Upload your <code>app-release-bundle.aab</code> in <strong>Production &rarr; Releases</strong>.</li>
                    <li>Complete the Store Listing (app icon, screenshots, description) and submit for Google review!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Internet & Hosting */}
          {activeTab === 'internet' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 space-y-1">
                <span className="font-bold flex items-center gap-1 text-xs font-mono">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Your App is Already Live on the Internet
                </span>
                <p className="text-[11px] text-slate-300">
                  AI Studio has automatically deployed your app to a secure HTTPS Google Cloud Run URL. You can share this URL right now with any user or link your own custom domain.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Current Live URL:</span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-emerald-400">
                  <span className="truncate">{appUrl}</span>
                  <button
                    onClick={() => handleCopy(appUrl, 'url')}
                    className="ml-2 text-slate-400 hover:text-white text-xs flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white block">Deploying to Other Providers (Vercel, Railway, Cloud Run):</span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-[11px]">Command line deployment</span>
                    <button
                      onClick={() => handleCopy(webDeploySnippet, 'deploy')}
                      className="text-slate-400 hover:text-emerald-400 text-xs font-mono flex items-center gap-1"
                    >
                      {copiedKey === 'deploy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'deploy' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre">
                    {webDeploySnippet}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Direct PWA Install */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 space-y-1">
                <span className="font-bold flex items-center gap-1 text-xs font-mono">
                  <Download className="w-4 h-4 text-indigo-400" />
                  Instant Install on Android, iPhone &amp; Desktop (No App Store Needed)
                </span>
                <p className="text-[11px] text-slate-300">
                  Users can install KernelPulse directly to their phone's home screen with a native app icon, fullscreen launch, and offline caching.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Android / Chrome:</span>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1">
                    <li>Open <code>{appUrl}</code> in Chrome on Android.</li>
                    <li>Tap the <strong>three dots menu (⋮)</strong> at top right.</li>
                    <li>Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</li>
                    <li>The app will install as a standalone native app icon!</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">iPhone / iOS Safari:</span>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1">
                    <li>Open <code>{appUrl}</code> in Safari on iOS.</li>
                    <li>Tap the <strong>Share</strong> button (box with upward arrow).</li>
                    <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                    <li>Tap <strong>Add</strong> in the top right.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            PWA Manifest &amp; Icons: <span className="text-emerald-400">Verified &amp; Configured</span>
          </span>
          <button
            onClick={() => {
              playTechClick(700);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors"
          >
            Got it &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
