import React, { useContext } from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./_layout"; // Ensure to import the type definitions

const MakerspacesScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const makerspaces = [
    {
      name: "Coco-op",
      description:
        "We believe that the citizens of Flagstaff deserve a vibrant hub where innovation, learning, and community spirit can thrive collectively.",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.squarespace-cdn.com%2Fcontent%2Fv1%2F664f72a63b7d6431711fcaff%2F3dded19e-8596-472a-b19d-cdfc834d2a2e%2FCoco-Op%2BSocial%2BProfile%2BPhoto.jpg%3Fformat%3D1500w&f=1&nofb=1&ipt=60086247dbb55990415f641d50f00524b0ef6d5c50288ba6fa84c2a5e477249e&ipo=images",
      contactEmail: "Unavailable",
      contactPhone: "928-351-7071",
      contactAddress: "1155 W Kaibab Lane Flagstaff, AZ 86001",
    },
    {
      name: "Tynkertopia",
      description:
        "Tynkertopia is a non-profit Community Center focusing on creativity, inquiry, and STEM/STEAM skills for kids, parents, teachers, and community members!",
      image: "https://example.com/image2.jpg",
      contactEmail: "info@tynkertopia.org",
      contactPhone: "928-326-3400",
      contactAddress: "3330 E Elder Drive, Flagstaff, Az, 86004",
    },
  ];

  const renderItem = ({ item }: { item: (typeof makerspaces)[0] }) => (
    <View
      style={[
        styles.itemContainer,
        {
          backgroundColor: settings.highContrast ? "#333" : "#f9f9f9",
        },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text
        style={[
          styles.itemName,
          {
            fontSize: settings.fontSize + 2,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
      >
        {item.name}
      </Text>
      <Text
        style={[
          styles.itemDescription,
          {
            fontSize: settings.fontSize,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
      >
        {item.description}
      </Text>
      <Text
        style={[
          styles.itemContact,
          {
            fontSize: settings.fontSize,
            color: settings.highContrast ? "#fff" : "#888",
          },
        ]}
      >
        Email: {item.contactEmail}
      </Text>
      <Text
        style={[
          styles.itemContact,
          {
            fontSize: settings.fontSize,
            color: settings.highContrast ? "#fff" : "#888",
          },
        ]}
      >
        Phone: {item.contactPhone}
      </Text>
      <Text
        style={[
          styles.itemContact,
          {
            fontSize: settings.fontSize,
            color: settings.highContrast ? "#fff" : "#888",
          },
        ]}
      >
        Address: {item.contactAddress}
      </Text>
      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate("MakerspaceDetails", { makerspace: item })
        }
        style={styles.moreInfoButton} // Add custom style here
      >
        More Info
      </Button>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: settings.highContrast ? "#000" : "#fff" },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            fontSize: settings.fontSize + 4,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
      >
        Makerspaces
      </Text>
      <FlatList
        data={makerspaces}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemLocation: {
    color: "#666",
  },
  itemDescription: {
    marginVertical: 5,
    color: "#444",
    padding: 20,
  },
  itemContact: {
    color: "#888",
  },
  moreInfoButton: {
    padding: 10, // Add padding to the button
    marginTop: 10, // Optional: Add some margin to separate from other content
  },
});

export default MakerspacesScreen;
