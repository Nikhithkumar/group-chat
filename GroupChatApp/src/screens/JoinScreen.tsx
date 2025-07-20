/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import AppView from '../components/AppView';
import AppInput from '../components/AppInput';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { darkTheme, lightTheme } from '../theme/colors';
import AppButton from '../components/AppButton';

const JoinScreen = () => {
  const [username, setUsername] = useState('');
  const navigation =
    useNavigation<any>();
  const { isDark } = useTheme();

  const handleJoin = () => {
    if (!username.trim()) return;
    navigation.navigate('Chat', { username });
  };

  return (
    <AppView style={styles.container}>
      <AppText style={styles.title}>Welcome to the Chat!</AppText>
      <AppInput
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={
          isDark ? darkTheme.placeholder : lightTheme.placeholder
        }
      />
      <AppButton
        title="Join Chat"
        onPress={handleJoin}
		    style={{marginTop: 20}}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
	fontWeight: 'bold',
  },

});

export default JoinScreen;
