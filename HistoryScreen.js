import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = firebase.auth().currentUser;
      if (!user) return;

      const snapshot = await firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('diagnoses')
        .orderBy('date', 'desc')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setHistory(data);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnosis History</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
            <Text>{item.resultText.slice(0, 100)}...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { padding: 15, backgroundColor: '#f1f1f1', marginBottom: 10, borderRadius: 8 },
  date: { fontWeight: 'bold' },
  image: { width: '100%', height: 200, marginBottom: 10, borderRadius: 8 }
});
