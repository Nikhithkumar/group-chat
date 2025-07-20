import React from 'react';
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleProp,
	TextStyle,
	ViewStyle,
	StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './AppText';

interface AppButtonProps extends TouchableOpacityProps {
	title: string;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({ title, style, textStyle, ...props }) => {
	const { theme } = useTheme();

	return (
		<TouchableOpacity
			style={[styles.button, { backgroundColor: theme.primary }, style]}
			activeOpacity={0.8}
			{...props}
		>
			<AppText style={[styles.text, textStyle]}>{title}</AppText>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontWeight: 'bold',
        color: '#FFF',
        fontSize: 16,
	},
});

export default AppButton;
