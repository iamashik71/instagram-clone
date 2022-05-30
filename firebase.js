// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA6Ufh180ky1sfjgOsdAWq47lt8GJKH1CA',
  authDomain: 'instagram-clone-253c0.firebaseapp.com',
  projectId: 'instagram-clone-253c0',
  storageBucket: 'instagram-clone-253c0.appspot.com',
  messagingSenderId: '1060231578777',
  appId: '1:1060231578777:web:f56125aff08d5c99bda408',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }
