import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Import ThemedText

export default function Search() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Search Screen</ThemedText>
    </View>
  );
}
