import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { RoadScreen } from '../screens/RoadScreen';
import { RankingScreen } from '../screens/RankingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../theme/colors';
import { Text, StyleSheet } from 'react-native';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const AuthNavigator = () => (
  <AuthStack.Navigator 
    screenOptions={{ 
      headerShown: Boolean(false),
      gestureEnabled: Boolean(false),
      animationEnabled: Boolean(true),
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

const TabBarIcon = ({ label, focused }: { label: string, focused: boolean }) => (
  <Text style={[
    styles.tabIcon, 
    { color: focused ? COLORS.primary : '#555' }
  ]}>
    {label === 'Mapa' ? '🏠' : label === 'Ranking' ? '🏆' : '👤'}
  </Text>
);

export const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: Boolean(false),
      gestureEnabled: Boolean(false),
      animationEnabled: Boolean(true),
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
    <MainTab.Screen 
      name="Road" 
      component={RoadScreen} 
      options={{ tabBarLabel: 'Mapa' }}
    />
    <MainTab.Screen 
      name="Ranking" 
      component={RankingScreen} 
      options={{ tabBarLabel: 'Ranking' }}
    />
    <MainTab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ tabBarLabel: 'Perfil' }}
    />
  </MainTab.Navigator>
);

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
    marginTop: 5,
  },
});
