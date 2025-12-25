import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  fixed?: boolean;
}

export default function Header({ fixed = false }: HeaderProps) {
  return (
    <header className={`${fixed ? 'fixed' : ''} top-0 left-0 w-full p-4 mix-blend-difference z-[100]`}>
      <div className="logo">
        <Link href="/lures">
          <Image
            src="/images/common/logo-sll.svg"
            alt="SLL Logo"
            width={120}
            height={40}
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
      </div>
      <div className="hamburger"></div>
    </header>
  );
}
