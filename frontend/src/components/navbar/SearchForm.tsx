import React from 'react'
import Form from "next/form";
import { Search } from "lucide-react";
// import {Search} from "lucide-react";
const SearchForm = () => {
  return (
    <Form action="/" scroll={false} className="search-form">
        <input name="query" className="flex-1 font-bold w-full outline-none" placeholder="Search for books" />

        <button className="size-7 rounded-full bg-[#473c38] flex justify-center items-center cursor-pointer text-grey">
            <Search className="size-4" />
        </button>
    </Form>
  )
}

export default SearchForm