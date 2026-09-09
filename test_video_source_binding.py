import time
import requests
import json
import sys

# Ensure UTF-8 output for Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

def test_source_video_generation(source_id, source_title, expected_terms, forbidden_terms, expected_filename_substr):
    print(f"\n=======================================================")
    print(f"TESTING VIDEO PIPELINE FOR: {source_title} ({source_id})")
    print(f"=======================================================")
    
    # 1. Trigger generation
    payload = {
        "source_id": source_id,
        "source_title": source_title,
        "output_type": "video"
    }
    
    res = requests.post(f"{BASE_URL}/api/video/generate", json=payload, timeout=10)
    assert res.status_code == 200, f"Generate failed: {res.text}"
    data = res.json()
    job_id = data["job_id"]
    print(f"[Triggered] Job ID: {job_id}")
    
    # 2. Poll until ready
    max_wait = 60
    start = time.time()
    final_status = None
    while time.time() - start < max_wait:
        s_res = requests.get(f"{BASE_URL}/api/video/status/{job_id}", timeout=10)
        assert s_res.status_code == 200, f"Status poll failed: {s_res.text}"
        status_data = s_res.json()
        stage = status_data.get("stage")
        pct = status_data.get("progress_percent")
        msg = status_data.get("message")
        print(f"[{stage.upper()}] {pct}% - {msg}")
        if status_data.get("is_ready") or stage == "ready":
            final_status = status_data
            break
        if stage == "failed":
            raise RuntimeError(f"Video job failed: {status_data.get('error')}")
        time.sleep(1.0)
        
    assert final_status is not None, "Timed out waiting for video job completion"
    print(f"\n[Job Complete] Display Filename: {final_status.get('display_filename')}")
    print(f"[Job Complete] Duration: {final_status.get('duration_sec')}s | Size: {final_status.get('file_size_bytes')} bytes")
    print(f"[Validation Checks]:\n" + "\n".join(f"  {c}" for c in final_status.get("checks", [])))
    
    # Check filename
    display_fn = final_status.get("display_filename", "")
    assert expected_filename_substr in display_fn, f"Filename mismatch: expected '{expected_filename_substr}' in '{display_fn}'"
    
    # Check SRT download
    srt_url = final_status.get("srt_url")
    if srt_url:
        srt_res = requests.get(f"{BASE_URL}{srt_url}", timeout=10)
        assert srt_res.status_code == 200, f"SRT fetch failed: {srt_res.status_code}"
        srt_text = srt_res.text
        print(f"\n[Generated SRT Excerpt (first 250 chars)]:\n{srt_text[:250]}...")
        
        # Check forbidden terms
        for forbidden in forbidden_terms:
            assert forbidden.lower() not in srt_text.lower(), f"FORBIDDEN TERM '{forbidden}' FOUND IN SRT FOR {source_id}!"
            
        # Check expected terms
        for expected in expected_terms:
            assert expected.lower() in srt_text.lower(), f"EXPECTED TERM '{expected}' NOT FOUND IN SRT FOR {source_id}!"
            
    # Check validation checks
    checks_str = " ".join(final_status.get("checks", []))
    for forbidden in forbidden_terms:
        assert forbidden.lower() not in checks_str.lower(), f"FORBIDDEN TERM '{forbidden}' FOUND IN CHECKS FOR {source_id}!"
    for expected in expected_terms:
        assert expected.lower() in checks_str.lower(), f"EXPECTED TERM '{expected}' NOT FOUND IN CHECKS FOR {source_id}!"

    print(f"\n>>> TEST PASSED FOR: {source_id} <<<")


if __name__ == "__main__":
    # Test 1: Cybersecurity CVE-2024-38077
    test_source_video_generation(
        source_id="cybersecurity",
        source_title="Cybersecurity Incident & Advisory: CVE-2024-38077 Zero-Day RCE",
        expected_terms=["CVE-2024-38077"],
        forbidden_terms=["Operation NightFalcon", "CVE-2026-88421", "Obsidian Kite", "OrionGate"],
        expected_filename_substr="CVE-2024-38077"
    )
    
    # Test 2: Health Advisory H5-V2
    test_source_video_generation(
        source_id="health_advisory",
        source_title="Public Health Emergency Advisory: Viral Respiratory Protocol 2026",
        expected_terms=["H5-V2"],
        forbidden_terms=["Operation NightFalcon", "CVE-2026-88421", "Obsidian Kite", "termsrv.dll"],
        expected_filename_substr="MOH-PHE-2026-04"
    )

    # Test 3: Operation NightFalcon Preset
    test_source_video_generation(
        source_id="nightfalcon",
        source_title="Operation NightFalcon Incident Report",
        expected_terms=["NightFalcon", "CVE-2026-88421"],
        forbidden_terms=["CVE-2024-38077", "H5-V2"],
        expected_filename_substr="NightFalcon"
    )

    print("\n=======================================================")
    print("ALL SOURCE BINDING TESTS PASSED PERFECTLY!")
    print("=======================================================")
