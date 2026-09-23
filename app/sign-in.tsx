import { authConfigured } from './server/auth';
import Link from 'next/link';

export default function SignIn({ error }: { error?: string }) {
  const configured = authConfigured();
  return <main className="sign-in-page">
    <section className="sign-in-card" aria-labelledby="sign-in-title">
      <div className="sign-in-mark" aria-hidden="true">⚡</div>
      <span className="eyebrow">Electrical Installation Mastery</span>
      <h1 id="sign-in-title">Your private learning workshop</h1>
      <p>Sign in with Google to keep your videos, notes, bookmarks, course order and reading place separate from every other learner and available across your devices.</p>
      {error && <p className="sign-in-error" role="alert">Sign-in was not completed. Please try again.</p>}
      {configured ? <a className="google-sign-in" href="/api/auth/google"><span aria-hidden="true">G</span> Continue with Google</a> : <p className="sign-in-pending" role="status">Account setup is being completed. Please check again shortly.</p>}
      <small>Only your name, email address and profile picture are used for the course account. The course never receives your Google password.</small>
      <nav className="policy-links" aria-label="Account policies"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
    </section>
  </main>;
}
