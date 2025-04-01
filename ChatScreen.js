import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';

export default function ChatScreen({ route }) {
  const { diagnosis } = route.params;
  const [messages, setMessages] = useState([
    { sender: 'ai', text: diagnosis }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input.trim() };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input.trim(),
          context: diagnosis
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask More About Your Diagnosis</Text>
      <ScrollView style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.msg, msg.sender === 'user' ? styles.user : styles.ai]}>
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Ask a follow-up question..."
      />
      <Button title={loading ? "Loading..." : "Send"} onPress={sendMessage} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  chatBox: { flex: 1, marginBottom: 10 },
  msg: { padding: 10, borderRadius: 10, marginVertical: 5 },
  user: { backgroundColor: '#d0f0c0', alignSelf: 'flex-end' },
  ai: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 }
});
