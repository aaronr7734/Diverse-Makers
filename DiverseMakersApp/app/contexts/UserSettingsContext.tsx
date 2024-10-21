import React, { createContext, useState, useEffect } from "react";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UserSettings {
  fontSize: number;
  highContrast: boolean;
}

interface UserSettingsContextProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const UserSettingsContext = createContext<UserSettingsContextProps>({
  settings: { fontSize: 14, highContrast: false },
  updateSettings: () => {},
});

export const UserSettingsProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    fontSize: 14,
    highContrast: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSettings({
            fontSize: userData.fontSize || 14,
            highContrast: userData.highContrast || false,
          });
        }
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
    // Optionally update settings in Firestore
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
      updateDoc(userDocRef, newSettings);
    }
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};
