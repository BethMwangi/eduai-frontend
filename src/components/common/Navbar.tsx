"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/common/Button";
import Image from "next/image";
import { useAuth } from "@/context/auth";
import { getDisplayName, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const publicMenuItems = [
  { title: "Products", href: "/products" },
  { title: "Use Cases", href: "/use-cases" },
  { title: "Blog", href: "/blog" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const authenticatedMenuItems = [
  { 
    title: "Dashboard", 
    href: "/dashboard/student", 
    icon: Home 
  },
  { 
    title: "Practice", 
    href: "/student/question-pool", 
    icon: BookOpen 
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    document.body.classList.add("logging-out");
    try {
      await logout();
    } catch (error) {
      console.error("Error during sign out:", error);
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoClick = () => {
    if (user) {
      router.push("/dashboard/student");
    } else {
      router.push("/");
    }
  };

  if (user) {
    // Authenticated Layout - Exact copy of your dashboard navbar
    const displayName = getDisplayName(user);
    const initials = getInitials(displayName);

    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Navigation Menu */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <button onClick={handleLogoClick} className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="StudyPool Logo"
                  width={100}
                  height={40}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <span className="font-bold text-[#182b5c] text-2xl">STUDY</span>
                  <span className="font-bold text-[#ff914d] text-2xl">pool</span>
                </div>
              </button>

              {/* Navigation Menu - Desktop */}
              <nav className="hidden md:flex items-center gap-6">
                {authenticatedMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "text-[#182b5c] bg-blue-50 font-medium"
                          : "text-gray-600 hover:text-[#182b5c] hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-700"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* User & Sign Out */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {displayName}
                  </span>
                  {user?.role && (
                    <span className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outlined"
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border-red-200 hover:border-red-300"
              >
                <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {open && (
            <div className="md:hidden border-t border-gray-200 py-3">
              <nav className="flex flex-col gap-2">
                {authenticatedMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "text-[#182b5c] bg-blue-50 font-medium"
                          : "text-gray-600 hover:text-[#182b5c] hover:bg-gray-50"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Public Layout - Your existing public navbar
  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-3 md:px-8 md:py-4 lg:px-12">
        {/* Left: Logo + Menu Icon (mobile) */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <button onClick={handleLogoClick} className="flex items-center">
            <Image
              src="/logo.png" 
              alt="StudyPool Logo"
              width={100}
              height={40}
              className="mr-2"
            />
            <div className="flex items-center">
              <span className="font-bold text-[#182b5c] text-2xl">STUDY</span>
              <span className="font-bold text-[#ff914d] text-2xl">pool</span>
            </div>
          </button>
        </div>

        {/* Center Nav Items (hidden on small screens) */}
        <nav className="hidden md:flex items-center gap-6">
          {publicMenuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-gray-700 hover:text-indigo-700 transition"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right: Auth Buttons */}
        <div className="hidden md:flex gap-3">
          <Link href="/login">
            <Button variant="outlined" fullWidth>
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" fullWidth>
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 pb-4 md:px-8 lg:px-12">
          <nav className="flex flex-col gap-3">
            {publicMenuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-gray-700 hover:text-indigo-700 transition"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <Link href="/login">
              <button className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="mt-2 w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded">
                Sign Up
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}