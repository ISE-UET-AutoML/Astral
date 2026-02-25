import glob

for f in glob.glob('/home/vbear/projects/astral/frontend/src/components/Predict/*.jsx'):
    with open(f, 'r') as fp:
        content = fp.read()
    if "\\'" in content:
        content = content.replace("\\'", "'")
        with open(f, 'w') as fp:
            fp.write(content)
        print("Fixed", f)
