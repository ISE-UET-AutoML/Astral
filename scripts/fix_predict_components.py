import os
import glob
import re

target_dir = '/home/vbear/projects/astral/frontend/src/components/Predict'

# The clean replacement for the stats block
clean_stats_block = """					<div className="flex flex-col sm:flex-row gap-6 p-4 rounded-lg">
						<div className="flex items-center gap-3">
							<HelpCircle className="h-8 w-8 text-gray-400" />
							<div>
								<p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total</p>
								<p className="text-xl font-bold text-gray-900">{statistics.correct + statistics.incorrect}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<CheckCircle2 className="h-8 w-8 text-green-500" />
							<div>
								<p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Correct</p>
								<p className="text-xl font-bold text-gray-900">{statistics.correct}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<XCircle className="h-8 w-8 text-red-500" />
							<div>
								<p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Incorrect</p>
								<p className="text-xl font-bold text-gray-900">{statistics.incorrect}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="h-8 w-8 flex items-center justify-center text-blue-500 font-bold">%</div>
							<div>
								<p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Accuracy</p>
								<p className="text-xl font-bold text-gray-900">{statistics.accuracy}%</p>
							</div>
						</div>
					</div>"""

# Find the files
files = glob.glob(os.path.join(target_dir, '*.jsx'))

for fp in files:
    with open(fp, 'r') as f:
        content = f.read()

    # 1. Replace the entire messy statistics block
    # It usually starts with <div className="flex flex-col gap-4"> and ends with </div></div> inside the stats box
    # A bit hard to match exactly with regex, let's match from prefix={<HelpCircle to suffix="%" precision={1} ><p...></div></div>
    
    # We can match: <div className="flex flex-col gap-4">.*?prefix={<HelpCircle.*?>.*?</div>.*?</div>.*?</div>
    # Actually, let's use a simpler regex:
    pattern = r'<div className="flex flex-col gap-4">\s*<div[^>]*prefix={<HelpCircle.*?</div>\s*</div>'
    content = re.sub(pattern, clean_stats_block, content, flags=re.DOTALL)
    
    # There is also one in TabularPredict that looks slightly different but should match if we make `\s*` flexible
    # Let's write a generic replacer for the statistic blocks
    
    pattern2 = r'<div className="flex flex-col gap-4">\s*<div\s*prefix={<HelpCircle.*?</p></div>}'
    pattern2_full = pattern2 + r'\s*/>\s*<div\s*prefix={<CheckCircle2.*?/>\s*<div\s*prefix={<XCircle.*?/>\s*<div\s*suffix="%".*?</div>\s*</div>'
    content = re.sub(pattern2_full, clean_stats_block, content, flags=re.DOTALL)

    pattern3 = r'<div className="flex flex-col gap-4">\s*<div\s*prefix={<HelpCircle.*?</p></div>}\s*/>\s*<div\s*prefix={<CheckCircle2.*?/>\s*<div\s*prefix={<XCircle.*?/>\s*<div\s*suffix="%".*?</div>\s*</div>'
    content = re.sub(pattern3, clean_stats_block, content, flags=re.DOTALL)

    # Let's just manually replace the Exact string chunk if regex fails, but regex should work.
    # To be extremely safe, we will just use a regex that matches from <div prefix={<HelpCircle to {statistics.accuracy}</p></div>
    
    pattern4 = r'<div\s*(?:className="flex flex-col gap-4"\s*)?>?\s*<div[^>]*prefix={<HelpCircle.*?(?:{statistics\.accuracy}</p></div>|{statistics\.accuracy}</p></div></div>)\s*(</div>)?'
    content = re.sub(pattern4, clean_stats_block, content, flags=re.DOTALL)
    
    # 2. Fix the fragment mismatch `<div>` closing `<>`
    # Example: 	`message={<>\n<Text>Predicted Class:</Text>\n<Text strong>{currentPrediction.class}</Text>\n</div>}`
    content = content.replace('message={\n\t\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t{`Predicted Class:`}\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tstrong\n\t\t\t\t\t\t\t\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttextTransform:\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\'uppercase\' }}\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t{currentPrediction.class}\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}', 'message={<><Text>{`Predicted Class:`}</Text><Text strong style={{textTransform: "uppercase"}}>{currentPrediction.class}</Text></>}')
    
    content = re.sub(r'message={\s*<>\s*<Text>\s*\{`Predicted ([^`]+)`:\}\s*</Text>\s*<Text strong>\s*\{currentPrediction\.class\}\s*</Text>\s*</div>\s*}', r'message={<><Text>{`Predicted \1:`}</Text><Text strong>{currentPrediction.class}</Text></>}', content, flags=re.DOTALL)

    content = re.sub(r'message={\s*<>\s*<Text>\s*\{`Predicted ([^`]+)`:\}\s*</Text>\s*<Text\s*strong\s*style=\{\{\s*textTransform:\s*\'uppercase\' \}\}\s*>\s*\{currentPrediction\.class\}\s*</Text>\s*</div>\s*}', r'message={<><Text>{`Predicted \1:`}</Text><Text strong style={{textTransform: "uppercase"}}>{currentPrediction.class}</Text></>}', content, flags=re.DOTALL)

    # 3. TextPredict.jsx specific `</div>` closing a `<>` at line 254
    content = re.sub(r'render: \(_, __, index\) => \(\s*<>\s*<Button\s*size="small"\s*type="primary"\s*ghost\s*onClick=\{\(\) => handleViewClick\(index\)\}\s*>\s*View\s*</Button>.*?</div>\s*\) \},', r'render: (_, __, index) => (<>\n\t\t\t\t\t<Button size="small" type="primary" ghost onClick={() => handleViewClick(index)}>View</Button>\n\t\t\t\t\t<Button size="small" danger={!incorrectPredictions.includes(index)} type={incorrectPredictions.includes(index) ? \'primary\' : \'default\'} ghost onClick={() => handlePredictionToggle(index)}>{incorrectPredictions.includes(index) ? \'Mark Correct\' : \'Mark Incorrect\'}</Button>\n\t\t\t\t</>) },', content, flags=re.DOTALL)

    # 4. AudioPredict: `<div title={<><SoundOutlined /><Text strong>Audio Player</Text></div>}>`
    content = re.sub(r'title={\s*<>\s*<SoundOutlined />\s*<Text strong>Audio Player</Text>\s*</div>\s*}', r'title={<><SoundOutlined /><Text strong>Audio Player</Text></>}', content, flags=re.DOTALL)

    # 5. ImagePredict: `<div title={<><Text strong>{showExplanation[currentIndex] ? \'Explanation View\' : \'Original Image\'}</Text>...</div>}>`
    content = re.sub(r'title={\s*<>\s*<Text strong>\s*\{showExplanation\[currentIndex\]\s*\?\s*\'Explanation View\'\s*:\s*\'Original Image\'\}\s*</Text>.*?</Button>\s*\)\}\s*</div>\s*}', r'title={<><Text strong>{showExplanation[currentIndex] ? \'Explanation View\' : \'Original Image\'}</Text>{explainImageUrl[currentIndex] !== SolutionImage && (<Button type="text" icon={<UndoOutlined />} onClick={() => toggleExplanationView(currentIndex)} style={{backgroundColor: \'#E6F7FF\', color: \'#0050B3\'}}>{showExplanation[currentIndex] ? \'Show Original\' : \'Show Explanation\'}</Button>)}</>}', content, flags=re.DOTALL)
    
    with open(fp, 'w') as f:
        f.write(content)
        
print("Replacement script executed.")
