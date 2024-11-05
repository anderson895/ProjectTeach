from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

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
    
    # Save to SQLite database
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL
        )
    ''')
    
    # Insert data into the users table
    cursor.execute('INSERT INTO users (name, age, gender) VALUES (?, ?, ?)', (name, age, gender))
    conn.commit()
    conn.close()
    
    # Redirect to a success or login page
    return redirect(url_for('student/login'))
if __name__ == '__main__':
    app.run(port=5001)
