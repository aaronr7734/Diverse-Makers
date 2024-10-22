import React, { createContext, useState, useEffect } from "react";
import { FIREBASE_DB, FIREBASE_AUTH } from "../app/firebaseConfig";
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
  settings: { fontSize: 16, highContrast: false },
  updateSettings: () => {},
});

export const UserSettingsProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    fontSize: 16,
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
            fontSize: userData.fontSize || 16,
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
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
      updateDoc(userDocRef, newSettings).catch((error) => {
        console.error("Error updating user settings: ", error);
      });
    }
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};
