import Image from 'next/image';

/** Official Google identity artwork; see developers.google.com/identity/branding-guidelines. */
export default function GoogleSignInButton() {
  return <a className="google-sign-in google-branded-button" href="/api/auth/google"><Image src="/google-g.png" width={20} height={20} alt="" unoptimized/>Continue with Google</a>;
}
