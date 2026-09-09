/**
 * TransformAI Professional PowerPoint (.pptx) Presentation Generator
 * 
 * Generates publication-grade PowerPoint presentations from structured presentation data.
 * Zero raw Markdown. Native shapes, cards, arrows, tables, headers, footers, and embedded speaker notes.
 */

import pptxgen from "pptxgenjs";

// TransformAI Unified Visual Design System Palette Constants (PPTX Native RGB Hex)
export const C_BG          = "000000"; // Deep Obsidian Black Canvas (#000000)
export const C_CARD_BG     = "121212"; // Structural Card / Box Fill (Deep Onyx #121212)
export const C_PANEL_BG    = "181818"; // Secondary Panel / Sub-Card Fill (Deep Onyx #181818)
export const C_TEXT        = "FFFFFF"; // Primary Typography & Titles (Pure White #FFFFFF)
export const C_BODY_TEXT   = "E1DCC9"; // High-Legibility Body Text (Warm Cream #E1DCC9)
export const C_BORDER      = "DFD0B8"; // Structural Borders & Separators (Warm Sand Gold #DFD0B8)
export const C_BORDER_LIGHT= "DFD0B8"; // Warm Sand Gold Accent Border

// Semantic Aliases for PPTX Shape & Text Rendering
export const C_BG_LIGHT    = C_BG;     // Canvas Background
export const C_WHITE       = C_CARD_BG;// Structural Card Fill (#121212)
export const C_NAVY_DARK   = "FFFFFF"; // Primary Typography & Titles (Pure White)
export const C_NAVY_BLUE   = "FFFFFF"; // Heading Text (Pure White)
export const C_BLUE_ACCENT = "DFD0B8"; // Primary Accent / Badges (Warm Sand Gold)
export const C_BLUE_LIGHT  = C_PANEL_BG;// Tertiary / Sub-Card Fill (#181818)
export const C_SLATE_DARK  = "E1DCC9"; // High-Legibility Body Text (Warm Cream)
export const C_SLATE_MUTED = "A0A0A0"; // Subtitles & Metadata (Muted Grey #A0A0A0)
export const C_RED_DARK    = "FFFFFF"; // Critical Alert Text
export const C_RED_LIGHT   = "8B1E1E"; // Critical Alert Fill (Dark Red)
export const C_AMBER_DARK  = "000000"; // Warning Alert Text
export const C_AMBER_LIGHT = "DFD0B8"; // Warning Alert Fill (Warm Sand Gold)
export const C_GREEN_DARK  = "FFFFFF"; // Verified Text
export const C_GREEN_LIGHT = "235E35"; // Verified Fill (Editorial Green)

// Centralized PPTX Theme Definition
export const PPTX_THEME = {
  background: C_BG,
  cardBackground: C_CARD_BG,
  panelBackground: C_PANEL_BG,
  text: C_TEXT,
  bodyText: C_BODY_TEXT,
  border: C_BORDER,
  borderLight: C_BORDER_LIGHT,
  muted: C_SLATE_MUTED,
  critical: C_RED_LIGHT,
  warning: C_AMBER_LIGHT,
  success: C_GREEN_LIGHT
};

// Native PPTX shape type identifiers
const SHAPE_RECT = "rect";
const SHAPE_ROUND_RECT = "roundRect";

/**
 * Adds running header, footer, and source citation to a slide.
 */
function addSlideDecorations(slide, slideData, totalSlides, advisoryId, tlp) {
  // Footer divider line
  slide.addShape(SHAPE_RECT, {
    x: 0.6, y: 5.0, w: 8.8, h: 0.02,
    fill: { color: C_BORDER }, line: { color: C_BORDER }
  });

  // Footer text - Left
  slide.addText(`SYNTAXX AGENTIC INTELLIGENCE SUITE  |  ADVISORY ID: ${advisoryId}`, {
    x: 0.6, y: 5.1, w: 6.0, h: 0.3,
    fontSize: 8, color: C_SLATE_MUTED, fontFace: "Arial"
  });

  // Footer text - Right (TLP & Page Number)
  slide.addText(`${tlp}  |  SLIDE ${slideData.slide_number} OF ${totalSlides}`, {
    x: 6.6, y: 5.1, w: 2.8, h: 0.3,
    fontSize: 8, bold: true, color: C_SLATE_MUTED, align: "right", fontFace: "Arial"
  });

  // Source Citation Pill (top right)
  const citation = (slideData.citations && slideData.citations[0]) || `[Source: ${advisoryId}]`;
  slide.addText(citation, {
    x: 6.5, y: 0.35, w: 2.9, h: 0.28,
    fontSize: 8, italic: true, color: C_SLATE_MUTED, align: "right", fontFace: "Arial"
  });
}

/**
 * Adds slide title and subtitle with standard positioning.
 */
function addSlideHeader(slide, title, subtitle, category = "THREAT INTELLIGENCE") {
  // Category badge
  slide.addText(category.toUpperCase(), {
    x: 0.6, y: 0.35, w: 4.5, h: 0.25,
    fontSize: 8, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
  });

  // Slide Title
  slide.addText(title, {
    x: 0.6, y: 0.6, w: 8.5, h: 0.45,
    fontSize: 20, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.05, w: 8.5, h: 0.3,
      fontSize: 10, color: C_SLATE_MUTED, fontFace: "Arial"
    });
  }
}

/**
 * Generates and triggers download of a publication-grade PPTX file.
 */
export async function generatePresentationPptx(presentationData, filenameOverride = null) {
  const pres = presentationData?.presentation || presentationData;
  const slides = pres?.slides || [];
  const advisoryId = pres?.advisory_id || "CTI-SX-2026-017";
  const tlp = pres?.classification || "TLP:AMBER+STRICT";
  const totalSlides = slides.length;

  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pptx.author = "SyntaxX Agentic Intelligence Engine";
  pptx.title = pres.title || "Presentation Slides & Notes";

  // Slide Masters
  pptx.defineSlideMaster({
    title: "SYNTAXX_EDITORIAL",
    background: { color: C_BG_LIGHT }
  });

  // Generate each slide based on its layout
  slides.forEach((s) => {
    const slide = pptx.addSlide({ masterName: "SYNTAXX_EDITORIAL" });

    // Embed professional speaker notes into the PowerPoint slide notes
    if (s.speaker_notes) {
      slide.addNotes(s.speaker_notes);
    }

    // SLIDE 1: TITLE / THREAT IDENTIFICATION
    if (s.layout === "title") {
      // Decorative top accent bar
      slide.addShape(SHAPE_RECT, {
        x: 0.0, y: 0.0, w: 10.0, h: 0.15,
        fill: { color: C_BLUE_ACCENT }
      });

      // Classification Badge
      slide.addText(tlp, {
        x: 0.8, y: 0.8, w: 2.4, h: 0.35,
        fontSize: 9, bold: true, color: C_AMBER_DARK,
        fill: { color: C_AMBER_LIGHT }, align: "center", fontFace: "Arial",
        rectRadius: 0.05
      });

      // Main Title
      slide.addText(s.title || "Incident Briefing", {
        x: 0.8, y: 1.35, w: 8.4, h: 0.85,
        fontSize: 30, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
      });

      // Subtitle
      slide.addText(s.subtitle || "Technical Advisory Briefing", {
        x: 0.8, y: 2.2, w: 8.4, h: 0.5,
        fontSize: 15, color: C_BLUE_ACCENT, fontFace: "Arial"
      });

      // Metadata Cards Grid (5 boxes)
      const metaItems = [
        { label: "ADVISORY ID", value: advisoryId },
        { label: "ISSUE DATE", value: s.metadata?.date || "08 Sep 2026" },
        { label: "SEVERITY", value: s.metadata?.severity || "CRITICAL" },
        { label: "CONFIDENCE", value: s.metadata?.confidence || "HIGH CONFIDENCE" },
        { label: "CLASSIFICATION", value: tlp }
      ];

      metaItems.forEach((item, idx) => {
        const xPos = 0.8 + idx * 1.72;
        slide.addShape(SHAPE_ROUND_RECT, {
          x: xPos, y: 2.85, w: 1.6, h: 0.85,
          fill: { color: C_CARD_BG },
          line: { color: C_BORDER, width: 1 },
          rectRadius: 0.06
        });
        slide.addText(item.label, {
          x: xPos + 0.1, y: 2.92, w: 1.4, h: 0.25,
          fontSize: 7.5, bold: true, color: C_SLATE_MUTED, fontFace: "Arial"
        });
        slide.addText(item.value, {
          x: xPos + 0.1, y: 3.2, w: 1.4, h: 0.4,
          fontSize: 9.5, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
        });
      });

      // Bottom Callout Box
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.8, y: 4.0, w: 8.4, h: 0.95,
        fill: { color: C_WHITE },
        line: { color: C_BLUE_ACCENT, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addText("PRIMARY INCIDENT VERDICT", {
        x: 1.0, y: 4.1, w: 8.0, h: 0.25,
        fontSize: 8, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });
      slide.addText(s.summary_line || s.content?.headline || "Targeted Infiltration and Boundary Control Bypass", {
        x: 1.0, y: 4.38, w: 8.0, h: 0.45,
        fontSize: 11, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
      });

      return;
    }

    // Standard Slide Decorator for Slides 2-11
    addSlideDecorations(slide, s, totalSlides, advisoryId, tlp);
    addSlideHeader(slide, s.title, s.subtitle, s.category);

    // SLIDE 2: THREAT OVERVIEW
    if (s.layout === "threat_overview" || s.layout === "executive_summary") {
      const attrs = s.content?.attributes || [
        { label: "Threat Type", value: s.content?.threat_type || "Incident Threat Briefing" },
        { label: "Severity", value: s.content?.severity || "CRITICAL", alert: true },
        { label: "Confidence", value: s.content?.confidence || "HIGH" },
        { label: "Affected Technology", value: s.content?.affected_technology || "Enterprise Infrastructure" },
        { label: "Threat Actor", value: s.content?.threat_actor || "Unattributed Adversary" },
        { label: "Malware / Tooling", value: s.content?.malware || "Unspecified Tooling" }
      ];

      // 6 Parameter Cards across a clean 2x3 Grid
      attrs.forEach((item, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const xPos = 0.6 + col * 4.5;
        const yPos = 1.45 + row * 1.1;

        const bgCol = item.alert ? C_RED_LIGHT : C_WHITE;
        const lineCol = item.alert ? C_RED_DARK : C_BORDER;
        const valCol = item.alert ? C_RED_DARK : C_NAVY_DARK;

        slide.addShape(SHAPE_ROUND_RECT, {
          x: xPos, y: yPos, w: 4.3, h: 0.98,
          fill: { color: bgCol }, line: { color: lineCol, width: 0.75 }, rectRadius: 0.06
        });
        slide.addText(item.label.toUpperCase(), {
          x: xPos + 0.2, y: yPos + 0.1, w: 3.9, h: 0.22,
          fontSize: 8.5, bold: true, color: C_SLATE_MUTED, fontFace: "Arial"
        });
        slide.addText(item.value, {
          x: xPos + 0.2, y: yPos + 0.36, w: 3.9, h: 0.5,
          fontSize: 12, bold: true, color: valCol, fontFace: "Arial"
        });
      });
    }

    // SLIDE 3: VULNERABILITY
    else if (s.layout === "vulnerability") {
      const c = s.content || {};

      // Top Vulnerability Banner
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.6, y: 1.45, w: 8.8, h: 0.82,
        fill: { color: C_RED_LIGHT }, line: { color: C_RED_DARK, width: 1.0 }, rectRadius: 0.05
      });
      slide.addText(`CVE-2026-88421  |  Remote Code Execution`, {
        x: 0.8, y: 1.52, w: 8.4, h: 0.32,
        fontSize: 13, bold: true, color: C_RED_DARK, fontFace: "Arial"
      });
      slide.addText(`Component: ${c.affected_component || "OrionGate Web Gateway"}  |  Versions: ${c.affected_versions || "7.2.x, 7.3.x"}`, {
        x: 0.8, y: 1.88, w: 8.4, h: 0.3,
        fontSize: 9.5, color: C_SLATE_DARK, fontFace: "Arial"
      });

      // 4 Metric Cards in a 2x2 grid
      const metrics = [
        { label: "AFFECTED COMPONENT", value: c.affected_component || "OrionGate Web Gateway" },
        { label: "AFFECTED VERSIONS", value: c.affected_versions || "7.2.x, 7.3.x (7.4.x potentially affected)" },
        { label: "ATTACK COMPLEXITY", value: c.attack_complexity || "Low", highlight: true },
        { label: "PRIVILEGES / USER INTERACTION", value: `Privileges: ${c.privileges_required || "None"}  |  User Interaction: ${c.user_interaction || "None"}`, highlight: true }
      ];

      metrics.forEach((m, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const xPos = 0.6 + col * 4.5;
        const yPos = 2.45 + row * 0.95;

        slide.addShape(SHAPE_ROUND_RECT, {
          x: xPos, y: yPos, w: 4.3, h: 0.85,
          fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.05
        });
        slide.addText(m.label, {
          x: xPos + 0.15, y: yPos + 0.08, w: 4.0, h: 0.22,
          fontSize: 8, bold: true, color: C_SLATE_MUTED, fontFace: "Arial"
        });
        slide.addText(m.value, {
          x: xPos + 0.15, y: yPos + 0.34, w: 4.0, h: 0.42,
          fontSize: 10, bold: true, color: m.highlight ? C_BLUE_ACCENT : C_NAVY_DARK, fontFace: "Arial"
        });
      });

      // Bottom Root Cause Callout
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.6, y: 4.45, w: 8.8, h: 0.48,
        fill: { color: C_WHITE }, line: { color: C_BLUE_ACCENT, width: 0.75 }, rectRadius: 0.05
      });
      slide.addText(`Root Cause Summary: ${c.technical_summary || "Unsafe deserialization of multipart POST payloads submitted to the web gateway endpoint."}`, {
        x: 0.8, y: 4.5, w: 8.4, h: 0.38,
        fontSize: 8.5, color: C_SLATE_DARK, fontFace: "Arial"
      });
    }

    // SLIDE 4: AFFECTED SYSTEMS & SCOPE
    else if (s.layout === "affected_systems") {
      const c = s.content || {};

      // Left Column: Affected Products & Software Versions (Width: 4.3")
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.6, y: 1.45, w: 4.3, h: 3.3,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("AFFECTED PRODUCTS & SOFTWARE VERSIONS", {
        x: 0.8, y: 1.6, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });
      slide.addText(c.product || "OrionGate Secure Access Server", {
        x: 0.8, y: 1.95, w: 3.9, h: 0.4,
        fontSize: 14, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
      });
      slide.addText("Impacted Software Versions:", {
        x: 0.8, y: 2.45, w: 3.9, h: 0.25,
        fontSize: 9, bold: true, color: C_SLATE_MUTED, fontFace: "Arial"
      });
      const vers = c.versions || ["7.2.x", "7.3.x", "7.4.x (potentially affected)"];
      vers.forEach((v, idx) => {
        slide.addText(`• Version ${v}`, {
          x: 0.8, y: 2.75 + idx * 0.35, w: 3.9, h: 0.3,
          fontSize: 9.5, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });
      slide.addText("Scope Note: Boundary appliances exposed to the public internet.", {
        x: 0.8, y: 4.15, w: 3.9, h: 0.45,
        fontSize: 8, italic: true, color: C_SLATE_MUTED, fontFace: "Arial"
      });

      // Right Column: Target Industry Sectors (Width: 4.3", x: 5.1)
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 5.1, y: 1.45, w: 4.3, h: 3.3,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("TARGET INDUSTRY SECTORS", {
        x: 5.3, y: 1.6, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });

      const sectors = c.target_sectors || [
        "Government",
        "Defence",
        "Critical Infrastructure",
        "Telecommunications",
        "Research",
        "Financial Services"
      ];

      sectors.forEach((sec, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const bx = 5.3 + col * 1.95;
        const by = 2.0 + row * 0.8;

        slide.addShape(SHAPE_ROUND_RECT, {
          x: bx, y: by, w: 1.85, h: 0.65,
          fill: { color: C_BLUE_LIGHT }, line: { color: C_BORDER, width: 0.5 }, rectRadius: 0.04
        });
        slide.addText(sec, {
          x: bx + 0.1, y: by + 0.15, w: 1.65, h: 0.35,
          fontSize: 9, bold: true, color: C_BLUE_ACCENT, align: "center", fontFace: "Arial"
        });
      });
    }

    // SLIDE 5: ATTACK CHAIN
    else if (s.layout === "attack_chain") {
      const stages = s.content?.stages || [];
      // 8 stages across 2 rows of 4 horizontal cards
      stages.forEach((st, idx) => {
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const xPos = 0.6 + col * 2.25;
        const yPos = 1.55 + row * 1.6;

        slide.addShape(SHAPE_ROUND_RECT, {
          x: xPos, y: yPos, w: 2.05, h: 1.35,
          fill: { color: C_WHITE }, line: { color: C_BLUE_ACCENT, width: 0.75 }, rectRadius: 0.06
        });
        // Stage number badge
        slide.addShape(SHAPE_RECT, {
          x: xPos, y: yPos, w: 0.45, h: 0.28,
          fill: { color: C_NAVY_DARK }
        });
        slide.addText(`${idx + 1}`, {
          x: xPos, y: yPos + 0.02, w: 0.45, h: 0.25,
          fontSize: 9, bold: true, color: C_WHITE, align: "center", fontFace: "Arial"
        });
        slide.addText(st.stage, {
          x: xPos + 0.5, y: yPos + 0.02, w: 1.45, h: 0.35,
          fontSize: 9, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
        });
        slide.addText(st.detail, {
          x: xPos + 0.1, y: yPos + 0.42, w: 1.85, h: 0.85,
          fontSize: 7.8, color: C_SLATE_DARK, fontFace: "Arial", lineSpacing: 11
        });

        // Horizontal arrows between columns 0, 1, 2
        if (col < 3) {
          slide.addText("→", {
            x: xPos + 2.05, y: yPos + 0.45, w: 0.2, h: 0.3,
            fontSize: 14, bold: true, color: C_BLUE_ACCENT, align: "center", fontFace: "Arial"
          });
        }
      });
    }

    // SLIDE 6: THREAT ACTOR & CAMPAIGN
    else if (s.layout === "threat_actor") {
      const c = s.content || {};

      // Left Column: Actor Intelligence Card (Width: 4.3")
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.6, y: 1.45, w: 4.3, h: 3.3,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("ADVERSARY DESIGNATION", {
        x: 0.8, y: 1.6, w: 3.9, h: 0.25,
        fontSize: 8, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });
      slide.addText(c.actor || "Unattributed Adversary", {
        x: 0.8, y: 1.85, w: 3.9, h: 0.4,
        fontSize: 16, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
      });

      const actorProps = [
        { l: "Known Aliases", v: c.aliases || "N/A" },
        { l: "Campaign", v: c.campaign || "Targeted Campaign" },
        { l: "Motivation", v: c.motivation || "System Compromise & Unauthorized Access" },
        { l: "Attribution Confidence", v: c.attribution_confidence || "Medium-High Confidence" }
      ];
      actorProps.forEach((p, idx) => {
        const py = 2.35 + idx * 0.55;
        slide.addText(p.l, {
          x: 0.8, y: py, w: 3.9, h: 0.2,
          fontSize: 8, bold: true, color: C_SLATE_MUTED, fontFace: "Arial"
        });
        slide.addText(p.v, {
          x: 0.8, y: py + 0.2, w: 3.9, h: 0.3,
          fontSize: 9.5, bold: true, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });

      // Right Column Top: Target Sectors
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 5.1, y: 1.45, w: 4.3, h: 1.55,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("TARGET PROFILE & SECTOR EXPOSURE", {
        x: 5.3, y: 1.55, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
      });
      const targets = c.target_profile || ["Government", "Defence", "Critical Infrastructure", "Research & Telecom"];
      targets.forEach((t, idx) => {
        slide.addText(`• ${t}`, {
          x: 5.3, y: 1.82 + idx * 0.28, w: 3.9, h: 0.25,
          fontSize: 8.5, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });

      // Right Column Bottom: Tactics & TTPs
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 5.1, y: 3.15, w: 4.3, h: 1.6,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("KEY ADVERSARY TECHNIQUES (TTPs)", {
        x: 5.3, y: 3.25, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
      });
      const ttps = c.ttps || ["Zero-day edge appliance exploitation", "DLL side-loading via ogupdate.dll", "Masquerading as vendor update service", "Encrypted HTTPS C2 beaconing"];
      ttps.forEach((t, idx) => {
        slide.addText(`• ${t}`, {
          x: 5.3, y: 3.52 + idx * 0.28, w: 3.9, h: 0.25,
          fontSize: 8.5, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });
    }

    // SLIDE 7: INDICATORS OF COMPROMISE (IOCs)
    else if (s.layout === "ioc_table") {
      const c = s.content || {};

      // 4 Quadrants
      // Q1: Network Indicators (top left)
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.6, y: 1.45, w: 4.3, h: 1.6,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("IP ADDRESSES (C2 & STAGING)", {
        x: 0.8, y: 1.55, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });
      (c.network || []).forEach((n, idx) => {
        slide.addText(`• ${n.indicator} — ${n.context}`, {
          x: 0.8, y: 1.82 + idx * 0.38, w: 3.9, h: 0.35,
          fontSize: 8, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });

      // Q2: Domains & URLs (top right)
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 5.1, y: 1.45, w: 4.3, h: 1.6,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("DOMAINS & URLS (EXACT DEFANGED)", {
        x: 5.3, y: 1.55, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });
      (c.domains || []).forEach((d, idx) => {
        slide.addText(`• ${d.indicator} (${d.context})`, {
          x: 5.3, y: 1.82 + idx * 0.45, w: 3.9, h: 0.4,
          fontSize: 8, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });

      // Q3: Files & Hashes (bottom left)
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.6, y: 3.15, w: 4.3, h: 1.65,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("FILE ARTIFACTS & SHA-256 HASHES", {
        x: 0.8, y: 3.25, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });
      (c.files_and_hashes || []).forEach((f, idx) => {
        const fy = 3.52 + idx * 0.6;
        slide.addText(`• ${f.name} (${f.type}):`, {
          x: 0.8, y: fy, w: 3.9, h: 0.2,
          fontSize: 8, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
        });
        slide.addText(`  SHA-256: ${f.hash}`, {
          x: 0.8, y: fy + 0.2, w: 3.9, h: 0.35,
          fontSize: 6.8, color: C_SLATE_DARK, fontFace: "Courier New"
        });
      });

      // Q4: Persistence Mechanisms (bottom right)
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 5.1, y: 3.15, w: 4.3, h: 1.65,
        fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
      });
      slide.addText("PERSISTENCE & SYSTEM ARTIFACTS", {
        x: 5.3, y: 3.25, w: 3.9, h: 0.25,
        fontSize: 8.5, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
      });
      (c.persistence || []).forEach((p, idx) => {
        const py = 3.52 + idx * 0.6;
        slide.addText(`• ${p.indicator} (${p.type}):`, {
          x: 5.3, y: py, w: 3.9, h: 0.2,
          fontSize: 8, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
        });
        slide.addText(`  ${p.context}`, {
          x: 5.3, y: py + 0.2, w: 3.9, h: 0.35,
          fontSize: 7.8, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });
    }

    // SLIDE 8: ATTACK TIMELINE
    else if (s.layout === "timeline") {
      const events = s.content?.events || [];

      // 6 Horizontal Milestone Cards across 2 rows of 3
      events.slice(0, 6).forEach((ev, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const xPos = 0.6 + col * 3.0;
        const yPos = 1.65 + row * 1.6;

        slide.addShape(SHAPE_ROUND_RECT, {
          x: xPos, y: yPos, w: 2.8, h: 1.35,
          fill: { color: C_WHITE }, line: { color: C_BLUE_ACCENT, width: 0.75 }, rectRadius: 0.06
        });
        // Date badge
        slide.addShape(SHAPE_RECT, {
          x: xPos, y: yPos, w: 1.2, h: 0.28,
          fill: { color: C_BLUE_ACCENT }
        });
        slide.addText(ev.date, {
          x: xPos, y: yPos + 0.02, w: 1.2, h: 0.25,
          fontSize: 8, bold: true, color: C_WHITE, align: "center", fontFace: "Arial"
        });
        slide.addText(ev.event, {
          x: xPos + 0.1, y: yPos + 0.35, w: 2.6, h: 0.35,
          fontSize: 9, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
        });
        slide.addText(ev.detail, {
          x: xPos + 0.1, y: yPos + 0.72, w: 2.6, h: 0.55,
          fontSize: 8, color: C_SLATE_DARK, fontFace: "Arial", lineSpacing: 11
        });
      });
    }

    // SLIDE 9: DETECTION & MONITORING
    else if (s.layout === "detection") {
      const pillars = s.content?.pillars || [];
      // 3 Columns across 8.8" width
      pillars.forEach((p, idx) => {
        const xPos = 0.6 + idx * 3.0;
        slide.addShape(SHAPE_ROUND_RECT, {
          x: xPos, y: 1.45, w: 2.8, h: 3.3,
          fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
        });
        slide.addShape(SHAPE_RECT, {
          x: xPos, y: 1.45, w: 2.8, h: 0.45,
          fill: { color: C_NAVY_DARK }
        });
        slide.addText(p.domain, {
          x: xPos + 0.1, y: 1.52, w: 2.6, h: 0.35,
          fontSize: 8.5, bold: true, color: C_WHITE, align: "center", fontFace: "Arial"
        });
        (p.rules || []).forEach((r, rIdx) => {
          slide.addText(`• ${r}`, {
            x: xPos + 0.15, y: 2.05 + rIdx * 0.85, w: 2.5, h: 0.78,
            fontSize: 8, color: C_SLATE_DARK, fontFace: "Arial", lineSpacing: 12
          });
        });
      });
    }

    // SLIDE 10: RESPONSE & REMEDIATION
    else if (s.layout === "recommendations") {
      const tiers = s.content?.tiers || [];
      // 3 Horizontal Priority Rows
      tiers.forEach((t, idx) => {
        const yPos = 1.45 + idx * 1.15;
        const colHeaderBg = t.color === "red" ? C_RED_LIGHT : (t.color === "amber" ? C_AMBER_LIGHT : C_BLUE_LIGHT);
        const colHeaderTxt = t.color === "red" ? C_RED_DARK : (t.color === "amber" ? C_AMBER_DARK : C_BLUE_ACCENT);

        slide.addShape(SHAPE_ROUND_RECT, {
          x: 0.6, y: yPos, w: 8.8, h: 1.05,
          fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.05
        });

        // Left Tag block
        slide.addShape(SHAPE_RECT, {
          x: 0.6, y: yPos, w: 2.2, h: 1.05,
          fill: { color: colHeaderBg }
        });
        slide.addText(t.level, {
          x: 0.7, y: yPos + 0.15, w: 2.0, h: 0.35,
          fontSize: 10, bold: true, color: colHeaderTxt, fontFace: "Arial"
        });
        slide.addText(t.badge, {
          x: 0.7, y: yPos + 0.5, w: 2.0, h: 0.45,
          fontSize: 7.5, bold: true, color: C_SLATE_MUTED, fontFace: "Arial"
        });

        // Right Action Items
        (t.actions || []).forEach((act, actIdx) => {
          const actCol = actIdx % 2;
          const actRow = Math.floor(actIdx / 2);
          const ax = 2.9 + actCol * 3.25;
          const ay = yPos + 0.1 + actRow * 0.45;
          slide.addText(`• ${act}`, {
            x: ax, y: ay, w: 3.15, h: 0.4,
            fontSize: 7.8, color: C_SLATE_DARK, fontFace: "Arial", lineSpacing: 11
          });
        });
      });
    }

    // SLIDE 11: KEY TAKEAWAYS
    else if (s.layout === "key_takeaways") {
      const c = s.content || {};

      // 4 Decision Pillars (2x2 Grid)
      (c.pillars || []).forEach((pil, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const xPos = 0.6 + col * 4.5;
        const yPos = 1.45 + row * 1.15;

        slide.addShape(SHAPE_ROUND_RECT, {
          x: xPos, y: yPos, w: 4.3, h: 1.05,
          fill: { color: C_WHITE }, line: { color: C_BORDER, width: 0.75 }, rectRadius: 0.06
        });
        slide.addText(pil.label, {
          x: xPos + 0.15, y: yPos + 0.1, w: 4.0, h: 0.22,
          fontSize: 8, bold: true, color: C_BLUE_ACCENT, fontFace: "Arial"
        });
        slide.addText(pil.value, {
          x: xPos + 0.15, y: yPos + 0.32, w: 4.0, h: 0.3,
          fontSize: 10.5, bold: true, color: C_NAVY_DARK, fontFace: "Arial"
        });
        slide.addText(pil.detail, {
          x: xPos + 0.15, y: yPos + 0.62, w: 4.0, h: 0.35,
          fontSize: 8, color: C_SLATE_DARK, fontFace: "Arial"
        });
      });

      // Governance Callout Banner (Bottom)
      slide.addShape(SHAPE_ROUND_RECT, {
        x: 0.6, y: 3.9, w: 8.8, h: 0.95,
        fill: { color: C_GREEN_LIGHT }, line: { color: C_GREEN_DARK, width: 1.0 }, rectRadius: 0.06
      });
      slide.addText("OPERATIONAL GOVERNANCE & MANDATORY AUTHORIZATION", {
        x: 0.8, y: 3.98, w: 8.4, h: 0.25,
        fontSize: 9, bold: true, color: C_GREEN_DARK, fontFace: "Arial"
      });
      slide.addText(c.governance_notice || "Human review and approval required before operational dissemination.", {
        x: 0.8, y: 4.25, w: 8.4, h: 0.28,
        fontSize: 8.5, bold: true, color: C_SLATE_DARK, fontFace: "Arial"
      });
      slide.addText(`Verification Audit Reference: ${c.audit_reference || advisoryId}`, {
        x: 0.8, y: 4.55, w: 8.4, h: 0.25,
        fontSize: 7.5, italic: true, color: C_SLATE_MUTED, fontFace: "Arial"
      });
    }
  });

  const finalName = filenameOverride || `${advisoryId}_Presentation_Slides_and_Notes.pptx`;
  await pptx.writeFile({ fileName: finalName });
  return finalName;
}
