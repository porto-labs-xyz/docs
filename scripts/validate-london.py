"""Validate London documentation contracts, examples, links and source pins.

Requires jsonschema, PyYAML and openapi-spec-validator in a development environment.
This validates documentation artefacts, not production application behaviour.
"""
from pathlib import Path
import hashlib
import json
import re
import yaml
from jsonschema import Draft202012Validator, FormatChecker
from openapi_spec_validator import validate as validate_openapi

site = Path(__file__).resolve().parents[1]
root = site / 'london-0.1.0'
workspace = site.parent
pages = sorted([*root.glob('*.md'), *root.glob('*.mdx')])
ids = set()
links = 0
for page in pages:
    text = page.read_text()
    assert text.startswith('---\n'), page
    front = yaml.safe_load(text.split('---\n', 2)[1])
    assert all(k in front for k in ('id', 'title', 'sidebar_position')), page
    assert front['id'] not in ids, front['id']
    ids.add(front['id'])
    assert '**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**' in text, page
    assert '\u2014' not in text, page
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if target.startswith(('https://', 'http://', '#', '/')):
            continue
        assert (page.parent / target.split('#')[0]).exists(), (page, target)
        links += 1
spec = json.loads((root / 'openapi.json').read_text())
validate_openapi(spec)
examples = 0
for methods in spec['paths'].values():
    for operation in methods.values():
        for key in ('x-authorization', 'x-rate-limit', 'x-pii-classification', 'x-audit-events'):
            assert operation[key]
        media = []
        if 'requestBody' in operation:
            media.append(operation['requestBody']['content']['application/json'])
        media.extend(response['content']['application/json'] for response in operation['responses'].values())
        for item in media:
            if 'example' not in item:
                continue
            schema = spec['components']['schemas'][item['schema']['$ref'].split('/')[-1]]
            Draft202012Validator.check_schema(schema)
            Draft202012Validator(schema, format_checker=FormatChecker()).validate(item['example'])
            examples += 1
for source in json.loads((root / 'source-manifest.json').read_text())['sources']:
    assert hashlib.sha256((workspace / source['path']).read_bytes()).hexdigest() == source['sha256'], source['path']
print(f'PASS: {len(pages)} front matters/draft banners; {links} local links; OpenAPI 3.1; {examples} schema-valid examples; 7 source hashes')
