# USPTO Patent Data Parser

This module provides a memory-efficient XML parser to extract structured data from United States Patent and Trademark Office (USPTO) bulk files.

## Features
- **Streaming Parsing**: Uses `lxml.etree.iterparse` to handle multi-GB XML files without exhausting RAM.
- **Data Export**: Outputs parsed data incrementally to JSONL (JSON Lines) or CSV formats.
- **Robust Error Handling**: Skips malformed nodes while continuing to parse the rest of the file.

## Usage

### Setup

All dependencies are included in the root `requirements.txt`.

```bash
pip install -r requirements.txt
```

### Parsing Records

You can import and use the parser in your Python code:

```python
from parsers.uspto_parser import convert_to_structured

# Convert a raw USPTO XML file to CSV
convert_to_structured(
    xml_file="../data/ipg240102.xml", 
    output_file="../data/output.csv", 
    format="csv"
)

# Convert to JSON (JSON Lines format)
convert_to_structured(
    xml_file="../data/ipg240102.xml", 
    output_file="../data/output.jsonl", 
    format="json"
)
```

## Running Tests

To verify the extraction logic, run the unit test suite:

```bash
cd parsers
pytest tests/
```

## Privacy & Security

> **Warning**: Do not commit raw patent data or generated CSV/JSON outputs to the Git repository. The standard project `.gitignore` assumes all such files are kept safely in the root `data/` directory. Always place raw bulk XML files into `data/` and point the parser to read/write from there.
