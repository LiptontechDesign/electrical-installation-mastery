import Link from 'next/link';

export const metadata = { title: 'Terms · Electrical Installation Mastery' };

export default function TermsPage() {
  return <main className="policy-page">
    <article>
      <Link className="policy-back" href="/">← Electrical Installation Mastery</Link>
      <span className="eyebrow">Account policy</span>
      <h1>Terms of use</h1>
      <p className="policy-updated">Last updated 23 September 2026</p>
      <p>By using Electrical Installation Mastery, you agree to use the service lawfully and for personal learning.</p>

      <h2>Educational purpose</h2>
      <p>The course supports study and revision. It does not replace current legislation, official licensing requirements, manufacturer instructions, site-specific risk assessment, competent supervision or professional electrical judgment.</p>

      <h2>Your account</h2>
      <p>You are responsible for activity performed through your Google account. Do not attempt to access another learner&apos;s records, disrupt the service, or upload unlawful or harmful material.</p>

      <h2>Course availability</h2>
      <p>The course may be corrected, reorganized or updated as teaching needs and technical requirements change. Reasonable care is taken to keep the service available, but uninterrupted availability is not guaranteed.</p>

      <h2>Your data</h2>
      <p>Use of account information and learning records is described in the <Link href="/privacy">Privacy policy</Link>. You can export or delete your account data from Account settings.</p>

      <h2>Contact</h2>
      <p>Questions about these terms can be sent to <a href="mailto:liptontechdesign@gmail.com">liptontechdesign@gmail.com</a>.</p>
    </article>
  </main>;
}
