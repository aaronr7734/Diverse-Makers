import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, TouchableRipple, useTheme, ActivityIndicator } from "react-native-paper";
import Activity from "../../models/Activity";
import { Link } from "expo-router";

interface SearchResultsProps {
 results: Activity[];
 loading: boolean;
 loadingMore: boolean;
 hasMore: boolean;
 onLoadMore: () => void;
 fontSize: number;
 highContrast: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
 results,
 loading,
 loadingMore,
 hasMore,
 onLoadMore,
 fontSize,
 highContrast,
}) => {
 const theme = useTheme();

 const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   resultCard: {
     marginBottom: 16,
     backgroundColor: highContrast ? "#000" : "#fff",
     borderRadius: 8,
     elevation: 2,
   },
   cardContent: {
     padding: 16,
   },
   title: {
     fontSize: fontSize + 4,
     fontWeight: "bold",
     color: highContrast ? "#fff" : "#000",
     marginBottom: 8,
   },
   description: {
     fontSize: fontSize,
     color: highContrast ? "#fff" : "#555",
     marginBottom: 12,
   },
   tagsContainer: {
     flexDirection: "row",
     flexWrap: "wrap",
     marginTop: 8,
   },
   tag: {
     fontSize: fontSize - 2,
     color: highContrast ? "#fff" : theme.colors.primary,
     marginRight: 8,
     marginBottom: 4,
   },
   emptyContainer: {
     padding: 16,
     alignItems: "center",
   },
   emptyText: {
     fontSize: fontSize,
     color: highContrast ? "#fff" : "#555",
     textAlign: "center",
   },
   loadingMore: {
     padding: 16,
     alignItems: "center",
   },
   resultsInfo: {
     fontSize: fontSize,
     color: highContrast ? "#fff" : "#555",
     textAlign: "center",
     marginBottom: 16,
   }
 });

 const renderItem = ({ item }: { item: Activity }) => (
   <Link
     href={{
       pathname: "/home/[activityId]",
       params: { activityId: item.getActivityId() },
     }}
     asChild
   >
     <TouchableRipple
       accessible
       accessibilityRole="button"
       accessibilityLabel={`View activity: ${item.getTitle()}`}
       accessibilityHint={`Shows details for ${item.getTitle()}`}
     >
       <Card style={styles.resultCard}>
         {item.getCoverImageUrl() && (
           <Card.Cover
             source={{ uri: item.getCoverImageUrl() }}
             accessible
             accessibilityLabel={item.getCoverImageAltText() || `Cover image for ${item.getTitle()}`}
           />
         )}
         <View style={styles.cardContent}>
           <Text style={styles.title} accessibilityRole="header">
             {item.getTitle()}
           </Text>
           <Text style={styles.description} numberOfLines={2}>
             {item.getDescription()}
           </Text>
           <View 
             style={styles.tagsContainer}
             accessible
             accessibilityLabel={`Tags: ${item.getTags().join(", ")}`}
           >
             {item.getTags().map((tag) => (
               <Text key={tag} style={styles.tag}>
                 #{tag}
               </Text>
             ))}
           </View>
         </View>
       </Card>
     </TouchableRipple>
   </Link>
 );

 const renderFooter = () => {
   if (!loadingMore) return null;

   return (
     <View style={styles.loadingMore}>
       <ActivityIndicator 
         size="small" 
         color={highContrast ? "#fff" : theme.colors.primary}
         accessibilityLabel="Loading more results"
       />
     </View>
   );
 };

 if (!loading && results.length === 0) {
   return (
     <View 
       style={styles.emptyContainer}
       accessible
       accessibilityRole="text"
       accessibilityLabel="No results found"
     >
       <Text style={styles.emptyText}>
         No activities found matching your search.
       </Text>
     </View>
   );
 }

 return (
   <View>
     <Text 
       style={styles.resultsInfo}
       accessible
       accessibilityRole="text"
       accessibilityLabel={`Found ${results.length} activities${hasMore ? ", scroll down to load more" : ""}`}
     >
       Found {results.length} activities
     </Text>
     <FlatList
       data={results}
       renderItem={renderItem}
       keyExtractor={(item) => item.getActivityId()}
       contentContainerStyle={styles.container}
       onEndReached={hasMore ? onLoadMore : undefined}
       onEndReachedThreshold={0.5}
       ListFooterComponent={renderFooter}
       accessible
       accessibilityRole="list"
       accessibilityHint={hasMore ? "Scroll down to load more results" : "All results loaded"}
     />
   </View>
 );
};

export default SearchResults;