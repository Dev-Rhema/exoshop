#!/usr/bin/env python3
import re

# Read the file
with open('src/pages/ProductDetail.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the Master Google case and wrap content in showFullDescription conditional
old_pattern = r'(case "Master_Google_&_YouTube_Ads_in_Naira":\s+return \(\s+<div>\s+\{/\* Customize GOOGLE & YOUTUBE ADS description here \*/\}\s+)<p className="font-body text-base flex flex-col gap-2 text-black leading-relaxed mb-4">\s+<p className="font-bold text-\[18px\]">\s+Master Google & YouTube Ads in Naira\s+</p>\s+<p className="font-bold text-\[18px\]">\s+No Dollar Card\? No Live Class Stress\? No Problem! <br />\s+\(Instant Access to Replay \+ All Resources\)\s+</p>\s+<p className="font-bold">What You\'ll Learn:</p>'

new_pattern = r'\1<div className="font-body text-base text-black leading-relaxed mb-4">\n              <p className="font-bold text-[18px] mb-4">\n                Master Google & YouTube Ads in Naira\n              </p>\n              <p className="font-bold text-[18px] mb-4">\n                No Dollar Card? No Live Class Stress? No Problem! <br />\n                (Instant Access to Replay + All Resources)\n              </p>\n              {showFullDescription && (\n                <>\n                  <p className="font-bold mb-4">What You\'ll Learn:</p>'

# Also need to close the conditional at the end
# Find the end of the case (the closing </p> and </div>)
end_pattern = r'(<p className="font-bold">GET ACCESS NOW →</p>\s+)</p>\s+(</div>\s+</div>\s+);'
end_replacement = r'\1</>\n              )}\n            </div>\n          </div>\n        );'

# Apply replacements
content_fixed = re.sub(end_pattern, end_replacement, content)
content_fixed = re.sub(old_pattern, new_pattern, content_fixed, flags=re.DOTALL)

# Write the file back
with open('src/pages/ProductDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(content_fixed)

print("Fixed Master Google case with showFullDescription conditional")
