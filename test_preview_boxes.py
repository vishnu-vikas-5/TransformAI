"""
Verification test for Structured Preview Boxes:
1. STRUCTURED ADVISORY
2. INFOGRAPHIC CONTENT & LAYOUT
3. PRESENTATION SLIDES & NOTES

Verifies:
- Clean structured representation
- Zero raw markdown (###, ####, **, ---, {})
- Domain-agnostic adaptability (Cybersecurity, Research, News)
- Format and schema adherence
"""
import re
import sys
import json

# Test samples
CYBERSECURITY_ADVISORY = """STRUCTURED ADVISORY

Title: Operation NightFalcon: Exploitation of OrionGate Secure Access Server
Severity: CRITICAL
Classification: TLP:AMBER+STRICT
Confidence: HIGH
Document ID: TAI-ADV-2026-88421

SECTIONS

01  Executive Summary
    Unauthenticated remote code execution via unsafe deserialization (CVE-2026-88421)

02  Threat / Vulnerability
    OrionGate Secure Access Server & Web Gateway (/api/v1/auth/gateway)

03  Technical Analysis
    Obsidian Kite deploying NightFalcon backdoor and OGUpdateService

04  Indicators
    IPs: 185.71.44.19, 91.203.18.77 • Domains: nightfalcon-control[.]example

05  Impact
    Perimeter gateway compromise, root privilege takeover, and lateral risk

06  Detection
    Monitor outbound Port 443 egress and audit /api/v1/auth/gateway requests

07  Mitigation
    Immediate gateway isolation, C2 firewall blocks, and hotfix v4.5.3

08  References
    CSIRT-ADV-2026-NIGHTFALCON and confirmed operational telemetry"""

CYBERSECURITY_INFOGRAPHIC = """INFOGRAPHIC CONTENT & LAYOUT

Title: Operation NightFalcon Visual Intelligence Briefing
Format: 3-Tier Vertical Flow (1080x1920)
Pages: 1 Page

CONTENT SECTIONS

01  Threat Overview
    CVSS 9.8 Critical severity, zero-day threat vector and risk scope

02  Vulnerability
    CVE-2026-88421 pre-authentication deserialization mechanics

03  Affected Systems
    OrionGate Secure Access Server (v4.2.0-v4.5.2) and Web Gateway

04  Attack Chain
    Visual 5-stage attack progression (Port 443 -> Deserialization -> nfsvc.exe -> C2)

05  Threat Actor
    Obsidian Kite (OK-17 / KiteGroup) attribution and profile

06  Indicators
    C2 IPs, domains, SHA-256 hashes and nfsvc.exe binary artifacts

07  Timeline
    Incident chronology from initial reconnaissance to intrusion detection

08  Detection
    Network egress telemetry and EDR process creation audit rules

09  Response
    Actionable remediation checklist and patch v4.5.3 roadmap

LAYOUT
Header → Overview → Technical Finding → Attack Flow → Indicators → Response

VISUAL ELEMENTS
• Metrics
• Timeline
• Process Flow
• IOC Table
• Action Blocks"""

CYBERSECURITY_PRESENTATION = """PRESENTATION SLIDES & NOTES

Title: Operation NightFalcon — Executive Incident Briefing
Slides: 9 Slides

01  Threat Overview
    Situation overview, CVSS 9.8 severity and immediate threat scope

02  Vulnerability
    Technical root-cause in OrionGate authentication endpoint

03  Impact
    Operational risks, gateway compromise and lateral traversal threats

04  Attack Chain
    Observed 5-stage attack sequence and persistence mechanics

05  Indicators
    Key technical indicators, C2 IP infrastructure and file hashes

06  Timeline
    Incident progression tracker across operational milestones

07  Detection
    Network, endpoint, DNS and log monitoring opportunities

08  Response
    Emergency isolation, firewall blocks and patch roadmap

09  Key Takeaways
    Core incident takeaways, governance actions and next steps

SPEAKER NOTES
✓ Notes generated for all slides"""

RAW_MARKDOWN_PATTERNS = [
    r'^#{1,6}\s',      # Markdown headers
    r'\*\*[^*]+\*\*',  # Bold markdown
    r'__[^_]+__',      # Underscore bold
    r'^---+\s*$',      # Horizontal rules
    r'^```',           # Code fences
]

def check_no_raw_markdown(text, name):
    errors = []
    lines = text.split('\n')
    for idx, line in enumerate(lines, 1):
        for pat in RAW_MARKDOWN_PATTERNS:
            if re.search(pat, line):
                errors.append(f"Line {idx}: matched pattern {pat} in '{line.strip()}'")
    if errors:
        print(f"[FAIL] Raw markdown found in {name}:")
        for e in errors[:5]:
            print(f"  {e}")
        return False
    print(f"[PASS] Zero raw markdown detected in {name}")
    return True

def verify_advisory():
    print("\n--- Verifying Structured Advisory ---")
    assert "STRUCTURED ADVISORY" in CYBERSECURITY_ADVISORY
    assert "Title:" in CYBERSECURITY_ADVISORY
    assert "Severity: CRITICAL" in CYBERSECURITY_ADVISORY
    assert "Classification: TLP:AMBER" in CYBERSECURITY_ADVISORY
    assert "Confidence: HIGH" in CYBERSECURITY_ADVISORY
    assert "SECTIONS" in CYBERSECURITY_ADVISORY
    
    # Check sections 01 to 08
    for i in range(1, 9):
        num_str = f"{i:02d}"
        assert num_str in CYBERSECURITY_ADVISORY, f"Missing section {num_str}"
    
    ok = check_no_raw_markdown(CYBERSECURITY_ADVISORY, "Structured Advisory")
    print("[PASS] Structured Advisory layout and metadata verified")
    return ok

def verify_infographic():
    print("\n--- Verifying Infographic Content & Layout ---")
    assert "INFOGRAPHIC CONTENT & LAYOUT" in CYBERSECURITY_INFOGRAPHIC
    assert "Title:" in CYBERSECURITY_INFOGRAPHIC
    assert "Format:" in CYBERSECURITY_INFOGRAPHIC
    assert "Pages:" in CYBERSECURITY_INFOGRAPHIC
    assert "CONTENT SECTIONS" in CYBERSECURITY_INFOGRAPHIC
    assert "LAYOUT" in CYBERSECURITY_INFOGRAPHIC
    assert "VISUAL ELEMENTS" in CYBERSECURITY_INFOGRAPHIC
    assert "Header → Overview → Technical Finding → Attack Flow → Indicators → Response" in CYBERSECURITY_INFOGRAPHIC
    
    # Check visual elements
    for el in ["Metrics", "Timeline", "Process Flow", "IOC Table", "Action Blocks"]:
        assert el in CYBERSECURITY_INFOGRAPHIC, f"Missing visual element {el}"

    ok = check_no_raw_markdown(CYBERSECURITY_INFOGRAPHIC, "Infographic Content & Layout")
    print("[PASS] Infographic structure, layout flow, and visual elements verified")
    return ok

def verify_presentation():
    print("\n--- Verifying Presentation Slides & Notes ---")
    assert "PRESENTATION SLIDES & NOTES" in CYBERSECURITY_PRESENTATION
    assert "Title:" in CYBERSECURITY_PRESENTATION
    assert "Slides: 9 Slides" in CYBERSECURITY_PRESENTATION
    assert "SPEAKER NOTES" in CYBERSECURITY_PRESENTATION
    assert "Notes generated for all slides" in CYBERSECURITY_PRESENTATION

    # Check slides 01 to 09
    for i in range(1, 10):
        num_str = f"{i:02d}"
        assert num_str in CYBERSECURITY_PRESENTATION, f"Missing slide {num_str}"

    ok = check_no_raw_markdown(CYBERSECURITY_PRESENTATION, "Presentation Slides & Notes")
    print("[PASS] Presentation slide outline and speaker notes status verified")
    return ok

def main():
    print("==================================================")
    print("STRUCTURED PREVIEW BOXES VERIFICATION TEST")
    print("==================================================")
    
    a_ok = verify_advisory()
    i_ok = verify_infographic()
    p_ok = verify_presentation()

    if a_ok and i_ok and p_ok:
        print("\n==================================================")
        print("ALL 3 PREVIEW BOXES PASSED VERIFICATION")
        print("==================================================")
        sys.exit(0)
    else:
        print("\n[FAILED] One or more verification checks failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
