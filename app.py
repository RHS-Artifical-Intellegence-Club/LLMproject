from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from dotenv import load_dotenv
import os
import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from openai import OpenAI

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Add Firebase configuration to Flask app config
app.config.update({
    'FIREBASE_API_KEY': os.getenv('FIREBASE_API_KEY'),
    'FIREBASE_AUTH_DOMAIN': os.getenv('FIREBASE_AUTH_DOMAIN'),
    'FIREBASE_PROJECT_ID': os.getenv('FIREBASE_PROJECT_ID'),
    'FIREBASE_STORAGE_BUCKET': os.getenv('FIREBASE_STORAGE_BUCKET'),
    'FIREBASE_MESSAGING_SENDER_ID': os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
    'FIREBASE_APP_ID': os.getenv('FIREBASE_APP_ID'),
    'FIREBASE_MEASUREMENT_ID': os.getenv('FIREBASE_MEASUREMENT_ID')
})

# Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-credentials.json")
firebase_admin.initialize_app(cred)

# Initialize OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("API_KEY"),
)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.get_user_by_email(email)
            # In a real application, you would verify the password here
            session['user_id'] = user.uid
            flash('Successfully logged in!', 'success')
            return redirect(url_for('dashboard'))
        except:
            flash('Invalid credentials!', 'error')
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.create_user(
                email=email,
                password=password
            )
            flash('Successfully created account!', 'success')
            return redirect(url_for('login'))
        except:
            flash('Error creating account!', 'error')
    return render_template('signup.html')

@app.route('/dashboard')
@login_required
def dashboard():
    user_id = session.get('user_id')
    user = auth.get_user(user_id)
    return render_template('dashboard.html', user=user)

@app.route('/chat', methods=['POST'])
@login_required
def chat():
    try:
        user_message = request.json.get('message')
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Get the current user
        user_id = session.get('user_id')
        user = auth.get_user(user_id)

        # Create chat completion using OpenRouter
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": request.host_url,
                "X-Title": "ClubLLM Chat",
            },
            model="deepseek/deepseek-r1:free",
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        # Extract the assistant's response
        ai_response = completion.choices[0].message.content

        return jsonify({'response': ai_response})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True) 