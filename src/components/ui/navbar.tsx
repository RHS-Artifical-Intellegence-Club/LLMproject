import React from 'react'
import Image from "next/image";
import Link from "next/link";


const navbar = () => {
  return (
    <header className = "px-5 py-3 bg-neutral-950 shadow-sm shadow-white shadow-blur-lg  font-work-sans p-3 ">
        <nav className = "flex justify-between items-center">
            <Link href = "/" className="flex items-center space-x-2 transition-transform duration-300 ease-in-out transform hover:scale-110">
                <Image src = "/leo-website.png" alt = "logo" width = {75} height = {100}/>
            </Link>

            <div className = "flex space-x-3">
  
            <Link href="/signIn" className = "p-<1> px-2 py-1 text-white font-sans hover:bg-orange-600 rounded-sm transition-transform duration-300 ease-in-out transform hover:scale-110">
                Sign In
            </Link> 

            <Link href="/signUp" className = "p-<1> px-2 py-1 text-white font-sans hover:bg-orange-600 rounded-sm transition-transform duration-300 ease-in-out transform hover:scale-110">
                Sign Up
            </Link> 


            </div>      
        </nav>
    </header>
  )
}

export default navbar