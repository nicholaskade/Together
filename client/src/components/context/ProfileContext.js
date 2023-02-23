import { useState, useContext, useReducer, createContext } from "react";

const ProfileContext = createContext(null);
const ProfileDispatchContext = createContext(null);

const initialProfile = { profile: null };

function useProfile() {
  return useContext(ProfileContext);
}

function useProfileDispatch() {
  return useContext(ProfileDispatchContext);
}

function profileReducer(profile, action) {
  switch (action.type) {
    case "mount": {
      return {
        ...profile,
        profile: action.profile,
      };
    }
    case "unmount": {
      return {
        ...profile,
        profile: null,
      };
    }
  }
}

function ProfileProvider({ children }) {
  const [profile, dispatch] = useReducer(profileReducer, initialProfile);

  return (
    <ProfileContext.Provider value={profile}>
      <ProfileDispatchContext.Provider value={dispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
}

export { ProfileContext, ProfileProvider, useProfileDispatch, useProfile };
