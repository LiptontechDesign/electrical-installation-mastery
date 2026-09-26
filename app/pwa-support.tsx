'use client';

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
type InstallState = { installed: boolean; available: boolean; busy: boolean; message: string; install: () => Promise<void> };
const InstallContext = createContext<InstallState>({ installed: false, available: false, busy: false, message: '', install: async () => {} });
function standalone() { return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone); }
function subscribeStandalone(notify: () => void) { const media = window.matchMedia('(display-mode: standalone)'); media.addEventListener('change', notify); return () => media.removeEventListener('change', notify); }

export function PwaProvider({ children }: { children: ReactNode }) {
  const runningInstalled = useSyncExternalStore(subscribeStandalone, standalone, () => false);
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const available = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); setMessage(''); };
    const complete = () => { setInstalled(true); setPrompt(null); setMessage('The app has been installed. Open it from your home screen or app launcher.'); };
    window.addEventListener('beforeinstallprompt', available);
    window.addEventListener('appinstalled', complete);
    return () => { window.removeEventListener('beforeinstallprompt', available); window.removeEventListener('appinstalled', complete); };
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    // Registration is optional: an unsupported browser can still use the course.
    void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {});
  }, []);
  async function install() {
    if (!prompt || busy) return;
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setMessage(choice.outcome === 'accepted' ? 'Follow your browser’s installation steps. Once complete, open Electrical Mastery from your home screen or app launcher.' : 'Installation cancelled. You can keep using the website, or install later from your browser menu.');
    } catch { setMessage('Your browser could not open installation. Use the browser-menu instructions below.'); }
    finally { setPrompt(null); setBusy(false); }
  }
  return <InstallContext.Provider value={{ installed: installed || runningInstalled, available: !!prompt, busy, message, install }}>{children}</InstallContext.Provider>;
}

export function InstallAction() {
  const state = useContext(InstallContext);
  return <div className="pwa-action">
    {state.installed ? <p className="pwa-installed">✓ You’re using or have installed Electrical Mastery.</p> : state.available ? <button className="primary-button" disabled={state.busy} onClick={state.install}>{state.busy ? 'Opening installation…' : 'Install Electrical Mastery'}</button> : <p>Choose your browser below to add Electrical Mastery to your home screen. If your browser offers an install button, it will appear here.</p>}
    {state.message && <p role="status">{state.message}</p>}
  </div>;
}
