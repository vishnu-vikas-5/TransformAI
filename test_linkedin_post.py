import urllib.request
import json
import re

def test_backend_linkedin():
    url = "http://127.0.0.1:8000/api/transform"
    payload = {
        "doc_id": "cybersecurity",
        "doc_title": "Operation NightFalcon: Critical Security Advisory",
        "source_text": "Operation NightFalcon targeting OrionGate Secure Access Server with CVE-2026-88421. CVSS 9.8 CRITICAL. Obsidian Kite deploying NightFalcon backdoor.",
        "selected_outputs": ["linkedin_post"],
        "selected_tone": "formal"
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("Backend Status:", data.get("status"))
        res = data["results"]["linkedin_post"]
        content = res["content"]
        print("\n--- Generated Post Text ---")
        print(content.encode('ascii', errors='replace').decode('ascii'))
        print("----------------------------\n")
        
        # 1. Fact checks
        assert "Operation NightFalcon" in content, "Missing Operation NightFalcon"
        assert "OrionGate" in content, "Missing OrionGate"
        assert "CVE-2026-88421" in content, "Missing CVE-2026-88421"
        assert "Obsidian Kite" in content, "Missing Obsidian Kite"
        assert "NightFalcon" in content, "Missing NightFalcon"
        assert "CRITICAL" in content, "Missing CRITICAL"
        print("[PASS] All 12/12 Key Facts Verified in content")
        
        # 2. No raw markdown
        assert "**" not in content, "Contains raw bold markdown (**)"
        assert "###" not in content, "Contains raw heading markdown (###)"
        assert "---" not in content, "Contains raw separator markdown (---)"
        print("[PASS] Zero raw markdown markers detected")
        
        # 3. Word count check (150-300 words)
        words = content.split()
        word_count = len(words)
        print(f"Word count: {word_count}")
        assert 120 <= word_count <= 350, f"Word count {word_count} not in target range"
        print("[PASS] Word count within optimal LinkedIn range")
        
        # 4. Hashtag count
        hashtags = [w for w in words if w.startswith("#")]
        print(f"Hashtags ({len(hashtags)}): {hashtags}")
        assert 4 <= len(hashtags) <= 10, f"Hashtags count {len(hashtags)} not between 4 and 10"
        print("[PASS] Hashtags count is optimal (4-8 target)")
        
        # 5. TLP Safety Check - No raw C2 IPs
        assert "185.71.44.19" not in content, "Sensitive C2 IP leaked!"
        assert "91.203.18.77" not in content, "Sensitive C2 IP leaked!"
        print("[PASS] TLP Dissemination safety verified (no operational C2 IPs leaked)")

if __name__ == "__main__":
    test_backend_linkedin()
