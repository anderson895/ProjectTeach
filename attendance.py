from database import Database
import pytz
from datetime import datetime

class Attendance:
    def __init__(self, connection):
        # Initialize with a database connection
        self.connection = connection
        self.cursor = connection.cursor()
    
    def close(self):
        # Close the cursor and connection
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()

    def admin_fetch_all_student(self):
        try:
            manila_tz = pytz.timezone('Asia/Manila')
            # Get today's date in the desired format (e.g., 'YYYY-MM-DD')
            today_date = datetime.now(manila_tz).strftime('%Y-%m-%d')
            
            # SQL query to fetch users not in today's attendance
            query = """
                SELECT * FROM users
                WHERE ID NOT IN (
                    SELECT a_student_id FROM attendance WHERE DATE(a_date) = %s
                )
            """
            
            # Execute the query with today's date as the parameter
            self.cursor.execute(query, (today_date,))
            result = self.cursor.fetchall()
            
            # Create a list of dictionaries for the students
            students = [{"id": row[0], "name": row[1], "age": row[2], "gender": row[3], "type": row[4]} for row in result]
            
            return students
        except Exception as e:
            print(f"Error fetching all users: {e}")
            return None


        


    def admin_record_Attendance(self, student_id, status):
        try:
            manila_tz = pytz.timezone('Asia/Manila')
            current_time = datetime.now(manila_tz).strftime('%Y-%m-%d %H:%M:%S')

            # Use parameterized query to avoid SQL injection
            query = "INSERT INTO `attendance` (`a_student_id`, `a_status`, `a_date`) VALUES (%s, %s, %s)"
            values = (student_id, status, current_time)

            # Execute the query with parameters
            self.cursor.execute(query, values)
            
            # Commit the transaction using the connection object
            self.connection.commit()
            
            return 200

        except Exception as e:
            print(f"Error recording attendance: {e}")
            return None



    

if __name__ == "__main__":
    # Initialize the database connection
    connection = Database().get_db_connection()

    # Instantiate Attendance with the connection
    attendance = Attendance(connection)

    # Execute the function with the parameters
    users = attendance.admin_fetch_all_student()

    print(users)


    # Close the connection
    attendance.close()
