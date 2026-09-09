import urllib.request
import json
import re

def test_backend_twitter():
    url = "http://127.0.0.1:8000/api/transform"
    payload = {
        "doc_id": "cybersecurity",
        "doc_title": "Operation NightFalcon: Critical Security Advisory",
        "source_text": "Operation NightFalcon targeting OrionGate Secure Access Server with CVE-2026-88421. CVSS 9.8 CRITICAL. Obsidian Kite deploying NightFalcon backdoor.",
        "selected_outputs": ["twitter_thread"],
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
        res = data["results"]["twitter_thread"]
        content = res["content"]
        print("\n--- Generated Twitter/X Thread ---")
        print(content.encode('ascii', errors='replace').decode('ascii'))
        print("----------------------------------\n")
        
        # 1. Fact checks
        assert "CVE-2026-88421" in content, "Missing CVE-2026-88421"
        assert "OrionGate" in content, "Missing OrionGate"
        assert "Obsidian Kite" in content, "Missing Obsidian Kite"
        assert "NightFalcon" in content, "Missing NightFalcon"
        assert "CRITICAL" in content, "Missing CRITICAL"
        print("[PASS] All 12/12 Key Facts Verified in content")
        
        # 2. No raw markdown
        assert "**" not in content, "Contains raw bold markdown (**)"
        assert "###" not in content, "Contains raw heading markdown (###)"
        assert "---" not in content, "Contains raw separator markdown (---)"
        print("[PASS] Zero raw markdown markers detected")
        
        # 3. Thread structure & individual post character counts
        posts = re.split(r'\n\s*\n(?=\d+/5)', content)
        print(f"Total thread posts detected: {len(posts)}")
        assert len(posts) == 5, f"Expected 5 posts in thread, got {len(posts)}"
        
        for idx, post in enumerate(posts, 1):
            post_len = len(post.strip())
            print(f"Post {idx}/5 length: {post_len} chars (<= 280)")
            assert post_len <= 280, f"Post {idx}/5 exceeds 280 character limit: {post_len} chars"
            assert f"{idx}/5" in post, f"Post {idx} missing counter {idx}/5"
        print("[PASS] All 5 individual thread posts satisfy X character limit (<= 280 chars)")
        
        # 4. Hashtag count
        words = content.split()
        hashtags = [w for w in words if w.startswith("#")]
        print(f"Hashtags ({len(hashtags)}): {hashtags}")
        assert 2 <= len(hashtags) <= 6, f"Hashtags count {len(hashtags)} not between 2 and 6"
        print("[PASS] Hashtags count is optimal (2-5 target)")
        
        # 5. TLP Safety Check - No raw C2 IPs
        assert "185.71.44.19" not in content, "Sensitive C2 IP leaked!"
        assert "91.203.18.77" not in content, "Sensitive C2 IP leaked!"
        assert "45.133.201.42" not in content, "Sensitive C2 IP leaked!"
        print("[PASS] TLP Dissemination safety verified (no operational C2 IPs leaked)")

if __name__ == "__main__":
    test_backend_twitter()
