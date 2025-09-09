
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "ags-activities-hub",
  "appId": "1:945966511726:web:c768113a13bbce4fde987f",
  "storageBucket": "ags-activities-hub.firebasestorage.app",
  "apiKey": "AIzaSyD_b7JSPSLapTa5mlKKVDPGvGOJH-793Rk",
  "authDomain": "ags-activities-hub.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "945966511726"
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Conditionally initialize Analytics only in the browser
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(firebaseApp);
}


export { firebaseApp, analytics };
