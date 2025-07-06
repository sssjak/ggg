
import React, { useState } from 'react';

interface AdminModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void;
  onForgotPasswordClick: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ onClose, onSubmit, onForgotPasswordClick }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-secondary p-8 rounded-lg shadow-2xl w-full max-w-sm m-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Admin Login</h2>
        <p className="text-text-secondary mb-6">Enter the password to enable editing mode.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 bg-primary text-text-primary rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-violet-500 transition-colors"
            >
              Unlock
            </button>
          </div>
        </form>
         <div className="text-center mt-4">
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Forgot password?
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
