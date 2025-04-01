import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';

export default function ReminderScreen() {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionGranted(status === 'granted');
      }
    })();
  }, []);

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'SkinAI Reminder',
        body: 'Time to check on your skin condition and take a new photo!',
      },
      trigger: {
        seconds: 3 * 24 * 60 * 60, // 3 days in seconds
      },
    });

    Alert.alert('Reminder Set', 'We’ll remind you to check back in 3 days.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set a Follow-Up Reminder</Text>
      <Text style={styles.text}>
        We'll send a notification to remind you to take another photo of your condition in 3 days.
      </Text>
      <Button
        title="Set Reminder"
        onPress={scheduleNotification}
        disabled={!permissionGranted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
