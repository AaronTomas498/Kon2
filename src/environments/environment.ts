// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBx66zTYCTFFdbBD6ilFOSDCMmHlBKNZSQ",
  authDomain: "chat-907ee.firebaseapp.com",
  databaseURL: "https://chat-907ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-907ee",
  storageBucket: "chat-907ee.appspot.com",
  messagingSenderId: "351087083214",
  appId: "1:351087083214:web:66f9cd81843f3be680da9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
