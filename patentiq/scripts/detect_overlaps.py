#!/usr/bin/env python3
"""
Wrapper script to detect concept overlaps between invention and patents
Called from Node.js via subprocess with input on stdin
"""

import sys
import json
from pathlib import Path

# Add scripts directory to path to import overlap_highlighting
sys.path.insert(0, str(Path(__file__).parent))

from overlap_highlighting import find_concept_overlaps

def main():
    try:
        # Read JSON from stdin
        input_data = json.load(sys.stdin)

        invention_text = input_data.get('invention', '')
        patents = input_data.get('patents', [])

        if not invention_text:
            print(json.dumps({'error': 'invention text required'}))
            sys.exit(1)

        results = []
        for patent in patents:
            patent_text = patent.get('text', '')
            patent_id = patent.get('id', '')

            if not patent_text:
                continue

            overlaps = find_concept_overlaps(invention_text, patent_text)
            results.append({
                'patent_id': patent_id,
                'overlap_count': overlaps['overlap_count'],
                'overlaps': overlaps['overlaps'],
                'average_similarity': overlaps['average_similarity'],
                'risk_level': overlaps['risk_level'],
                'highlight_terms': overlaps['highlight_terms'],
            })

        print(json.dumps(results))

    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
