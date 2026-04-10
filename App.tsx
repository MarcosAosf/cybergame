import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { 
  useFonts, 
  RobotoMono_400Regular, 
  RobotoMono_700Bold 
} from '@expo-google-fonts/roboto-mono';

import { AppNavigator } from './src/navigation/AppNavigator';
import { useSecStore } from './src/store/useSecStore';

const SEC_THEME = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
    card: '#050505',
    text: '#00d4ff',
    border: '#1a1a1a',
    primary: '#00d4ff',
  },
};

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  
  const [fontsLoaded] = useFonts({
    RobotoMono_400Regular,
    RobotoMono_700Bold,
  });

  const _hasHydrated = useSecStore(state => state._hasHydrated);

  useEffect(() => {
    // Phase 72 Restoration: Boot gatekeeper synchronized with local assets
    if (fontsLoaded && _hasHydrated) {
      setIsAppReady(true);
    }
  }, [fontsLoaded, _hasHydrated]);

  if (!isAppReady) {
    return <View style={styles.gatekeeper} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={SEC_THEME}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="#000000" 
          translucent={false}
          hidden={false}
        />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gatekeeper: {
    flex: 1,
    backgroundColor: '#000',
  },
});