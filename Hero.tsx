import React from 'react';
import Editable from './Editable';

interface HeroProps {
  profilePictureUrl: string;
  fullName: string;
  bio: string;
  isEditing: boolean;
  onProfilePictureChange: (value: string) => void;
  onFullNameChange: (value:string) => void;
  onBioChange: (value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ profilePictureUrl, fullName, bio, isEditing, onProfilePictureChange, onFullNameChange, onBioChange }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      onProfilePictureChange(newUrl);
    }
  };

  return (
    <section id="home" className="text-center py-20">
      <div className="max-w-3xl mx-auto">
        <div className="relative inline-block">
            <img
            src={profilePictureUrl}
            alt="Profile Picture"
            className="w-40 h-40 rounded-full mx-auto mb-8 object-cover border-4 border-accent shadow-lg"
            />
        </div>
         {isEditing && (
          <div className="max-w-md mx-auto mb-6">
            <label
              htmlFor="profile-pic-upload"
              className="cursor-pointer text-center block w-48 mx-auto bg-accent text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-violet-500 transition-colors"
            >
              Change Picture
            </label>
            <input
              type="file"
              id="profile-pic-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        )}
        <Editable
          as="h1"
          isEditing={isEditing}
          value={fullName}
          onChange={onFullNameChange}
          className="text-5xl md:text-7xl font-serif font-bold text-text-primary mb-4"
          textareaClassName="text-5xl md:text-7xl font-serif font-bold text-text-primary mb-4 text-center"
        />
        <Editable
          as="p"
          isEditing={isEditing}
          value={bio}
          onChange={onBioChange}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto"
           textareaClassName="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto text-center"
        />
      </div>
    </section>
  );
};

export default Hero;