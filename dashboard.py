from database import Database

class Dashboard:
    def __init__(self, connection):
        # Initialize with a database connection
        self.connection = connection
        self.cursor = connection.cursor()

    def count_users(self):
        try:
            query = "SELECT COUNT(*) FROM users"
            self.cursor.execute(query)
            result = self.cursor.fetchone()
            return result[0]
        except Exception as e:
            print(f"Error counting users: {e}")
            return None

    def count_daily_activity(self):
        try:
            query = "SELECT COUNT(*) FROM game_record WHERE DATE(gr_date) = CURDATE()"
            self.cursor.execute(query)
            result = self.cursor.fetchone()
            return result[0]
        except Exception as e:
            print(f"Error counting daily activity: {e}")
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

    # Instantiate Dashboard with the connection
    db = Dashboard(connection)

    # Get the user count
    user_count = db.count_users()
    print(f"Total users: {user_count}")

    # Get the daily activity count
    daily_activity_count = db.count_daily_activity()
    print(f"Total daily activity: {daily_activity_count}")

    # Close the connection
    db.close()
