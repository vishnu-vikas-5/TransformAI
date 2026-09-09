import sys
import pypdf
import io
from server.advisory_pdf import build_advisory_pdf

# NightFalcon test data matching coreIntelligence.js exactly
nightfalcon_intel = {
  "metadata": {
    "advisoryTitle": "SECURITY ADVISORY: OPERATION NIGHTFALCON TARGETING ORIONGATE SECURE ACCESS SERVER",
    "advisoryId": "TAI-ADV-2026-88421",
    "documentReference": "CSIRT-ADV-2026-NIGHTFALCON",
    "issueDate": "August 25, 2026",
    "severity": "CRITICAL",
    "cvssScore": "9.8",
    "cvssVector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    "confidence": "HIGH",
    "threatCategory": "Pre-Authentication Remote Code Execution / Cyber Espionage",
    "status": "ACTIVE EXPLOITATION / EMERGENCY REMEDIATION",
    "tlpClassification": "TLP:AMBER+STRICT",
    "classification": "CONFIDENTIAL / LIMITED DISSEMINATION"
  },
  "executive_summary": {
    "paragraphs": [
      "A critical zero-day vulnerability designated CVE-2026-88421 has been actively exploited in coordinated cyber espionage attacks tracked as Operation NightFalcon. Advanced persistent threat actor Obsidian Kite (also tracked as OK-17 and KiteGroup) is targeting internet-facing OrionGate Secure Access Server appliances and OrionGate Web Gateways to achieve unauthenticated remote code execution with SYSTEM-level privileges.",
      "The intrusion campaign specifically affects OrionGate Secure Access Server versions v4.2.0 through v4.5.2. Upon gaining initial foothold, adversaries deploy the NightFalcon backdoor payload (nfsvc.exe) and sideload companion libraries (ogupdate.dll), establishing persistence via a rogue system service designated OGUpdateService and initiating outbound encrypted command-and-control communication.",
      "Because compromised OrionGate instances serve as primary ingress gateways between the public internet and internal enterprise networks, this threat poses catastrophic risk of lateral network traversal, credential theft, and unauthorized access to protected internal enclaves. Immediate isolation of affected appliances, host-level remediation, and perimeter blocking of identified command-and-control indicators are mandatory."
    ]
  },
  "threat_at_a_glance": {
    "threat_type": "Pre-Authentication Remote Code Execution / APT Backdoor Deployment",
    "severity": "CRITICAL (CVSS v3.1: 9.8)",
    "confidence": "HIGH (Multiple Confirmed Incidents)",
    "cve": "CVE-2026-88421",
    "threat_actor": "Obsidian Kite (OK-17 / KiteGroup)",
    "malware": "NightFalcon (Backdoor / Remote Access Trojan)",
    "affected_technology": "OrionGate Secure Access Server & OrionGate Web Gateway"
  },
  "affected_systems": [
    {
      "product": "OrionGate Secure Access Server",
      "versions": "v4.2.0, v4.3.1, v4.4.0, v4.5.0, v4.5.2",
      "os": "Linux / Windows Edge Appliance",
      "scope": "Internet-Facing SSL VPN & Identity Gateways",
      "status": "Vulnerable (Active Exploitation)"
    },
    {
      "product": "OrionGate Web Gateway",
      "versions": "All builds prior to v4.5.3",
      "os": "Gateway Ingress Tier",
      "scope": "Edge Reverse Proxy & Portal Auth (/api/v1/auth/gateway)",
      "status": "Pre-Auth RCE Target"
    },
    {
      "product": "Internal Enterprise Network Segments",
      "versions": "Downstream Connected Subnets",
      "os": "Enterprise Core LAN",
      "scope": "Lateral Traversal Target",
      "status": "High Exposure Risk"
    }
  ],
  "key_actions": [
    {
      "step": "1",
      "title": "Immediate Perimeter Isolation",
      "detail": "Disconnect or isolate all public-facing OrionGate Secure Access Server instances from internal production subnets until emergency patches or hotfixes are verified."
    },
    {
      "step": "2",
      "title": "Block Threat Actor C2 Infrastructure",
      "detail": "Enforce perimeter firewall blocks for IP addresses 185.71.44.19, 91.203.18.77, 45.133.201.42 and domains nightfalcon-control[.]example, og-update[.]example."
    },
    {
      "step": "3",
      "title": "Terminate & Remove Rogue Service",
      "detail": "Audit endpoints for rogue service OGUpdateService; immediately terminate processes executing nfsvc.exe and delete ogupdate.dll artifacts."
    },
    {
      "step": "4",
      "title": "Deploy Emergency Hotfix v4.5.3",
      "detail": "Upgrade all OrionGate Secure Access Server deployments to version v4.5.3 or higher, resolving the unsafe deserialization flaw in CVE-2026-88421."
    }
  ],
  "threat": {
    "threat_type": "Pre-Authentication Remote Code Execution (RCE) / Unsafe Deserialization",
    "attack_vector": "Inbound HTTP/HTTPS POST requests to unauthenticated gateway auth endpoints",
    "affected_component": "OrionGate Web Gateway Authentication Handler (/api/v1/auth/gateway)",
    "severity": "CRITICAL (CVSS v3.1: 9.8)",
    "exploitation_status": "Active in-the-wild exploitation confirmed across enterprise perimeter gateways",
    "attack_complexity": "Low",
    "privileges_required": "None (Unauthenticated Remote Access)",
    "user_interaction": "None required",
    "technical_description": "Adversaries submit crafted serialized payloads to OrionGate Web Gateway API endpoints, triggering unsafe object deserialization and achieving arbitrary command execution under root/SYSTEM context without credentials."
  },
  "technical_analysis": {
    "summary": "Technical investigation reveals that the root cause of CVE-2026-88421 resides in the processing of incoming authentication requests by the OrionGate Web Gateway component (/api/v1/auth/gateway). When parsing crafted multipart requests, the application deserializes untrusted input without prior cryptographic validation or schema verification. This allows unauthenticated external attackers to bypass authentication controls and execute arbitrary binary code within the system process context. In observed intrusions, adversaries leveraged this initial execution primitive to download and execute the NightFalcon backdoor (nfsvc.exe), sideload a companion dynamic library (ogupdate.dll), and register a persistent Windows service under the deceptive title 'OGUpdateService' (OrionGate Background Update Helper)."
  },
  "attack_chain": [
    {"stage": "Initial Access", "detail": "Adversary conducts automated HTTPS discovery probes against internet-exposed OrionGate Web Gateway instances over TCP Port 443."},
    {"stage": "Exploitation", "detail": "Exploitation of CVE-2026-88421 via crafted serialized HTTP POST requests targeting the /api/v1/auth/gateway endpoint."},
    {"stage": "Remote Code Execution", "detail": "Unsafe deserialization triggers arbitrary shellcode execution with NT AUTHORITY\\SYSTEM / root privileges."},
    {"stage": "NightFalcon Deployment", "detail": "Adversaries drop and execute the NightFalcon primary backdoor payload (nfsvc.exe) and sideload ogupdate.dll."},
    {"stage": "Persistence", "detail": "Registration of rogue system service 'OGUpdateService' to maintain surviving access across reboots."},
    {"stage": "System Discovery", "detail": "Automated reconnaissance commands executed to map internal subnets, Active Directory domain structures, and local credentials."},
    {"stage": "Command & Control", "detail": "NightFalcon establishes encrypted outbound beaconing over HTTPS to 185.71.44.19, 91.203.18.77, and nightfalcon-control[.]example."},
    {"stage": "Potential Data Collection", "detail": "Staging of gateway credential caches, VPN session tokens, and packet capture files prior to exfiltration."}
  ],
  "vulnerability": {
    "cve": "CVE-2026-88421",
    "vulnerability_type": "Pre-Authentication Unsafe Deserialization / Remote Code Execution",
    "affected_component": "OrionGate Web Gateway (/api/v1/auth/gateway)",
    "affected_versions": "v4.2.0 through v4.5.2 (Resolved in v4.5.3)",
    "attack_complexity": "Low",
    "privileges_required": "None (Pre-Authentication)",
    "user_interaction": "None",
    "scope": "Unchanged",
    "confidentiality_impact": "High",
    "integrity_impact": "High",
    "availability_impact": "High"
  },
  "threat_actor": {
    "actor": "Obsidian Kite",
    "aliases": "OK-17, KiteGroup",
    "motivation": "Cyber Espionage & Persistent Strategic Access",
    "target_profile": "Enterprise Remote Access Gateways, Defense Contractors, Public Sector Agencies, Critical Infrastructure",
    "campaign": "Operation NightFalcon",
    "attribution_confidence": "High Confidence (Corroborated across telemetry, staging patterns, and tool reuse)"
  },
  "timeline": [
    {"date": "2026-08-14", "event": "Initial reconnaissance scanning and automated HTTPS probes observed against edge OrionGate instances.", "significance": "Pre-attack targeting phase identified."},
    {"date": "2026-08-18", "event": "First active exploitation of CVE-2026-88421 detected originating from external IP 45.133.201.42.", "significance": "Zero-day exploitation initiated against target gateways."},
    {"date": "2026-08-19", "event": "Adversaries deploy NightFalcon binary (nfsvc.exe) and install rogue service OGUpdateService.", "significance": "Persistent foothold established within DMZ gateway tier."},
    {"date": "2026-08-20", "event": "NightFalcon initiates outbound C2 beaconing to nightfalcon-control[.]example and 185.71.44.19.", "significance": "Interactive command-and-control established."},
    {"date": "2026-08-22", "event": "Security operations teams detect unauthorized service creation; initiate emergency incident response.", "significance": "Containment procedures and network isolation initiated."},
    {"date": "2026-08-25", "event": "Vendor releases emergency security advisory and patched firmware release v4.5.3.", "significance": "Definitive vendor remediation hotfix available."}
  ],
  "iocs": {
    "network": [
      {"indicator": "185.71.44.19", "protocol": "TCP 443 / 8443", "context": "NightFalcon Primary Command & Control (C2) Node"},
      {"indicator": "91.203.18.77", "protocol": "TCP 443 / 8443", "context": "NightFalcon Secondary Fallback C2 Node"},
      {"indicator": "45.133.201.42", "protocol": "TCP 80 / 443", "context": "Initial Exploitation & Payload Staging Server"}
    ],
    "domains": [
      {"indicator": "nightfalcon-control[.]example", "type": "Domain", "context": "NightFalcon Command & Control Infrastructure"},
      {"indicator": "og-update[.]example", "type": "Domain", "context": "Adversary Payload Distribution & Staged Updates"}
    ],
    "urls": [
      {"indicator": "https://og-update[.]example/bin/patch_v4.enc", "type": "URL", "context": "Encrypted NightFalcon Payload Download"},
      {"indicator": "http://185.71.44.19/gateway/auth/token", "type": "URL", "context": "C2 Ingress Token Verification Endpoint"},
      {"indicator": "https://nightfalcon-control[.]example/api/v2/session", "type": "URL", "context": "Interactive C2 Session Beacon Channel"}
    ],
    "file_hashes": [
      {"hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "type": "SHA-256", "name": "nfsvc.exe (NightFalcon Core Binary)"},
      {"hash": "8f4b23a1c93710d2e85a6b7201ef34a5921865dc1947e30bca2d89f4158a7321", "type": "SHA-256", "name": "ogupdate.dll (Sideloaded Module)"},
      {"hash": "3c9d01fae81b6725439c2e11894d03e9154a7c6f0923b8192a5431ec41d8e09f", "type": "SHA-256", "name": "CVE-2026-88421 Exploit Stub"}
    ],
    "file_names": [
      {"name": "nfsvc.exe", "path": "%SystemRoot%\\System32\\nfsvc.exe", "context": "NightFalcon core backdoor executable"},
      {"name": "ogupdate.dll", "path": "%SystemRoot%\\System32\\ogupdate.dll", "context": "Sideloaded malicious helper library"}
    ],
    "persistence": [
      {"indicator": "OGUpdateService", "type": "Windows Service", "context": "Service Name: OrionGate Background Update Helper"},
      {"indicator": "HKLM\\SYSTEM\\CurrentControlSet\\Services\\OGUpdateService", "type": "Registry Key", "context": "Service ImagePath pointing to %System32%\\nfsvc.exe"}
    ]
  },
  "detection": {
    "network": "Inspect egress firewall and proxy telemetry for persistent outbound HTTPS sessions to 185.71.44.19, 91.203.18.77, and 45.133.201.42.",
    "endpoint": "Deploy EDR detection rules for executable creation of nfsvc.exe and ogupdate.dll, specifically monitoring files placed in %SystemRoot%\\System32\\ by web server worker processes.",
    "dns": "Alert on internal DNS queries attempting to resolve nightfalcon-control[.]example or og-update[.]example.",
    "authentication": "Audit authentication logs for anomalous administrative sessions on OrionGate Web Gateways occurring without corresponding MFA records.",
    "web_logs": "Search OrionGate HTTP server logs for POST requests to /api/v1/auth/gateway returning HTTP 500 status codes with request body sizes exceeding 8KB.",
    "cloud_audit": "Audit cloud edge environment logs for unauthorized modifications to gateway security groups or new external IP bindings."
  },
  "recommendations": {
    "p0_immediate": [
      "Isolate all internet-facing OrionGate Secure Access Server appliances from the internal network immediately to prevent lateral traversal.",
      "Terminate any running process named nfsvc.exe and delete malicious files nfsvc.exe and ogupdate.dll from system directories.",
      "Enforce perimeter firewall blocks for IP addresses 185.71.44.19, 91.203.18.77, and 45.133.201.42, and sinkhole domains nightfalcon-control[.]example and og-update[.]example.",
      "Stop and delete the rogue Windows service OGUpdateService ('sc stop OGUpdateService' and 'sc delete OGUpdateService').",
      "Invalidate all active SSL VPN sessions, gateway access tokens, and administrative credentials associated with OrionGate instances."
    ],
    "p1_within_24_72h": [
      "Deploy vendor security update v4.5.3 or higher across all OrionGate Secure Access Server installations.",
      "Perform forensic disk and memory triage on all hosts hosting OrionGate software to identify potential secondary persistence mechanisms.",
      "Conduct comprehensive audit of Active Directory domain controller event logs for unauthorized privilege escalation following initial gateway breach."
    ],
    "long_term_hardening": [
      "Re-architect edge access topology to enforce network microsegmentation between gateway appliances and sensitive corporate enclaves.",
      "Enforce hardware-backed FIDO2 Multi-Factor Authentication (MFA) across all remote access and administrative portals.",
      "Establish continuous external attack surface monitoring to identify exposed gateway interfaces prior to adversary discovery."
    ]
  },
  "mitigation": {
    "immediate_mitigation": [
      "Perimeter network isolation of affected OrionGate appliances from production subnets.",
      "Firewall ingress/egress filtering for identified C2 IPs and domains.",
      "Removal of rogue service OGUpdateService and binary nfsvc.exe.",
      "Session invalidation and credential revocation across all gateway accounts."
    ],
    "long_term_remediation": [
      "Upgrade to vendor patched release OrionGate SAS v4.5.3.",
      "Implementation of network segmentation preventing gateway-to-internal pivot.",
      "Automated EDR runtime integrity checking on edge appliances."
    ]
  },
  "evidence": [
    {
      "claim": "Critical Pre-Auth RCE vulnerability CVE-2026-88421 in OrionGate Secure Access Server",
      "source": "Operation NightFalcon Threat Intelligence Briefing",
      "section": "Section 1, Page 2",
      "evidence": "Analysis confirms zero-day vulnerability designated CVE-2026-88421 in OrionGate Secure Access Server versions v4.2.0 through v4.5.2 permits unauthenticated code execution."
    },
    {
      "claim": "Intrusion campaign attributed to threat actor Obsidian Kite (OK-17, KiteGroup)",
      "source": "Operation NightFalcon Threat Intelligence Briefing",
      "section": "Section 2, Page 4",
      "evidence": "Tactics, infrastructure overlap, and code signing artifacts attribute campaign to Obsidian Kite (OK-17 / KiteGroup)."
    },
    {
      "claim": "Adversaries deployed NightFalcon backdoor via rogue service OGUpdateService",
      "source": "Host Forensic Analysis Report INC-2026-NF",
      "section": "Section 3, Page 7",
      "evidence": "Forensic analysis identified binary nfsvc.exe and ogupdate.dll registered under service OGUpdateService on compromised gateway nodes."
    },
    {
      "claim": "Active C2 beaconing to 185.71.44.19 and domain nightfalcon-control[.]example",
      "source": "Network Telemetry & Incident Sensor Log",
      "section": "Section 4, Page 9",
      "evidence": "Outbound HTTPS beacons recorded to IP 185.71.44.19 and domain nightfalcon-control[.]example following initial exploitation."
    }
  ],
  "validation": {
    "source_grounded": True,
    "fact_consistency": True,
    "ioc_preservation": True,
    "unsupported_claims": 0,
    "evidence_traceability": True,
    "human_review_required": True
  },
  "approval": {
    "requirement_notice": "Human review and approval required before operational dissemination.",
    "reviewed_by_line": "________________________________________________",
    "role_line": "________________________________________________",
    "date_line": "________________________________________________",
    "status_options": "[  ] APPROVED FOR DISSEMINATION    [  ] REVISE    [  ] REJECTED"
  },
  "disclaimer": {
    "classification": "CONFIDENTIAL / LIMITED DISSEMINATION",
    "tlp": "TLP:AMBER+STRICT",
    "notice": "This advisory is generated from the supplied source material using source-grounded content transformation and automated validation. Human review and approval are required before operational dissemination."
  }
}

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_bytes = build_advisory_pdf(nightfalcon_intel)
print(f"Generated PDF bytes: {len(pdf_bytes)}")

# Save to disk for inspection
with open("test_advisory_output.pdf", "wb") as f:
    f.write(pdf_bytes)
print("Saved to test_advisory_output.pdf")

# Read with pypdf
reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
num_pages = len(reader.pages)
print(f"Total Pages: {num_pages}")

all_text = ""
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    all_text += "\n" + text
    print(f"\n--- Page {i+1} (length {len(text)}) ---")
    safe_preview = text[:300].replace('\n', ' ')
    print(safe_preview)

# QA CHECK 1: Exactly 4 pages
assert num_pages == 4, f"Expected exactly 4 pages, got {num_pages}"
print("\n[QA PASS] Page count is exactly 4.")

# QA CHECK 2: All Critical Source Intelligence Present
critical_terms = [
    "Operation NightFalcon",
    "OrionGate Secure Access Server",
    "CVE-2026-88421",
    "CRITICAL",
    "HIGH",
    "Obsidian Kite",
    "OK-17",
    "KiteGroup",
    "NightFalcon",
    "185.71.44.19",
    "91.203.18.77",
    "45.133.201.42",
    "nightfalcon-control[.]example",
    "og-update[.]example",
    "nfsvc.exe",
    "ogupdate.dll",
    "OGUpdateService",
    "SHA-256"
]

for term in critical_terms:
    assert term in all_text, f"Missing critical intelligence term: {term}"
print("[QA PASS] All critical intelligence terms and IOCs preserved exactly.")

# QA CHECK 3: No forbidden generic placeholders
forbidden_placeholders = [
    "Uploaded Document (Backend Ingested)",
    "Active Directive",
    "Operational impact active"
]

for bad in forbidden_placeholders:
    assert bad not in all_text, f"Found forbidden placeholder: {bad}"
print("[QA PASS] No forbidden generic placeholders found.")

# QA CHECK 4: No raw markdown artifacts
assert "###" not in all_text, "Found raw markdown ### in rendered PDF"
assert "**" not in all_text, "Found raw markdown ** in rendered PDF"
print("[QA PASS] No raw markdown syntax in rendered PDF.")

# QA CHECK 5: Check Running Headers & Footers
assert "SYNTAXX AGENTIC INTELLIGENCE SUITE" in all_text or "TRANSFORMAI GROUNDED INTELLIGENCE ENGINE" in all_text, "Missing running footer branding"
assert "PAGE 1 OF 4" in all_text or "PAGE 4 OF 4" in all_text, "Missing page numbering"
print("[QA PASS] Running headers and footers verified.")

print("\nALL AUTOMATED QA CHECKS PASSED SUCCESSFULLY!")

