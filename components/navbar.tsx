'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function NavBar() {
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-black to-blue-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Chorulla Palli
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="text-white hover:text-blue-200">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/add-mosque" className="text-white hover:text-blue-200">
                Add Mosque
              </Link>
              {userProfile?.role === "admin" && (
                <Link href="/dashboard" className="text-white hover:text-blue-200">
                  Dashboard
                </Link>
              )}
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
              <Button variant="default" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-black to-blue-900 mt-2 p-4 rounded-md">
          <Link href="/" className="block text-white py-2" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {user ? (
            <>
              <Link href="/add-mosque" className="block text-white py-2" onClick={() => setIsOpen(false)}>
                Add Mosque
              </Link>
              {userProfile?.role === "admin" && (
                <Link href="/dashboard" className="block text-white py-2" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              )}
              <Button 
                variant="secondary"
                className="w-full mt-2"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-white py-2" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Button variant="default" className="w-full mt-2" asChild>
                <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}