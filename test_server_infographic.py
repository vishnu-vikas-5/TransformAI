import sys
from server.infographic_pdf import build_infographic_pdf

def test_infographic_pdf():
    print("Testing backend Infographic PDF generation...")
    
    # Test with CVE-2024-38077
    cve_intel = {
        "metadata": {
            "advisoryId": "CSIRT-2024-38077-ADV",
            "advisoryTitle": "CVE-2024-38077 Zero-Day RCE in Windows Remote Desktop",
            "severity": "CRITICAL",
            "cvssScore": "9.8",
            "confidence": "HIGH"
        },
        "threat_at_a_glance": {
            "threat_type": "Zero-Day Remote Code Execution",
            "affected_technology": "Windows Remote Desktop Licensing (termsrv.dll)",
            "malware": "Cobalt Strike & LockBit 4.0 Staging"
        },
        "threat_actor": {
            "actor": "Unauthenticated Cybercrime Threat Affiliates",
            "campaign": "CVE-2024-38077 Enterprise Infiltration"
        },
        "vulnerability": {
            "cve": "CVE-2024-38077"
        }
    }
    
    pdf_bytes = build_infographic_pdf(cve_intel)
    assert len(pdf_bytes) > 5000, "Generated PDF too small"
    assert pdf_bytes.startswith(b"%PDF"), "Output is not a valid PDF"
    print(f"[OK] CVE-2024-38077 PDF generated successfully ({len(pdf_bytes)} bytes)")
    
    # Test with NightFalcon
    nf_intel = {
        "metadata": {
            "advisoryId": "CTI-SX-2026-017",
            "advisoryTitle": "OPERATION NIGHTFALCON",
            "severity": "CRITICAL",
            "cvssScore": "9.8",
            "confidence": "HIGH"
        },
        "threat_at_a_glance": {
            "threat_type": "State-Sponsored Intrusion",
            "affected_technology": "OrionGate Secure Access Servers",
            "malware": "NightFalcon Backdoor"
        },
        "threat_actor": {
            "actor": "Obsidian Kite",
            "campaign": "Operation NightFalcon"
        },
        "vulnerability": {
            "cve": "CVE-2026-88421"
        }
    }
    
    pdf_bytes_nf = build_infographic_pdf(nf_intel)
    assert len(pdf_bytes_nf) > 5000, "Generated PDF too small"
    assert pdf_bytes_nf.startswith(b"%PDF"), "Output is not a valid PDF"
    print(f"[OK] NightFalcon PDF generated successfully ({len(pdf_bytes_nf)} bytes)")

    # Test with Health Policy Advisory
    health_intel = {
        "metadata": {
            "advisoryId": "HEALTH-ADV-2026-004",
            "advisoryTitle": "Novel Pathogen Outbreak Response H5-V2",
            "severity": "CRITICAL",
            "confidence": "HIGH"
        },
        "summary": "Emerging respiratory syndrome H5-V2 isolated across 4 region healthcare centers.",
        "key_findings": [
            "Transmissibility index R0 estimated at 3.2 in indoor environments.",
            "Mandatory triage and N95 respiratory protection required."
        ]
    }
    pdf_bytes_health = build_infographic_pdf(health_intel)
    assert len(pdf_bytes_health) > 4000, "Health PDF too small"
    assert pdf_bytes_health.startswith(b"%PDF"), "Output is not a valid PDF"
    print(f"[OK] Health Advisory PDF generated successfully ({len(pdf_bytes_health)} bytes)")
    
    print("\nBackend Infographic PDF engine verified successfully!")

if __name__ == "__main__":
    test_infographic_pdf()
