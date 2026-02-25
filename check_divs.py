import re

with open('src/pages/project/deploy/deployedModelView.jsx', 'r') as f:
    text = f.read()

div_starts = [(m.start(), text[m.start():m.start()+20]) for m in re.finditer(r'<div\b[^>]*>', text)]
div_ends = [(m.start(), text[m.start():m.start()+6]) for m in re.finditer(r'</div>', text)]

print(f"Starts: {len(div_starts)}, Ends: {len(div_ends)}")
