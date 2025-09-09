
// THIS FILE IS NO LONGER USED BY THE MOCK AUTHENTICATION SYSTEM.
// It is kept for when the real Firebase authentication is restored.

import { initializeApp, getApps, getApp } from "firebase/app";

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
// Note: This initialization is currently not being used by the mock auth system.
// The app will not connect to Firebase until the mock system is removed.
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { firebaseApp };
