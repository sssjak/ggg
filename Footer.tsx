import React from 'react';

interface FooterProps {
  fullName: string;
  isEditing: boolean;
}

const Footer: React.FC<FooterProps> = ({ fullName, isEditing }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={`bg-secondary/50 mt-24 border-t border-gray-800 transition-all duration-300 ${isEditing ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-6 py-8 text-center text-text-secondary">
        <p>&copy; {currentYear} {fullName}. All Rights Reserved.</p>
        <p className="text-sm mt-2">
          This portfolio was built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;