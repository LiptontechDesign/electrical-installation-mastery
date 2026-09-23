'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Bookmark, Check, ChevronDown, Cloud, LogOut, Settings, ShieldCheck, UserRound, X } from 'lucide-react';
import GoogleSignInButton from './google-sign-in-button';
import type { CourseUser } from './server/auth';
import { useRef } from 'react';

const AccountContext = createContext<{ user: CourseUser | null; requestSignIn: () => void }>({ user: null, requestSignIn: () => {} });
export const useCourseAccount = () => useContext(AccountContext);

export function CourseAccountProvider({ user, authError, children }: { user: CourseUser | null; authError?: string; children: ReactNode }) {
  const [open, setOpen] = useState(Boolean(authError));
  const dialog = useRef<HTMLDialogElement>(null);
  const requestSignIn = useCallback(() => setOpen(true), []);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previous; previousFocus?.focus(); };
  }, [open]);
  return <AccountContext.Provider value={{ user, requestSignIn }}>
    {children}
    {open && <dialog ref={dialog} className="account-invitation" aria-labelledby="account-invitation-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
        <button className="invitation-close icon-button" aria-label="Close sign in" onClick={() => setOpen(false)}><X size={22}/></button>
        <span className="invitation-icon"><Bookmark size={26}/></span><span className="eyebrow neutral">Your own learning space</span>
        <h2 id="account-invitation-title">Keep your place.<br/>Build on your progress.</h2>
        <p>The whole course is open. Sign in when you want a learning record that stays with you.</p>
        <ul><li><Check size={18}/> Save watched lessons, notes and bookmarks</li><li><Check size={18}/> Pick up on any device</li><li><Check size={18}/> Organize your own course without affecting others</li></ul>
        {authError && <p role="alert">Sign-in was not completed. You can try again or keep browsing.</p>}
        <GoogleSignInButton/>
        <button className="browse-instead" onClick={() => setOpen(false)}>Keep exploring without an account</button>
        <small>Guest learning activity is not saved. <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></small>
    </dialog>}
  </AccountContext.Provider>;
}

export function AccountControl({ onSettings }: { onSettings: () => void }) {
  const { user, requestSignIn } = useCourseAccount();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const words = user?.name.trim().split(/\s+/) ?? [];
  const initials = (words.length > 1 ? words[0][0] + words.at(-1)![0] : words[0]?.slice(0, 2) ?? '').toUpperCase();
  if (!user) return <button className="account-sign-in" onClick={requestSignIn}><UserRound size={17}/><span>Sign in</span></button>;
  return <div className="account-control" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); root.current?.querySelector('button')?.focus(); } }}>
    <button className="account-trigger" aria-expanded={open} aria-controls="course-account-menu" aria-label={`Your account: ${user.name}`} onClick={() => setOpen(value => !value)}><span className="account-avatar" aria-hidden="true">{initials}</span><span className="account-trigger-label"><strong>{words[0]}</strong><small>My learning account</small></span><ChevronDown size={14} className="account-chevron"/></button>
    {open && <div id="course-account-menu" className="account-popover"><div className="account-menu-identity"><span className="account-avatar" aria-hidden="true">{initials}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div><p>{user.isAdmin ? <ShieldCheck size={15}/> : <Cloud size={15}/>} {user.isAdmin ? 'Administrator' : 'Personal learning account'}</p><button onClick={() => { setOpen(false); onSettings(); }}><Settings size={17}/> Account & settings</button><form action="/api/auth/logout" method="post"><button type="submit"><LogOut size={17}/> Sign out</button></form><small className="account-menu-note">Your saved learning stays here when you sign out.</small></div>}
  </div>;
}
