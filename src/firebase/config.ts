import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAZsJwKqHUTKhs-VdqdO-GZa7c_-eslwlg",
  authDomain: "osegonte.firebaseapp.com",
  projectId: "osegonte",
  storageBucket: "osegonte.firebasestorage.app",
  messagingSenderId: "906632077091",
  appId: "1:906632077091:web:1036799224ff2fe510f606"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)