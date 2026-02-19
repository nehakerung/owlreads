import React from 'react';
import { FaLinkedin, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#9dcd5a] text-[#473c38] w-full py-16">
      <div className="flex justify-between items-center main-max-width mx-auto padding-x flex-wrap gap-6 max-md:justify-center">
        {/* Logo & Description */}
        <div className="flex flex-col gap-6 w-125">
          <Image
            src="/logowTitle.png"
            alt="OwlReads Logo"
            width={180}
            height={38}
            priority
          />
          <p className="text-[15px]leading-[1.6]">
            Encourage reading for pleasure and personal growth. Discover a wide
            range of books, from timeless classics to contemporary bestsellers,
            all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <ul className="space-y-3">
            <li className="hover:text-white transition">
              <Link href="/">Home</Link>
            </li>
            <li className="hover:text-white transition">Browse Books</li>
            <li className="hover:text-white transition">Browse Genres</li>
            <li className="hover:text-white transition">Most Popular</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold">Categories</h2>
          <ul className="space-y-3">
            <li className="hover:text-white transition">FAQ</li>

            <li className="hover:text-white transition">
              <Link href="/aboutus">About Us</Link>
            </li>

            <li className="hover:text-white transition">
              <Link href="/contactus">Contact Us</Link>
            </li>

            <li className="hover:text-white transition">Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <Link href="https://www.linkedin.com/">
          <FaLinkedin className="text-2xl hover:text-white transition cursor-pointer" />
        </Link>
        <Link href="https://www.facebook.com/">
          <FaFacebookF className="text-2xl hover:text-white transition cursor-pointer" />
        </Link>
        <Link href="https://twitter.com/">
          <BsTwitterX className="text-2xl hover:text-white transition cursor-pointer" />
        </Link>
        <Link href="https://www.youtube.com/">
          <FaYoutube className="text-2xl hover:text-white transition cursor-pointer" />
        </Link>
        {/* <ContactLinks /> */}
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-8">
        © {new Date().getFullYear()} Owlreads. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
