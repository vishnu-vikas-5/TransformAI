import urllib.request
import json
import pypdf
import io

def test_pdf(endpoint, intel, expected_terms, forbidden_terms):
    req = urllib.request.Request(
        f"http://127.0.0.1:8000{endpoint}",
        data=json.dumps(intel).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        pdf_bytes = resp.read()
        
    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() or ""
        
    for term in expected_terms:
        assert term in full_text, f"Expected '{term}' not found in PDF from {endpoint}"
    for term in forbidden_terms:
        assert term not in full_text, f"Forbidden term '{term}' FOUND in PDF from {endpoint}!"
    print(f"[PASS] {endpoint} passed ({len(reader.pages)} pages, verified terms: {expected_terms})")

# Test CVE-2024-38077 Intelligence
cve_intel = {
    "metadata": {
        "advisoryTitle": "INCIDENT ADVISORY: CVE-2024-38077 ZERO-DAY RCE IN WINDOWS REMOTE DESKTOP LICENSING",
        "advisoryId": "CSIRT-2024-38077-ADV",
        "documentReference": "INC-2024-88902-SEC",
        "issueDate": "September 04, 2026",
        "severity": "CRITICAL",
        "cvssScore": "9.8",
        "threatCategory": "Zero-Day Remote Code Execution / Ransomware Precursor",
        "tlpClassification": "TLP:AMBER+STRICT",
        "classification": "CONFIDENTIAL / INTERNAL ONLY"
    },
    "threat_at_a_glance": {
        "threat_type": "Zero-Day Remote Code Execution (RCE)",
        "severity": "CRITICAL (CVSS: 9.8)",
        "confidence": "HIGH",
        "cve": "CVE-2024-38077",
        "threat_actor": "Ransomware Affiliates",
        "malware": "Cobalt Strike / LockBit 4.0",
        "affected_technology": "Windows Remote Desktop Licensing Service"
    },
    "key_actions": [
        {"step": "1", "title": "Perimeter RPC Port 135 Block", "detail": "Block Port 135 at perimeter firewalls."},
        {"step": "2", "title": "Emergency Patch KB5040442", "detail": "Deploy KB5040442 immediately."}
    ],
    "executive_summary": {
        "paragraphs": [
            "Active exploitation of zero-day CVE-2024-38077 in Windows Remote Desktop Licensing service.",
            "Unauthenticated attackers trigger heap buffer overflows over Port 135.",
            "Mandatory perimeter blocking and emergency security update KB5040442 required."
        ]
    },
    "attack_chain": [
        {"stage": "Initial Access", "detail": "Unauthenticated RPC handshake over TCP Port 135."},
        {"stage": "Exploitation", "detail": "Heap buffer overflow in termsrv.dll."},
        {"stage": "Remote Code Execution", "detail": "SYSTEM privileges acquired."},
        {"stage": "Ransomware Staging", "detail": "LockBit 4.0 ransomware staged."}
    ],
    "iocs": {
        "network": [{"indicator": "192.168.1.100", "protocol": "TCP", "context": "Quarantined Host"}],
        "domains": [],
        "file_hashes": [],
        "file_names": [{"name": "termsrv.dll", "path": "System32", "context": "Licensing binary"}],
        "cves": [{"cve": "CVE-2024-38077", "cvss": "9.8", "component": "Remote Desktop"}]
    }
}

print("Testing PDF Generation Endpoints with CVE-2024-38077 Intelligence:")
test_pdf("/api/export/advisory-pdf", cve_intel, ["CVE-2024-38077", "CSIRT-2024-38077-ADV"], ["NightFalcon", "CVE-2026-88421", "Obsidian Kite", "OrionGate"])
test_pdf("/api/export/executive-pdf", cve_intel, ["CVE-2024-38077", "CSIRT-2024-38077-ADV"], ["NightFalcon", "CVE-2026-88421", "Obsidian Kite", "OrionGate"])
test_pdf("/api/export/infographic-pdf", cve_intel, ["CVE-2024-38077", "CSIRT-2024-38077-ADV"], ["NightFalcon", "CVE-2026-88421", "Obsidian Kite", "OrionGate"])

print("\nALL PDF GENERATION TESTS PASSED WITH ZERO CONTAMINATION!")
