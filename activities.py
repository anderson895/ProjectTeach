from database import Database
import pytz
from datetime import datetime

class Activities:
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

    def admin_fetch_game_record(self, user_id):
        try:
            manila_tz = pytz.timezone('Asia/Manila')
            # Get today's date in the desired format (e.g., 'YYYY-MM-DD')
            today_date = datetime.now(manila_tz).strftime('%Y-%m-%d')
            
            # SQL query to fetch game records for the specified user_id
            query = """
                SELECT * FROM game_record
                LEFT JOIN game
                ON game.game_id = game_record.gr_game_id   
                WHERE gr_user_id = %s
            """
            
            # Execute the query with the actual user_id
            self.cursor.execute(query, (user_id,))
            result = self.cursor.fetchall()
            
            return result
        except Exception as e:
            print(f"Error fetching game records: {e}")
            return None



    def admin_fetch_game_record_daily(self, user_id):
        try:
            manila_tz = pytz.timezone('Asia/Manila')
            # Get today's date in the desired format (e.g., 'YYYY-MM-DD')
            today_date = datetime.now(manila_tz).strftime('%Y-%m-%d')

            # SQL query to fetch game records for the specified user_id on today's date
            query = """
                SELECT * FROM game_record
                LEFT JOIN game
                ON game.game_id = game_record.gr_game_id   
                WHERE gr_user_id = %s AND DATE(gr_date) = %s
            """
            
            # Execute the query with the actual user_id and today's date
            self.cursor.execute(query, (user_id, today_date))
            result = self.cursor.fetchall()
            
            return result
        except Exception as e:
            print(f"Error fetching game records: {e}")
            return None
        


    def admin_fetch_game_record_all(self, game_id, user_id):
        try:
            # SQL query to fetch all records matching user_id and game_id, sorted by descending date
            query = """
                SELECT * 
                FROM game_record
                LEFT JOIN game
                ON game.game_id = game_record.gr_game_id
                LEFT JOIN users
                ON users.id = game_record.gr_user_id
                WHERE gr_user_id = %s AND gr_game_id = %s
                ORDER BY game_record.gr_date DESC  -- Sort by date in descending order
            """
            # Execute the query with the provided parameters
            self.cursor.execute(query, (user_id, game_id))
            
            # Fetch all matching records
            result = self.cursor.fetchall()
            
            return result
        except Exception as e:
            print(f"Error fetching game records: {e}")
            return None

        

if __name__ == "__main__":
    connection = Database().get_db_connection()
    conn = Activities(connection)
    data = conn.admin_fetch_game_record_all(4,11)

    print(data)

    conn.close()
