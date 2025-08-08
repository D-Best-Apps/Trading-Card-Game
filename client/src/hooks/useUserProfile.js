// client/src/hooks/useUserProfile.js
// ACTION: Replace the entire contents of your file with this.

import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

/**
 * A simple hook that provides access to the shared user profile context.
 * This should be used by any component that needs user information.
 */
const useUserProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    // This error will happen if you try to use the hook outside of the provider.
    throw new Error('useUserProfile must be used within a ProfileProvider');
  }
  return context;
};

export default useUserProfile;