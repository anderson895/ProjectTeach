from flask import Flask, render_template, request, redirect, url_for, flash, session, abort, jsonify ,make_response
from database import Database
from dashboard import Dashboard
import mysql.connector 
import bcrypt  
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'AWLJDIAWLWAD'

# Function to hash password using bcrypt
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


@app.route('/admin/register', methods=['POST'])
def register_admin():
    username = request.form.get('username')
    password = request.form.get('password')

    # Ensure both fields are provided
    if not username or not password:
        return jsonify({"error": "Please fill out all fields."}), 400

    conn = None  # Initialize conn to avoid UnboundLocalError
    try:
        conn = Database().get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed."}), 500

        # Use cursor as a context manager to automatically close it after the block
        with conn.cursor() as cursor:
            # Check if the username already exists
            cursor.execute('SELECT * FROM admin WHERE admin_username = %s', (username,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({"error": f'Username "{username}" already exists. Try another username.'}), 400

            # Hash the password using bcrypt
            hashed_password = hash_password(password)

            # Insert new admin with hashed password
            cursor.execute('INSERT INTO admin (admin_username, admin_password) VALUES (%s, %s)', 
                           (username, hashed_password))
            conn.commit()

        return jsonify({"message": "Registration successful!"}), 200

    except mysql.connector.Error as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({"error": "An error occurred while saving data."}), 500
    finally:
        if conn:
            conn.close()

@app.route('/admin/login')
def admin_login():
    return render_template('admin/login.html')

@app.route('/admin/login', methods=['POST'])
def login_admin():
    # Retrieve form data
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    conn = Database().get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed."}), 500

    try:
        cursor = conn.cursor()
        # Retrieve the user data from the database
        cursor.execute('SELECT * FROM admin WHERE admin_username = %s', (username,))
        user = cursor.fetchone()

        # If user is found, check if the password matches
        if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):  # Assuming user[2] holds the hashed password
            session['user_id'] = user[0]  # Store user ID in session
            session['user_name'] = user[1]  # Store user name in session
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"error": "Invalid username or password."}), 401
    except Error as e:
        app.logger.error(f"Database query error: {e}")
        return jsonify({"error": "An error occurred while querying the database."}), 500
    finally:
        cursor.close()
        conn.close()



@app.route('/save_game_results', methods=['POST'])
def save_game_results():
    data = request.get_json()

    # Extract game results from the request data
    game_id = data['game_id']
    user_id = data['user_id']
    gr_lvl1 = data['gr_lvl1']
    gr_lvl2 = data['gr_lvl2']
    gr_lvl3 = data['gr_lvl3']
    date_today = data['DateToday']

    # Save the game results to the database
    connection = Database().get_db_connection()
    cursor = connection.cursor()

    # Check if a record already exists for the same user, game, and date
    check_query = """
    SELECT * FROM game_record 
    WHERE gr_user_id = %s AND gr_game_id = %s AND gr_date = %s
    """

    try:
        cursor.execute(check_query, (user_id, game_id, date_today))
        existing_record = cursor.fetchone()

        if existing_record:
            # If record exists, update it
            # Determine the current level based on the provided levels
            if gr_lvl3 is None:
                gr_current_level = "gr_lvl3"  # If level 3 is not completed
                update_query = """
                UPDATE game_record 
                SET gr_current_level = %s, gr_lvl2 = %s 
                WHERE gr_user_id = %s AND gr_game_id = %s AND gr_date = %s
                """
                cursor.execute(update_query, (gr_current_level, gr_lvl2, user_id, game_id, date_today))
            else:
                gr_current_level = "Completed"  # All levels completed
                update_query = """
                UPDATE game_record 
                SET gr_current_level = %s, gr_lvl3 = %s 
                WHERE gr_user_id = %s AND gr_game_id = %s AND gr_date = %s
                """
                cursor.execute(update_query, (gr_current_level, gr_lvl3, user_id, game_id, date_today))

            connection.commit()
            return jsonify({'message': 'Game results updated successfully'}), 200
        else:
            # Determine the current level based on the provided levels
            if gr_lvl2 is None:
                gr_current_level = "gr_lvl2"  # If level 2 is not completed
            elif gr_lvl3 is None:
                gr_current_level = "gr_lvl3"  # If level 3 is not completed
            else:
                gr_current_level = "Completed"  # All levels completed

            # If record does not exist, insert a new one
            insert_query = """
            INSERT INTO game_record (gr_game_id, gr_user_id, gr_current_level, gr_lvl1, gr_lvl2, gr_lvl3, gr_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (game_id, user_id, gr_current_level, gr_lvl1, gr_lvl2, gr_lvl3, date_today))
            connection.commit()
            return jsonify({'message': 'Game results saved successfully'}), 200
    except Error as e:
        app.logger.error(f"Database error while saving game results: {e}")
        return jsonify({'message': 'Error saving game results'}), 500
    finally:
        cursor.close()
        connection.close()




@app.route('/check_existing_record', methods=['POST'])
def check_existing_record():
    data = request.get_json()
    user_id = data['user_id']
    game_id = data['game_id'] 
    date_today = datetime.now().strftime('%Y-%m-%d')  # Format today's date as 'YYYY-MM-DD'

    connection = Database().get_db_connection()
    if connection is None:
        app.logger.error("Database connection failed.")
        return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500

    cursor = connection.cursor()
    try:
        # Check if a record already exists for the same user, game, and today's date
        check_query = """
        SELECT * FROM game_record 
        WHERE gr_user_id = %s AND gr_game_id = %s AND gr_date = %s
        """
        cursor.execute(check_query, (user_id, game_id, date_today))
        existing_records = cursor.fetchall()

        if existing_records:
            return jsonify({'status': 'success', 'records': existing_records}), 200
        else:
            return jsonify({'status': 'no_records', 'message': 'No records found for this user and game today.'}), 200

    except Error as e:
        app.logger.error(f"Database error while checking existing records: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        cursor.close()
        connection.close()




@app.route('/')
def landing():
    message = "Hello, this message is dynamic!"
    return render_template('index.html', message=message)



@app.route('/admin/register')
def admin_register():
    return render_template('admin/registration.html')

@app.route('/student/login')
def student_login():
    return render_template('student/login.html')

@app.route('/student/register')
def student_register():
    return render_template('student/registration.html')




@app.route('/student/sensory_game/<int:user_id>')
def sensory_game(user_id):
    return render_template('student/sensory_game.html', user_id=user_id)




@app.route('/student/interactive_game/<int:user_id>')
def interactive_game(user_id):
    return render_template('student/interactive_game.html', user_id=user_id)





@app.route('/student/interactive_game/lvl_1<int:user_id>')
def matching_gameLvl_1(user_id):
    return render_template('student/interactive_game/lvl_1.html', user_id=user_id)


@app.route('/student/interactive_game/lvl_2<int:user_id>')
def matching_gameLvl_2(user_id):
    return render_template('student/interactive_game/lvl_2.html', user_id=user_id)

@app.route('/student/interactive_game/lvl_3<int:user_id>')
def matching_gameLvl_3(user_id):
    return render_template('student/interactive_game/lvl_3.html', user_id=user_id)




@app.route('/student/matching_game/<int:user_id>')
def matching_game(user_id):
    return render_template('student/matching_game.html', user_id=user_id)


@app.route('/student/matching_game/lvl_1<int:user_id>')
def matching_gameLvl1(user_id):
    return render_template('student/matching_game/lvl_1.html', user_id=user_id)


@app.route('/student/matching_game/lvl_2<int:user_id>')
def matching_gameLvl2(user_id):
    return render_template('student/matching_game/lvl_2.html', user_id=user_id)



@app.route('/student/matching_game/lvl_3<int:user_id>')
def matching_gameLvl3(user_id):
    return render_template('student/matching_game/lvl_3.html', user_id=user_id)






@app.route('/student/sequence_game/<int:user_id>')
def sequence_game(user_id):
    return render_template('student/sequence_game.html', user_id=user_id)




@app.route('/student/sequence_game/lvl_1<int:user_id>')
def sequence_gameLvl_1(user_id):
    return render_template('student/sequence_game/lvl_1.html', user_id=user_id)



@app.route('/student/sequence_game/lvl_2<int:user_id>')
def sequence_gameLvl_2(user_id):
    return render_template('student/sequence_game/lvl_2.html', user_id=user_id)



@app.route('/student/sequence_game/lvl_3<int:user_id>')
def sequence_gameLvl_3(user_id):
    return render_template('student/sequence_game/lvl_3.html', user_id=user_id)







@app.route('/student/home')
def student_home():
    
    if 'user_id' not in session or 'user_name' not in session:
        return redirect(url_for('student_login'))  
    
    
    response = make_response(render_template('student/home.html'))
    
    # Prevent the browser from caching the page
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    return response
    



@app.route('/logout', methods=['POST'])
def student_logout():
    session.pop('user_id', None)  
    session.pop('user_name', None)  

    return redirect(url_for('student_login'))  



@app.route('/admin/dashboard/')
def admin_dashboard():
   
    if 'user_id' not in session or 'user_name' not in session:
        return redirect(url_for('admin_login'))

    response = make_response(render_template('admin/dashboard.html'))
    
    return response


@app.route('/admin_dashboard_analytics', methods=['GET'])



def admin_dashboard_analytics():
    conn = Database().get_db_connection()
    count_users = Dashboard(conn).count_users()
    count_daily_activity = Dashboard(conn).count_daily_activity()

    # Create a dictionary with the variables
    data = {
        "count_users": count_users,
        "count_daily_activity": count_daily_activity
    }

    # Return the dictionary as a JSON response
    return jsonify(data)



@app.route('/admin/activities/')
def admin_activities():
    return render_template('admin/activities.html')


@app.route('/admin/attendance/')
def admin_attendance():
    return render_template('admin/attendance.html')

@app.route('/admin/student_progress/')
def admin_student_progress():
    return render_template('admin/student_progress.html')





@app.route('/admin/logout', methods=['POST'])
def admin_logout():
    # Clear all session data
    session.pop('user_id', None)
    session.pop('user_name', None)
    
    return redirect(url_for('admin_login'))  # Redirect to login page after logout




@app.route('/student/register', methods=['POST'])
def register_user():
    # Get JSON data from the request
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    gender = data.get('gender')
    user_type = 'student'

    # Basic validation to ensure all fields are filled
    if not name or not age or not gender:
        return jsonify({"error": "Please fill out all fields."}), 400  # Return error as JSON

    try:
        # Attempt to connect to the database
        conn = Database().get_db_connection()
        cursor = conn.cursor()

        # Check if the name already exists in the database
        cursor.execute('SELECT * FROM users WHERE name = %s', (name,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"error": f'"{name}" already exists. Try another name.'}), 400

        # Insert the new user into the database
        cursor.execute('INSERT INTO users (name, age, gender, type) VALUES (%s, %s, %s, %s)', 
                       (name, age, gender, user_type))
        conn.commit()

        # Return success message as JSON
        return jsonify({"message": f'Registration successful! Welcome, {name}!'}), 200

    except Error as e:
        # Log the database error and show a friendly message
        app.logger.error(f"Database error: {e}")
        return jsonify({"error": "An error occurred while saving your data. Please try again."}), 500
    
    finally:
        if conn:
            conn.close()











@app.route('/login', methods=['POST'])
def login_user():
    username = request.form.get('username')
    
    try:
        conn = Database().get_db_connection()
        if conn is None:
            flash("Database connection failed.")
            return redirect(url_for('student_login'))
        
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE name = %s', (username,))
        user = cursor.fetchone()
        
        if user:
            session['user_id'] = user[0]  # Store user ID in session
            session['user_name'] = user[1]  # Store user name in session
            return redirect(url_for('student_home'))
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
