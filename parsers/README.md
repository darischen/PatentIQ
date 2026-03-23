# Patent Parsers & Automation

This directory contains the logic for fetching and parsing patent data, specifically from the USPTO.

## Directory Structure

- `uspto_parser.py`: Low-level streaming XML parser for USPTO bulk files.
- `uspto_manager.py`: High-level manager for crawling USPTO bulk links and downloading data.
- `uspto_update_job.py`: Orchestrator for the monthly automated update.

## USPTO Monthly Update System

The system is designed to automatically extract and update patent data from the USPTO every month.

### Key Components

1. **Detection & Fetching**: `uspto_manager.py` crawls the USPTO bulk data datasets to identify new releases.
2. **Parsing**: `uspto_parser.py` extracts required fields (ID, Title, Abstract, Claims, inventors, Assignee, CPC, Filing/Grant Date).
3. **Orchestration**: `uspto_update_job.py` coordinates the download, parse, and database update process.

### Running the Job

To run the monthly update manually:

```bash
python parsers/uspto_update_job.py
```

### Configuration

Ensure your database credentials are set in `patentiq/.env.local`:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Troubleshooting

See the [USPTO Update Job Plan](../brain/2bcda2ad-451b-447c-a2e8-044912d438a7/uspto_update_job_plan.md) for detailed architecture and troubleshooting steps regarding database credentials.
