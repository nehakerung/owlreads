import React from 'react'
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface Props{
    mobile?: boolean
}

const NavItems = ({mobile}: Props) => {
  return (
    <div className={cn(`flex items-center justify-center gap-6 ${mobile ? "flex-col" : "flex-row"}`)}>

        <Link href="/profile" className="text-lg font-medium text-gray-900 hover:text-gray-700 transition">
        </Link>

        <button className="btnprimary">Login</button>
        <button className="btnprimary">Log Out</button>

        <div className="relative flex items-center h-10 w-10 justify-center">
            <FiBookOpen className="text-4xl"/>
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brown shadow-md">
            {/* Replace with user profile image */}
        </div>

    </div>
  )
}

export default NavItems