import profileData from '../data/profile.json';

const STORAGE_KEY = 'lapas_profile';

class ProfileService {
  constructor() {
    // No initialization needed
  }

  // Get profile dari local data dengan fallback ke localStorage
  async getProfile() {
    // Fallback ke localStorage atau file default
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEY);
      if (storedProfile) {
        return JSON.parse(storedProfile);
      }
    } catch (error) {
      console.warn('localStorage unavailable:', error);
    }

    return profileData;
  }

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('Error saving profile data:', error);
      throw error;
    }
  }

  updateStruktur(strukturData) {
    const profile = this.getProfile();
    const updatedProfile = {
      ...profile,
      struktur: {
        ...profile.struktur,
        ...strukturData
      }
    };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  }
}

const profileService = new ProfileService();
export default profileService;
