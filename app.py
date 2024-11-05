from flask import Flask, render_template, request, redirect, url_for, flash, session, abort
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
app.secret_key = 'AWLJDIAWLWAD'

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            database='ProjTeach',
            user='root',
            password=''  # Make sure this is correct
        )
        return conn
    except Error as e:
        app.logger.error(f"Error connecting to database: {e}")
        return None

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

@app.route('/student/home')
def student_home():
    if 'user_id' not in session:
        flash("Please log in to access this page.")
        return redirect(url_for('student_login'))
    
    name = request.args.get('name')
    return render_template('student/home.html', name=name)

@app.route('/logout', methods=['POST'])
def student_logout():
    session.pop('user_id', None)
    flash("You have been logged out.")
    return redirect(url_for('student_login'))

@app.route('/register', methods=['POST'])
def register_user():
    name = request.form.get('name')
    age = request.form.get('age')
    gender = request.form.get('gender')
    user_type = 'student'

    if not name or not age or not gender:
        flash("Please fill out all fields.")
        return redirect(url_for('student_register'))

    try:
        conn = get_db_connection()
        if conn is None:
            flash("Database connection failed.")
            return redirect(url_for('student_register'))
        
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                gender VARCHAR(10) NOT NULL,
                type VARCHAR(10) NOT NULL
            )
        ''')
        
        cursor.execute('SELECT * FROM users WHERE name = %s', (name,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            flash(f'"{name}" already exists. Try another name.')
            return redirect(url_for('student_register'))
        
        cursor.execute('INSERT INTO users (name, age, gender, type) VALUES (%s, %s, %s, %s)', 
                       (name, age, gender, user_type))
        conn.commit()
        flash(f'Registration successful! Welcome, {name}!')

    except Error as e:
        app.logger.error(f"Database error: {e}")
        abort(500, description="An error occurred while saving data.")
    finally:
        if conn:
            conn.close()

    return redirect(url_for('student_login'))

@app.route('/login', methods=['POST'])
def login_user():
    username = request.form.get('username')
    
    try:
        conn = get_db_connection()
        if conn is None:
            flash("Database connection failed.")
            return redirect(url_for('student_login'))
        
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE name = %s', (username,))
        user = cursor.fetchone()
        
        if user:
            session['user_id'] = user[0]
            return redirect(url_for('student_home', name=username))
        else:
            flash(f'User "{username}" not found. Please register.')
            return redirect(url_for('student_login'))

    except Error as e:
        app.logger.error(f"Database error: {e}")
        abort(500, description="An error occurred during login.")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(port=5001, debug=True)
