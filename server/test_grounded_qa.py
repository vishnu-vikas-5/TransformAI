"""
Test Suite for Grounded AI Q&A Pipeline (Parts 9 & 10 Verification)
Tests Direct, Paraphrased, Specific, Out-of-Document, Hallucination, Multi-hop,
Exact Factual, and Contradiction queries against a Quantum Computing lab worksheet.
"""

import asyncio
import os
import sys

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from dotenv import load_dotenv

# Ensure server path is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

from main import grounded_chat_qa, ChatRequest

# Representative Quantum Computing Lab Worksheet text with realistic page markers and sections
SAMPLE_QUANTUM_WORKSHEET = """[Page 1]
DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
AMRITA VISHWA VIDYAPEETHAM, COIMBATORE, TAMIL NADU
COURSE: 19CSE456 QUANTUM COMPUTING LABORATORY
STUDENT REGISTRATION: CH.SC.U4CSE24115
EXPERIMENT 1: FUNDAMENTAL QUANTUM LOGIC GATES AND BELL STATE SYNTHESIS

1. AIM OF THE EXPERIMENT
The aim of this worksheet is to understand and implement fundamental quantum logic gates (Pauli-X, Hadamard, and CNOT) using Qiskit, construct quantum circuits to generate entangled Bell states, and analyze the measurement probability distribution on a quantum simulator.

2. SYSTEM AND ENVIRONMENT PREREQUISITES
- Python Version Requirement: Python 3.10 or higher is required for Qiskit SDK compatibility.
- Required Libraries: qiskit>=1.0.0, qiskit-aer>=0.13.0, matplotlib.
- Execution Environment: Jupyter Notebook / Python Virtual Environment.

[Page 2]
3. THEORY AND WORKING PRINCIPLES

3.1 Single-Qubit Quantum Gates
The Hadamard (H) gate transforms standard computational basis states |0⟩ and |1⟩ into equal superposition states (|0⟩ + |1⟩)/√2 and (|0⟩ - |1⟩)/√2 respectively.

3.2 Two-Qubit Entangling Gates: Controlled-NOT (CNOT) Gate
The Controlled-NOT (CNOT) gate is a two-qubit quantum gate consisting of a control qubit and a target qubit. When the control qubit is in the state |1⟩, the target qubit is inverted (flipped via Pauli-X); when the control qubit is in the state |0⟩, the target qubit remains unchanged.
The CNOT gate is fundamental for generating quantum entanglement. Together with the Hadamard gate, it is used to generate the maximally entangled Bell states.

3.3 Bell State Generation
To construct the Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2, the quantum circuit applies a Hadamard gate to qubit 0, followed by a CNOT gate with qubit 0 acting as control and qubit 1 acting as target.

[Page 3]
4. EXPERIMENTAL PROCEDURE AND OBSERVATIONS
Step 1: Initialize a QuantumCircuit with 2 quantum bits and 2 classical bits.
Step 2: Apply the Hadamard gate to q[0].
Step 3: Apply the CNOT gate using control q[0] and target q[1].
Step 4: Apply measurement operators mapping qubits to classical registers.
Step 5: Execute 1024 shots on the AerSimulator and plot the output histogram.

5. CONCLUSION AND RESULTS
The Bell state circuit was verified successfully. The measurement yields equal 50% probabilities for outcomes '00' and '11', confirming maximal quantum entanglement.
"""

TEST_CASES = [
    {
        "id": "A",
        "name": "Direct Document Question",
        "question": "What is the aim of this worksheet?",
        "expected": "Mentions understanding/implementing quantum gates (Hadamard, CNOT, Pauli-X) and Bell state generation in Qiskit.",
        "must_contain": ["quantum", "gate", "bell"],
        "must_not_contain": ["couldn't find", "not available"],
        "min_score": 60.0
    },
    {
        "id": "B",
        "name": "Semantic / Paraphrased Question",
        "question": "What is this experiment intended to teach?",
        "expected": "Teaches fundamental quantum logic gates, superposition, and creating entangled Bell states.",
        "must_contain": ["quantum", "gate"],
        "must_not_contain": ["couldn't find"],
        "min_score": 60.0
    },
    {
        "id": "C",
        "name": "Specific Document Question",
        "question": "What is a CNOT gate?",
        "expected": "Two-qubit gate that flips the target qubit when control is |1>; used to create entangled states.",
        "must_contain": ["two-qubit", "control", "target", "flip"],
        "must_not_contain": ["couldn't find"],
        "min_score": 75.0
    },
    {
        "id": "D",
        "name": "Out-of-Document Question (Tamil Nadu)",
        "question": "What is the capital of Tamil Nadu?",
        "expected": "I couldn't find this information in the provided document. (groundingScore = 0.0)",
        "must_contain": ["couldn't find"],
        "must_not_contain": ["chennai"],
        "exact_score": 0.0
    },
    {
        "id": "E",
        "name": "Out-of-Document Question (India)",
        "question": "What is the population of India?",
        "expected": "Not found in document. (groundingScore = 0.0)",
        "must_contain": ["couldn't find"],
        "exact_score": 0.0
    },
    {
        "id": "F",
        "name": "Hallucination Test (CGPA)",
        "question": "What is the student's CGPA?",
        "expected": "Not found in document. (groundingScore = 0.0)",
        "must_contain": ["couldn't find"],
        "exact_score": 0.0
    },
    {
        "id": "G",
        "name": "Unrelated but Plausible Question (OS)",
        "question": "What operating system does the student use?",
        "expected": "Not found in document. (groundingScore = 0.0)",
        "must_contain": ["couldn't find"],
        "exact_score": 0.0
    },
    {
        "id": "H",
        "name": "Multi-hop Document Question",
        "question": "Which gates are used to construct the Bell State circuit?",
        "expected": "Hadamard (H) gate and Controlled-NOT (CNOT) gate.",
        "must_contain": ["hadamard", "cnot"],
        "must_not_contain": ["couldn't find"],
        "min_score": 70.0
    },
    {
        "id": "I",
        "name": "Exact Factual Question",
        "question": "What Python version is specified in the installation requirements?",
        "expected": "Python 3.10 or higher.",
        "must_contain": ["3.10"],
        "must_not_contain": ["couldn't find"],
        "min_score": 75.0
    },
    {
        "id": "J",
        "name": "Contradiction Test (Java vs Python)",
        "question": "Does the document state that Java is required instead of Python?",
        "expected": "States Python (version 3.10 or higher) is required, not Java.",
        "must_contain": ["python"],
        "must_not_contain": ["yes, java is required", "java is required instead"],
        "min_score": 60.0
    }
]


async def run_suite():
    print("=" * 80)
    print("TRANSFORMAI GROUNDED Q&A ACCURACY VALIDATION SUITE")
    print("Document: CH.SC.U4CSE24115_EXP_1.pdf (Quantum Computing Lab)")
    print("=" * 80)

    results = []

    for test in TEST_CASES:
        print(f"\n[Running Test {test['id']}] {test['name']}")
        print(f"Query: \"{test['question']}\"")

        req = ChatRequest(
            doc_id="CH.SC.U4CSE24115_EXP_1",
            doc_title="CH.SC.U4CSE24115_EXP_1.pdf",
            source_text=SAMPLE_QUANTUM_WORKSHEET,
            question=test["question"]
        )

        res = await grounded_chat_qa(req)

        ans = res.answer
        score = res.groundingScore
        cits = res.citations
        status = res.status

        print(f"-> Status: {status} | Score: {score}% | Provider: {res.api_provider}", flush=True)
        safe_ans = ans[:160].encode('ascii', errors='replace').decode('ascii')
        print(f"-> Answer: {safe_ans}...", flush=True)
        if cits:
            safe_cit = cits[0][:100].encode('ascii', errors='replace').decode('ascii')
            print(f"-> Citations ({len(cits)}): {safe_cit}...", flush=True)

        # Verification checks
        passed = True
        reasons = []

        ans_lower = ans.lower()

        if "must_contain" in test:
            for term in test["must_contain"]:
                if term.lower() not in ans_lower:
                    passed = False
                    reasons.append(f"Missing expected term: '{term}'")

        if "must_not_contain" in test:
            for term in test["must_not_contain"]:
                if term.lower() in ans_lower:
                    passed = False
                    reasons.append(f"Contains forbidden term: '{term}'")

        if "exact_score" in test:
            if abs(score - test["exact_score"]) > 0.001:
                passed = False
                reasons.append(f"Score {score}% != expected {test['exact_score']}%")

        if "min_score" in test:
            if score < test["min_score"]:
                passed = False
                reasons.append(f"Score {score}% < minimum {test['min_score']}%")

        result_status = "PASSED" if passed else "FAILED"
        print(f"-> RESULT: {result_status}" + (f" ({', '.join(reasons)})" if not passed else ""), flush=True)

        results.append({
            "id": test["id"],
            "name": test["name"],
            "question": test["question"],
            "status": result_status,
            "grounding_score": score,
            "answer_preview": safe_ans[:120].replace('\n', ' '),
            "provider": res.api_provider
        })

    print("\n" + "=" * 80, flush=True)
    print("FINAL TEST SUMMARY", flush=True)
    print("=" * 80, flush=True)
    all_passed = all(r["status"] == "PASSED" for r in results)
    for r in results:
        print(f"Test {r['id']} ({r['name']}): [{r['status']}] Score={r['grounding_score']}% | Answer: {r['answer_preview']}...", flush=True)

    print(f"\nOVERALL RESULT: {'ALL TESTS PASSED (10/10)' if all_passed else 'SOME TESTS FAILED'}", flush=True)
    return all_passed


if __name__ == "__main__":
    success = asyncio.run(run_suite())
    sys.exit(0 if success else 1)
