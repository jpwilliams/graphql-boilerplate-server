const admin = require('firebase-admin')
const serviceAccount = require('../../config/serviceAccountKey.json')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wildfire-gg.firebaseio.com'
})

exports.firebase = firebase
