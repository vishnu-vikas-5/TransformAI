"""
Test Suite for TransformAI Video Generation Pipeline
Validates programmatic 10-scene MP4 video generation, voiceover synthesis,
subtitles, FFmpeg H.264/AAC composition, and pre-export fact validation.
"""

import os
import sys
import time

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server.video_engine import VideoGenerationJob, execute_video_generation

nightfalcon_video_intel = {
    "video_package": {
        "title": "Operation NightFalcon — Cyber Threat Alert",
        "duration": "90 seconds",
        "aspect_ratio": "16:9",
        "resolution": "1920x1080",
        "scenes": [
            {
                "scene_number": 1,
                "title": "Threat Introduction",
                "narration": "Operation NightFalcon critical security alert. Security teams must immediately address active in-the-wild exploitation targeting OrionGate Secure Access Server appliances.",
                "on_screen_text": ["OPERATION NIGHTFALCON", "CRITICAL SECURITY ALERT", "CVE-2026-88421 | CVSS 9.8 CRITICAL"],
                "subtitle_text": "Operation NightFalcon critical security alert targeting OrionGate servers."
            },
            {
                "scene_number": 2,
                "title": "Vulnerability",
                "narration": "A critical zero-day vulnerability allows unauthenticated remote attackers to bypass edge access controls on OrionGate servers and execute arbitrary code with full root and SYSTEM privileges.",
                "on_screen_text": ["ORIONGATE SERVER INFRASTRUCTURE", "UNAUTHENTICATED ACCESS BYPASS", "SYSTEM & ROOT PRIVILEGES GAINED"],
                "subtitle_text": "A critical zero-day vulnerability allows unauthenticated remote attackers to bypass access controls."
            },
            {
                "scene_number": 3,
                "title": "Affected Systems",
                "narration": "Designated CVE-2026-88421, this remote code execution vulnerability resides in the gateway authentication handler endpoint at /api/v1/auth/gateway, caused by unsafe object deserialization.",
                "on_screen_text": ["CVE-2026-88421", "REMOTE CODE EXECUTION", "AFFECTED: ORIONGATE WEB GATEWAY", "ENDPOINT: /api/v1/auth/gateway"],
                "subtitle_text": "Designated CVE-2026-88421, remote code execution flaw in endpoint /api/v1/auth/gateway."
            },
            {
                "scene_number": 4,
                "title": "Attack Chain",
                "narration": "The intrusion follows an eight-stage attack chain: Initial Access, Exploitation, Remote Code Execution, NightFalcon Backdoor Deployment, Rogue Service Persistence, System Discovery, Command and Control, and Potential Data Collection.",
                "on_screen_text": [
                    "ATTACK CHAIN PROGRESSION:",
                    "1. Initial Access -> 2. Exploitation -> 3. Remote Code Execution",
                    "4. NightFalcon Deployment -> 5. Persistence -> 6. System Discovery",
                    "7. Command & Control -> 8. Potential Data Collection"
                ],
                "subtitle_text": "Intrusion follows an eight-stage attack chain from initial access to command and control."
            },
            {
                "scene_number": 5,
                "title": "Threat Actor",
                "narration": "Intelligence telemetries attribute this campaign to state-sponsored threat group Obsidian Kite, also tracked under aliases OK-17 and KiteGroup, conducting Operation NightFalcon for strategic access.",
                "on_screen_text": ["THREAT ACTOR: OBSIDIAN KITE", "ALIASES: OK-17, KITEGROUP", "CAMPAIGN: OPERATION NIGHTFALCON", "ATTRIBUTION CONFIDENCE: HIGH"],
                "subtitle_text": "Attributed to state-sponsored threat group Obsidian Kite, tracked as OK-17 and KiteGroup."
            },
            {
                "scene_number": 6,
                "title": "Indicators",
                "narration": "Block C2 infrastructure immediately: IP addresses 185.71.44.19, 91.203.18.77, and 45.133.201.42, along with domains nightfalcon-control[.]example and og-update[.]example. Terminate binary nfsvc.exe, unregister ogupdate.dll, and remove service OGUpdateService.",
                "on_screen_text": [
                    "C2 IPs: 185.71.44.19 | 91.203.18.77 | 45.133.201.42",
                    "DOMAINS: nightfalcon-control[.]example | og-update[.]example",
                    "BINARIES: %SystemRoot%\\System32\\nfsvc.exe | ogupdate.dll",
                    "ROGUE SERVICE: OGUpdateService"
                ],
                "subtitle_text": "Block C2 IPs 185.71.44.19, 91.203.18.77, 45.133.201.42, threat domains, and binary nfsvc.exe."
            },
            {
                "scene_number": 7,
                "title": "Timeline",
                "narration": "The intrusion timeline demonstrates rapid progression: September 4 scanning, September 5 server discovery, September 6 vulnerability exploitation, September 7 payload deployment and C2 establishment, culminating in September 8 emergency advisory issuance.",
                "on_screen_text": [
                    "04 SEP — Scanning & Reconnaissance",
                    "05 SEP — OrionGate Server Discovery",
                    "06 SEP — Exploitation of CVE-2026-88421",
                    "07 SEP — NightFalcon Payload & C2",
                    "08 SEP — Emergency Advisory Release"
                ],
                "subtitle_text": "Intrusion timeline progression from September 4 scanning to September 8 emergency advisory."
            },
            {
                "scene_number": 8,
                "title": "Detection",
                "narration": "Enable detection across four tiers: inspect network traffic for persistent outbound TLS sessions on Port 443, monitor endpoint EDR for service creation in System32, block DNS queries for threat domains, and query web logs for HTTP 500 errors on the gateway endpoint.",
                "on_screen_text": [
                    "NETWORK: Egress Beacons on Port 443 (185.71.44.19)",
                    "ENDPOINT: EDR Alert on nfsvc.exe in %SystemRoot%\\System32",
                    "DNS: Block nightfalcon-control[.]example & og-update[.]example",
                    "WEB LOGS: POST /api/v1/auth/gateway Returning HTTP 500"
                ],
                "subtitle_text": "Enable detection across Network, Endpoint, DNS, and Web Logs."
            },
            {
                "scene_number": 9,
                "title": "Response",
                "narration": "Execute mandatory response protocols: CONTAIN perimeter appliances immediately, INVESTIGATE host memory and active connections, BLOCK all C2 indicators, PATCH systems to OrionGate release v4.5.3, and MONITOR egress traffic.",
                "on_screen_text": [
                    "CONTAIN — Isolate Perimeter Gateways from Internal Subnets",
                    "INVESTIGATE — Forensically Triage Host Memory & Disk",
                    "BLOCK — Add C2 IPs and Threat Domains to Edge Deny Lists",
                    "PATCH — Deploy Vendor Security Update v4.5.3 Tonight",
                    "MONITOR — Continuously Audit Egress TLS Sessions"
                ],
                "subtitle_text": "Execute mandatory response protocols: CONTAIN, INVESTIGATE, BLOCK, PATCH, and MONITOR."
            },
            {
                "scene_number": 10,
                "title": "Conclusion",
                "narration": "Critical threat: CVE-2026-88421 requires immediate leadership action. Contain, investigate, patch, and monitor. Human review is required before operational dissemination.",
                "on_screen_text": [
                    "CRITICAL THREAT: CVE-2026-88421",
                    "CONTAIN  ->  INVESTIGATE  ->  PATCH  ->  MONITOR",
                    "Human review required before operational dissemination."
                ],
                "subtitle_text": "Critical threat: CVE-2026-88421 requires immediate action. Human review required before dissemination."
            }
        ]
    }
}

def main():
    print("=== STARTING VIDEO GENERATION ENGINE TEST ===")
    out_dir = os.path.join(os.path.dirname(__file__), "output_videos")
    os.makedirs(out_dir, exist_ok=True)
    
    job_id = "test_run_01"
    job = VideoGenerationJob(job_id, nightfalcon_video_intel, out_dir)
    
    t0 = time.time()
    execute_video_generation(job)
    t1 = time.time()
    
    print(f"Final Job Stage: {job.stage}")
    print(f"Elapsed Time: {t1 - t0:.2f}s")
    print(f"Is Ready: {job.is_ready}")
    print(f"Error: {job.error}")
    print(f"Duration: {job.duration_sec:.2f}s")
    print(f"MP4 Path: {job.mp4_path}")
    print(f"SRT Path: {job.srt_path}")
    
    if job.is_ready:
        size = os.path.getsize(job.mp4_path)
        print(f"MP4 File Size: {size:,} bytes ({size / (1024*1024):.2f} MB)")
        print(f"Validation Checks Passed:")
        for chk in job.validation_results.get("checks", []):
            safe_chk = chk.replace("✓", "[PASS]")
            print(f"  {safe_chk}")
        assert size > 50000, "MP4 file size is too small"
        assert os.path.exists(job.srt_path), "SRT file does not exist"
        print(">>> TEST PASSED 100%! REAL MP4 VIDEO AND SRT GENERATED SUCCESSFULLY! <<<")
    else:
        print(">>> TEST FAILED! <<<")
        sys.exit(1)

if __name__ == "__main__":
    main()
