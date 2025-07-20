import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const AppText: React.FC<TextProps> = ({ style, ...props }) => {
	const { theme } = useTheme();
	return <Text style={[{ color: theme.text }, style]} {...props} />;
};

export default AppText;