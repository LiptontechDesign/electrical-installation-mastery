'use client';
import { useState } from 'react';
import { Download, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import type { CourseUser } from './server/auth';

export default function AccountPanel({ user }: { user: CourseUser }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  async function deleteData() {
    if (confirmation !== 'DELETE MY DATA') return;
    setDeleting(true); setError('');
    try {
      const response = await fetch('/api/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ confirmation }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      localStorage.removeItem(`electrical-mastery-progress-v1:${user.id}`);
      localStorage.removeItem(`electrical-supplementary-watched-v1:${user.id}`);
      window.location.reload();
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Your data was not deleted.');
      setDeleting(false);
    }
  }
  return <section className="settings-section account-settings">
    <span className="eyebrow neutral">Google account</span>
    <div className="account-identity">
      <span aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
      <div><strong>{user.name}</strong><small>{user.email}</small>{user.isAdmin && <em><ShieldCheck size={13} /> Administrator</em>}</div>
    </div>
    <a className="settings-link" href="/api/account/export"><Download size={19} /><span><strong>Download all account data</strong><small>Export every cloud-saved course record</small></span></a>
    <form action="/api/auth/logout" method="post"><button type="submit"><LogOut size={19} /><span><strong>Sign out</strong><small>Your cloud records remain safely saved</small></span></button></form>
    <details className="delete-account"><summary><Trash2 size={18} /> Delete my course data</summary><p>This permanently removes your course account and all saved learning records. It does not delete your Google account.</p><label>Type <strong>DELETE MY DATA</strong><input value={confirmation} onChange={event => setConfirmation(event.target.value)} autoComplete="off" /></label><button className="danger" type="button" disabled={deleting || confirmation !== 'DELETE MY DATA'} onClick={() => void deleteData()}>{deleting ? 'Deleting…' : 'Permanently delete my data'}</button>{error && <p role="alert">{error}</p>}</details>
  </section>;
}
