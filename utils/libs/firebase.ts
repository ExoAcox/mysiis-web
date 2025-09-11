import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

// const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: "mysiis-51c60.firebaseapp.com",
//     databaseURL: "https://mysiis-51c60.firebaseio.com",
//     projectId: "mysiis-51c60",
//     storageBucket: "mysiis-51c60.appspot.com",
//     messagingSenderId: "899030049499",
//     appId: "1:899030049499:web:318be0ca8a02cd433b22fe",
//     measurementId: "G-9CWNB2GQ31",
// };

export let app: FirebaseApp;
export let db: Firestore;
export let analytic: Analytics;
export let performance: ReturnType<typeof getPerformance>;

export const initFirebase = () => {
    // app = initializeApp(firebaseConfig);
    // db = getFirestore(app);
    // analytic = getAnalytics(app);
    // performance = getPerformance(app);
};
