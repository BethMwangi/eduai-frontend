"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/common/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const publicMenuItems = [
  // { title: "Products", href: "/" },
  // { title: "Use Cases", href: "/" },
  { title: "Blog", href: "/blog" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

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