import sys
import pypdf
import io
from server.video_pdf import build_video_package_pdf
from test_reportlab_gen import nightfalcon_intel

print("Testing Video Production Package PDF Engine...")

pdf_bytes = build_video_package_pdf(nightfalcon_intel)
assert len(pdf_bytes) > 5000, f"Generated PDF too small: {len(pdf_bytes)} bytes"

with open("test_video_output.pdf", "wb") as f:
    f.write(pdf_bytes)

print(f"[QA PASS] Successfully built Video Production Package PDF: {len(pdf_bytes)} bytes written.")

reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
num_pages = len(reader.pages)
print(f"[QA INFO] Total pages generated: {num_pages}")
assert num_pages == 6, f"Expected exactly 6 pages for standard video production package, got {num_pages}"
print("[QA PASS] Exact 6-page layout verified.")

# Extract page text
page1 = reader.pages[0].extract_text()
page2 = reader.pages[1].extract_text()
page3 = reader.pages[2].extract_text()
page4 = reader.pages[3].extract_text()
page5 = reader.pages[4].extract_text()
page6 = reader.pages[5].extract_text()
all_text = "\n".join([page1, page2, page3, page4, page5, page6])

# Page checks
assert "1. VIDEO OVERVIEW" in page1.upper()
assert "2. BROADCAST PRODUCTION SPECIFICATIONS" in page1.upper()
assert "3. MASTER 10-SCENE STORYBOARD OUTLINE" in page1.upper()
print("[QA PASS] Page 1 verified (Overview, Specs, 10-Scene Outline).")

assert "4. COMPLETE VOICEOVER NARRATION SCRIPT" in page2.upper()
assert "5. ATTACK CHAIN VISUAL ARCHITECTURE" in page2.upper()
print("[QA PASS] Page 2 verified (Narration Script, Attack Chain Flow).")

assert "SCENE 01" in page3.upper()
assert "SCENE 05" in page3.upper()
print("[QA PASS] Page 3 verified (Storyboard Scenes 1 to 5).")

assert "SCENE 06" in page4.upper()
assert "SCENE 10" in page4.upper()
print("[QA PASS] Page 4 verified (Storyboard Scenes 6 to 10).")

assert "8. INDICATORS OF COMPROMISE CATALOG" in page5.upper()
assert "9. DETECTION TELEMETRY" in page5.upper()
assert "10. PRIORITIZED REMEDIATION ACTION DIRECTIVES" in page5.upper()
print("[QA PASS] Page 5 verified (IOCs, Detection, Remediation Directives).")

assert "11. SYNCHRONIZED SUBTITLES" in page6.upper()
assert "12. SOURCE GROUNDING & EVIDENCE TRACEABILITY" in page6.upper()
assert "VALIDATION AUDIT" in page6.upper()
assert "HUMAN REVIEW & VIDEO DISSEMINATION APPROVAL MANDATE" in page6.upper()
print("[QA PASS] Page 6 verified (Subtitles, Traceability, Validation, Governance).")

# Ground truth facts
critical_facts = [
    "Operation NightFalcon",
    "OrionGate Secure Access Server",
    "CVE-2026-88421",
    "CRITICAL",
    "HIGH CONFIDENCE",
    "Obsidian Kite",
    "185.71.44.19",
    "91.203.18.77",
    "45.133.201.42",
    "nightfalcon-control[.]example",
    "og-update[.]example",
    "nfsvc.exe",
    "ogupdate.dll",
    "OGUpdateService",
    "v4.2.0",
    "v4.5.3"
]

for fact in critical_facts:
    assert fact in all_text, f"Missing critical ground-truth fact: {fact}"
print("[QA PASS] All critical ground-truth facts verified in Video PDF.")

# Zero raw markdown
assert "###" not in all_text, "Found raw markdown ### in PDF"
assert "**" not in all_text, "Found raw markdown ** in PDF"
print("[QA PASS] Zero raw markdown syntax verified.")

# Running headers & footers
assert "VIDEO PRODUCTION PACKAGE" in page2
assert "PAGE 1 OF 6" in page1 or "PAGE 1 OF 6" in all_text
assert "PAGE 6 OF 6" in page6
print("[QA PASS] Running headers and footers (PAGE X OF 6) verified.")

print("\nALL AUTOMATED VIDEO PRODUCTION PACKAGE QA CHECKS PASSED 100%!")
