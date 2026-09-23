import Link from 'next/link';

export const metadata = { title: 'Privacy · Electrical Installation Mastery' };

export default function PrivacyPage() {
  return <main className="policy-page">
    <article>
      <Link className="policy-back" href="/">← Electrical Installation Mastery</Link>
      <span className="eyebrow">Account policy</span>
      <h1>Privacy</h1>
      <p className="policy-updated">Last updated 23 September 2026</p>
      <p>Electrical Installation Mastery is a private learning service operated by Liptontech. This policy explains the limited information used to provide individual course accounts.</p>

      <h2>Information we use</h2>
      <ul>
        <li><strong>Google account details:</strong> your Google account identifier, name, email address and profile picture.</li>
        <li><strong>Learning records:</strong> video completion, notes, bookmarks, reading position, course ordering and supplementary-video choices.</li>
        <li><strong>Service data:</strong> essential session cookies and ordinary hosting security logs needed to operate and protect the service.</li>
      </ul>

      <h2>How the information is used</h2>
      <p>The information is used only to sign you in, keep your learning records separate from other users, synchronize your course across devices, and maintain the security and reliability of the service. It is not sold or used for advertising.</p>

      <h2>Google access</h2>
      <p>The service requests only the standard Google OpenID profile scopes needed for sign-in: identity, email and basic profile. It never receives your Google password and does not store Google access or refresh tokens.</p>

      <h2>Storage and sharing</h2>
      <p>Account and learning records are stored in a private Neon Postgres database connected to the course&apos;s Vercel project. Course books are stored in private Vercel Blob storage. Data is disclosed to these infrastructure providers only as required to run the service, or when required by law.</p>

      <h2>Your choices</h2>
      <p>You can export your account data or permanently delete your account and learning records from Account settings. You can also revoke this app&apos;s Google access from your Google Account. Essential security logs may remain for the limited period maintained by the hosting providers.</p>

      <h2>Contact</h2>
      <p>Questions or privacy requests can be sent to <a href="mailto:liptontechdesign@gmail.com">liptontechdesign@gmail.com</a>.</p>
    </article>
  </main>;
}
