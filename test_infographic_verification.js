import { buildStructuredInfographic, formatInfographicText, formatInfographicMarkdown } from "./src/services/infographicModel.js";

function runTests() {
  console.log("=== STARTING INFOGRAPHIC MODEL VALIDATION ===");

  // TEST 1: Source B (CVE-2024-38077)
  console.log("\n--- Testing Source B: CVE-2024-38077 ---");
  const docB = {
    id: "cybersecurity",
    title: "Cybersecurity Incident & Advisory: CVE-2024-38077 Zero-Day RCE",
    content: "Critical RCE in Windows Remote Desktop Licensing service termsrv.dll listening on TCP port 135. Threat actors staging Cobalt Strike and LockBit 4.0. Emergency update KB5040442."
  };
  const modelB = buildStructuredInfographic(docB.content, {}, docB);
  console.log("Title:", modelB.title);
  console.log("Metrics count:", modelB.metrics.length);
  console.log("Sections count:", modelB.sections.length);

  // Assertions for B
  if (!modelB.title.includes("38077")) throw new Error("Model B title missing CVE-2024-38077");
  if (JSON.stringify(modelB).includes("NightFalcon")) throw new Error("NightFalcon leaked into CVE-2024-38077 model!");
  if (JSON.stringify(modelB).includes("OrionGate")) throw new Error("OrionGate leaked into CVE-2024-38077 model!");
  if (JSON.stringify(modelB).includes("%%%%%")) throw new Error("Corrupt %%%%% found in Model B!");

  const textB = formatInfographicText(modelB);
  if (textB.includes("###") || textB.includes("**") || textB.includes("%%%%%")) {
    throw new Error("Raw markdown or %%%%% leaked into text formatting of Model B!");
  }
  console.log("✓ Source B (CVE-2024-38077) Passed with Zero Bleed and Clean Formatting");

  // TEST 2: Source A (NightFalcon)
  console.log("\n--- Testing Source A: Operation NightFalcon ---");
  const docA = {
    id: "nightfalcon",
    title: "Operation NightFalcon: Targeted Exploitation of OrionGate Web Gateways",
    content: "Pre-auth RCE flaw CVE-2026-88421 in OrionGate Web Gateways. Adversary Obsidian Kite drops nfsvc.exe and beaconing to 91.203.18.77."
  };
  const modelA = buildStructuredInfographic(docA.content, {}, docA);
  console.log("Title:", modelA.title);
  if (!modelA.title.includes("NIGHTFALCON")) throw new Error("Model A title missing NIGHTFALCON");
  if (!JSON.stringify(modelA).includes("Obsidian Kite")) throw new Error("Model A missing threat actor");
  if (JSON.stringify(modelA).includes("%%%%%")) throw new Error("Corrupt %%%%% found in Model A!");
  console.log("✓ Source A (Operation NightFalcon) Passed");

  // TEST 3: Source C (Health Policy Advisory)
  console.log("\n--- Testing Source C: Public Health Emergency Advisory ---");
  const docC = {
    id: "health_advisory",
    title: "Public Health Emergency Advisory: Novel Pathogen H5-V2",
    content: "Emerging viral respiratory syndrome H5-V2. High aerosol transmissibility with R0 3.2. Mandatory triage, N95 masks, negative pressure isolation."
  };
  const modelC = buildStructuredInfographic(docC.content, {}, docC);
  console.log("Title:", modelC.title);
  console.log("Headline metric:", modelC.headline_metric);
  if (!modelC.title.includes("H5-V2")) throw new Error("Model C title missing H5-V2");
  if (JSON.stringify(modelC).includes("NightFalcon")) throw new Error("NightFalcon leaked into Health Advisory!");
  if (JSON.stringify(modelC).includes("38077")) throw new Error("CVE-2024-38077 leaked into Health Advisory!");
  if (JSON.stringify(modelC).includes("%%%%%")) throw new Error("Corrupt %%%%% found in Model C!");
  console.log("✓ Source C (Health Advisory) Passed with Zero Bleed");

  // TEST 4: Source D (Research Paper)
  console.log("\n--- Testing Source D: Research Paper ---");
  const docD = {
    id: "research_paper",
    title: "Research Paper: Parallel Multi-Agent LLM Orchestration via Directed Acyclic Graphs",
    content: "Decentralized task decomposition for complex reasoning benchmarks. Evaluates DAG workflows vs sequential chains across MMLU-Pro and SWE-bench."
  };
  const modelD = buildStructuredInfographic(docD.content, {}, docD);
  console.log("Title:", modelD.title);
  console.log("Headline metric:", modelD.headline_metric);
  if (!modelD.title.includes("AGENTIC") && !modelD.subtitle.includes("Parallel")) throw new Error("Model D missing AGENTIC or Parallel");
  if (JSON.stringify(modelD).includes("NightFalcon")) throw new Error("NightFalcon leaked into Research Paper!");
  if (JSON.stringify(modelD).includes("38077")) throw new Error("CVE-2024-38077 leaked into Research Paper!");
  if (JSON.stringify(modelD).includes("%%%%%")) throw new Error("Corrupt %%%%% found in Model D!");
  console.log("✓ Source D (Research Paper) Passed with Zero Bleed");

  console.log("\n=== ALL 4 SOURCE INFOGRAPHIC MODELS VALIDATED SUCCESSFULLY ===");
}

runTests();
