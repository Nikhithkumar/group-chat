import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface AppViewProps extends ViewProps {
	style?: StyleProp<ViewStyle>;
	lightBackground?: string;
	darkBackground?: string;
	borderColor?: string;
	borderWidth?: number;
	borderRadius?: number;
}

const AppView: React.FC<AppViewProps> = ({
	style,
	lightBackground,
	darkBackground,
	borderColor,
	borderWidth,
	borderRadius,
	...props
}) => {
	const { theme, isDark } = useTheme();

	console.log('isDark', isDark, theme);

	const dynamicStyle: ViewStyle = {
		backgroundColor: isDark
			? darkBackground ?? theme.background
			: lightBackground ?? theme.background,
		...(borderColor && { borderColor }),
		...(borderWidth !== undefined && { borderWidth }),
		...(borderRadius !== undefined && { borderRadius }),
	};

	return <View style={[dynamicStyle, style]} {...props} />;
};

export default AppView;
