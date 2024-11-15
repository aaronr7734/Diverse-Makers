import React, { useState, useEffect, useRef, useContext } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import {
  Searchbar,
  Button,
  Text,
  useTheme,
  ActivityIndicator,
  TextInput,
  Surface,
  Portal,
  Dialog,
  Checkbox,
} from "react-native-paper";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { ActivityService } from "../../services/ActivityService";
import { AccessibilityInfo } from "react-native";
import Activity from "../../models/Activity";
import SearchResults from "./SearchResults";
import * as SecureStore from "expo-secure-store";

const CONFIG = {
  TAG_FILTER_THRESHOLD: 10,
  PAGE_SIZE: 10,
  MAX_HISTORY_ITEMS: 5,
  SEARCH_HISTORY_KEY: "search_history",
} as const;

interface SearchHistoryItem {
  query: string;
  tags: string[];
  timestamp: number;
}

const SearchScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const theme = useTheme();

  const [searchState, setSearchState] = useState({
    query: "",
    selectedTags: [] as string[],
    availableTags: [] as string[],
    tagFilter: "",
    results: [] as Activity[],
    searchHistory: [] as SearchHistoryItem[],
  });

  const [uiState, setUiState] = useState({
    loading: false,
    loadingMore: false,
    error: null as string | null,
    hasSearched: false,
    isLoadingTags: true,
    showHistory: false,
  });

  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    hasMore: true,
  });

  const searchInputRef = useRef<any>(null);
  const resultsRef = useRef<View>(null);

  useEffect(() => {
    (async () => {
      await fetchAvailableTags();
      await loadSearchHistory();
    })();
  }, []);

  const fetchAvailableTags = async () => {
    try {
      const activities = await ActivityService.getAllActivities();
      const tags = new Set<string>();
      activities.forEach(activity => 
        activity.getTags().forEach(tag => tags.add(tag))
      );
      setSearchState(prev => ({
        ...prev,
        availableTags: Array.from(tags).sort(),
      }));
    } catch (err) {
      setUiState(prev => ({
        ...prev,
        error: "Failed to load tags. Please try again.",
      }));
      AccessibilityInfo.announceForAccessibility("Error loading tags");
    } finally {
      setUiState(prev => ({ ...prev, isLoadingTags: false }));
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await SecureStore.getItemAsync(CONFIG.SEARCH_HISTORY_KEY);
      if (history) {
        setSearchState(prev => ({
          ...prev,
          searchHistory: JSON.parse(history),
        }));
      }
    } catch (err) {
      console.error("Failed to load search history:", err);
    }
  };

  const saveSearchHistory = async (query: string, tags: string[]) => {
    if (!query.trim() && tags.length === 0) return;

    try {
      const newHistoryItem: SearchHistoryItem = {
        query,
        tags,
        timestamp: Date.now(),
      };
      const updatedHistory = [newHistoryItem, ...searchState.searchHistory]
        .slice(0, CONFIG.MAX_HISTORY_ITEMS);

      await SecureStore.setItemAsync(
        CONFIG.SEARCH_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );
      setSearchState(prev => ({
        ...prev,
        searchHistory: updatedHistory,
      }));
    } catch (err) {
      console.error("Failed to save search history:", err);
    }
  };

  const handleSearch = async (newSearch: boolean = true) => {
    if (!searchState.query.trim() && !searchState.selectedTags.length) {
      AccessibilityInfo.announceForAccessibility(
        "Please enter a search term or select tags"
      );
      return;
    }

    setUiState(prev => ({
      ...prev,
      loading: newSearch,
      loadingMore: !newSearch,
      error: null,
      hasSearched: true,
    }));

    try {
      const activities = await ActivityService.getAllActivities();
      let filtered = activities;

      if (searchState.query.trim()) {
        const query = searchState.query.toLowerCase();
        filtered = filtered.filter(activity =>
          activity.getTitle().toLowerCase().includes(query)
        );
      }

      if (searchState.selectedTags.length) {
        filtered = filtered.filter(activity =>
          searchState.selectedTags.some(tag => 
            activity.getTags().includes(tag)
          )
        );
      }

      const startIndex = (paginationState.currentPage - 1) * CONFIG.PAGE_SIZE;
      const paginatedResults = filtered.slice(0, startIndex + CONFIG.PAGE_SIZE);

      if (newSearch) {
        setSearchState(prev => ({
          ...prev,
          results: paginatedResults,
        }));
        saveSearchHistory(searchState.query, searchState.selectedTags);
      } else {
        setSearchState(prev => ({
          ...prev,
          results: [...prev.results, ...paginatedResults],
        }));
      }

      setPaginationState(prev => ({
        ...prev,
        hasMore: filtered.length > startIndex + CONFIG.PAGE_SIZE,
      }));

      AccessibilityInfo.announceForAccessibility(
        `Found ${filtered.length} activities`
      );
      resultsRef.current?.focus();
    } catch (err) {
      setUiState(prev => ({
        ...prev,
        error: "Search failed. Please try again.",
      }));
      AccessibilityInfo.announceForAccessibility("Search failed");
    } finally {
      setUiState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false,
      }));
    }
  };

  const clearSearch = () => {
    setSearchState(prev => ({
      ...prev,
      query: "",
      selectedTags: [],
      results: [],
    }));
    setUiState(prev => ({
      ...prev,
      hasSearched: false,
      error: null,
    }));
    setPaginationState({
      currentPage: 1,
      hasMore: true,
    });
    AccessibilityInfo.announceForAccessibility("Search cleared");
    searchInputRef.current?.focus();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: settings.fontSize + 2,
      fontWeight: "bold",
      color: settings.highContrast ? "#fff" : "#000",
      marginBottom: 12,
    },
    searchBar: {
      marginBottom: 16,
      elevation: 0,
      backgroundColor: settings.highContrast ? "#333" : "#f5f5f5",
      borderRadius: 8,
    },
    tagsContainer: {
      backgroundColor: settings.highContrast ? "#222" : "#fff",
      borderRadius: 8,
      padding: 12,
      elevation: 2,
    },
    tagFilterInput: {
      backgroundColor: settings.highContrast ? "#333" : "#f5f5f5",
      marginBottom: 12,
      borderRadius: 4,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      marginVertical: 2,
    },
    tagLabel: {
      flex: 1,
      color: settings.highContrast ? "#fff" : "#000",
      fontSize: settings.fontSize,
      marginLeft: 12,
    },
    buttonContainer: {
      marginTop: 16,
      gap: 8,
    },
  });

  const filteredTags = searchState.tagFilter
    ? searchState.availableTags.filter(tag =>
        tag.toLowerCase().includes(searchState.tagFilter.toLowerCase())
      )
    : searchState.availableTags;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Searchbar
            ref={searchInputRef}
            placeholder="Search activities..."
            value={searchState.query}
            onChangeText={query => 
              setSearchState(prev => ({ ...prev, query }))
            }
            style={styles.searchBar}
            iconColor={settings.highContrast ? "#fff" : "#000"}
            inputStyle={{
              color: settings.highContrast ? "#fff" : "#000",
              fontSize: settings.fontSize,
            }}
            placeholderTextColor={settings.highContrast ? "#ccc" : "#666"}
            accessibilityRole="search"
            accessibilityLabel="Search activities"
          />

          {searchState.searchHistory.length > 0 && !uiState.hasSearched && (
            <Button
              mode="outlined"
              onPress={() => setUiState(prev => ({ ...prev, showHistory: true }))}
              accessibilityLabel="View recent searches"
            >
              View Recent Searches
            </Button>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter by Tags</Text>

          <Surface style={styles.tagsContainer}>
            {searchState.availableTags.length >= CONFIG.TAG_FILTER_THRESHOLD && (
              <TextInput
                label="Filter tags"
                value={searchState.tagFilter}
                onChangeText={tagFilter => 
                  setSearchState(prev => ({ ...prev, tagFilter }))
                }
                style={styles.tagFilterInput}
                accessibilityLabel="Filter tags"
              />
            )}

            {filteredTags.map(tag => (
              <Checkbox.Item
                key={tag}
                label={tag}
                status={searchState.selectedTags.includes(tag) ? "checked" : "unchecked"}
                onPress={() => {
                  setSearchState(prev => ({
                    ...prev,
                    selectedTags: prev.selectedTags.includes(tag)
                      ? prev.selectedTags.filter(t => t !== tag)
                      : [...prev.selectedTags, tag],
                  }));
                }}
                style={styles.checkboxContainer}
                labelStyle={styles.tagLabel}
                accessibilityLabel={`${tag} tag, ${searchState.selectedTags.includes(tag) ? 'checked' : 'unchecked'}`}
              />
            ))}

            {searchState.selectedTags.length > 0 && (
              <Button
                mode="outlined"
                onPress={() => {
                  setSearchState(prev => ({ ...prev, selectedTags: [] }));
                  AccessibilityInfo.announceForAccessibility("All tags cleared");
                }}
                accessibilityLabel="Clear all selected tags"
              >
                Clear All Tags
              </Button>
            )}
          </Surface>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => handleSearch(true)}
            loading={uiState.loading}
            disabled={uiState.loading}
            accessibilityLabel="Search"
          >
            Search
          </Button>

          {uiState.hasSearched && (
            <Button
              mode="outlined"
              onPress={clearSearch}
              disabled={uiState.loading}
              accessibilityLabel="Clear search"
            >
              Clear Search
            </Button>
          )}
        </View>

        {uiState.error ? (
          <Text
            style={{
              color: "red",
              marginTop: 16,
              textAlign: "center",
            }}
            accessibilityRole="alert"
          >
            {uiState.error}
          </Text>
        ) : (
          uiState.hasSearched && (
            <View ref={resultsRef}>
              <SearchResults
                results={searchState.results}
                loading={uiState.loading}
                loadingMore={uiState.loadingMore}
                hasMore={paginationState.hasMore}
                onLoadMore={() => {
                  setPaginationState(prev => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }));
                  handleSearch(false);
                }}
                fontSize={settings.fontSize}
                highContrast={settings.highContrast}
              />
            </View>
          )
        )}
      </ScrollView>

      <Portal>
        <Dialog
          visible={uiState.showHistory}
          onDismiss={() => setUiState(prev => ({ ...prev, showHistory: false }))}
          style={{
            backgroundColor: settings.highContrast ? "#000" : "#fff",
          }}
        >
          <Dialog.Title
            style={{
              color: settings.highContrast ? "#fff" : "#000",
            }}
          >
            Recent Searches
          </Dialog.Title>
          <Dialog.Content>
            {searchState.searchHistory.map((item, index) => (
              <Button
                key={index}
                mode="outlined"
                onPress={() => {
                  setSearchState(prev => ({
                    ...prev,
                    query: item.query,
                    selectedTags: item.tags,
                  }));
                  setUiState(prev => ({
                    ...prev,
                    showHistory: false,
                  }));
                  handleSearch(true);
                }}
                style={{ marginBottom: 8 }}
                accessibilityLabel={`Recent search: ${item.query} ${
                  item.tags.length ? `with tags ${item.tags.join(", ")}` : ""
                }`}
              >
                {item.query || item.tags.join(", ")}
              </Button>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setUiState(prev => ({ ...prev, showHistory: false }))}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;
