import mysql.connector
from mysql.connector import Error
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    def get_db_connection(self):
        try:
            conn = mysql.connector.connect(
                host='localhost',
                database='ProjTeach',
                user='root',
                password=''  # Ensure this is correct
            )
            if conn.is_connected():
                logger.info("Database connection successful.")
            return conn
        except Error as e:
            logger.error(f"Error connecting to database: {e}")
            return None
