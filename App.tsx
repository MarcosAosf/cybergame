import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  RobotoMono_400Regular,
  RobotoMono_700Bold
} from '@expo-google-fonts/roboto-mono';

import { RoadScreen } from './src/screens/RoadScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RankingScreen } from './src/screens/RankingScreen';
import { AudioProvider } from './src/components/AudioProvider';

export default function App() {
  const [currentTab, setCurrentTab] = useState('road');
  const [fontsLoaded] = useFonts({
    RobotoMono_400Regular,
    RobotoMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Image 
          source={require('./assets/branding/escudo.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <Text style={styles.loadingText}>// SCANNING_SYSTEM...</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'road':
        return <RoadScreen />;
      case 'ranking':
        return <RankingScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <RoadScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <AudioProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
          
          <View style={styles.content}>
            {renderContent()}
          </View>

          <SafeAreaView edges={['bottom']} style={styles.tabBar}>
            <TouchableOpacity 
              style={styles.tabItem} 
              onPress={() => setCurrentTab('road')}
              activeOpacity={0.7}
            >
              <Text style={{ ...styles.tabIcon, color: currentTab === 'road' ? '#00d4ff' : '#a0a0a0' }}>🏠</Text>
              <Text style={{ ...styles.tabLabel, color: currentTab === 'road' ? '#00d4ff' : '#a0a0a0' }}>Mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabItem} 
              onPress={() => setCurrentTab('ranking')}
              activeOpacity={0.7}
            >
              <Text style={{ ...styles.tabIcon, color: currentTab === 'ranking' ? '#00d4ff' : '#a0a0a0' }}>🏆</Text>
              <Text style={{ ...styles.tabLabel, color: currentTab === 'ranking' ? '#00d4ff' : '#a0a0a0' }}>Ranking</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabItem} 
              onPress={() => setCurrentTab('profile')}
              activeOpacity={0.7}
            >
              <Text style={{ ...styles.tabIcon, color: currentTab === 'profile' ? '#00d4ff' : '#a0a0a0' }}>👤</Text>
              <Text style={{ ...styles.tabLabel, color: currentTab === 'profile' ? '#00d4ff' : '#a0a0a0' }}>Perfil</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </AudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00d4ff',
    marginTop: 20,
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: 'RobotoMono_400Regular',
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
  },
});