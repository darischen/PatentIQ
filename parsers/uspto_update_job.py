import os
import logging
import subprocess
import json
from datetime import datetime
try:
    from .uspto_manager import USPTOManager
    from .uspto_parser import parse_uspto_xml
except ImportError:
    from uspto_manager import USPTOManager
    from uspto_parser import parse_uspto_xml

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("monthly_update.log"),
        logging.StreamHandler()
    ]
)

import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Path to .env.local
env_path = os.path.join(os.path.dirname(__file__), '..', 'patentiq', '.env.local')
load_dotenv(env_path)

def run_monthly_job():
    logging.info("=== Starting Monthly USPTO Update Job ===")
    start_time = datetime.now()
    
    # DB Credentials from Env
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5434'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'postgres'),
        'dbname': os.getenv('DB_NAME', 'patentiq')
    }
    
    # Dataset link provided by the user
    BULK_URL = "https://data.uspto.gov/bulkdata/datasets/ptgrdt?fileDataFromDate=2025-02-24&fileDataToDate=2026-02-24"
    
    manager = USPTOManager(BULK_URL)
    
    try:
        # 1. Detect and Download
        logging.info("Step 1: Detecting and downloading latest dataset...")
        latest_file = manager.fetch_latest_bulk_metadata()
        local_zip = manager.download_file(latest_file)
        
        # 2. Extract
        logging.info("Step 2: Decompressing dataset...")
        extracted_dir = manager.decompress_file(local_zip)
        
        # 3. Parse and Insert
        logging.info("Step 3: Connecting to database and updating records...")
        conn = psycopg2.connect(**db_config)
        conn.autocommit = True
        cur = conn.cursor()
        
        processed_count = 0
        added_count = 0
        
        # In a real run, we would iterate over XML files in extracted_dir
        # For simulation during this session, we'll iterate over mock files if they exist
        for xml_file in os.listdir(extracted_dir):
            if xml_file.endswith('.xml'):
                xml_path = os.path.join(extracted_dir, xml_file)
                for patent in parse_uspto_xml(xml_path):
                    upsert_sql = """
                    INSERT INTO patents (
                        patent_id, title, abstract, claims, inventors, 
                        assignee, filing_date, status, cpc_classification
                    ) VALUES (
                        %(patent_number)s, %(invention_title)s, %(abstract)s, %(claims)s, %(inventors)s,
                        %(assignee)s, %(filing_date)s, %(grant_status)s, %(cpc_classification)s
                    )
                    ON CONFLICT (patent_id) DO UPDATE SET
                        title = EXCLUDED.title,
                        abstract = EXCLUDED.abstract,
                        claims = EXCLUDED.claims,
                        inventors = EXCLUDED.inventors,
                        assignee = EXCLUDED.assignee,
                        status = EXCLUDED.status,
                        cpc_classification = EXCLUDED.cpc_classification,
                        updated_at = CURRENT_TIMESTAMP;
                    """
                    # Fix date format if needed (USPTO is YYYYMMDD)
                    if patent.get('filing_date') and len(patent['filing_date']) == 8:
                        f = patent['filing_date']
                        patent['filing_date'] = f"{f[:4]}-{f[4:6]}-{f[6:8]}"
                    
                    cur.execute(upsert_sql, patent)
                    processed_count += 1
                    added_count += 1
        
        cur.close()
        conn.close()
        
        # 4. Trigger Vector Re-indexing
        logging.info("Step 4: Triggering vector embedding generation for new/updated records...")
        try:
            # We call the existing generate_embeddings.py script
            # Passing --db-path or similar if the script supports it, otherwise it uses its defaults
            subprocess.run(["python", "generate_embeddings.py"], check=True)
            logging.info("Vector re-indexing successful.")
        except subprocess.CalledProcessError as e:
            logging.error(f"Vector re-indexing failed: {e}")
            notify_admin(f"USPTO Update: Database updated but Vector re-indexing failed.")

        # 5. Success Logging
        duration = datetime.now() - start_time
        logging.info(f"=== Job Complete ===")
        logging.info(f"Date: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        logging.info(f"Duration: {duration}")
        logging.info(f"Records Processed: {processed_count}")
        logging.info(f"Records Added/Updated: {added_count}")
        
    except Exception as e:
        logging.error(f"Job Failed: {e}")
        notify_admin(f"Monthly USPTO Update Failed: {str(e)}")

def notify_admin(message):
    logging.warning(f"ADM ALERT: {message}")

if __name__ == "__main__":
    run_monthly_job()
