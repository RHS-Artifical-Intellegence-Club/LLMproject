# Flask Firebase Authentication App

A modern web application with Firebase authentication, featuring both email/password and Google Sign-In options.

## Features

- User authentication with email and password
- Google Sign-In integration
- Protected dashboard
- Modern UI with Tailwind CSS
- Responsive design

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication and set up Email/Password and Google Sign-In methods
   - Download your Firebase Admin SDK service account key and save it as `firebase-credentials.json`
   - Copy your Firebase configuration values to the `.env` file

5. Configure environment variables:
   - Rename `.env.example` to `.env`
   - Fill in your Firebase configuration values

6. Run the application:
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file with the following variables:
```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Project Structure

```
.
├── app.py                 # Main application file
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables
├── firebase-credentials.json  # Firebase Admin SDK credentials
└── templates/            # HTML templates
    ├── base.html        # Base template
    ├── index.html       # Home page
    ├── login.html       # Login page
    ├── signup.html      # Sign up page
    └── dashboard.html   # Protected dashboard
```
