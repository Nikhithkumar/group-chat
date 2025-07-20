/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppView from './AppView';

const AppInput: React.FC<any> = ({
  placeholderTextColor,
  value,
  onChangeText,
  placeholder
}) => {
  const { theme } = useTheme();
  return (
    <AppView
      style={styles.input}
      lightBackground={theme.inputBackground}
      darkBackground={theme.inputBackground}
    >
      <TextInput
        style={[
          { backgroundColor: theme.inputBackground, color: theme.text },
          styles.inputstyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
    </AppView>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    height: 50,
    marginTop: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputstyle: {
    fontSize: 18,
    textAlign:'left',
  },
});
