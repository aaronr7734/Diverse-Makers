import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home Screen', headerShown: false}} />
      <Tabs.Screen name="profileContainer" options={{ title: 'Profile' }} /> 
    </Tabs>
  );
}
