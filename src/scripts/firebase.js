import { initializeApp } from 'firebase/app'

const config = {
  apiKey: "AIzaSyDQznZGLQ_rqgTRy1Xqbpk9K3c2S9RyJJ8",
  authDomain: "andre-cloud-storage.firebaseapp.com",
  databaseURL: "https://andre-cloud-storage-default-rtdb.firebaseio.com",
  projectId: "andre-cloud-storage",
  storageBucket: "andre-cloud-storage.appspot.com",
  messagingSenderId: "243258024084",
  appId: "1:243258024084:web:347de9b51b57da4ea59481"
}

const app = initializeApp(config)

export default app