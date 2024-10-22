import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import the icon set you want to use
import React from 'react';

export default function TabLayout() {
  return (

    <Tabs>
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home Screen',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Local Makerspace Discovery Tab */}
      <Tabs.Screen
        name="localMakerspaceDiscovery"
        options={{
          title: 'Makerspaces',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profileContainer"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
