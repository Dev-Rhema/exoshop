import fs from "fs";
const path = "src/pages/ProductDetail.jsx";
let content = fs.readFileSync(path, "utf-8");

// Replace the opening section
content = content.replace(
  /<p className="font-body text-base flex flex-col gap-2 text-black leading-relaxed mb-4">\s*<p className="font-bold text-\[18px\]">\s*Master Google & YouTube Ads in Naira\s*<\/p>\s*<p className="font-bold text-\[18px\]">\s*No Dollar Card\? No Live Class Stress\? No Problem! <br \/>\s*\(Instant Access to Replay \+ All Resources\)\s*<\/p>\s*<p className="font-bold">What You'll Learn:<\/p>/,
  '<div className="font-body text-base text-black leading-relaxed mb-4">\n              <p className="font-bold text-[18px] mb-4">\n                Master Google & YouTube Ads in Naira\n              </p>\n              <p className="font-bold text-[18px] mb-4">\n                No Dollar Card? No Live Class Stress? No Problem! <br />\n                (Instant Access to Replay + All Resources)\n              </p>\n              {showFullDescription && (\n                <>\n                  <p className="font-bold mb-4">What You\'ll Learn:</p>',
);

// Replace the closing section
content = content.replace(
  /<p className="font-bold">GET ACCESS NOW →<\/p>\s*<\/p>/,
  '<p className="font-bold">GET ACCESS NOW →</p>\n                </>\n              )}\n            </div>',
);

fs.writeFileSync(path, content, "utf-8");
console.log("✓ Applied View More/Less toggle to Google Ads");
