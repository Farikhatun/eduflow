// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAjsQXRPa3NMQ3FUOIK7gDAUuZ6cTgTfj8",
    authDomain: "eduflow-4e37a.firebaseapp.com",
    projectId: "eduflow-4e37a",
    storageBucket: "eduflow-4e37a.firebasestorage.app",
    messagingSenderId: "199986650240",
    appId: "1:199986650240:web:25a7004141c317ced3da65",
    measurementId: "G-ESKBRCT3G4"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

// Set Firestore settings
db.settings({ timestampsInSnapshots: true });

// Export untuk digunakan di file lain
window.db = db;
window.storage = storage;
window.storageRef = storageRef;

console.log('Firebase initialized successfully!'); // Buat cek apakah berhasil
