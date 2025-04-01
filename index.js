const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.captureEmail = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).send('Invalid email');
  }

  try {
    await admin.firestore().collection('emailSignups').add({
      email,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    return res.status(200).send('Email captured');
  } catch (error) {
    console.error('Error saving email:', error);
    return res.status(500).send('Internal Server Error');
  }
});
