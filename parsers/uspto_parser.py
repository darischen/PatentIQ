import os
import json
import logging
from lxml import etree
import pandas as pd
from tqdm import tqdm

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("parser.log"),
        logging.StreamHandler()
    ]
)

def safe_get_text(element, xpath, namespaces=None):
    """Safely extract text from an XML element using XPath."""
    if element is None:
        return ""
    try:
        nodes = element.xpath(xpath, namespaces=namespaces)
        if nodes:
            # If the result is a string, return it directly
            if isinstance(nodes[0], str):
                return nodes[0].strip()
            # If it's an element, get its text
            return " ".join([n.text.strip() for n in nodes if n.text]).strip()
    except Exception as e:
        logging.debug(f"Error extracting {xpath}: {e}")
    return ""

def safe_get_all_text(element, xpath, namespaces=None):
    """Safely extract and concatenate all text within multiple elements."""
    if element is None:
        return ""
    try:
        nodes = element.xpath(xpath, namespaces=namespaces)
        text_content = []
        for node in nodes:
            # lxml node.itertext() gets all text, including children
            text = "".join(node.itertext()).strip()
            if text:
                text_content.append(text)
        return "\n".join(text_content)
    except Exception as e:
        logging.debug(f"Error extracting multiple text for {xpath}: {e}")
    return ""

def parse_uspto_xml(file_path):
    """
    Parses a USPTO patent XML file incrementally.
    Yields a dictionary of extracted patent data for each document found.
    """
    logging.info(f"Starting to parse: {file_path}")
    
    # USPTO bulk files often have multiple XML declarations and root elements.
    # iterparse handles this sequential XML stream well if we recover from errors.
    
    context = etree.iterparse(
        file_path, 
        events=('end',), 
        tag='us-patent-grant', # Generic tag for grant data, might also be 'us-patent-application'
        recover=True, # Recover from multiple roots/declarations
        huge_tree=True
    )
    
    count = 0
    for event, elem in context:
        extracted_data = {}
        try:
            # Extract basic identifiers
            pub_ref = elem.find('.//publication-reference')
            app_ref = elem.find('.//application-reference')
            
            extracted_data['patent_number'] = safe_get_text(pub_ref, './/document-id/doc-number')
            extracted_data['publication_date'] = safe_get_text(pub_ref, './/document-id/date')
            extracted_data['filing_date'] = safe_get_text(app_ref, './/document-id/date')
            
            # Title, Abstract, Claims
            extracted_data['invention_title'] = safe_get_text(elem, './/invention-title')
            extracted_data['abstract'] = safe_get_all_text(elem, './/abstract/p')
            extracted_data['claims'] = safe_get_all_text(elem, './/claims/claim')
            
            # Inventors
            inventors = []
            for inv in elem.xpath('.//inventors/inventor | .//inventor'):
                first = safe_get_text(inv, './/first-name')
                last = safe_get_text(inv, './/last-name')
                if first or last:
                    inventors.append(f"{first} {last}".strip())
            extracted_data['inventors'] = inventors
            
            # Assignees
            assignees = []
            for asn in elem.xpath('.//assignees/assignee | .//assignee'):
                orgname = safe_get_text(asn, './/orgname')
                first = safe_get_text(asn, './/first-name')
                last = safe_get_text(asn, './/last-name')
                if orgname:
                    assignees.append(orgname)
                elif first or last:
                    assignees.append(f"{first} {last}".strip())
            extracted_data['assignee'] = assignees
            
            # CPC Classification
            cpcs = []
            for cpc in elem.xpath('.//classifications-cpc//classification-cpc'):
                section = safe_get_text(cpc, './/section')
                c_class = safe_get_text(cpc, './/class')
                subclass = safe_get_text(cpc, './/subclass')
                group = safe_get_text(cpc, './/main-group')
                subgroup = safe_get_text(cpc, './/subgroup')
                if section and c_class:
                    cpc_string = f"{section}{c_class}{subclass} {group}/{subgroup}".strip()
                    cpcs.append(cpc_string)
            extracted_data['cpc_classification'] = cpcs
            
            yield extracted_data
            count += 1
            
        except Exception as e:
            logging.error(f"Error parsing an element: {e}")
        finally:
            # Memory management: free the element after processing
            elem.clear()
            # Also eliminate empty ancestors
            while elem.getprevious() is not None:
                del elem.getparent()[0]
                
    logging.info(f"Finished parsing. Total records extracted: {count}")

def convert_to_structured(xml_file, output_file, format='json'):
    """
    Parses the XML and writes the output incrementally to JSON or CSV.
    """
    if not os.path.exists(xml_file):
        logging.error(f"File not found: {xml_file}")
        return
        
    logging.info(f"Extracting data to {output_file} (format: {format})")
    
    parsed_generator = parse_uspto_xml(xml_file)
    
    records = []
    try:
        for idx, record in enumerate(tqdm(parsed_generator, desc="Parsing Patents")):
            records.append(record)
            
            # Periodically write to disk for large files
            if len(records) >= 1000:
                _write_records(records, output_file, format, mode='a' if idx >= 1000 else 'w')
                records = []
                
        # Write any remaining records
        if records:
             _write_records(records, output_file, format, mode='a' if os.path.exists(output_file) and format == 'csv' else 'w')
             
        if format == 'json':
            # For JSON, if we dumped incrementally, it might not be a valid JSON array.
            # Best practice for large JSON is JSONL (JSON Lines). 
            # We enforce JSONL if format='json' to avoid memory blowups on massive arrays.
            logging.info("JSON output is formatted as JSON Lines (.jsonl)")

    except Exception as e:
         logging.error(f"Fatal error during conversion: {e}")

def _write_records(records, output_file, format, mode='w'):
    if format == 'csv':
        df = pd.DataFrame(records)
        # Convert lists to strings for CSV
        df['inventors'] = df['inventors'].apply(lambda x: '; '.join(x) if isinstance(x, list) else x)
        df['assignee'] = df['assignee'].apply(lambda x: '; '.join(x) if isinstance(x, list) else x)
        df['cpc_classification'] = df['cpc_classification'].apply(lambda x: '; '.join(x) if isinstance(x, list) else x)
        
        df.to_csv(output_file, mode=mode, index=False, header=(mode == 'w'))
    elif format == 'json':
        with open(output_file, mode) as f:
            for record in records:
                f.write(json.dumps(record) + '\n')

if __name__ == "__main__":
    # Example Usage:
    # convert_to_structured("../data/sample.xml", "../data/output.csv", format="csv")
    pass
