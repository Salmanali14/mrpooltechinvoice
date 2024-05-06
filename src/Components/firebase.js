import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyACsIk0ZMbM5-imC9WSXb9B7qUQCGI9yfc",
  authDomain: "invoice-95351.firebaseapp.com",
  databaseURL: "https://invoice-95351-default-rtdb.firebaseio.com",
  projectId: "invoice-95351",
  storageBucket: "invoice-95351.appspot.com",
  messagingSenderId: "375841137564",
  appId: "1:375841137564:web:00d00e6e006a74cb9f5e59",
  measurementId: "G-CWK1EGS73V"
};


const app = initializeApp(firebaseConfig);

export { app };
const analytics = getAnalytics(app);