"use client"

import React, { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import SearchForm from "./SearchForm";
import NavItems from './NavItems';
import MobileNavBar from "./MobileNavBar";
import SearchButton from './SearchButton';

const NavBar = () => {

  const [showSearchForm, setShowSearchForm] = useState(false)

  const handleSearch = () => {
    setShowSearchForm(curr => !curr)
  }
  return (
    <>
    <nav className="sticky top-0 left-0 w-full z-20 py-4 bg-[#9dcd5a]">
        <div className="flex justify-between items-center main-max-width mx-auto padding-x border-white">
          <Link href="/">
            <Image src="/logowTitle.png" alt="OwlReads Logo" width={180} height={38} priority/>
          </Link>

          <div className="max-lg:hidden">
            <SearchForm />
          </div>

          <div className = "max-lg:block hidden">
            <SearchButton handleSearch={handleSearch} showSearchForm={showSearchForm}/>

          </div>

          <div className="max-md:hidden">
            <NavItems />
          </div>
          <div className="max-md:block hidden">
            <MobileNavBar />
          </div>
        </div>
    </nav>
      {showSearchForm && (
        <div className="w-75 mx-auto mt-4 max-lg:block hidden">
          <SearchForm />
        </div>
      )}
    </>
  )
};

export default NavBar
