import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { RoadScreen } from '../screens/RoadScreen';
import { RankingScreen } from '../screens/RankingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../theme/colors';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

// --- Auth Stack Removed ---

// --- Tab Bar Component ---
const TabBarIcon = ({ label, focused }: { label: string, focused: boolean }) => (
  <Text style={[
    styles.tabIcon, 
    { color: focused ? COLORS.primary : '#555' }
  ]}>
    {label === 'Mapa' ? '🏠' : label === 'Ranking' ? '🏆' : '👤'}
  </Text>
);

// --- Main Navigation ---
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      gestureEnabled: false,
      animationEnabled: true,
      tabBarShowLabel: true,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: '#050505',
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
        height: 70,
        paddingBottom: 10,
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: '#555',
      tabBarLabelStyle: {
        fontFamily: 'RobotoMono_400Regular',
        fontSize: 10,
      },
      tabBarIcon: ({ focused }) => {
        let label = '';
        if (route.name === 'Road') label = 'Mapa';
        else if (route.name === 'Ranking') label = 'Ranking';
        else if (route.name === 'Profile') label = 'Perfil';
        return <TabBarIcon label={label} focused={focused} />;
      },
    })}
  >
    <MainTab.Screen name="Road" component={RoadScreen} options={{ tabBarLabel: 'Mapa' }} />
    <MainTab.Screen name="Ranking" component={RankingScreen} options={{ tabBarLabel: 'Ranking' }} />
    <MainTab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
  </MainTab.Navigator>
);

export const AppNavigator = () => {
  // STABLE_RECOVERY: Local-only baseline forces MainStack
  return <MainTabNavigator />;
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
    marginTop: 5,
  },
});
