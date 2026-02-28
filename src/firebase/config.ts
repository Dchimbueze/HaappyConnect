
// IMPORTANT: For this quickstart, you can hardcode your configuration here.
// For a production application, it is strongly recommended to use environment variables.
//
// HOW TO USE:
// 1. Go to your Firebase project settings.
// 2. In the "Your apps" card, select the "Web" platform.
// 3. Find your app's configuration object.
// 4. Copy the values and paste them here, replacing the placeholder strings.
//
// Example:
// apiKey: "AIzaSyB...your-key...",
// authDomain: "your-project-id.firebaseapp.com",
// ...
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
