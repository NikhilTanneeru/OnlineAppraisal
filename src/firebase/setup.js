import { initializeApp } from "firebase/app";
import {getAuth } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyB5qkgak0xPgRKPo5iMLEirl86Dj7s2WsU",
  authDomain: "appraisal-bec64.firebaseapp.com",
  projectId: "appraisal-bec64",
  storageBucket: "appraisal-bec64.appspot.com",
  messagingSenderId: "1050562552895",
  appId: "1:1050562552895:web:672b1d181515e41daf048a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { app, auth };