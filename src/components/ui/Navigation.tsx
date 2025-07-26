"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

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
        : 'bg-black bg-opacity-80 backdrop-blur-sm text-white'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={isScrolled ? "/images/logos/reball-logo-black.png" : "/images/logos/reball-logo-white.png"}
              alt="REBALL"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="hover:opacity-80 transition-opacity"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="hover:opacity-80 transition-opacity"
            >
              About Us
            </Link>
            <Link 
              href="/resources" 
              className="hover:opacity-80 transition-opacity"
            >
              Resources
            </Link>
            <Link 
              href="/pricing" 
              className="hover:opacity-80 transition-opacity"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="hover:opacity-80 transition-opacity"
            >
              Contact
            </Link>
            {session?.user && (
              <Link 
                href="/videos" 
                className="hover:opacity-80 transition-opacity"
              >
                Videos
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link 
                href="/dashboard"
                className="hover:opacity-80 transition-opacity"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth/signin"
                  className="hover:opacity-80 transition-opacity"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register"
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isScrolled
                      ? 'bg-black text-white hover:bg-black-dark'
                      : 'bg-white text-black hover:bg-white-off'
                  }`}
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 