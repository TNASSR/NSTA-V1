import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { User, SystemSettings } from "./types";

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase only if config is valid (simple check)
let app;
let database: any;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        database = getDatabase(app);
    }
} catch (e) {
    console.error("Firebase Initialization Error:", e);
}

export const checkFirebaseConnection = (): boolean => {
    return !!database;
};

export const saveChapterData = (key: string, data: any) => {
    if (!database) return;
    // Replace invalid characters in key if necessary, but assuming key is safe-ish or handled by caller
    // Ideally, we should structure data properly in Firebase, e.g., content/board/class/subject/chapterId
    // But for now we simulate the key-value store behavior requested.
    // However, Firebase keys cannot contain certain characters like '.', '#', '$', '[', ']'.
    // The key "nst_content_CBSE_10_Science_ch1" is safe.
    set(ref(database, 'content/' + key), data);
};

export const bulkSaveLinks = async (updates: Record<string, any>) => {
    if (!database) return;
    const fbUpdates: Record<string, any> = {};
    Object.keys(updates).forEach(key => {
        fbUpdates['content/' + key] = updates[key];
    });
    return update(ref(database), fbUpdates);
};

export const saveSystemSettings = (settings: SystemSettings) => {
    if (!database) return;
    set(ref(database, 'systemSettings'), settings);
};

export const subscribeToUsers = (callback: (users: User[]) => void) => {
    if (!database) return () => {};

    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Convert object to array if necessary, depending on how data is stored
            // Assuming data is an array or object of users
            const usersList: User[] = Array.isArray(data) ? data : Object.values(data);
            callback(usersList);
        } else {
            callback([]);
        }
    });

    return unsubscribe;
};
