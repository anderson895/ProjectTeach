from flask import Flask, render_template, request, redirect, url_for, flash, session, abort, jsonify ,make_response
from database import Database
from dashboard import Dashboard
from attendance import Attendance
from activities import Activities
from get_student_record import Get_User_Info
import mysql.connector 
import bcrypt  
from datetime import datetime
from game import Get_Game_Info
from GameStat import Get_GameStat

app = Flask(__name__)
app.secret_key = 'AWLJDIAWLWAD'


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())




@app.route('/admin/game_stat/<int:game_id>/<string:game_name>')
def game_stat(game_id,game_name):
    return render_template('admin/game_stat.html',game_id=game_id,game_name=game_name)


@app.route('/admin/view_student_game_stat/<int:student_id>/<int:game_id>/<string:gameName>/<string:studName>')
def view_student_game_stat(student_id, game_id,gameName,studName):
    return render_template('admin/view_student_game_stat.html', student_id=student_id, game_id=game_id,gameName=gameName,studName=studName)




@app.route('/admin_fetchGameStat', methods=['GET'])
def admin_fetchGameStat():
    game_id = request.args.get('game_id')
    student_id = request.args.get('student_id')

    fetch_game_record = Get_GameStat(Database().get_db_connection()).fetch_game_record_stat(game_id, student_id)
    
    return jsonify(fetch_game_record) 




@app.route('/admin_fetchGame', methods=['GET'])
def admin_fetchGame():
    conn = Database().get_db_connection()
    fetch_game_record = Get_Game_Info(conn).fetch_game_record()
    data = {
        "Get_Game_Info": fetch_game_record
    }
    return jsonify(data)



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



@app.route('/game_details')
def game_details():
    # Retrieve query parameters
    game_id = request.args.get('gameId')
    user_id = request.args.get('userId')

    game_details = {
        "game_id": game_id,
        "user_id": user_id
    }
    return render_template('/admin/game_details.html', game_details=game_details)




@app.route('/admin/register')
def admin_register():
    return render_template('admin/registration.html')



@app.route('/student/login', methods=['GET'])
def student_login():
    return render_template('student/login.html')


@app.route('/student/login', methods=['POST'])
def login_user():
    # Get the JSON data sent by the AJAX request
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({'error': 'Username is required.'}), 400
    
    try:
        # Establish database connection
        conn = Database().get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed.'}), 500

        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE name = %s', (username,))
        user = cursor.fetchone()

        if user:
            # Assuming user[0] is the user ID and user[1] is the user name
            session['user_id'] = user[0]  # Store user ID in session
            session['user_name'] = user[1]  # Store user name in session

            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'error': f'User "{username}" not found. Please register.'}), 404

    except Error as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({'error': 'An error occurred during login.'}), 500

    finally:
        if conn:
            conn.close()





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
    data = {
        "count_users": count_users,
        "count_daily_activity": count_daily_activity
    }
    return jsonify(data)




@app.route('/admin_fetch_game_record_daily', methods=['GET'])
def admin_fetch_game_record_daily():
    student_id = request.args.get('id')
    conn = Database().get_db_connection()
    data = Activities(conn).admin_fetch_game_record_daily(student_id)

    return jsonify(data)



@app.route('/admin_fetch_game_record_details', methods=['GET'])
def admin_fetch_game_record_all():
    gameId = request.args.get('gameId')
    userId = request.args.get('userId')
    conn = Database().get_db_connection()
    data = Activities(conn).admin_fetch_game_record_all(gameId,userId)

    return jsonify(data)



@app.route('/admin_fetch_all_student_today', methods=['GET'])
def admin_fetch_all_student_today():
    conn = Database().get_db_connection()
    admin_fetch_all_student_today = Attendance(conn).admin_fetch_all_student_today()
    return jsonify(admin_fetch_all_student_today)



@app.route('/admin_fetch_all_student', methods=['GET'])
def admin_fetch_all_student():
    conn = Database().get_db_connection()
    admin_fetch_all_student = Attendance(conn).admin_fetch_all_student()
    return jsonify(admin_fetch_all_student)



@app.route('/all_record_Attendance', methods=['GET'])
def all_record_Attendance():
    student_id = request.args.get('id')
    if not student_id:
        return jsonify({"error": "Student ID is required"}), 400
    try:
        conn = Database().get_db_connection()
        all_record_Attendance = Attendance(conn).all_record_Attendance(student_id)
        return jsonify(all_record_Attendance)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/admin_record_Attendance', methods=['POST'])
def admin_record_Attendance():
    data = request.get_json()
    student_id, status = data.get('studentId'), data.get('status')
    if not student_id or not status:
        return jsonify({"status": 400, "message": "Missing studentId or status"}), 400
    try:
        conn = Database().get_db_connection()
        if Attendance(conn).admin_record_Attendance(student_id, status) == 200:
            return jsonify({"status": 200, "message": "Attendance recorded successfully"})
        return jsonify({"status": 500, "message": "Error recording attendance"}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": 500, "message": "Internal Server Error"}), 500




@app.route('/admin/view_student/')
def admin_view_student():
    student_id = request.args.get('id')  # Get the 'id' from the URL query string
    if student_id:
        # Fetch the student details from the database using the student_id
        student = get_student_by_id(student_id)  # Replace with your actual database query
        if student:
            return render_template('admin/view_student.html', student=student)
        else:
            # Handle case where no student is found
            return "Student not found", 404
    else:
        # Handle case where no student_id is provided
        return "Student ID not found", 404
    



def get_student_by_id(student_id):
    conn = Database().get_db_connection()
    fetch_data = Get_User_Info(conn).fetch_student_record(student_id)
    print(fetch_data)  # Debugging line to print the data returned by the query
    return fetch_data  # Make sure this contains 'name'



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
    
    return redirect(url_for('admin_login')) 




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















# if __name__ == '__main__':
#     app.run(port=5001, debug=True)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)