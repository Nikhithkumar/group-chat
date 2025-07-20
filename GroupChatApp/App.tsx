import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './src/theme/ThemeContext';
import JoinScreen from './src/screens/JoinScreen';
import ChatScreen from './src/screens/ChatScreen';

export type RootStackParamList = {
	Join: undefined;
	Chat: { username: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<ThemeProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName='Join'>
					<Stack.Screen name='Join' component={JoinScreen} options={{ headerShown: false }} />
					<Stack.Screen name='Chat' component={ChatScreen} options={{ headerShown: false }} />
				</Stack.Navigator>
			</NavigationContainer>
		</ThemeProvider>
	);
}