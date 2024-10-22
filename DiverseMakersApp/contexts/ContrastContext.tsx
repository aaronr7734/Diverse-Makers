import React, { createContext, useContext, useState } from 'react';

type ContrastContextType = {
    highContrastMode: boolean;
    setHighContrastMode: (enabled: boolean) => void;
};

const ContrastContext = createContext<ContrastContextType | undefined>(undefined);

export function ContrastProvider({ children }: { children: React.ReactNode }) {
    const [highContrastMode, setHighContrastMode] = useState(false);

    return (
        <ContrastContext.Provider value={{ highContrastMode, setHighContrastMode }}>
            {children}
        </ContrastContext.Provider>
    );
}

export function useContrast() {
    const context = useContext(ContrastContext);
    if (context === undefined) {
        throw new Error('useContrast must be used within a ContrastProvider');
    }
    return context;
}
