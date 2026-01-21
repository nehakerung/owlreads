import Image from "next/image";
import Link from "next/link";
import styles from "../app/ui/buttons.module.css";


const Footer = () => {
  return (
    <nav className="bottom-0 left-0 w-full bg-[#9dcd5a] py-6 border-b">
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
        </div>
      </div>
    </nav>
  );
};

export default Footer;
