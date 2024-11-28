from datetime import datetime
from database import Database  # Ensure this import is correct

class Get_GameStat(Database):
    def __init__(self, connection):
        self.connection = connection
        self.cursor = connection.cursor()
    
    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()

    def fetch_game_record_stat(self, game_id, user_id):
        try:
            # Define the query to filter by game_id and user_id
            query = """
                SELECT gr_id, gr_game_id, gr_user_id, gr_current_level, gr_lvl1, gr_lvl2, gr_lvl3, gr_date
                FROM game_record
                WHERE gr_game_id = %s AND gr_user_id = %s
                ORDER BY gr_date ASC
            """
            self.cursor.execute(query, (game_id, user_id))

            # Fetch all rows from the result set
            results = self.cursor.fetchall()

            if not results:
                return None  # No data found for the user and game

            # Get the column names from cursor.description
            columns = [col[0] for col in self.cursor.description]

            # Get the first record date (this will be "Day 1")
            first_record_date = results[0][7]  # gr_date is at index 7 (0-based indexing)
            report = []

            # Iterate through the results and assign the day count
            for row in results:
                # Convert each row to a dictionary using column names
                row_dict = dict(zip(columns, row))

                # Extract values
                gr_date = row_dict['gr_date']
                gr_current_level = row_dict['gr_current_level']
                gr_lvl1 = row_dict['gr_lvl1']
                gr_lvl2 = row_dict['gr_lvl2']
                gr_lvl3 = row_dict['gr_lvl3']

                # Calculate the number of days since the first record
                delta_days = (gr_date - first_record_date).days

                # Create a report for each day including levels
                report.append({
                    'Day': delta_days + 1,  # Day starts from 1
                    'Level': gr_current_level,
                    'Lvl1': gr_lvl1,
                    'Lvl2': gr_lvl2,
                    'Lvl3': gr_lvl3,
                    'Date': gr_date
                })

            return report  # Return the list of day reports

        except Exception as e:
            print(f"Error fetching game record: {e}")
            return None


if __name__ == "__main__":
    connection = Database().get_db_connection()
    conn = Get_GameStat(connection)
    data = conn.fetch_game_record_stat(game_id=1, user_id=11)

    if data:
        for day_report in data:
            print(f"DAY {day_report['Day']} = {day_report['Level']} (Date: {day_report['Date']})")
            print(f"  Lvl1: {day_report['Lvl1']}, Lvl2: {day_report['Lvl2']}, Lvl3: {day_report['Lvl3']}")
    else:
        print("No data found for the specified game and user.")

    conn.close()
