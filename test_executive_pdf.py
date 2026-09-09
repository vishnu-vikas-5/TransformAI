import sys
import pypdf
import io
from server.executive_pdf import build_executive_summary_pdf
from test_reportlab_gen import nightfalcon_intel

print("Testing Executive Summary PDF Generation Engine...")

# 1. Generate PDF
pdf_bytes = build_executive_summary_pdf(nightfalcon_intel)
assert len(pdf_bytes) > 5000, f"Generated PDF is too small: {len(pdf_bytes)} bytes"

with open("test_executive_output.pdf", "wb") as f:
    f.write(pdf_bytes)

print(f"[QA PASS] Successfully built Executive Summary PDF: {len(pdf_bytes)} bytes written.")

# 2. Inspect with PyPDF
reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
num_pages = len(reader.pages)
print(f"[QA INFO] Total pages generated: {num_pages}")
assert num_pages == 3, f"Expected exactly 3 pages for standard executive briefing, got {num_pages}"
print("[QA PASS] Exact 3-page layout verified (no page overflow).")

# Extract and inspect text page-by-page
page1_text = reader.pages[0].extract_text()
page2_text = reader.pages[1].extract_text()
page3_text = reader.pages[2].extract_text()
all_text = f"{page1_text}\n{page2_text}\n{page3_text}"

# Page 1 checks
assert "1. EXECUTIVE OVERVIEW" in page1_text.upper()
assert "2. THREAT AT A GLANCE" in page1_text.upper()
assert "3. WHAT HAPPENED & KEY FINDINGS" in page1_text.upper()
assert "4. BUSINESS & OPERATIONAL IMPACT" in page1_text.upper()
print("[QA PASS] Page 1 content verified (Overview, Threat at a Glance, Findings, Impact).")

# Page 2 checks
assert "5. AFFECTED SYSTEMS & INFRASTRUCTURE SCOPE" in page2_text.upper()
assert "6. THREAT ACTOR & CAMPAIGN ATTRIBUTION" in page2_text.upper()
assert "7. KEY INDICATORS OF COMPROMISE (SUMMARY)" in page2_text.upper()
assert "8. KEY INCIDENT TIMELINE" in page2_text.upper()
print("[QA PASS] Page 2 content verified (Affected Systems, Threat Actor, Indicators, Timeline).")

# Page 3 checks
assert "9. PRIORITIZED RECOMMENDED ACTIONS" in page3_text.upper()
assert "10. DECISION & ACTION REQUIRED" in page3_text.upper()
assert "11. SOURCE GROUNDING & EVIDENCE TRACEABILITY" in page3_text.upper()
assert "VALIDATION AUDIT" in page3_text.upper()
assert "HUMAN REVIEW & OPERATIONAL APPROVAL MANDATE" in page3_text.upper()
print("[QA PASS] Page 3 content verified (Recommendations, Decisions, Evidence, Validation, Governance).")

# Ground truth facts verification
critical_facts = [
    "Operation NightFalcon",
    "OrionGate Secure Access Server",
    "CVE-2026-88421",
    "CRITICAL",
    "HIGH CONFIDENCE",
    "Obsidian Kite",
    "185.71.44.19",
    "v4.2.0",
    "v4.5.2",
    "v4.5.3",
    "OGUpdateService",
    "nfsvc.exe"
]

for fact in critical_facts:
    assert fact in all_text, f"Missing critical ground-truth fact: {fact}"
print("[QA PASS] All critical ground-truth facts verified in PDF text.")

# No raw markdown checks
assert "###" not in all_text, "Found raw markdown ### in PDF"
assert "**" not in all_text, "Found raw markdown ** in PDF"
print("[QA PASS] Zero raw markdown syntax verified.")

# Running headers & footers
assert "EXECUTIVE SUMMARY BRIEFING" in page2_text
assert "PAGE 1 OF 3" in page1_text or "PAGE 1 OF 3" in all_text
assert "PAGE 3 OF 3" in page3_text
print("[QA PASS] Running headers and footers (PAGE X OF 3) verified.")

print("\nALL AUTOMATED EXECUTIVE SUMMARY PDF QA CHECKS PASSED!")
