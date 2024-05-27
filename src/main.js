import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/style.css'
import router from '@/plugins/router.js'
import App from '@/App.vue'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "../firebase/firebase.js";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)


createApp(App).use(createPinia()).use(router).mount('#app');

export {db}
