from database import Database

class Attendance:
    def __init__(self, connection):
        # Initialize with a database connection
        self.connection = connection
        self.cursor = connection.cursor()

    def admin_fetch_all_student(self):
        try:
            query = "SELECT * FROM users"
            self.cursor.execute(query)
            result = self.cursor.fetchall()  # Use fetchall() to get all rows
            
            # Assuming the columns are returned in the order: id, name, age, gender, type
            students = [{"id": row[0], "name": row[1], "age": row[2], "gender": row[3], "type": row[4]} for row in result]
            
            return students
        except Exception as e:
            print(f"Error fetching all users: {e}")
            return None


    def close(self):
        # Close the cursor and connection
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()

if __name__ == "__main__":
    # Initialize the database connection
    connection = Database().get_db_connection()

    # Instantiate Attendance with the connection
    attendance = Attendance(connection)

    # Get all users
    users = attendance.admin_fetch_all_student()
    print(users)  # Display fetched users

    # Close the connection
    attendance.close()
