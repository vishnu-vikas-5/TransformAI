"""
Automated Verification Suite for Grounded AI Q&A Transformation Redirection.
Verifies all 7 agent redirections, multi-request handling, ambiguity clarifications,
and preservation of legitimate document questions.
"""

import sys
import os

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import grounding_engine as ge
from main import ChatRequest, grounded_chat_qa
import asyncio

TEST_ROUTING_CASES = [
    # 1. Summary Requests
    ("summary", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),
    ("give me a summary", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),
    ("summarize this", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),
    ("summarize the PDF", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),
    ("make a summary", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),
    ("executive summary", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),
    ("give me an executive summary", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),
    ("brief this document", "exec_summary", "Executive Summary Agent", "Open Executive Summary Agent"),

    # 2. Video Requests
    ("video", "video_package", "Video Package Agent", "Open Video Package Agent"),
    ("make a video", "video_package", "Video Package Agent", "Open Video Package Agent"),
    ("create a video", "video_package", "Video Package Agent", "Open Video Package Agent"),
    ("video script", "video_package", "Video Package Agent", "Open Video Package Agent"),
    ("generate a video script", "video_package", "Video Package Agent", "Open Video Package Agent"),
    ("make a video package", "video_package", "Video Package Agent", "Open Video Package Agent"),
    ("create storyboard", "video_package", "Video Package Agent", "Open Video Package Agent"),

    # 3. LinkedIn Requests
    ("LinkedIn post", "linkedin_post", "LinkedIn Post Agent", "Open LinkedIn Post Agent"),
    ("make a LinkedIn post", "linkedin_post", "LinkedIn Post Agent", "Open LinkedIn Post Agent"),
    ("create LinkedIn content", "linkedin_post", "LinkedIn Post Agent", "Open LinkedIn Post Agent"),
    ("write a LinkedIn post", "linkedin_post", "LinkedIn Post Agent", "Open LinkedIn Post Agent"),

    # 4. Twitter/X Requests
    ("Twitter post", "twitter_thread", "Twitter/X Post & Thread Agent", "Open Twitter/X Agent"),
    ("X post", "twitter_thread", "Twitter/X Post & Thread Agent", "Open Twitter/X Agent"),
    ("tweet", "twitter_thread", "Twitter/X Post & Thread Agent", "Open Twitter/X Agent"),
    ("Twitter thread", "twitter_thread", "Twitter/X Post & Thread Agent", "Open Twitter/X Agent"),
    ("X thread", "twitter_thread", "Twitter/X Post & Thread Agent", "Open Twitter/X Agent"),
    ("create a Twitter thread", "twitter_thread", "Twitter/X Post & Thread Agent", "Open Twitter/X Agent"),

    # 5. Advisory Requests
    ("technical advisory", "advisory_doc", "Structured Advisory Agent", "Open Structured Advisory Agent"),
    ("security advisory", "advisory_doc", "Structured Advisory Agent", "Open Structured Advisory Agent"),
    ("create an advisory", "advisory_doc", "Structured Advisory Agent", "Open Structured Advisory Agent"),
    ("make an advisory", "advisory_doc", "Structured Advisory Agent", "Open Structured Advisory Agent"),
    ("compliance advisory", "advisory_doc", "Structured Advisory Agent", "Open Structured Advisory Agent"),
    ("policy advisory", "advisory_doc", "Structured Advisory Agent", "Open Structured Advisory Agent"),

    # 6. Infographic Requests
    ("infographic", "infographic_pkg", "Infographic Content & Layout Agent", "Open Infographic Agent"),
    ("create an infographic", "infographic_pkg", "Infographic Content & Layout Agent", "Open Infographic Agent"),
    ("make an infographic", "infographic_pkg", "Infographic Content & Layout Agent", "Open Infographic Agent"),
    ("visual summary", "infographic_pkg", "Infographic Content & Layout Agent", "Open Infographic Agent"),
    ("infographic layout", "infographic_pkg", "Infographic Content & Layout Agent", "Open Infographic Agent"),

    # 7. Presentation Requests
    ("presentation", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent"),
    ("create presentation", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent"),
    ("make slides", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent"),
    ("create PPT", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent"),
    ("make a PowerPoint", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent"),
    ("generate slides", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent"),
    ("presentation slides", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent"),
    ("speaker notes", "presentation", "Presentation Slides & Notes Agent", "Open Presentation Agent")
]

SAMPLE_DOC = """[Page 1]
AIM OF THE EXPERIMENT:
Understand fundamental quantum logic gates (Pauli-X, Hadamard, and CNOT) using Qiskit.
Python Version Requirement: Python 3.10 or higher.
The CNOT gate flips the target qubit when control is |1>.
Superposition is created using the Hadamard gate.
Bell State |Phi+> is constructed with H on q[0] and CNOT on q[0], q[1].
"""

async def run_transformation_tests():
    print("=" * 80)
    print("TRANSFORMAI GROUNDED Q&A: TRANSFORMATION ROUTING TEST SUITE")
    print("=" * 80)

    failed = 0
    passed = 0

    # 1. Test All 7 Single-Agent Redirections
    print("\n--- 1. SINGLE TRANSFORMATION REQUESTS (SECTIONS 1-7) ---")
    for prompt, expected_id, expected_agent_name, expected_btn in TEST_ROUTING_CASES:
        req = ChatRequest(
            doc_id="test_doc",
            doc_title="Test Document",
            source_text=SAMPLE_DOC,
            question=prompt
        )
        res = await grounded_chat_qa(req)

        # Validations
        is_redirect = res.status == "agent_redirection"
        is_transform = res.intent == "TRANSFORM"
        no_grounding_score = res.groundingScore is None
        has_agent_name = expected_agent_name.lower() in res.answer.lower()
        has_btn = any(a.get("button_text") == expected_btn for a in (res.agents or [])) or res.button_text == expected_btn

        ok = is_redirect and is_transform and no_grounding_score and has_agent_name and has_btn

        if ok:
            passed += 1
            print(f"  [PASS] \"{prompt}\" -> Redirected to {expected_agent_name} (No grounding score, Button: {expected_btn})")
        else:
            failed += 1
            print(f"  [FAIL] \"{prompt}\" -> status={res.status}, intent={res.intent}, score={res.groundingScore}, ans={res.answer[:60]}")

    # 2. Test Multi-Request Handling (Section 12)
    print("\n--- 2. MULTIPLE TRANSFORMATION REQUESTS (SECTION 12) ---")
    multi_prompt = "Give me a summary and create a presentation."
    req = ChatRequest(
        doc_id="test_doc",
        doc_title="Test Document",
        source_text=SAMPLE_DOC,
        question=multi_prompt
    )
    res = await grounded_chat_qa(req)

    has_both_agents = ("executive summary agent" in res.answer.lower()) and ("presentation slides" in res.answer.lower())
    has_workbench_msg = "specialized workbench agents" in res.answer.lower()
    has_multi_buttons = len(res.agents or []) >= 2
    no_score = res.groundingScore is None

    if has_both_agents and has_workbench_msg and has_multi_buttons and no_score:
        passed += 1
        print(f"  [PASS] \"{multi_prompt}\" -> Multi-agent redirect with {len(res.agents)} action buttons.")
    else:
        failed += 1
        print(f"  [FAIL] Multi-request: both={has_both_agents}, msg={has_workbench_msg}, btns={len(res.agents or [])}, score={res.groundingScore}")

    # 3. Test Ambiguous Prompt (Section 13)
    print("\n--- 3. AMBIGUOUS QUESTION HANDLING (SECTION 13) ---")
    ambig_prompt = "Tell me about the summary"
    req = ChatRequest(
        doc_id="test_doc",
        doc_title="Test Document",
        source_text=SAMPLE_DOC,
        question=ambig_prompt
    )
    res = await grounded_chat_qa(req)

    is_ambig = res.status == "ambiguous_clarification" or res.intent == "AMBIGUOUS"
    has_clarification = "summary mentioned in the document" in res.answer.lower()
    no_score = res.groundingScore is None

    if is_ambig and has_clarification and no_score:
        passed += 1
        print(f"  [PASS] \"{ambig_prompt}\" -> Clarification prompt returned: \"{res.answer}\"")
    else:
        failed += 1
        print(f"  [FAIL] Ambiguous: is_ambig={is_ambig}, text={res.answer}, score={res.groundingScore}")

    # 4. Test Legitimate Document Questions (Sections 8 & 9)
    print("\n--- 4. PRESERVATION OF DOCUMENT QUESTIONS (SECTIONS 8, 9, 14) ---")
    DOC_QUESTIONS = [
        "What is this PDF about?",
        "What is the aim of the experiment?",
        "What is a CNOT gate?",
        "What Python version does the document require?",
        "Which quantum gates are mentioned?",
        "What does the document say about superposition?",
        "How is the Bell State constructed according to the document?",
        "What does the document say about quantum gates?",
        "Explain superposition from the document."
    ]

    for dq in DOC_QUESTIONS:
        intent = ge.classify_query_intent(dq)
        if intent["intent"] == "GROUNDED_QA":
            passed += 1
            print(f"  [PASS] Document Question Kept in Q&A: \"{dq}\" (intent=GROUNDED_QA)")
        else:
            failed += 1
            print(f"  [FAIL] Document Question Incorrectly Redirected: \"{dq}\" (intent={intent['intent']})")

    print("\n" + "=" * 80)
    print(f"RESULTS: {passed} PASSED | {failed} FAILED")
    print("=" * 80)
    return failed == 0

if __name__ == "__main__":
    ok = asyncio.run(run_transformation_tests())
    sys.exit(0 if ok else 1)
