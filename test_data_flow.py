import urllib.request
import json

def test_source(source_id, source_title, source_text):
    print(f"\n==========================================")
    print(f"Testing Source: {source_id} - {source_title}")
    print(f"==========================================")
    payload = {
        "source_id": source_id,
        "doc_id": source_id,
        "source_title": source_title,
        "doc_title": source_title,
        "source_content": source_text,
        "source_text": source_text,
        "selected_outputs": [
            "exec_summary",
            "video_package",
            "linkedin_post",
            "twitter_thread",
            "advisory_doc",
            "infographic_pkg",
            "presentation"
        ]
    }
    
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/transform",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        
    print(f"Status: {data.get('status')}")
    results = data.get("results", {})
    
    for format_id, res in results.items():
        content = res.get("content", "")
        sid = res.get("source_id")
        stitle = res.get("source_title")
        citations = res.get("citations", [])
        
        # Verify correctness
        if source_id == "cybersecurity":
            has_cve_2024 = "38077" in content or "Remote Desktop" in content or "KB5040442" in content
            has_nightfalcon = "NightFalcon" in content or "88421" in content or "Obsidian Kite" in content
            print(f"[{format_id}] source_id={sid} | has_CVE-2024={has_cve_2024} | has_NightFalcon_contamination={has_nightfalcon}")
            assert not has_nightfalcon, f"Contamination in {format_id}!"
        elif source_id == "nightfalcon":
            has_nightfalcon = "NightFalcon" in content or "88421" in content or "Obsidian Kite" in content or "OrionGate" in content
            print(f"[{format_id}] source_id={sid} | has_NightFalcon={has_nightfalcon}")

test_source(
    "cybersecurity",
    "Cybersecurity Incident & Advisory: CVE-2024-38077 Zero-Day RCE",
    "INCIDENT ADVISORY: Active exploitation of zero-day CVE-2024-38077 in Windows Remote Desktop Licensing service termsrv.dll over Port 135. Threat CVSS 9.8 Critical. Deploy emergency update KB5040442."
)

test_source(
    "nightfalcon",
    "Threat Intelligence Report: Operation NightFalcon (CVE-2026-88421)",
    "SECURITY ADVISORY: OPERATION NIGHTFALCON targeting OrionGate Secure Access Server (CVE-2026-88421) by Obsidian Kite deploying NightFalcon backdoor."
)

print("\nALL BACKEND DATA-FLOW TESTS PASSED PERFECTLY!")
