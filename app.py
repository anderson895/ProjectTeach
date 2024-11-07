from flask import Flask, render_template, request, redirect, url_for, flash, session, abort, jsonify
import mysql.connector
from mysql.connector import Error
from datetime import datetime


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
    connection = get_db_connection()
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

    connection = get_db_connection()
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

@app.route('/student/sensory_game/<int:user_id>')
def sensory_game(user_id):
    return render_template('student/sensory_game.html', user_id=user_id)




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
    if 'user_id' not in session:
        flash("Please log in to access this page.")
        return redirect(url_for('student_login'))
    
    return render_template('student/home.html')

@app.route('/logout', methods=['POST'])
def student_logout():
    session.pop('user_id', None)  # Remove user ID from session
    session.pop('user_name', None)  # Remove user name from session
    flash("You have been logged out.")  # Optional flash message
    return redirect(url_for('student_login'))  # Redirect to login page

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
