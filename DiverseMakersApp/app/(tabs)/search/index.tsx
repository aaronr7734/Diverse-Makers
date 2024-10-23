import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";

const SearchScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: settings.highContrast ? "#000" : "#fff",
        },
      ]}
    >
      <Searchbar
        placeholder="Search activities..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={[
          styles.searchBar,
          {
            backgroundColor: settings.highContrast ? "#333" : "#f0f0f0",
          },
        ]}
        iconColor={settings.highContrast ? "#fff" : "#000"}
        inputStyle={{
          color: settings.highContrast ? "#fff" : "#000",
          fontSize: settings.fontSize,
        }}
        placeholderTextColor={settings.highContrast ? "#ccc" : "#666"}
        accessible
        accessibilityLabel="Search activities"
        accessibilityHint="Enter text to search for activities"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    borderRadius: 8,
  },
});

export default SearchScreen;

