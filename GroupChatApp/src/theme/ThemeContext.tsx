import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { lightTheme, darkTheme, ThemeType } from './colors';

interface ThemeContextProps {
	theme: ThemeType;
	toggleTheme: () => void;
	isDark: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const colorScheme: ColorSchemeName = Appearance.getColorScheme(); // 'light' | 'dark' | null
	const [isDark, setIsDark] = useState(colorScheme === 'dark');

	// Optional: respond to system theme changes dynamically
	useEffect(() => {
		const subscription = Appearance.addChangeListener(({ colorScheme }) => {
			setIsDark(colorScheme === 'dark');
		});
		return () => subscription.remove();
	}, []);

	const toggleTheme = () => setIsDark((prev) => !prev);

	const value = {
		theme: isDark ? darkTheme : lightTheme,
		toggleTheme,
		isDark,
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error('useTheme must be used within a ThemeProvider');
	return context;
};
