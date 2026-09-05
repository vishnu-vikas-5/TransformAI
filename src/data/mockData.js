export const SAMPLE_DOCUMENTS = [
  {
    id: "cybersecurity",
    title: "Cybersecurity Incident & Advisory: CVE-2024-38077 Zero-Day RCE",
    category: "Threat Intelligence & Incident Response",
    wordCount: 3840,
    pages: 10,
    entities: ["CVE-2024-38077", "RDP Licensing Service", "Remote Code Execution", "CVSS 9.8", "Windows Server 2022"],
    summaryPreview: "A critical zero-day memory corruption vulnerability in the Windows Remote Desktop Licensing service permits unauthenticated remote code execution with SYSTEM privileges.",
    rawText: `INCIDENT ADVISORY & TECHNICAL THREAT LOG
Document Reference: INC-2024-88902-SEC
Classification: CONFIDENTIAL / INTERNAL DISSEMINATION ONLY
Date: September 04, 2026
Target System: Remote Desktop Licensing Service (termsrv.dll / lsvcs.dll)

1. EXECUTIVE THREAT OVERVIEW
On September 02, 2026, the Cyber Security Incident Response Team (CSIRT) identified active exploitation of a zero-day vulnerability designated CVE-2024-38077. The vulnerability resides in the Windows Remote Desktop Licensing Service component. An unauthenticated remote attacker can trigger a heap-based buffer overflow by crafting malicious RPC requests over port 135 / TCP, allowing arbitrary code execution with NT AUTHORITY\\SYSTEM privileges across vulnerable domain controllers and license servers.

2. AFFECTED INFRASTRUCTURE & IMPLICATIONS
- Windows Server 2016, 2019, and 2022 (with Remote Desktop Licensing role enabled).
- Threat CVSS v3.1 Base Score: 9.8 (CRITICAL) [Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H]
- Active Infiltration Vector: Adversaries deploy Cobalt Strike beacons and LockBit 4.0 ransomware payloads within 45 minutes of initial RPC handshake.
- Discovered Impact: 14 internal database nodes quarantined; zero confirmed data exfiltration to external C2 IP addresses.

3. MANDATORY REMEDIATION ACTIONS FOR IT & INFRASTRUCTURE
A. Immediate Workaround (Execute within 2 hours):
   - Block TCP Port 135 and RPC Dynamic Port Range (49152-65535) at perimeter firewalls for inbound external traffic.
   - Stop and disable the Remote Desktop Licensing service ('net stop TermServLicensing') on non-production domain nodes.
B. Patch Deployment:
   - Apply Emergency Security Update KB5040442 immediately across all enterprise domain nodes.
   - Enforce RPC Endpoint Mapper filters and mandate SMB Signing.
C. User & Credential Protections:
   - Initiate mandatory password reset for all Active Directory Domain Admin accounts.
   - Enable mandatory Hardware Token MFA for all Remote Desktop Gateway sessions.`
  },
  {
    id: "health_advisory",
    title: "Public Health Emergency Advisory: Viral Respiratory Protocol 2026",
    category: "Government & Health Policy",
    wordCount: 2950,
    pages: 7,
    entities: ["Respiratory Pathogen H5-V2", "Ministry of Health", "Quarantine Protocol", "Public Advisory", "Vaccine Distribution"],
    summaryPreview: "Emergency policy guidelines detailing containment protocols, travel restrictions, healthcare facility capacity management, and public safety procedures for H5-V2.",
    rawText: `PUBLIC HEALTH ADVISORY & OPERATIONAL DIRECTIVE
Directive ID: MOH-PHE-2026-04
Date of Issuance: September 01, 2026
Subject: Containment & Operational Protocol for Novel Respiratory Pathogen Variant H5-V2

1. CONTEXT AND EPIDEMIOLOGICAL SNAPSHOT
The National Public Health Authority has issued a Tier-2 Public Health Warning following confirmed regional clusters of Novel Respiratory Variant H5-V2. Transmission occurs via fine respiratory aerosols with an estimated basic reproduction number (R0) of 2.4. Symptoms present within 48-72 hours, including acute febrile illness, persistent coughing, and sudden fatigue.

2. DIRECTIVES FOR COMMERCIAL ORGANIZATIONS & INSTITUTIONS
- Facility Sanitation: All commercial buildings must increase HVAC air exchange rates to a minimum of 6 ACH and deploy MERV-13 or HEPA filtration.
- Flexible Remote Work: Organizations are instructed to transition 60% of non-essential personnel to remote work schedules to reduce public transport density.
- Symptom Screening: Implement thermal screening checkpoints at all main entry points. Personnel exhibiting temperature >= 38.0°C must be provided N95 masks and directed to home isolation.`
  },
  {
    id: "research_paper",
    title: "Research Paper: Agentic Task Decomposition & Parallel LLM Orchestration",
    category: "AI & Computer Science Research",
    wordCount: 5120,
    pages: 14,
    entities: ["Agentic Architecture", "Task Decomposition", "Parallel Inference", "Grounding Score", "Hallucination Reduction"],
    summaryPreview: "A technical evaluation demonstrating how decomposing complex multi-output prompts into specialized agent DAGs achieves 4.2x latency improvement and 99.1% factual grounding.",
    rawText: `RESEARCH PAPER: DECOUPLING GENERATION AND VALIDATION IN MULTI-AGENT LLM PIPELINES
Authors: TransformAI Research Group
Published: August 2026

ABSTRACT
Single-prompt Large Language Model (LLM) architectures frequently suffer from context degradation, formatting bleed, and hallucination when tasked with producing heterogeneous communication outputs from a unified source document.`
  }
];

export const OUTPUT_FORMATS = [
  {
    id: "exec_summary",
    title: "Executive Summary",
    agent: "Summarization Agent",
    icon: "FileText",
    badgeColor: "indigo",
    audience: "C-Suite / Executive Board",
    description: "Concise, high-level strategic executive briefing focusing on key business impact, risk levels, and required decisions."
  },
  {
    id: "video_package",
    title: "Video Package",
    agent: "Video Script Agent",
    icon: "Video",
    badgeColor: "rose",
    audience: "Video Production & Media",
    description: "Complete video production package including full script, scene-by-scene storyboard, narration text, subtitles, and visual cues."
  },
  {
    id: "linkedin_post",
    title: "LinkedIn Post",
    agent: "Social Media Agent",
    icon: "Share2",
    badgeColor: "cyan",
    audience: "Professional Community / PR",
    description: "Platform-optimized professional post suitable for corporate publication with key takeaways and call-to-actions."
  },
  {
    id: "twitter_thread",
    title: "Twitter/X Post & Thread",
    agent: "Microblogging Agent",
    icon: "MessageSquare",
    badgeColor: "amber",
    audience: "Public & Microblogging Followers",
    description: "Sequence of bite-sized, character-optimized tweets/threads with relevant hashtags and engagement hooks."
  },
  {
    id: "advisory_doc",
    title: "Structured Advisory",
    agent: "Policy & Advisory Agent",
    icon: "ShieldAlert",
    badgeColor: "emerald",
    audience: "Stakeholders & Compliance Teams",
    description: "Formal structured advisory document detailing threat levels, operational guidance, and compliance protocols."
  },
  {
    id: "infographic_pkg",
    title: "Infographic Content & Layout",
    agent: "Visual Infographic Agent",
    icon: "PieChart",
    badgeColor: "purple",
    audience: "Designers & Public Viewers",
    description: "Structured infographic content, key messaging metrics, layout wireframe recommendations, and asset guidance."
  },
  {
    id: "presentation",
    title: "Presentation Slides & Notes",
    agent: "Presentation Agent",
    icon: "Layers",
    badgeColor: "indigo",
    audience: "Presenters & Decision Makers",
    description: "Structured slide outline with title headers, key bullet points, visual slide cues, and comprehensive speaker notes."
  }
];

export const PRE_GENERATED_RESULTS = {
  cybersecurity: {
    exec_summary: {
      content: `### Executive Summary: Critical Zero-Day Vulnerability (CVE-2024-38077)

**Risk Level:** CRITICAL (CVSS v3.1: 9.8)  
**Affected Component:** Windows Remote Desktop Licensing Service  

#### Strategic Business Impact
- **Immediate Threat:** Unauthenticated remote attackers can execute arbitrary code with full SYSTEM privileges over Port 135.
- **Ransomware Threat Vector:** Active exploitation deploys Cobalt Strike beacons and LockBit 4.0 within 45 minutes of intrusion.
- **Operational Status:** 14 internal database nodes quarantined as a precaution. Zero external data exfiltration detected to date.

#### Mandatory Decisions & Authorizations
1. Authorize emergency security patch KB5040442 deployment during tonight's maintenance window.
2. Enforce perimeter firewall RPC block (Port 135) immediately.
3. Initiate mandatory Hardware Token MFA reset for all Domain Admin sessions.`,
      groundingScore: 99.4,
      hallucinations: 0,
      toneMatch: 100,
      validationNotes: "All CVSS metrics, CVE tags, node counts, and remediation KB numbers match source advisory exactly.",
      citations: [
        "Source Section 1: CVSS v3.1 Base Score 9.8",
        "Source Section 2: 14 internal database nodes quarantined; zero confirmed data exfiltration",
        "Source Section 3: Emergency Update KB5040442"
      ]
    },

    video_package: {
      content: `### Video Production Package: Security Threat Alert (CVE-2024-38077)

#### 1. Video Overview & Technical Specifications
- **Target Duration:** 90 Seconds
- **Format:** 16:9 HD / Vertical Short Cut (9:16)
- **Tone:** Urgent, Authoritative, Action-Oriented

#### 2. Scene-by-Scene Storyboard & Script

**Scene 1 [00:00 - 00:15] — Opening Hook**
- **Visual Recommendation:** Animated red alert pulse over an abstract server rack network graphic.
- **Narration Text:** "A critical zero-day vulnerability designated CVE-2024-38077 has been discovered in Windows Remote Desktop Licensing services. Here is what your security team needs to know right now."
- **Subtitles:** [Critical Zero-Day Alert: CVE-2024-38077 | CVSS 9.8]

**Scene 2 [00:15 - 00:45] — Threat Breakdown**
- **Visual Recommendation:** Motion graphic highlighting Port 135 with animated LockBit 4.0 & Cobalt Strike payload vectors.
- **Narration Text:** "Unauthenticated attackers are exploiting heap buffer overflows over Port 135 to gain full SYSTEM privileges. Intrusion to ransomware staging can occur in under 45 minutes."
- **Subtitles:** [Intrusion Vector: Port 135 / RPC | Threat: SYSTEM Privilege Takeover]

**Scene 3 [00:45 - 01:15] — Actionable Remediation**
- **Visual Recommendation:** Terminal screen showing 'net stop TermServLicensing' and KB5040442 patch application.
- **Narration Text:** "Immediate action is required: Block Port 135 at your perimeter firewall, apply Microsoft KB5040442, and enforce hardware MFA across domain admin sessions."
- **Subtitles:** [Action Steps: 1. Block Port 135 | 2. Patch KB5040442 | 3. Enforce MFA]

**Scene 4 [01:15 - 01:30] — Outro & Resources**
- **Visual Recommendation:** Company Security Operations Center logo and link to full advisory document.
- **Narration Text:** "Stay secure. Download the complete technical advisory at security.company.com."
- **Subtitles:** [Read Full Advisory: security.company.com]`,
      groundingScore: 98.9,
      hallucinations: 0,
      toneMatch: 99,
      validationNotes: "Includes full script, timestamps, narration, subtitles, and scene visual recommendations grounded in advisory metrics.",
      citations: [
        "Source Section 1: CVE-2024-38077 and 45-minute LockBit timeframe",
        "Source Section 3: Remediation steps KB5040442 and Port 135 block"
      ]
    },

    linkedin_post: {
      content: `🚨 Critical Cybersecurity Advisory: Responding to CVE-2024-38077

Our Cyber Security Incident Response Team has issued an urgent advisory regarding CVE-2024-38077—a critical zero-day Remote Code Execution vulnerability in Windows Remote Desktop Licensing services (CVSS 9.8).

Key Action Items for Infrastructure & Security Leaders:
▪️ Perimeter Firewall Defense: Immediately block TCP Port 135 and RPC Dynamic Ports (49152-65535).
▪️ Service Containment: Disable 'TermServLicensing' on non-essential nodes.
▪️ Emergency Patching: Deploy Security Update KB5040442 across enterprise domain controllers.

Proactive incident monitoring confirms zero external data exfiltration across our environment. 

Read our full technical breakdown and response checklist: [link]

#CyberSecurity #InfoSec #VulnerabilityAdvisory #IncidentResponse #ThreatIntel #PatchTuesday`,
      groundingScore: 99.1,
      hallucinations: 0,
      toneMatch: 100,
      validationNotes: "Matches professional LinkedIn corporate announcement style while retaining strict factual grounding.",
      citations: [
        "Source Section 1: CVSS 9.8 and CVE identifier",
        "Source Section 3: Remediation port rules"
      ]
    },

    twitter_thread: {
      content: `1/5 🚨 THREAT ALERT: Critical zero-day vulnerability CVE-2024-38077 (CVSS 9.8) actively exploited in Windows Remote Desktop Licensing services. Here's a quick 4-tweet breakdown & mitigation checklist 🧵👇

2/5 ⚠️ Attack Vector: Unauthenticated attackers trigger heap buffer overflows over Port 135, gaining full NT AUTHORITY\\SYSTEM rights. Ransomware staging (Cobalt Strike / LockBit 4.0) observed within 45 mins.

3/5 🛡️ Immediate Workarounds (Execute within 2h):
• Block TCP Port 135 & RPC Dynamic range (49152-65535) at perimeter.
• Stop 'TermServLicensing' service on non-prod nodes.

4/5 📦 Permanent Fix: Apply Emergency Security Patch KB5040442 immediately across all Windows Server 2016/2019/2022 nodes. Enforce SMB signing & hardware MFA for RDP Gateway.

5/5 📑 Full technical advisory & guidance available here: [link] #CyberSecurity #InfoSec #ZeroDay #InfraOps`,
      groundingScore: 99.5,
      hallucinations: 0,
      toneMatch: 99,
      validationNotes: "Formatted into a 5-tweet optimized thread respecting character limits and thread numbering.",
      citations: [
        "Source Section 1, 2 & 3: CVE, CVSS 9.8, port ranges, and KB patch number"
      ]
    },

    advisory_doc: {
      content: `### FORMAL CYBERSECURITY ADVISORY
**Document ID:** ADV-2026-88902  
**Issue Date:** September 04, 2026  
**Severity Level:** CRITICAL (CVSS 9.8)  
**Target Subject:** CVE-2024-38077 — Windows Remote Desktop Licensing Service Vulnerability  

#### 1. Hazard Summary
Active exploitation of a heap-based buffer overflow in \`termsrv.dll\` / \`lsvcs.dll\` enables remote attackers to execute arbitrary code with \`SYSTEM\` privileges without authentication.

#### 2. Scope & Vulnerable Systems
- Windows Server 2016 (All Editions)
- Windows Server 2019 (All Editions)
- Windows Server 2022 (All Editions)

#### 3. Mandatory Compliance Directives
- **Directive A (Immediate Firewall Block):** Restrict TCP Port 135 and RPC Dynamic Port Range (49152-65535) at network perimeters.
- **Directive B (Patch Application):** Deploy Emergency Patch KB5040442 within 12 hours of issuance.
- **Directive C (Credential Guard):** Force Active Directory Domain Admin password reset and mandate Hardware Token MFA.`,
      groundingScore: 100,
      hallucinations: 0,
      toneMatch: 100,
      validationNotes: "Structured formal advisory with explicit hazard summary, scope, and numbered directives.",
      citations: [
        "Source Section 1, 2, 3: Full advisory parameters"
      ]
    },

    infographic_pkg: {
      content: `### Infographic Design & Content Package

#### 1. Core Visual Concept & Layout Structure
- **Layout Grid:** 3-Tier Vertical Flow (Header Threat Stats -> Visual Attack Vector -> Remediation Checklist)
- **Primary Color Palette:** Deep Charcoal (#0B0F19), Critical Red (#F43F5E), Emerald Green (#10B981)

#### 2. Key Data Cards & Visual Metrics
- **Card 1 (Hero Metric):** "CVSS 9.8 / CRITICAL" — Large bold callout with a warning icon.
- **Card 2 (Exploitation Window):** "45 Minutes" — Animated clock icon representing time from initial RPC handshake to LockBit 4.0 ransomware staging.
- **Card 3 (Containment Stat):** "0 Data Exfiltrated" — Shield icon showing 14 database nodes isolated with zero data loss.

#### 3. Step-by-Step Visual Action Flow
1. **Block Port 135:** Firewall icon shutting down TCP 135 & RPC dynamic ports.
2. **Apply KB5040442:** Download/Install update icon for Windows Server 2016/2019/2022.
3. **Reset Admin Passwords & Enforce MFA:** Security key icon representing Hardware MFA login.`,
      groundingScore: 98.7,
      hallucinations: 0,
      toneMatch: 98,
      validationNotes: "Provides complete visual infographic wireframe, asset recommendations, and data callouts.",
      citations: [
        "Source Section 1 & 2: 45-minute window and 14 database nodes"
      ]
    },

    presentation: {
      content: `### Executive & Board Presentation: Incident Briefing (CVE-2024-38077)

#### Slide 1: Threat Overview & Scope
- **Headline:** Response to Critical RCE Vulnerability (CVE-2024-38077)
- **Key Metric:** CVSS 9.8 Critical Score
- **Visual Cue:** Server network map highlighting Remote Desktop Licensing Role
- **Speaker Note:** Reassure the board that zero data exfiltration occurred and core operational databases remain secure.

#### Slide 2: Containment & Remediation Roadmap
- **Step 1:** Immediate RPC Port 135 Perimeter Firewall Blocking (Completed).
- **Step 2:** Quarantined 14 internal nodes & disabled non-critical licensing services (Completed).
- **Step 3:** Deployment of Emergency Patch KB5040442 (In Progress).
- **Speaker Note:** Emphasize that emergency patching is occurring during tonight's maintenance window to prevent operational downtime.

#### Slide 3: Next Steps & Security Governance
- Mandatory MFA reset for Active Directory Domain Admin accounts.
- Enforce RPC Endpoint Mapper filters and SMB Signing across all domain controllers.
- **Speaker Note:** Request authorization for accelerating hardware key deployment across secondary IT units.`,
      groundingScore: 99.2,
      hallucinations: 0,
      toneMatch: 99,
      validationNotes: "Slide-by-slide titles, bullet points, visual cues, and explicit speaker notes.",
      citations: [
        "Source Section 2 & 3: Board briefing points"
      ]
    }
  }
};

export const AGENT_ROSTER = [
  {
    name: "Master AI Orchestrator",
    role: "Task Decomposition & Graph Manager",
    badge: "Orchestrator",
    badgeColor: "indigo",
    description: "Parses source documents, analyzes user intent, builds the execution DAG, and routes sub-tasks to specialized agents."
  },
  {
    name: "Document Analysis Agent",
    role: "Entity & Syntax Extractor",
    badge: "Parsing",
    badgeColor: "cyan",
    description: "Extracts key facts, numerical data, dates, technical parameters, and entity metadata into a clean JSON graph."
  },
  {
    name: "Summarization Agent",
    role: "Executive & Strategic Synthesizer",
    badge: "Summary",
    badgeColor: "purple",
    description: "Generates high-level executive briefings and structured point-by-point summaries tailored for decision makers."
  },
  {
    name: "Video Script Agent",
    role: "Multimedia Package Specialist",
    badge: "Video",
    badgeColor: "rose",
    description: "Creates complete video production packages including scripts, storyboards, narration text, subtitles, and scene visual cues."
  },
  {
    name: "Social & Microblogging Agent",
    role: "PR & Short-Form Copywriter",
    badge: "Social",
    badgeColor: "amber",
    description: "Produces platform-optimized LinkedIn posts and Twitter/X threads with hashtags, character limits, and engagement hooks."
  },
  {
    name: "Validation & Quality Agent",
    role: "Factual Grounding & Hallucination Auditor",
    badge: "Validation",
    badgeColor: "emerald",
    description: "Cross-checks generated text against original source material line-by-line to prevent hallucinations and enforce tone compliance."
  }
];

export const COMPARATIVE_DATA = [
  {
    feature: "Processing Latency",
    manual: "Hours to Days",
    singleLlm: "Fast (10-30s), but suffers degradation",
    transformAi: "Fast Parallel Execution (Parallel DAG)"
  },
  {
    feature: "Multi-Format Adaptation",
    manual: "Labor-intensive, repetitive",
    singleLlm: "High risk of format bleed & tone mixing",
    transformAi: "Specialized micro-agents per format"
  },
  {
    feature: "Factual Grounding & Verification",
    manual: "Subject to human fatigue & oversight",
    singleLlm: "14.8% average hallucination rate",
    transformAi: "Automated Validation Agent audit (<0.9% hallucination)"
  },
  {
    feature: "Human-in-the-Loop Governance",
    manual: "High (Full manual writing)",
    singleLlm: "Low (Take-it-or-leave-it text blob)",
    transformAi: "Full Human Control (Select, Edit, Regenerate, Export)"
  }
];
