// 1. Importa 'firebase/app' per il core
import firebase from 'firebase/app';

// 2. Importa i singoli servizi CHE TI SERVONO per "popolare" l'oggetto firebase
import 'firebase/auth';
import 'firebase/firestore';

// 3. La tua configurazione rimane la stessa
const firebaseConfig = {
    apiKey: "AIzaSyByv5k3bSb9J6YUDDIWnYC7-9IsWybF9iY",
    authDomain: "rob-portfolio-bdba9.firebaseapp.com",
    projectId: "rob-portfolio-bdba9",
    storageBucket: "rob-portfolio-bdba9.firebasestorage.app",
    messagingSenderId: "175391409353",
    appId: "1:175391409353:web:7c45004632a55c3c587918",
    measurementId: "G-R8JLEHJ1W7"
};


// 4. Inizializza l'app SOLO SE non è già stata inizializzata
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 5. Esporta i servizi usando la sintassi namespaced (es. firebase.auth())
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };;