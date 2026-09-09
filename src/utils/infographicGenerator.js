/**
 * TransformAI Visual Infographic Generator & Layout Engine
 * 
 * Publication-grade A4 document-infographic renderer adhering strictly to the
 * SyntaxX Design System and matching the reference briefing image:
 * - Pure White document background
 * - Cream filled section banners (#EBE6D8)
 * - Thin brown borders (#B8B2A0 / #9C9286)
 * - Dark brown / black typography (#000000, #1F150C)
 * - Restrained alerts (#8B1E1E for Critical, #A66A1E for Amber)
 * - Modular components: renderHeader, renderMetadataGrid, renderSummary,
 *   renderKeyFindings, renderTechnicalGrid, renderAttackFlow, renderResponse, renderFooter
 * - Cursor-based vertical layout with dynamic page breaks and no overflow
 */

import { jsPDF } from "jspdf";

function downloadBlobSafe(blob, filename) {
  if (typeof document === 'undefined') return;
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  } catch (err) {
    console.error("Download failed:", err);
  }
}

/**
 * Strips raw markdown syntax, asterisks, hashes, raw bullet hyphens,
 * and fixes typographers' unicode quotes so text renders cleanly in PDF.
 */
function cleanText(str) {
  if (!str) return "";
  return String(str)
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[-*•▪]\s+/gm, '')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2026]/g, '...')
    .replace(/[^\x20-\x7E\n\r]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Normalizes input model or intel dictionary into a structured object
 */
function normalizeModel(model) {
  if (!model) model = {};
  const meta = model.metadata || {};
  const glance = model.threat_at_a_glance || {};
  const vuln = model.vulnerability || {};
  const actor = model.threat_actor || {};
  const impact = model.impact || {};
  const remediation = model.remediation || model.recommendations || {};

  const advisoryId = model.advisory_id || model.advisoryId || meta.advisoryId || "TAI-ADV-2026-88421";
  const title = model.title || meta.advisoryTitle || "OPERATION NIGHTFALCON";
  const subtitle = model.subtitle || glance.threat_type || "Targeted Exploitation of OrionGate Secure Access Servers";
  const dateStr = model.issue_date || model.date || meta.date || meta.issueDate || "August 25, 2026";
  const classification = model.classification || meta.classification || meta.tlpClassification || "TLP:AMBER";
  
  const cvssVal = meta.cvssScore || model.headline_metric?.value || "9.8";
  const severity = String(model.severity || model.headline_metric?.severity || meta.severity || "CRITICAL").toUpperCase();
  const severityStr = severity.includes("CVSS") ? severity : `${severity} (CVSS ${cvssVal})`;
  const confidence = String(model.confidence || meta.confidence || "HIGH CONFIDENCE").toUpperCase();

  const cveId = model.identifier || vuln.cve || meta.cve || model.cve || (title.includes("38077") ? "CVE-2024-38077" : "CVE-2026-88421");
  const affectedComp = glance.affected_technology || vuln.affected_component || model.affected_component || (title.includes("38077") ? "Windows Remote Desktop Licensing (termsrv.dll)" : "OrionGate Web Gateway (/api/v1/auth/gateway)");
  const threatActor = actor.actor || actor.name || model.threat_actor || (title.includes("38077") ? "Unauthenticated Cybercrime Affiliates" : "Obsidian Kite (OK-17)");
  const statusStr = model.status || meta.status || glance.status || "ACTIVE EXPLOITATION / EMERGENCY REMEDIATION";

  // Summary
  const summaryText = model.summary || model.overview || model.executiveSummary || (
    title.includes("38077")
      ? "Active in-the-wild exploitation of zero-day vulnerability CVE-2024-38077 in Windows Remote Desktop Licensing services. Unauthenticated remote attackers transmit malformed RPC packets to TCP Port 135, triggering a heap buffer overflow in termsrv.dll to gain full NT AUTHORITY\\SYSTEM privileges and stage LockBit 4.0 ransomware."
      : "A critical zero-day vulnerability designated CVE-2026-88421 has been actively exploited in coordinated cyber espionage attacks tracked as Operation NightFalcon. Advanced persistent threat actor Obsidian Kite is targeting internet-facing OrionGate Secure Access Server appliances and OrionGate Web Gateways to achieve unauthenticated remote code execution with SYSTEM-level privileges. Immediate isolation of affected appliances, host-level remediation, and perimeter blocking of identified command-and-control indicators are mandatory."
  );

  // Key findings
  let findings = [];
  const overviewSec = model.sections?.find(s => s.id === "overview" || s.type === "summary");
  if (Array.isArray(model.keyFindings)) {
    findings = model.keyFindings;
  } else if (overviewSec && Array.isArray(overviewSec.items)) {
    findings = overviewSec.items;
  } else if (Array.isArray(model.findings)) {
    findings = model.findings;
  } else {
    findings = [
      `Root Vulnerability: Critical remote code execution vulnerability (${cveId}) targeting perimeter network services.`,
      `Intrusion Campaign: Advanced persistent threat actor ${threatActor} deploys secondary payloads and persistent backdoors.`,
      `Perimeter Exposure: Compromised ingress servers serve as gateways into internal corporate networks, creating severe lateral traversal risk.`
    ];
  }

  // Attack chain
  let attackSteps = [];
  const flowSec = model.sections?.find(s => s.id === "attack-flow" || s.type === "flow");
  if (Array.isArray(model.attackFlow)) {
    attackSteps = model.attackFlow;
  } else if (Array.isArray(model.attack_flow)) {
    attackSteps = model.attack_flow;
  } else if (flowSec && Array.isArray(flowSec.steps)) {
    attackSteps = flowSec.steps.map(st => st.name || st.detail || st);
  } else if (Array.isArray(model.attack_chain)) {
    attackSteps = model.attack_chain;
  } else {
    attackSteps = ["PORT SCAN", "HEAP OVERFLOW", "SYSTEM RCE", "PERSISTENCE", "COMMAND & CONTROL"];
  }

  return {
    advisoryId,
    title,
    subtitle,
    dateStr,
    classification,
    severityStr,
    confidence,
    cveId,
    affectedComp,
    threatActor,
    statusStr,
    summaryText,
    findings,
    attackSteps,
    impact,
    remediation
  };
}

/**
 * Generates an official publication-grade A4 PDF Blob matching the reference briefing image.
 * Uses cursor-based component layout with zero overflow and multi-page support.
 */
export async function generateInfographicPdfBlob(inputModel) {
  console.log("INFOGRAPHIC PDF DATA", inputModel);
  console.log("INFOGRAPHIC PDF RENDER START");
  const data = normalizeModel(inputModel);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm
  const bottomMargin = 280;

  // SyntaxX Document Editorial Palette
  const cBlack = [0, 0, 0];
  const cDarkBrown = [31, 21, 12];
  const cDeepBrown = [65, 45, 21];
  const cCream = [225, 220, 201];
  const cSlate100 = [235, 230, 216]; // #EBE6D8 (Section Header Fill)
  const cSlate50 = [249, 248, 245];  // Pale Cream row fill
  const cBorder = [184, 178, 160];   // #B8B2A0 (Thin border)
  const cBorderFrame = [156, 146, 134]; // #9C9286 (Outer frame)
  const cRed = [139, 30, 30];        // Alert Red
  const cAmber = [166, 106, 30];      // Amber TLP
  const cMuted = [101, 84, 66];      // Secondary text
  const cWhite = [255, 255, 255];

  let currentY = 16;

  function drawOuterFrame() {
    doc.setDrawColor(...cBorderFrame);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16, "D");
  }

  function checkPageBreak(neededHeight) {
    if (currentY + neededHeight > bottomMargin) {
      doc.addPage();
      drawOuterFrame();
      drawRunningHeader();
      currentY = 18;
    }
  }

  function drawRunningHeader() {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...cDarkBrown);
    doc.text("CYBERSECURITY EXECUTIVE BRIEFING  |  DECISION-MAKER SUMMARY", marginX, 13);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...cRed);
    doc.text("[ INFOGRAPHIC RENDERER V2 ]", marginX + contentWidth - 48, 13);

    doc.setDrawColor(...cBorder);
    doc.setLineWidth(0.3);
    doc.line(marginX, 15, marginX + contentWidth, 15);
  }

  // Draw initial page frame
  drawOuterFrame();

  // =========================================================================
  // 1. HEADER & TOP TAGLINE
  // =========================================================================
  function renderHeader() {
    console.log("HEADER RENDER");

    // Temporary visible test box near top of page 1 (Requirement 5)
    doc.setFillColor(254, 226, 226);
    doc.setDrawColor(185, 28, 28);
    doc.setLineWidth(0.4);
    doc.rect(marginX, currentY, contentWidth, 5.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(185, 28, 28);
    doc.text("INFOGRAPHIC RENDER TEST", marginX + contentWidth / 2, currentY + 3.8, { align: "center" });
    currentY += 7.5;

    // Top Tagline & Test Marker
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...cDarkBrown);
    doc.text("CYBERSECURITY EXECUTIVE BRIEFING  |  DECISION-MAKER SUMMARY", marginX, currentY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...cRed);
    doc.text("[ INFOGRAPHIC RENDERER V2 ]", marginX + contentWidth - 48, currentY);
    currentY += 5;

    // Main Title (Wrapped)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...cBlack);
    const titleLines = doc.splitTextToSize(cleanText(data.title).toUpperCase(), contentWidth);
    titleLines.forEach(tl => {
      doc.text(tl, marginX, currentY);
      currentY += 6.5;
    });

    // Subtitle (Wrapped)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...cDeepBrown);
    const subLines = doc.splitTextToSize(cleanText(data.subtitle), contentWidth);
    subLines.forEach(sl => {
      doc.text(sl, marginX, currentY);
      currentY += 4.5;
    });

    currentY += 2;
  }

  // =========================================================================
  // 2. 6-COLUMN METADATA GRID (Matches Reference Image)
  // =========================================================================
  function renderMetadataGrid() {
    console.log("METADATA RENDER");
    const colW = contentWidth / 6;
    const headerH = 5.5;
    const valueH = 6.5;

    // Header Row Fill
    doc.setFillColor(...cSlate100);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, headerH, "FD");

    const headers = ["SEVERITY", "CONFIDENCE", "CVE IDENTIFIER", "ADVISORY ID", "DATE", "CLASSIFICATION"];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...cBlack);

    headers.forEach((h, idx) => {
      doc.text(h, marginX + idx * colW + 2, currentY + 3.8);
      if (idx > 0) {
        doc.line(marginX + idx * colW, currentY, marginX + idx * colW, currentY + headerH);
      }
    });

    currentY += headerH;

    // Value Row Fill
    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, valueH, "FD");

    const values = [
      { text: data.severityStr, isRed: true },
      { text: data.confidence },
      { text: data.cveId },
      { text: data.advisoryId },
      { text: data.dateStr },
      { text: data.classification, isAmber: true }
    ];

    values.forEach((v, idx) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      if (v.isRed) doc.setTextColor(...cRed);
      else if (v.isAmber) doc.setTextColor(...cAmber);
      else doc.setTextColor(...cDarkBrown);

      const cellText = doc.splitTextToSize(cleanText(v.text), colW - 3)[0] || cleanText(v.text);
      doc.text(cellText, marginX + idx * colW + 2, currentY + 4.3);
      if (idx > 0) {
        doc.line(marginX + idx * colW, currentY, marginX + idx * colW, currentY + valueH);
      }
    });

    currentY += valueH + 4;
  }

  // Helper for Section Banners (Title + Subtitle in Light Cream Fill)
  function drawSectionHeader(numStr, titleStr, subtitleStr) {
    const bannerH = 9.5;
    checkPageBreak(bannerH + 12);

    doc.setFillColor(...cSlate100);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, bannerH, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...cBlack);
    doc.text(`${numStr}. ${cleanText(titleStr).toUpperCase()}`, marginX + 3, currentY + 4.2);

    if (subtitleStr) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(...cMuted);
      doc.text(cleanText(subtitleStr), marginX + 3, currentY + 7.8);
    }

    currentY += bannerH + 1.5;
  }

  // =========================================================================
  // 3. SECTION 1: EXECUTIVE OVERVIEW
  // =========================================================================
  function renderSummary() {
    console.log("SUMMARY RENDER");
    drawSectionHeader("1", "Executive Overview", "Strategic Situation Overview for Leadership");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const summaryLines = doc.splitTextToSize(cleanText(data.summaryText), contentWidth - 6);
    const boxH = summaryLines.length * 3.5 + 4;

    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, boxH, "FD");

    doc.setTextColor(...cDarkBrown);
    summaryLines.forEach((line, idx) => {
      doc.text(line, marginX + 3, currentY + 3.8 + idx * 3.5);
    });

    currentY += boxH + 4;
  }

  // =========================================================================
  // 4. SECTION 2: THREAT AT A GLANCE (3x2 Grid Table)
  // =========================================================================
  function renderThreatAtAGlance() {
    drawSectionHeader("2", "Threat At A Glance", "Core Threat Vectors & Incident Metadata");

    const colW = contentWidth / 3;
    const rowHeaderH = 4.8;
    const rowValH = 5.8;
    const totalGridH = (rowHeaderH + rowValH) * 2;

    checkPageBreak(totalGridH + 4);

    // Row 1 Headers
    doc.setFillColor(...cSlate50);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, rowHeaderH, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...cBlack);
    doc.text("THREAT / INCIDENT", marginX + 2, currentY + 3.4);
    doc.line(marginX + colW, currentY, marginX + colW, currentY + rowHeaderH);
    doc.text("SEVERITY", marginX + colW + 2, currentY + 3.4);
    doc.line(marginX + colW * 2, currentY, marginX + colW * 2, currentY + rowHeaderH);
    doc.text("CONFIDENCE", marginX + colW * 2 + 2, currentY + 3.4);
    currentY += rowHeaderH;

    // Row 1 Values
    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, rowValH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...cDarkBrown);
    doc.text(`${cleanText(data.title)} (RCE Intrusion)`.slice(0, 36), marginX + 2, currentY + 4.1);
    doc.line(marginX + colW, currentY, marginX + colW, currentY + rowValH);
    doc.setTextColor(...cRed);
    doc.text(cleanText(data.severityStr), marginX + colW + 2, currentY + 4.1);
    doc.line(marginX + colW * 2, currentY, marginX + colW * 2, currentY + rowValH);
    doc.setTextColor(...cDarkBrown);
    doc.text(cleanText(data.confidence), marginX + colW * 2 + 2, currentY + 4.1);
    currentY += rowValH;

    // Row 2 Headers
    doc.setFillColor(...cSlate50);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, rowHeaderH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...cBlack);
    doc.text("CVE IDENTIFIER", marginX + 2, currentY + 3.4);
    doc.line(marginX + colW, currentY, marginX + colW, currentY + rowHeaderH);
    doc.text("AFFECTED COMPONENT", marginX + colW + 2, currentY + 3.4);
    doc.line(marginX + colW * 2, currentY, marginX + colW * 2, currentY + rowHeaderH);
    doc.text("CURRENT STATUS", marginX + colW * 2 + 2, currentY + 3.4);
    currentY += rowHeaderH;

    // Row 2 Values
    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, rowValH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...cRed);
    doc.text(cleanText(data.cveId), marginX + 2, currentY + 4.1);
    doc.line(marginX + colW, currentY, marginX + colW, currentY + rowValH);
    doc.setTextColor(...cDarkBrown);
    doc.text(cleanText(data.affectedComp).slice(0, 38), marginX + colW + 2, currentY + 4.1);
    doc.line(marginX + colW * 2, currentY, marginX + colW * 2, currentY + rowValH);
    doc.setTextColor(...cRed);
    doc.text(cleanText(data.statusStr).slice(0, 42), marginX + colW * 2 + 2, currentY + 4.1);
    currentY += rowValH + 4;
  }

  // =========================================================================
  // 5. SECTION 3: KEY FINDINGS (Bulleted Card)
  // =========================================================================
  function renderKeyFindings() {
    console.log("KEY FINDINGS RENDER");
    drawSectionHeader("3", "What Happened & Key Findings", "Forensic Observations and Confirmed Incident Activity");

    let allLines = [];
    data.findings.forEach(item => {
      const formatted = `* ${cleanText(item)}`;
      const wrapped = doc.splitTextToSize(formatted, contentWidth - 8);
      allLines.push(...wrapped);
    });

    const boxH = allLines.length * 3.6 + 4;
    checkPageBreak(boxH);

    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, boxH, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...cDarkBrown);

    allLines.forEach((l, idx) => {
      if (l.startsWith('* ')) {
        doc.setFont("helvetica", "bold");
        doc.text(l.slice(0, 24), marginX + 3, currentY + 3.8 + idx * 3.6);
        doc.setFont("helvetica", "normal");
        doc.text(l.slice(24), marginX + 3 + doc.getTextWidth(l.slice(0, 24)), currentY + 3.8 + idx * 3.6);
      } else {
        doc.text(l, marginX + 5, currentY + 3.8 + idx * 3.6);
      }
    });

    currentY += boxH + 4;
  }

  // =========================================================================
  // 6. SECTION 4: BUSINESS & OPERATIONAL IMPACT
  // =========================================================================
  function renderImpact() {
    drawSectionHeader("4", "Business & Operational Impact", "Organizational Risk, Affected Operations, and Consequences");

    const imp = data.impact || {};
    const impactFields = [
      { label: "Affected Operations", text: imp.affected_operations || "Ingress remote access SSL VPN connectivity and enterprise perimeter gateways." },
      { label: "Affected Systems", text: imp.affected_systems || "Perimeter appliances and exposed domain controllers; downstream LAN segments exposed." },
      { label: "Potential Consequences", text: imp.potential_consequences || "Root/SYSTEM-level takeover, Active Directory domain reconnaissance, and internal network lateral traversal." },
      { label: "Current Operational Status", text: imp.status || "Immediate containment and quarantine active. Zero external database exfiltration confirmed to date." },
      { label: "Financial / Business Impact Figures", text: imp.financial_impact || "Not available in source material (strict ground truth preserved)." }
    ];

    let fieldLines = [];
    impactFields.forEach(f => {
      const full = `${f.label}: ${f.text}`;
      const wrapped = doc.splitTextToSize(cleanText(full), contentWidth - 8);
      fieldLines.push(...wrapped);
    });

    const boxH = fieldLines.length * 3.6 + 4;
    checkPageBreak(boxH);

    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, contentWidth, boxH, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...cDarkBrown);

    fieldLines.forEach((l, idx) => {
      const colonIdx = l.indexOf(':');
      if (colonIdx > 0 && colonIdx < 35) {
        doc.setFont("helvetica", "bold");
        doc.text(l.slice(0, colonIdx + 1), marginX + 3, currentY + 3.8 + idx * 3.6);
        doc.setFont("helvetica", "normal");
        doc.text(l.slice(colonIdx + 1), marginX + 3 + doc.getTextWidth(l.slice(0, colonIdx + 1)), currentY + 3.8 + idx * 3.6);
      } else {
        doc.text(l, marginX + 3, currentY + 3.8 + idx * 3.6);
      }
    });

    currentY += boxH + 4;
  }

  // =========================================================================
  // 7. SECTION 5: TECHNICAL DETAILS & VULNERABILITY PROFILE
  // =========================================================================
  function renderTechnicalGrid() {
    console.log("TECHNICAL DETAILS RENDER");
    drawSectionHeader("5", "Technical Details & Vulnerability Profile", "Root Cause Analysis & Exploitation Mechanics");

    const techRows = [
      ["VULNERABILITY IDENTIFIER", cleanText(data.cveId)],
      ["ATTACK VECTOR", "Unauthenticated Remote Network Access via Gateway Endpoint"],
      ["AFFECTED ENDPOINT / DLL", cleanText(data.affectedComp)],
      ["REQUIRED PRIVILEGES", "None (Unauthenticated Remote Execution)"],
      ["AFFECTED VERSIONS", "All unpatched enterprise deployments prior to latest emergency security release"]
    ];

    const labelW = 55;
    const valW = contentWidth - labelW;
    const rowH = 5.6;
    checkPageBreak(techRows.length * rowH + 4);

    techRows.forEach((r, idx) => {
      doc.setFillColor(...cSlate50);
      doc.setDrawColor(...cBorder);
      doc.rect(marginX, currentY, labelW, rowH, "FD");

      doc.setFillColor(...cWhite);
      doc.rect(marginX + labelW, currentY, valW, rowH, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      doc.setTextColor(...cBlack);
      doc.text(r[0], marginX + 2, currentY + 3.8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...cDarkBrown);
      doc.text(doc.splitTextToSize(r[1], valW - 4)[0], marginX + labelW + 2, currentY + 3.8);

      currentY += rowH;
    });

    currentY += 4;
  }

  // =========================================================================
  // 8. SECTION 6: ATTACK FLOW (Visual Connected Boxes)
  // =========================================================================
  function renderAttackFlow() {
    console.log("ATTACK FLOW RENDER");
    drawSectionHeader("6", "Attack Flow & Execution Sequence", "Step-by-Step Intrusion Progression");

    const steps = data.attackSteps.slice(0, 5);
    const boxCount = steps.length;
    const gap = 3;
    const boxW = (contentWidth - gap * (boxCount - 1)) / boxCount;
    const boxH = 9.5;

    checkPageBreak(boxH + 4);

    steps.forEach((step, idx) => {
      const bx = marginX + idx * (boxW + gap);
      doc.setFillColor(...cSlate50);
      doc.setDrawColor(...cBorder);
      doc.rect(bx, currentY, boxW, boxH, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...cRed);
      doc.text(`[ 0${idx + 1} ]`, bx + 2, currentY + 3.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...cDarkBrown);
      const stepName = doc.splitTextToSize(cleanText(step).toUpperCase(), boxW - 4)[0];
      doc.text(stepName, bx + 2, currentY + 7.2);
    });

    currentY += boxH + 4;
  }

  // =========================================================================
  // 9. SECTION 7: RESPONSE & REMEDIATION (2-Column Cards)
  // =========================================================================
  function renderResponse() {
    console.log("RESPONSE RENDER");
    drawSectionHeader("7", "Response & Remediation Actions", "Source-Supported Immediate Containment & Long-Term Guidance");

    const colW = (contentWidth - 3) / 2;
    const cardH = 26;
    checkPageBreak(cardH + 4);

    // Left Card: Immediate Actions
    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(marginX, currentY, colW, cardH, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...cBlack);
    doc.text("IMMEDIATE ACTIONS", marginX + 3, currentY + 4.5);

    const immItems = [
      "* Isolate affected gateway appliances from internet.",
      "* Apply emergency security updates KB5040442 / v4.5.3.",
      "* Block identified threat actor C2 indicators at firewall."
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(...cDarkBrown);
    immItems.forEach((item, idx) => {
      doc.text(item, marginX + 3, currentY + 9.5 + idx * 5);
    });

    // Right Card: Next Steps
    const rx = marginX + colW + 3;
    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cBorder);
    doc.rect(rx, currentY, colW, cardH, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...cBlack);
    doc.text("NEXT STEPS & MITIGATION", rx + 3, currentY + 4.5);

    const nextItems = [
      "* Audit system event telemetry for unauthorized services.",
      "* Rotate privileged domain access credentials.",
      "* Conduct active threat hunt for secondary web shells."
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(...cDarkBrown);
    nextItems.forEach((item, idx) => {
      doc.text(item, rx + 3, currentY + 9.5 + idx * 5);
    });

    currentY += cardH + 4;
  }

  // =========================================================================
  // RUN ALL MODULAR RENDERERS
  // =========================================================================
  renderHeader();
  renderMetadataGrid();
  renderSummary();
  renderThreatAtAGlance();
  renderKeyFindings();
  renderImpact();

  // Page Break for Page 2 Technical Sections
  doc.addPage();
  drawOuterFrame();
  drawRunningHeader();
  currentY = 20;

  renderTechnicalGrid();
  renderAttackFlow();
  renderResponse();

  // =========================================================================
  // 10. RUNNING FOOTER ON ALL PAGES
  // =========================================================================
  console.log("FOOTER RENDER");
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const footerY = 287;
    doc.setDrawColor(...cBorder);
    doc.setLineWidth(0.3);
    doc.line(marginX, footerY - 2, marginX + contentWidth, footerY - 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...cDarkBrown);
    doc.text("SYNTAXX AGENTIC INTELLIGENCE SUITE  |  EXECUTIVE BRIEFING", marginX, footerY + 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(`PAGE ${p} OF ${totalPages}`, marginX + contentWidth, footerY + 2, { align: "right" });
  }

  return doc.output("blob");
}

/**
 * Backwards-compatibility canvas exports
 */
export function exportInfographicAsPng(model, filename) {
  generateInfographicPdfBlob(model).then(blob => {
    downloadBlob(blob, filename || `${model.advisory_id || 'infographic'}_Visual_Briefing.pdf`);
  });
}

export function exportInfographicAsJpg(model, filename) {
  generateInfographicPdfBlob(model).then(blob => {
    downloadBlob(blob, filename || `${model.advisory_id || 'infographic'}_Visual_Briefing.pdf`);
  });
}
