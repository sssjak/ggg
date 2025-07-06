import React, { useState } from 'react';
import { icons } from '../constants';

interface HeaderProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onAdminClick, onLogout, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#skills', label: 'Skills' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#videos', label: 'Videos' },
    { href: '#education', label: 'Education' },
    { href: '#story', label: 'Story' },
    { href: '#social', label: 'Links' },
    { href: '#documents', label: 'Docs' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };
  
  return (
    <header className="bg-secondary/70 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" onClick={(e) => handleScroll(e, 'body')} className="text-xl font-serif font-bold text-text-primary hover:text-highlight transition-colors">My Portfolio</a>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={(e) => handleScroll(e, link.href)} className="text-text-secondary font-medium hover:text-highlight transition-colors duration-300">{link.label}</a>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <button
              onClick={onReset}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-300 text-text-secondary"
              aria-label="Reset data to default"
              title="Reset to Default"
            >
              {icons.reset}
            </button>
          )}
          <button
            onClick={isAdmin ? onLogout : onAdminClick}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-300"
            aria-label={isAdmin ? 'Logout Admin' : 'Login Admin'}
          >
            {isAdmin ? (
              <span className="text-highlight" title="Admin Mode On">{icons.unlock}</span>
            ) : (
              <span className="text-text-secondary" title="Admin Login">{icons.lock}</span>
            )}
          </button>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-secondary focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isOpen ? "M4 6h16M4 12h16m-7 6h7" : "M6 18L18 6M6 6l12 12"}></path></svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-secondary/95">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={(e) => handleScroll(e, link.href)} className="text-text-secondary hover:text-highlight transition-colors duration-300 block py-2 font-medium">{link.label}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;