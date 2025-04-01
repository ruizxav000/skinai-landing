import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ResultsScreen({ route }) {
  const { result } = route.params;

  const sections = result.diagnosis.split(/(?=\n[A-Z])/g); // Split into readable parts

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Diagnosis Summary</Text>
      {sections.map((section, index) => (
        <Text key={index} style={styles.content}>{section.trim()}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  content: { fontSize: 16, marginBottom: 10 }
});
