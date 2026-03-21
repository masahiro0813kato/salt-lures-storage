import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  fixed?: boolean;
}

export default function Header({ fixed = false }: HeaderProps) {
  return (
    <>
    <header className={`${fixed ? 'fixed' : ''} top-0 left-0 w-full p-4 z-[100] hidden md:flex items-center`}>
      <div className="flex-shrink-0">
        <Link href="/">
          <Image
            src="/images/common/logo-sll.svg"
            alt="SLL Logo"
            width={120}
            height={40}
            priority
            style={{ width: '120px', height: '40px' }}
          />
        </Link>
      </div>
      <nav className="flex-1 flex items-center justify-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-white hover:text-accent-green transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </Link>
        <Link href="/lures" className="flex items-center gap-2 text-sm text-white hover:text-accent-green transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Lure
        </Link>
      </nav>
      <div className="flex-shrink-0">
        <button className="text-white hover:text-accent-green transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
    <header className={`${fixed ? 'fixed' : ''} top-0 left-0 w-full p-4 z-[100] md:hidden`}>
      <div className="logo">
        <Link href="/">
          <Image
            src="/images/common/logo-sll.svg"
            alt="SLL Logo"
            width={120}
            height={40}
            priority
            style={{ width: '120px', height: '40px' }}
          />
        </Link>
      </div>
    </header>
    </>
  );
}
