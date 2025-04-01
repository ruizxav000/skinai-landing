import React, { useRef, useState, useEffect } from 'react';
import { View, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const db = firebase.firestore();
  const storage = firebase.storage();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const uploadImageAsync = async (uri, uid) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = reject;
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = storage.ref().child(`diagnoses/${uid}/${Date.now()}.jpg`);
    await ref.put(blob);
    blob.close();
    return await ref.getDownloadURL();
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const data = await cameraRef.current.takePictureAsync({ base64: true });

      try {
        const response = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_base64: data.base64 })
        });

        const result = await response.json();
        const user = firebase.auth().currentUser;

        if (user) {
          const imageUrl = await uploadImageAsync(data.uri, user.uid);
          await db
            .collection('users')
            .doc(user.uid)
            .collection('diagnoses')
            .add({
              resultText: result.diagnosis,
              date: new Date().toISOString(),
              imageUrl: imageUrl
            });
        }

        setLoading(false);
        navigation.navigate('Results', { result });
      } catch (error) {
        console.error("Upload error:", error);
        setLoading(false);
      }
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={cameraRef}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <Button title="Capture & Analyze" onPress={takePicture} />
        )}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
});
