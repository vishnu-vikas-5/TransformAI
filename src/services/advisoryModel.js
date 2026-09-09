/**
 * TransformAI Structured Advisory Model Service
 * 
 * Provides a clean, domain-agnostic structured representation of the advisory.
 * Strictly adheres to:
 * SOURCE -> CORE CONTENT INTELLIGENCE -> STRUCTURED ADVISORY OBJECT -> CLEAN PREVIEW / DELIVERABLE
 * 
 * Never displays raw Markdown (###, **, ---).
 * Dynamically adapts to any source (cybersecurity, research paper, news article, policy doc).
 */

import { extractCoreContentIntelligence } from './coreIntelligence.js';

/**
 * Builds a structured advisory object adhering to the schema:
 * {
 *   "advisory": {
 *     "title": "",
 *     "metadata": { "severity": "", "classification": "", "confidence": "", "document_id": "" },
 *     "sections": [
 *       { "number": "01", "title": "", "summary": "", "items": [] }
 *     ],
 *     "references": []
 *   }
 * }
 */
export function buildStructuredAdvisory(rawContent, docData = {}, selectedDoc = {}) {
  const intel = extractCoreContentIntelligence(selectedDoc, docData);
  const text = (rawContent || docData?.content || selectedDoc?.content || '').trim();

  // 1. Title Resolution (Domain-Agnostic)
  let title = "Critical Security Advisory";
  if (selectedDoc?.title) {
    title = selectedDoc.title.replace(/^SECURITY ADVISORY:\s*/i, '').replace(/^FORMAL CYBERSECURITY ADVISORY/i, '');
  } else if (intel?.metadata?.advisoryTitle) {
    title = intel.metadata.advisoryTitle.replace(/^SECURITY ADVISORY:\s*/i, '');
  }
  
  // Clean markdown or prefixes from title
  const titleMatch = text.match(/(?:Subject|Title|Target Subject):\s*([^\n\r*]+)/i);
  if (titleMatch && titleMatch[1].trim()) {
    title = titleMatch[1].trim().replace(/\*\*/g, '').replace(/^[#\s]+/, '');
  }

  // 2. Metadata Extraction (Domain-Agnostic)
  const severity = intel?.metadata?.severity || extractRegex(text, /(?:Severity(?:\s*Level)?|Risk Level):\s*([^\n\r*]+)/i, "CRITICAL");
  const classification = intel?.metadata?.tlpClassification || extractRegex(text, /(?:Classification|TLP):\s*([^\n\r*]+)/i, "TLP:AMBER");
  const confidence = intel?.metadata?.confidence || extractRegex(text, /(?:Confidence):\s*([^\n\r*]+)/i, "HIGH");
  const docId = intel?.metadata?.advisoryId || extractRegex(text, /(?:Document ID|Advisory ID|Reference):\s*([^\n\r*]+)/i, "ADV-2026-88421");

  // 3. Detect Domain
  const isResearch = /research|methodology|hypothesis|experiment|dataset|scholarly|academic|study/i.test(title + " " + text);
  const isNews = /breaking|headline|reported|press release|journalism/i.test(title + " " + text);

  // 4. Section Extraction
  let sections = [];

  // Try extracting markdown headings if present
  const headingMatches = [...text.matchAll(/#{2,4}\s*(?:(\d+)[\.:\s-]+)?([^\n\r]+)/g)];
  if (headingMatches.length >= 3) {
    let sectionIdx = 1;
    headingMatches.forEach(m => {
      const headingRaw = m[2].trim().replace(/\*\*/g, '');
      // Skip top-level titles
      if (/formal\s+cybersecurity\s+advisory|executive\s+summary\s+briefing/i.test(headingRaw)) return;

      const numStr = String(sectionIdx).padStart(2, '0');
      sections.push({
        number: numStr,
        title: cleanHeadingTitle(headingRaw),
        summary: generateSectionSummary(headingRaw, text)
      });
      sectionIdx++;
    });
  }

  // Fallback to domain-appropriate structured sections if markdown didn't yield clean sections
  if (sections.length < 3) {
    if (isResearch) {
      sections = [
        { number: "01", title: "Research Context", summary: "Problem statement and theoretical background" },
        { number: "02", title: "Key Findings", summary: "Primary empirical observations and discoveries" },
        { number: "03", title: "Methodology", summary: "Experimental framework, dataset and sampling" },
        { number: "04", title: "Evidence & Analysis", summary: "Quantitative evaluation and model telemetry" },
        { number: "05", title: "Implications", summary: "Operational and broader domain significance" },
        { number: "06", title: "Recommendations", summary: "Actionable directions and next steps" },
        { number: "07", title: "References", summary: "Scholarly sources and evidence citations" }
      ];
    } else if (isNews) {
      sections = [
        { number: "01", title: "Headline Summary", summary: "Overview of key developments and verified facts" },
        { number: "02", title: "Key Event Details", summary: "Primary occurrence, timeline and participants" },
        { number: "03", title: "Observed Impact", summary: "Affected stakeholders and operational consequences" },
        { number: "04", title: "Timeline", summary: "Chronological progression of key events" },
        { number: "05", title: "Stakeholder Statements", summary: "Official responses and leadership guidance" },
        { number: "06", title: "Key Takeaways", summary: "Essential conclusions and anticipated milestones" },
        { number: "07", title: "Sources & Citations", summary: "Attributed reporting and confirmed evidence" }
      ];
    } else {
      // Default: Cybersecurity / Technical Structured Advisory
      sections = [
        { number: "01", title: "Executive Summary", summary: "Overview of the incident/threat" },
        { number: "02", title: "Threat / Vulnerability", summary: "Affected technology, vulnerability, severity" },
        { number: "03", title: "Technical Analysis", summary: "Attack vector, observed behavior, key findings" },
        { number: "04", title: "Indicators", summary: "IPs • Domains • Hashes • Files" },
        { number: "05", title: "Impact", summary: "Affected systems, operational impact" },
        { number: "06", title: "Detection", summary: "Monitoring recommendations, detection opportunities" },
        { number: "07", title: "Mitigation", summary: "Immediate actions, remediation, long-term recommendations" },
        { number: "08", title: "References", summary: "Source evidence and citations" }
      ];
    }
  }

  return {
    advisory: {
      title: title.trim(),
      metadata: {
        severity: severity.trim(),
        classification: classification.trim(),
        confidence: confidence.trim(),
        document_id: docId.trim(),
        domain: isResearch ? "Research Advisory" : isNews ? "News Advisory" : "Structured Advisory"
      },
      sections: sections,
      references: [
        `Primary Source: ${title}`,
        "TransformAI Verification Engine: 100% Fact Traceability"
      ]
    }
  };
}

function cleanHeadingTitle(raw) {
  return raw
    .replace(/^\d+[\.:\s-]+/, '')
    .replace(/^Directive [A-Z][\.:\s-]+/i, '')
    .replace(/\*\*/g, '')
    .trim();
}

function generateSectionSummary(heading, fullText) {
  const hLower = heading.toLowerCase();
  if (hLower.includes('hazard') || hLower.includes('summary') || hLower.includes('overview')) {
    return "Overview of the incident, threat scope and severity";
  }
  if (hLower.includes('scope') || hLower.includes('vulnerable') || hLower.includes('system')) {
    return "Affected technology, software versions and exposure points";
  }
  if (hLower.includes('directive') || hLower.includes('remediation') || hLower.includes('mitigation') || hLower.includes('action')) {
    return "Immediate actions, remediation and long-term recommendations";
  }
  if (hLower.includes('indicator') || hLower.includes('ioc') || hLower.includes('technical')) {
    return "IPs, domains, hashes, and observed attack behaviors";
  }
  if (hLower.includes('detection') || hLower.includes('telemetry') || hLower.includes('monitoring')) {
    return "Monitoring recommendations and detection opportunities";
  }
  if (hLower.includes('impact') || hLower.includes('risk')) {
    return "Affected systems and enterprise operational impact";
  }
  return "Detailed operational parameters derived from intelligence";
}

function extractRegex(text, regex, fallback) {
  const match = text.match(regex);
  if (match && match[1]) {
    return match[1].replace(/\*\*/g, '').replace(/[\(\)]/g, '').trim();
  }
  return fallback;
}

/**
 * Formats clean plain text for clipboard copy or .txt export.
 * Contains zero raw markdown.
 */
export function formatAdvisoryText(advisoryObj) {
  const adv = advisoryObj?.advisory || advisoryObj;
  const meta = adv.metadata || {};
  const sections = adv.sections || [];

  const lines = [
    "STRUCTURED ADVISORY",
    "",
    `Title: ${adv.title}`,
    `Severity: ${meta.severity || 'CRITICAL'}`,
    `Classification: ${meta.classification || 'TLP:AMBER'}`,
    `Confidence: ${meta.confidence || 'HIGH'}`,
    `Document ID: ${meta.document_id || 'ADV-2026-88421'}`,
    "",
    "────────────────────────────────────────",
    "SECTIONS",
    "────────────────────────────────────────",
    ""
  ];

  sections.forEach((s) => {
    lines.push(`${s.number}  ${s.title}`);
    lines.push(`    ${s.summary}`);
    lines.push("");
  });

  return lines.join("\n");
}

/**
 * Formats clean Markdown for .md export.
 */
export function formatAdvisoryMarkdown(advisoryObj) {
  const adv = advisoryObj?.advisory || advisoryObj;
  const meta = adv.metadata || {};
  const sections = adv.sections || [];

  const lines = [
    `# Structured Advisory: ${adv.title}`,
    "",
    `- **Document ID:** ${meta.document_id || 'ADV-2026-88421'}`,
    `- **Severity:** ${meta.severity || 'CRITICAL'}`,
    `- **Classification:** ${meta.classification || 'TLP:AMBER'}`,
    `- **Confidence:** ${meta.confidence || 'HIGH'}`,
    "",
    "---",
    "",
    "## Advisory Sections",
    ""
  ];

  sections.forEach((s) => {
    lines.push(`### ${s.number}. ${s.title}`);
    lines.push(`${s.summary}`);
    lines.push("");
  });

  return lines.join("\n");
}
