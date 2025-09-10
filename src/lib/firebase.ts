

// THIS FILE IS NOW USED TO INITIALIZE FIREBASE FOR THE APP AND FUNCTIONS
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

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
const functions = getFunctions(firebaseApp);

export { firebaseApp, functions };
