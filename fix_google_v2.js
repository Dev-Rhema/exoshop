import fs from "fs";

const filePath = "src/pages/ProductDetail.jsx";
let content = fs.readFileSync(filePath, "utf-8");

// First, add the opening conditional after "Instant Access..."
content = content.replace(
  /(<p className="font-bold text-\[18px\] mb-4">\s*No Dollar Card\? No Live Class Stress\? No Problem! <br \/>\s*\(Instant Access to Replay \+ All Resources\)\s*<\/p>)\s*(<p className="font-bold">What You'll Learn:<\/p>)/,
  "$1\n              {showFullDescription && (\n                <>\n                  $2",
);

// Then, add the closing conditional before GET ACCESS NOW
content = content.replace(
  /(<p className="font-bold">GET ACCESS NOW →<\/p>)\s*(<\/p>\s*<\/div>)/,
  "$1\n                </>\n              )}\n            </div>\n          </div>",
);

// Also need to change from list item indentation
content = content.replace(
  /(<ul className="list-disc list-inside">)/g,
  '<ul className="list-disc list-inside mb-4">',
);

fs.writeFileSync(filePath, content, "utf-8");
console.log("✓ Fixed Google Ads View More/Less toggle");
