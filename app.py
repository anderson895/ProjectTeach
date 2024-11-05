from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import os


app = Flask(__name__)

app.secret_key = 'AWLJDIAWLWAD' 

@app.route('/')
def landing():
    message = "Hello, this message is dynamic!"
    return render_template('index.html', message=message)

@app.route('/admin/login')
def admin_login():
    return render_template('admin/login.html')

@app.route('/admin/register')
def admin_register():
    return render_template('admin/registration.html')

@app.route('/student/login')
def student_login():
    return render_template('student/login.html')

@app.route('/student/register')
def student_register():
    return render_template('student/registration.html')

# Route to handle form submission
@app.route('/register', methods=['POST'])
def register_user():
    # Get form data
    name = request.form.get('name')
    age = request.form.get('age')
    gender = request.form.get('gender')
    
    try:
        # Use a writable path for the SQLite database
        conn = sqlite3.connect('/tmp/database.db')  # Updated path
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL
        )''')
        
        # Insert data into the users table
        cursor.execute('INSERT INTO users (name, age, gender) VALUES (?, ?, ?)', (name, age, gender))
        conn.commit()

        # Flash a success message
        flash('Registration successful! Welcome, {}!'.format(name))

    except sqlite3.Error as e:
        print(f"Database error: {e}")  # Print error to console
        return "An error occurred while saving data: " + str(e), 500
    finally:
        conn.close()
    
    # Redirect to student login page
    return redirect(url_for('student_login'))


if __name__ == '__main__':
    app.run(port=5001)
