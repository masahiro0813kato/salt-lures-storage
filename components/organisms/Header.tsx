import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full p-4 mix-blend-difference">
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
