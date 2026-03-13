import os
import pytest
from parsers.uspto_parser import parse_uspto_xml

# Sample USPTO XML Grant format snippet
SAMPLE_XML = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE us-patent-grant SYSTEM "us-patent-grant-v47-2023-01-25.dtd">
<us-patent-grant>
    <us-bibliographic-data-grant>
        <publication-reference>
            <document-id>
                <doc-number>1234567</doc-number>
                <date>20240101</date>
            </document-id>
        </publication-reference>
        <application-reference>
            <document-id>
                <date>20230501</date>
            </document-id>
        </application-reference>
        <invention-title id="d2e53">Artificial Intelligence Patent System</invention-title>
        <assignees>
            <assignee>
                <orgname>OpenAI</orgname>
            </assignee>
        </assignees>
        <inventors>
            <inventor>
                <first-name>Jane</first-name>
                <last-name>Doe</last-name>
            </inventor>
            <inventor>
                <first-name>John</first-name>
                <last-name>Smith</last-name>
            </inventor>
        </inventors>
        <classifications-cpc>
            <main-cpc>
                <classification-cpc>
                    <section>G</section>
                    <class>06</class>
                    <subclass>F</subclass>
                    <main-group>17</main-group>
                    <subgroup>30</subgroup>
                </classification-cpc>
            </main-cpc>
        </classifications-cpc>
    </us-bibliographic-data-grant>
    <abstract id="abstract">
        <p id="p-0001">A system for parsing patents using AI.</p>
        <p id="p-0002">It extracts data efficiently.</p>
    </abstract>
    <claims id="claims">
        <claim id="c-0001">
            <claim-text>1. A method comprising: parsing XML.</claim-text>
        </claim>
        <claim id="c-0002">
            <claim-text>2. The method of claim 1, further comprising outputting JSON.</claim-text>
        </claim>
    </claims>
</us-patent-grant>
"""

@pytest.fixture
def sample_xml_file(tmp_path):
    file_path = tmp_path / "sample.xml"
    file_path.write_text(SAMPLE_XML)
    return file_path

def test_parse_uspto_xml(sample_xml_file):
    generator = parse_uspto_xml(str(sample_xml_file))
    records = list(generator)
    
    assert len(records) == 1
    record = records[0]
    
    assert record['patent_number'] == '1234567'
    assert record['publication_date'] == '20240101'
    assert record['filing_date'] == '20230501'
    assert record['invention_title'] == 'Artificial Intelligence Patent System'
    assert record['abstract'] == 'A system for parsing patents using AI.\nIt extracts data efficiently.'
    assert record['claims'] == '1. A method comprising: parsing XML.\n2. The method of claim 1, further comprising outputting JSON.'
    
    assert len(record['inventors']) == 2
    assert record['inventors'][0] == 'Jane Doe'
    assert record['inventors'][1] == 'John Smith'
    
    assert len(record['assignee']) == 1
    assert record['assignee'][0] == 'OpenAI'
    
    assert len(record['cpc_classification']) == 1
    assert record['cpc_classification'][0] == 'G06F 17/30'
