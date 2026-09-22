"""Validate London specification artifacts only, never claim runtime certification.

Requires jsonschema, PyYAML and openapi-spec-validator in a development environment.
"""
from pathlib import Path
import hashlib
import json
import re
import yaml
from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012
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
    assert '**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**' in text, page
    assert '\u2014' not in text, page
    assert '**DRAFT' not in text, page
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if target.startswith(('https://', 'http://', '#', '/')):
            continue
        assert (page.parent / target.split('#')[0]).exists(), (page, target)
        links += 1
spec = json.loads((root / 'openapi.json').read_text())
validate_openapi(spec)
registry = Registry().with_resource('urn:london:openapi', Resource(spec, DRAFT202012))
examples = operations = 0
for methods in spec['paths'].values():
    for method, operation in methods.items():
        if method not in ('get', 'post', 'put', 'patch', 'delete'):
            continue
        operations += 1
        for key in ('x-authorization', 'x-rate-limit', 'x-pii-classification', 'x-audit-events', 'x-idempotency'):
            assert operation[key]
        media = []
        if 'requestBody' in operation:
            media.extend(operation['requestBody']['content'].values())
        for response in operation['responses'].values():
            media.extend(response.get('content', {}).values())
        for item in media:
            if 'example' not in item:
                continue
            schema = {'$ref': 'urn:london:openapi' + item['schema']['$ref']}
            Draft202012Validator(schema, registry=registry, format_checker=FormatChecker()).validate(item['example'])
            examples += 1
for schema in spec['components']['schemas'].values():
    Draft202012Validator.check_schema(schema)
artifacts = json.loads((root / 'artifact-schemas.json').read_text())
profile = json.loads((root / 'release-profile.schema.json').read_text())
Draft202012Validator.check_schema(artifacts)
Draft202012Validator.check_schema(profile)
fixtures = json.loads((root / 'fixtures.json').read_text())
for value in fixtures['artifact_examples']:
    Draft202012Validator(artifacts, format_checker=FormatChecker()).validate(value)
for vector in fixtures['canonical_vectors']:
    # These fixtures deliberately use only ASCII keys/values and decimal strings.
    canonical = json.dumps(vector['artifact'], sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    assert canonical == vector['canonical_utf8']
    digest = hashlib.sha256(b'porto:london:artifact:v1\n' + canonical.encode()).hexdigest()
    assert digest == vector['sha256_domain_prefixed']
for vector in fixtures['allocation_vectors']:
    amount = int(vector['amount'])
    weights = list(map(int, vector['weights']))
    total = sum(weights)
    result = [amount * weight // total for weight in weights]
    order = sorted(range(len(weights)), key=lambda i: (-(amount * weights[i] % total), vector['ids'][i]))
    for i in order[:amount - sum(result)]:
        result[i] += 1
    assert list(map(str, result)) == vector['expected'], vector['name']
    assert sum(result) == amount
sources = json.loads((root / 'source-manifest.json').read_text())
assert sources['status'] == 'APPROVED'
for source in sources['sources']:
    assert hashlib.sha256((workspace / source['path']).read_bytes()).hexdigest() == source['sha256'], source['path']
assert len(re.findall(r'^\| A\d\d \|', (root / '22-acceptance-test-catalogue.md').read_text(), re.M)) == 40
print(f'PASS: {len(pages)} approved pages; {links} local links; {operations} OpenAPI operations; {examples} schema-valid examples; {len(fixtures["artifact_examples"])} artifacts; profile schema; canonical hash and {len(fixtures["allocation_vectors"])} allocation vectors; {len(sources["sources"])} unchanged canonical source hashes; 40 acceptance cases')
