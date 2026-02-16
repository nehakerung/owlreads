import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/ui/buttons.module.css';

const Navbar = () => {
  return (
    <nav className="sticky top-0 left-0 w-full z-20 bg-[#9dcd5a] py-6 border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src="/logowTitle.png"
              alt="OwlReads Logo"
              width={180}
              height={38}
              priority
            />
          </Link>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div placeholder="Search invoices..." />
            <button type="submit" className={styles.btnprimary}>
              Search
            </button>
          </div>
        </div>

        {/* Auth links */}
        <div className="flex items-center gap-4">
          <button type="submit" className={styles.btnprimary}>
            Log in
          </button>
          <button type="submit" className={styles.btnprimary}>
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
