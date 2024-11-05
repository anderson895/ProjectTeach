from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3

app = Flask(__name__)
app.secret_key = 'AWLJDIAWLWAD' 

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

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

@app.route('/register', methods=['POST'])
def register_user():
    name = request.form.get('name')
    age = request.form.get('age')
    gender = request.form.get('gender')
    user_type = 'student'  # Adjust as needed for dynamic user types

    if not name or not age or not gender:
        flash("Please fill out all fields.")
        return redirect(url_for('student_register'))

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    age INTEGER NOT NULL,
                    gender TEXT NOT NULL,
                    type TEXT NOT NULL
                )
            ''')
            
            cursor.execute('SELECT * FROM users WHERE name = ?', (name,))
            existing_user = cursor.fetchone()
            
            if existing_user:
                flash(f'Registration failed! User "{name}" already exists.')
                return redirect(url_for('student_register'))
            
            cursor.execute('INSERT INTO users (name, age, gender, type) VALUES (?, ?, ?, ?)', 
                           (name, age, gender, user_type))
            conn.commit()

            flash(f'Registration successful! Welcome, {name}!')

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return "An error occurred while saving data: " + str(e), 500
    
    return redirect(url_for('student_login'))

if __name__ == '__main__':
    app.run(port=5001)
