
import React, { useState } from 'react';

type Step = 'generate' | 'verify' | 'reset';

interface ForgotPasswordModalProps {
  onClose: () => void;
  userType: 'admin' | 'docs';
  onPasswordReset: (userType: 'admin' | 'docs', newPassword: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, userType, onPasswordReset }) => {
  const [step, setStep] = useState<Step>('generate');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const recoveryEmail = "mdsafiulla727@gmail.com";
  const subject = `Password Reset Request for Portfolio (${userType === 'admin' ? 'Admin' : 'Document'} Section)`;
  const mailtoLink = `mailto:${recoveryEmail}?subject=${encodeURIComponent(subject)}`;
  const magicCode = '123456';

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === magicCode) {
      setError('');
      setStep('reset');
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill out both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    onPasswordReset(userType, newPassword);
  };
  
  const renderStep = () => {
    switch(step) {
      case 'generate':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Forgot Password (Step 1/3)</h2>
            <p className="text-text-secondary mb-6">
              This is a simulation. Click below to "send" a reset request, then proceed to the next step.
            </p>
            <p className="text-sm text-text-secondary mb-6">
              An email would be sent to: <strong className="text-highlight">{recoveryEmail}</strong>
            </p>
            <a
              href={mailtoLink}
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                setStep('verify');
              }}
              className="inline-block w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-500 transition-colors"
            >
              Generate Reset Email & Proceed
            </a>
          </div>
        );
      case 'verify':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Enter Code (Step 2/3)</h2>
            <p className="text-text-secondary mb-6">
              Enter the 6-digit verification code you "received" in your email.
              <br/>
              (Hint: the code is <strong className="text-highlight">{magicCode}</strong>)
            </p>
            <form onSubmit={handleVerification}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full p-3 bg-primary text-text-primary rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent text-center tracking-[0.5em]"
                autoFocus
              />
               <button
                  type="submit"
                  className="mt-6 w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-500 transition-colors"
                >
                  Verify Code
                </button>
            </form>
          </div>
        );
      case 'reset':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Set New Password (Step 3/3)</h2>
            <p className="text-text-secondary mb-6">
              Enter and confirm your new password below.
            </p>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-3 bg-primary text-text-primary rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full p-3 bg-primary text-text-primary rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
              />
               <button
                  type="submit"
                  className="mt-6 w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-500 transition-colors"
                >
                  Set New Password
                </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70]">
      <div className="bg-secondary p-8 rounded-lg shadow-2xl w-full max-w-md m-4 border border-gray-700 relative">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors" 
          onClick={onClose}
          aria-label="Close"
        >&times;</button>
        
        {renderStep()}

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
