# SUNOO - Feel The Music

The next generation of music streaming. This application features:
- A modern, dark-themed UI for music playback
- Firebase integration for authentication, database, music, and cover art storage
- Real-time tracks and playlist handling
- Custom creator dashboard


## Getting Started

Firebase has been configured using the Firebase AI Skill so it runs out of the box when you start the project!

## Deploying to Vercel & Common Firebase Errors

### Why the `auth/unauthorized-domain` Error Happens on Vercel
**IMPORTANT:** You are seeing this error because the database automatically created by AI Studio is restricted to run *only* inside AI Studio. You **do not have permission** to add new domains to the AI Studio database.

To fix this and host your app on Vercel, you need to use your **own Firebase project**.

### Steps to Deploy to Vercel:

1. **Create your own Firebase Project**
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a "New Project".
   - Enable **Authentication** (Email/Password).
   - Enable **Firestore Database**.
   - Enable **Storage** (and refer to the Storage rules below).
   - Go to Project Settings > General > Add Web App, and copy your Firebase config `apiKey`, `projectId`, etc.

2. **Add Environment Variables in Vercel**
   In your Vercel project settings, add the following Environment Variables based on your new Firebase config:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

Once these are set, your Vercel app will use your personal Firebase database and the unauthorized domain error will disappear!

### 2. Fixing `storage/retry-limit-exceeded` Error
If you're unable to upload or delete tracks, your Firebase Storage instance might not be initialized or your security rules are blocking the upload.
To fix this:
1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Open **Build** → **Storage** from the left sidebar.
3. Click **Get Started** to enable Cloud Storage.
4. Go to the **Rules** tab in Storage and set it to:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tracks/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
