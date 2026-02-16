import React from 'react';
import { FaLinkedin, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import Image from 'next/image';

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
            <li className="hover:text-white transition">Home</li>
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
            <li className="hover:text-white transition">About Us</li>
            <li className="hover:text-white transition">Contact Us</li>
            <li className="hover:text-white transition">Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <FaLinkedin className="text-2xl hover:text-white transition cursor-pointer" />
        <FaFacebookF className="text-2xl hover:text-white transition cursor-pointer" />
        <BsTwitterX className="text-2xl hover:text-white transition cursor-pointer" />
        <FaYoutube className="text-2xl hover:text-white transition cursor-pointer" />
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
