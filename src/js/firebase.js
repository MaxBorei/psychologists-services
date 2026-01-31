import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = { apiKey: "AIzaSyBlVW45OUJnfwhyKZP4aewIrv647F7Iyn0",
authDomain: "psychologists-services-b403d.firebaseapp.com", projectId:
"psychologists-services-b403d", storageBucket:
"psychologists-services-b403d.firebasestorage.app", messagingSenderId:
"1001258801337", appId: "1:1001258801337:web:1d222ac3d0250fbe3ae368",
measurementId: "G-5MHHDFM7ZS" };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);