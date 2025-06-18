'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TopHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="bg-white px-6 py-4 shadow-sm flex justify-between items-center">
      <div className="text-xl font-semibold text-[#1d2233]">readtention.com</div>

      {/* Menu icon (for mobile) */}
      <button onClick={toggleMenu} className="md:hidden text-2xl">
        📚
      </button>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6 text-sm text-[#1d2233]">
        <a onClick={() => router.push('/books')} className="cursor-pointer">My Books</a>
        <a onClick={() => router.push('/bookshelf')} className="cursor-pointer">Bookshelf</a>
        <a className="cursor-pointer">Trends</a>
        <a className="cursor-pointer">AI Agent</a>
        <a className="cursor-pointer">Pricing</a>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-md flex flex-col p-4 gap-3 md:hidden text-sm z-50">
          <a onClick={() => { toggleMenu(); router.push('/books'); }} className="cursor-pointer">My Books</a>
          <a onClick={() => { toggleMenu(); router.push('/bookshelf'); }} className="cursor-pointer">Bookshelf</a>
          <a className="cursor-pointer">Trends</a>
          <a className="cursor-pointer">AI Agent</a>
          <a className="cursor-pointer">Pricing</a>
        </div>
      )}
    </header>
  );
}
