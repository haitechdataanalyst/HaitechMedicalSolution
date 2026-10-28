"""Final audit of the Cloudinary media library's folder organisation.

Run after refreshing the two inputs (see docs/asset-audit/REPORT.md):
  docs/asset-audit/cloudinary-inventory-final.json   every image asset with its asset_folder, tags and delivery URL
  docs/asset-audit/cloudinary-folders-final.json     every folder that exists, found by walking the folder tree

    python scripts/audit-cloudinary-folders.py

Prints PASS/FAIL per check, writes docs/asset-audit/cloudinary-final-audit.json, exits 1 if any check fails.
"""
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = 'Haitech Medical Solution/'
AUDIT = 'docs/asset-audit'
post = json.load(open(f'{AUDIT}/cloudinary-inventory-final.json', encoding='utf-8'))
folders = json.load(open(f'{AUDIT}/cloudinary-folders-final.json', encoding='utf-8'))
pre = json.load(open(f'{AUDIT}/cloudinary-inventory-final-pre.json', encoding='utf-8'))
plan = json.load(open(f'{AUDIT}/cloudinary-final-plan.json', encoding='utf-8'))
upload_map = json.load(open(f'{AUDIT}/cloudinary-upload-map.json', encoding='utf-8'))

results = []


def check(name, ok, detail=''):
    results.append({'check': name, 'pass': bool(ok), 'detail': detail})
    print(('PASS ' if ok else 'FAIL ') + name + (' | ' + detail if detail else ''))


# 1. nothing lost, nothing renamed
check('no asset deleted or added by the organisation', len(post) == len(pre), f'{len(pre)} -> {len(post)}')
check('every public ID is unchanged', {a['public_id'] for a in post} == {a['public_id'] for a in pre})

# 2. every asset sits in a folder under the single root folder
no_folder = [a['public_id'] for a in post if not a['asset_folder']]
outside = [a['public_id'] for a in post if a['asset_folder'] and not a['asset_folder'].startswith(ROOT)]
check('assets with no folder', not no_folder, str(len(no_folder)))
check('assets outside "Haitech Medical Solution/"', not outside, str(len(outside)))
check('one root folder only', [f for f in folders if '/' not in f] == ['Haitech Medical Solution'], str([f for f in folders if '/' not in f]))

# 3. folder paths follow the hierarchy
allowed = [
    r'^images/products/(admetec|almadent|bondent|medesy|salli|strauss)(/.+)?$',
    r'^images/products/shared$',
    r'^images/(team|articles|icons)$',
    r'^images/site(/hero)?$',
    r'^brand/(haitech|manufacturers)$',
    r'^_cloudinary-defaults$',
]
used_folders = {a['asset_folder'] for a in post}
bad_path = [f for f in used_folders if not any(re.match(p, f[len(ROOT):]) for p in allowed)]
check('every asset folder follows the hierarchy', not bad_path, str(bad_path[:3]))
bad_name = [f for f in used_folders if any(any(c.isupper() for c in s) or ' ' in s for s in f[len(ROOT):].split('/'))]
check('no uppercase letters or spaces below the root folder', not bad_name, str(bad_name[:3]))

# 4. no empty folders
empty = [f for f in folders if not any(h == f or h.startswith(f + '/') for h in used_folders)]
check('empty folders', not empty, str(empty[:5]))

# 5. a file's name agrees with the folder it is in
disagree = []
for a in post:
    folder = a['asset_folder'][len(ROOT):]
    name = a['public_id'].split('/')[-1]
    parts = folder.split('/')
    if parts[:4] == ['images', 'products', 'admetec', 'loupes']:
        if 'archive' not in parts and len(parts) == 7 and not name.startswith(parts[6]):
            disagree.append(a['public_id'])
        if 'archive' in parts and parts[-1].endswith('-frame') and not name.startswith(parts[-1].replace('-frame', '')):
            disagree.append(a['public_id'])
    m = re.match(r'images/products/strauss/([a-z]+)-series', folder)
    if m and not name.startswith(m.group(1)):
        disagree.append(a['public_id'])
    m = re.match(r'images/products/salli/(sway-fit|triple-fit|ultra-triple-fit)$', folder)
    if m and not name.startswith(m.group(1)):
        disagree.append(a['public_id'])
    m = re.match(r'images/products/admetec/frames/our-frames/([a-z]+)-frame', folder)
    if m and m.group(1) not in name:
        disagree.append(a['public_id'])
check('file name disagrees with its folder (loupes, strauss, salli, frames)', not disagree, str(disagree[:3]))

# 6. the Cloudinary folder equals the local folder for everything uploaded from the repository
by_pid = {a['public_id']: a for a in post}
differ = [p for p, v in upload_map.items() if by_pid[v['public_id']]['asset_folder'] != ROOT + os.path.dirname(p[len('public/'):])]
check('uploaded images: Cloudinary folder equals the local folder', not differ, f'{len(upload_map)} checked, {len(differ)} differ')

# 7. unused and duplicate assets are marked, not lost
tag_unused = {a['public_id'] for a in post if 'unused-by-current-site' in a['tags']}
tag_dup = {a['public_id'] for a in post if 'duplicate-content' in a['tags']}
check('unused and duplicate assets carry their tag', tag_unused == set(plan['tag_unused']) and tag_dup == set(plan['tag_duplicate']), f'unused {len(tag_unused)}, duplicate {len(tag_dup)}')


# 8. every delivery URL still resolves
def head(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'cloudinary-folder-audit'}), timeout=30) as r:
            return r.status
    except Exception:
        return 0


with ThreadPoolExecutor(16) as pool:
    codes = list(pool.map(lambda a: head(a['secure_url']), post))
check('every delivery URL answers HTTP 200', all(c == 200 for c in codes), f'{sum(1 for c in codes if c == 200)}/{len(post)}')

# 9. what the site uses exists and is not marked unused
text = ''
for path in subprocess.run(['git', 'ls-files'], capture_output=True, text=True).stdout.split('\n'):
    if path.endswith(('.ts', '.tsx', '.json', '.mjs')) and not path.startswith(('public/', 'docs/')) and all(s not in path for s in ('package-lock', 'phase3b', '.cloudinary-upload-map', 'lastmod')):
        if os.path.exists(path) and os.path.getsize(path) < 8_000_000:
            text += open(path, encoding='utf-8', errors='ignore').read() + '\n'
used = {urllib.parse.unquote(m.group(1)) for m in re.finditer(r'res\.cloudinary\.com/[^/]+/image/upload/(?:[^/]+/)*?(?:v\d+/)?(haitech/[^"\'\s`)]+?)\.(?:png|jpe?g|webp|svg|gif|avif)', text)}
check('every Cloudinary image the site uses exists', used <= set(by_pid), f'{len(used)} used, {len(used - set(by_pid))} missing')
check('no image in use carries the "unused" tag', not (used & tag_unused), str(len(used & tag_unused)))

json.dump(results, open(f'{AUDIT}/cloudinary-final-audit.json', 'w', encoding='utf-8'), indent=1)
failed = [r['check'] for r in results if not r['pass']]
print('\nOVERALL:', 'ALL %d CHECKS PASS' % len(results) if not failed else 'FAILURES: ' + str(failed))
sys.exit(1 if failed else 0)
