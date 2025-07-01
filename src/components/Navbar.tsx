// src/components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity">
          PoliGraph+
        </Link>
        {/* Basic responsive toggle for mobile - functionality would require JS */}
        {/* <button className="md:hidden px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button> */}
        <div className="space-x-6 text-lg"> {/* Increased spacing and text size */}
          <Link href="/" className="hover:text-purple-300 transition-colors duration-300 ease-in-out">Home</Link>
          <Link href="/sports" className="hover:text-purple-300 transition-colors duration-300 ease-in-out">Sports</Link>
          <Link href="/news" className="hover:text-purple-300 transition-colors duration-300 ease-in-out">News</Link>
          <Link href="/live" className="hover:text-purple-300 transition-colors duration-300 ease-in-out">Live</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
