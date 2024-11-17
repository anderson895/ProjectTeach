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

    def admin_fetch_all_student_today(self):
        try:
            today_date = datetime.now(pytz.timezone('Asia/Manila')).strftime('%Y-%m-%d')
            
            query = """
                SELECT * FROM users
                WHERE ID NOT IN (
                    SELECT a_student_id FROM attendance WHERE DATE(a_date) = %s
                )
            """
            
            self.cursor.execute(query, (today_date,))
            result = self.cursor.fetchall()
            
            return [
                {"id": row[0], "name": row[1], "age": row[2], "gender": row[3], "type": row[4]}
                for row in result
            ]
        except Exception as e:
            print(f"Error fetching all users: {e}")
            return None
        


    def admin_fetch_all_student(self):
        try:
            query = """ SELECT * FROM users"""
            
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            
            return [
                {"id": row[0], "name": row[1], "age": row[2], "gender": row[3], "type": row[4]}
                for row in result
            ]
        except Exception as e:
            print(f"Error fetching all users: {e}")
            return None
        




        

    def all_record_Attendance(self, student_id):
        try:
            query = """SELECT * FROM attendance WHERE a_student_id = %s"""
            self.cursor.execute(query, (student_id,))
            result = self.cursor.fetchall()

            # Adjust to match the table schema
            return [
                {
                    "id": row[0],          # a_id
                    "student_id": row[1],  # a_student_id
                    "status": row[2],      # a_status
                    "date": row[3]         # a_date
                }
                for row in result
            ]
        except Exception as e:
            print(f"Error fetching attendance records: {e}")
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
    connection = Database().get_db_connection()
    if connection:
        attendance = Attendance(connection)

        # Fetch attendance records for a specific student ID
        student_id = 15
        users = attendance.all_record_Attendance(student_id)

        if users:
            print("Attendance Records:")
            for user in users:
                print(user)
        else:
            print("No attendance records found.")

        # Close the connection
        attendance.close()
    else:
        print("Failed to connect to the database.")
