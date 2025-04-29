# Mentor Match
A mentor-mentee matchmaking platform that connects users based on shared skills, interests, and availability.  
🔗 [Live Demo](https://mentor-match-eight-delta.vercel.app/dashboard.html)

## Purpose
Mentor Match aims to foster meaningful and personalized connections between mentors and mentees. Whether you're offering guidance or seeking it, this platform provides a focused space for mentorship based on compatibility and shared growth goals.

## Technology
- HTML
- CSS
- JavaScript (ES Modules)
- Firebase (Firestore & Authentication)
- Cloudinary (Image cloud storage)
- Vercel (Hosting)

## Features
✅ Available  
- Firebase Authentication (Sign in / Sign up )  
- User profile creation and image upload  
- Role-based dashboard for mentors and mentees  
- Dynamic filtering by skills, interests, location, and availability  
- Mentor/Mentee card generation with real-time Firestore data  

🛠 To Be Updated  
- Invitation system for connecting with mentors/mentees  
- Accept/reject mentorship requests  
- Chat or scheduling functionality  
- Notification system  
- Full mobile responsiveness

## Set Up Instruction

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mentor-match.git
   cd mentor-match

2. **Install Live Server (if needed)**
You can use VSCode's Live Server extension or any local HTTP server.

3. **Firebase Configuration**
- Create a Firebase project at firebase.google.com
- Enable Authentication (Google Sign-In)
- Create a Firestore Database with a users collection
- In assets/js/firebase.js, replace the placeholder with your Firebase config:
```bash
javascriptconst firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
4. **Cloudinary Configuration**
   - Sign up for a free account at [cloudinary.com](https://cloudinary.com)
   - Navigate to the Dashboard to find your account details
   - Add the Cloudinary JavaScript SDK
   - Configure Cloudinary in your project
```bash
javascriptconst cloudinaryConfig = {
  cloudName: 'YOUR_CLOUD_NAME',
  apiKey: 'YOUR_API_KEY',
  uploadPreset: 'YOUR_UPLOAD_PRESET'
};
```
- Create an unsigned upload preset

5. **Run the project**
Ensure internet access for Firebase CDN modules to load
- Localhost: Open index.html or dashboard.html with Live Server
- Online: Log in Vercel with Github for hosting

## Structure
```bash
C:.
├───assets
│   ├───css
│   ├───images
│   └───js
└───node_modules
    ├───cloudinary
    │   ├───lib
    │   │   ├───analysis
    │   │   ├───api_client
    │   │   ├───cache
    │   │   ├───provisioning
    │   │   ├───utils
    │   │   │   ├───analytics
    │   │   │   ├───encoding
    │   │   │   └───parsing
    │   │   └───v2
    │   └───types
    ├───dotenv
    │   └───lib
    ├───lodash
    │   └───fp
    └───q
```
## Inspirations
- Peer support systems in educational and professional settings
- The need for curated, skill-based networking tools
