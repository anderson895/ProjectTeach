from database import Database

class Get_User_Info(Database):
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

    def fetch_student_record(self, user_id):
        try:
            # SQL query to fetch specific columns (id, name, age, gender, type) for the specified user_id
            query = """
            SELECT id, name, age, gender, type FROM `users`
                WHERE id = %s
            """
            
            # Execute the query with the actual user_id
            self.cursor.execute(query, (user_id,))
            result = self.cursor.fetchall()
            
            # If result is not empty, convert the first record to a dictionary
            if result:
                column_names = ['id', 'name', 'age', 'gender', 'type']  # Define the column names
                # Return only the first record (the expected student)
                return dict(zip(column_names, result[0]))  
            return None
        except Exception as e:
            print(f"Error fetching student record: {e}")
            return None





        
    

if __name__ == "__main__":
    connection = Database().get_db_connection()
    conn = Get_User_Info(connection)
    data = conn.fetch_student_record()

    print(data)

    conn.close()
