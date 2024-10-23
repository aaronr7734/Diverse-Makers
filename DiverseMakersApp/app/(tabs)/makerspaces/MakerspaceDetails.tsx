import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { UserSettingsContext } from '../../../contexts/UserSettingsContext';

const MakerspaceDetails: React.FC = () => {
  const route = useRoute();
  const { makerspace } = route.params as { makerspace: any };
  const { settings } = useContext(UserSettingsContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card
        style={[
          styles.card,
          { backgroundColor: settings.highContrast ? '#000' : '#fff' },
        ]}
      >
        <Card.Title
          title={makerspace.name}
          subtitle={makerspace.location}
          titleStyle={[
            styles.title,
            { color: settings.highContrast ? '#fff' : '#000', fontSize: settings.fontSize + 2 },
          ]}
          subtitleStyle={[
            styles.subtitle,
            { color: settings.highContrast ? '#ccc' : '#666', fontSize: settings.fontSize },
          ]}
        />
        <Card.Content style={styles.cardContent}>
          <Text
            style={[
              styles.description,
              { color: settings.highContrast ? '#fff' : '#000', fontSize: settings.fontSize },
            ]}
          >
            {makerspace.description}
          </Text>
        </Card.Content>
        <Card.Cover source={{ uri: makerspace.image }} style={styles.image} />
      </Card>

      {/* Contact Information Section */}
      <Card
        style={[
          styles.contactCard,
          { backgroundColor: settings.highContrast ? '#000' : '#fff' },
        ]}
      >
        <Card.Title
          title="Contact Information"
          titleStyle={{
            color: settings.highContrast ? '#fff' : '#000',
            fontSize: settings.fontSize + 2,
          }}
        />
        <Card.Content style={styles.cardContent}>
          <Text
            style={[
              styles.contactText,
              { color: settings.highContrast ? '#fff' : '#000', fontSize: settings.fontSize },
            ]}
          >
            📧 Email: {makerspace.contactEmail || 'N/A'}
          </Text>
          <Text
            style={[
              styles.contactText,
              { color: settings.highContrast ? '#fff' : '#000', fontSize: settings.fontSize },
            ]}
          >
            📞 Phone: {makerspace.contactPhone || 'N/A'}
          </Text>
          <Text
            style={[
              styles.contactText,
              { color: settings.highContrast ? '#fff' : '#000', fontSize: settings.fontSize },
              styles.address, // Apply additional styling for the address
            ]}
          >
            🏢 Address: {makerspace.contactAddress || 'N/A'}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
  },
  image: {
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: '300',
  },
  description: {
    marginVertical: 10,
    flexShrink: 1, // Allow text to shrink within the card
    padding: 10, // Add padding to prevent text cutoff
  },
  contactCard: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  cardContent: {
    flexDirection: 'column', // Ensure content is in a column
  },
  contactText: {
    marginVertical: 5,
  },
  address: {
    marginTop: 20, // Add extra margin to move the address down
  },
});

export default MakerspaceDetails;
