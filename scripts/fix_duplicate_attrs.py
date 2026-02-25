import glob
import re

for f in glob.glob('/home/vbear/projects/astral/frontend/src/components/Predict/*.jsx'):
    with open(f, 'r') as fp:
        content = fp.read()
    
    # regex to find:
    # 									size="small"
    # 									className="flex-1"
    # and remove them because className is already on the <input tag
    pattern = r'\s*size="small"\s*className="[^"]*"'
    
    # We can just remove size="small" and className="<something>" after onChange block.
    # A safer way: find <input className="..."... size="small" className="..."
    # Actually, we can just remove `size="small"\n\t\t\t\t\t\t\t\t\tclassName="flex-1..."`
    # Let's just use re.sub
    new_content = re.sub(r'(\s+)size="small"(\s+)className="([^"]+)"', r'', content)
    
    if new_content != content:
        with open(f, 'w') as fp:
            fp.write(new_content)
        print("Fixed duplicate attributes in", f)
