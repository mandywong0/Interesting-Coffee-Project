import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  theme: 'light' | 'dark';
  preferredSeating: 'indoor' | 'outdoor';
  preferredPayment: 'cash' | 'creditCard';
  pricePreference: '$' | '$$';
  setTheme: (theme: 'light' | 'dark') => void;
  setPreferredSeating: (seating: 'indoor' | 'outdoor') => void;
  setPreferredPayment: (payment: 'cash' | 'creditCard') => void;
  setPricePreference: (price: '$' | '$$') => void;
}

type SettingsState = Omit<SettingsContextType, 'setTheme' | 'setPreferredSeating' | 'setPreferredPayment' | 'setPricePreference'>;

const defaultSettings: SettingsState = {
  theme: 'dark',
  preferredSeating: 'indoor',
  preferredPayment: 'cash',
  pricePreference: '$',
};

export const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  setTheme: () => {},
  setPreferredSeating: () => {},
  setPreferredPayment: () => {},
  setPricePreference: () => {},
});

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedSettings = localStorage.getItem('cafeFinderSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('cafeFinderSettings', JSON.stringify(settings));
  }, [settings]);

  const setTheme = (theme: 'light' | 'dark') => {
    setSettings((prev: SettingsState) => ({ ...prev, theme }));
  };

  const setPreferredSeating = (preferredSeating: 'indoor' | 'outdoor') => {
    setSettings((prev: SettingsState) => ({ ...prev, preferredSeating }));
  };

  const setPreferredPayment = (preferredPayment: 'cash' | 'creditCard') => {
    setSettings((prev: SettingsState) => ({ ...prev, preferredPayment }));
  };

  const setPricePreference = (pricePreference: '$' | '$$') => {
    setSettings((prev: SettingsState) => ({ ...prev, pricePreference }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTheme,
        setPreferredSeating,
        setPreferredPayment,
        setPricePreference,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext); 