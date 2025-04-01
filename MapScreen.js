import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';

const MOCK_DERMATOLOGISTS = [
  { id: '1', name: 'Dr. Smith', insurance: 'Aetna', location: '1.2 miles away' },
  { id: '2', name: 'Dr. Johnson', insurance: 'Blue Cross', location: '2.1 miles away' },
  { id: '3', name: 'Dr. Lee', insurance: 'UnitedHealthcare', location: '0.8 miles away' }
];

export default function MapScreen() {
  const [insurance, setInsurance] = useState('');
  const [filtered, setFiltered] = useState(MOCK_DERMATOLOGISTS);

  useEffect(() => {
    if (!insurance) {
      setFiltered(MOCK_DERMATOLOGISTS);
    } else {
      setFiltered(MOCK_DERMATOLOGISTS.filter(doc => doc.insurance.toLowerCase().includes(insurance.toLowerCase())));
    }
  }, [insurance]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Dermatologists</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your insurance"
        value={insurance}
        onChangeText={setInsurance}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.insurance}</Text>
            <Text>{item.location}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 15 },
  card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' }
});
