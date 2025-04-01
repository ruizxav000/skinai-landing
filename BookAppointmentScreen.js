import React from 'react';
import { View, Text, Button, Linking, StyleSheet } from 'react-native';

export default function BookAppointmentScreen({ route }) {
  const { diagnosis } = route.params || {};
  const searchQuery = diagnosis
    ? `dermatologist near me ${diagnosis.split('.')[0]}`
    : 'dermatologist near me';

  const openMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    Linking.openURL(mapsUrl);
  };

  const openZocdoc = () => {
    Linking.openURL('https://www.zocdoc.com/dermatologists');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Dermatologist</Text>
      <Text style={styles.subtitle}>Based on your diagnosis, you can book a specialist near you.</Text>
      <Button title="Find on Google Maps" onPress={openMaps} />
      <View style={{ height: 20 }} />
      <Button title="Search on Zocdoc" onPress={openZocdoc} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 }
});
