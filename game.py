from database import Database

class Get_Game_Info(Database):
    def __init__(self, connection):
        self.connection = connection
        self.cursor = connection.cursor()
    
    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()

    def fetch_game_record(self):
        try:
            # Define and execute the SQL query
            query = "SELECT * FROM `game`"
            self.cursor.execute(query)
            
            # Fetch all rows from the result set
            results = self.cursor.fetchall()

            # Fetch column names from the cursor description
            columns = [col[0] for col in self.cursor.description]

            # Check if there's any data
            if results:
                # Convert each row to a dictionary using column names as keys
                return [dict(zip(columns, row)) for row in results]
            
            return None  # Return None if the result is empty
        except Exception as e:
            print(f"Error fetching game record: {e}")
            return None







        
    

if __name__ == "__main__":
    connection = Database().get_db_connection()
    conn = Get_Game_Info(connection)
    data = conn.fetch_game_record()

    print(data)

    conn.close()
