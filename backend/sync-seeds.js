import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsPath = path.join(__dirname, "../src/app/components/mockData.ts");
let content = fs.readFileSync(tsPath, "utf8");

function extractArray(arrayName, typeAnnotation) {
  const startPattern = `export const ${arrayName}${typeAnnotation} = [`;
  const startIdx = content.indexOf(startPattern);
  if (startIdx === -1) {
    throw new Error(`Could not find ${startPattern}`);
  }
  
  let bracketCount = 1;
  let currentIdx = startIdx + startPattern.length;
  while (bracketCount > 0 && currentIdx < content.length) {
    if (content[currentIdx] === "[") bracketCount++;
    else if (content[currentIdx] === "]") bracketCount--;
    currentIdx++;
  }
  
  const arrayBody = content.substring(startIdx + startPattern.length - 1, currentIdx);
  const evaluated = new Function(`return ${arrayBody}`)();
  return evaluated;
}

try {
  const slots = extractArray("CLASS_TIMETABLE", ": TimetableSlot[]");
  const uploads = extractArray("UPLOADED_TIMETABLES", ": UploadedTimetable[]");
  const requests = extractArray("SUBSTITUTION_REQUESTS", ": SubstitutionRequest[]");
  const auditLogs = extractArray("AUDIT_LOGS", ": AuditLog[]");

  fs.writeFileSync(path.join(__dirname, "slots.json"), JSON.stringify(slots, null, 2));
  fs.writeFileSync(path.join(__dirname, "uploads.json"), JSON.stringify(uploads, null, 2));
  fs.writeFileSync(path.join(__dirname, "requests.json"), JSON.stringify(requests, null, 2));
  fs.writeFileSync(path.join(__dirname, "audit_logs.json"), JSON.stringify(auditLogs, null, 2));
  console.log(`Successfully extracted ${slots.length} slots, ${uploads.length} uploads, ${requests.length} requests, and ${auditLogs.length} audit logs.`);
} catch (err) {
  console.error("Extraction failed:", err);
  process.exit(1);
}
