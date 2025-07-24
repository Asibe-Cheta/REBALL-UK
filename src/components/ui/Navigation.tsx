"use client";

import Link from "next/link";
import SignInButton from "@/components/auth/SignInButton";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg text-black-dark' 
        : 'bg-transparent text-white'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-permanent-marker">
            REBALL
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="font-poppins font-medium hover:opacity-80 transition-opacity"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="font-poppins font-medium hover:opacity-80 transition-opacity"
            >
              About Us
            </Link>
            <Link 
              href="/resources" 
              className="font-poppins font-medium hover:opacity-80 transition-opacity"
            >
              Resources
            </Link>
            <Link 
              href="/pricing" 
              className="font-poppins font-medium hover:opacity-80 transition-opacity"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="font-poppins font-medium hover:opacity-80 transition-opacity"
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin"
              className="font-poppins font-medium hover:opacity-80 transition-opacity"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register"
              className={`px-6 py-2 rounded-lg font-poppins font-semibold transition-colors ${
                isScrolled
                  ? 'bg-black text-white hover:bg-black-dark'
                  : 'bg-white text-black hover:bg-white-off'
              }`}
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 