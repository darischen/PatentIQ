import psycopg2
import os
import sys
from dotenv import load_dotenv

# Path to .env.local
env_path = os.path.join(os.path.dirname(__file__), '..', 'patentiq', '.env.local')
load_dotenv(env_path)

def apply_migration():
    host = os.getenv('DB_HOST', 'localhost')
    port = os.getenv('DB_PORT', '5432')
    user = os.getenv('DB_USER', 'postgres')
    password = os.getenv('DB_PASSWORD', 'postgres')
    dbname = os.getenv('DB_NAME', 'patentiq')

    print(f"Connecting to {dbname} on {host}:{port} as {user}...")
    
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            dbname=dbname
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        sql_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'update_patents_table.sql')
        print(f"Reading SQL from {sql_path}...")
        
        with open(sql_path, 'r') as f:
            sql = f.read()
            
        print("Executing migration...")
        cur.execute(sql)
        print("✅ Migration applied successfully!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    apply_migration()
