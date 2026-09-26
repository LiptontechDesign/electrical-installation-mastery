import Link from 'next/link';
import Image from 'next/image';
import { InstallAction } from '../pwa-support';

export const metadata = { title: 'Install the app', description: 'Add Electrical Installation Mastery to your phone or computer home screen.' };

export default function InstallPage() {
  return <main className="pwa-page"><Link className="pwa-back" href="/">← Back to the course</Link>
    <header className="pwa-hero"><Image src="/icons/app-192.png" alt="" width={88} height={88}/><span className="eyebrow">Your course, one tap away</span><h1>Electrical Mastery.<br/>On your home screen.</h1><p>Open lessons, books and practice in their own app window. Install directly from your browser—no app-store download needed.</p><InstallAction/></header>
    <section className="pwa-instructions" aria-label="Installation instructions">
      <article><h2>iPhone &amp; iPad</h2><ol><li>Open this website in <strong>Safari</strong>.</li><li>Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</li><li>Keep <strong>Open as Web App</strong> enabled if it is shown, then tap <strong>Add</strong>.</li></ol><p>If the option is missing, check the Share menu’s additional actions.</p></article>
      <article><h2>Android</h2><ol><li>Open this website in <strong>Chrome</strong> or another browser that supports installation.</li><li>Use the install button above when available, or open your browser’s menu.</li><li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong> and follow the prompts.</li></ol></article>
      <article><h2>Computer</h2><p>In Chrome or Edge, look for the install icon in the address bar or the browser’s app menu. In supported Safari versions, use <strong>Add to Dock</strong>.</p></article>
    </section>
    <section className="pwa-online"><h2>Keep an internet connection</h2><p>Installation adds the app to your device. It does not download the course videos or reference books. Videos, books, account sync and opening new course pages need internet access.</p><p>If a page cannot connect, a reconnect screen helps you try again. Updates arrive from the website when you open or reload it; an update will not automatically reload an open lesson or practice attempt.</p><p>Your signed-in learning remains tied to your account. You may need to sign in again in the installed app. Practice working still lasts only while the page is open—download it before closing or reloading.</p></section>
    <footer><Link href="/">Open the course →</Link><Link href="/privacy">Privacy</Link></footer>
  </main>;
}
