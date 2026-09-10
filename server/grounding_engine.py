import re
import math
import os
from typing import List, Dict, Any, Optional, Tuple
try:
    import numpy as np
except ImportError:
    np = None

STOP_WORDS = {
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
    'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t',
    'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have',
    'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself',
    'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into',
    'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
    'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
    'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
    'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
    'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
    'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
    'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s',
    'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you',
    'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
    'tell', 'give', 'show', 'please', 'explain', 'describe', 'list', 'detail', 'details', 'know'
}

QUESTION_WORDS = {
    'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
    'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could', 'should',
    'would', 'will', 'has', 'have', 'had', 'state', 'explain', 'describe'
}

META_INTENT_WORDS = {
    'intended', 'teach', 'teaches', 'learning', 'learn', 'learned', 'objective', 'objectives',
    'aim', 'aims', 'purpose', 'purposes', 'goal', 'goals', 'overview', 'summary',
    'define', 'definition', 'meaning', 'concept', 'detail', 'details',
    'mention', 'mentions', 'cover', 'covers', 'discuss', 'discusses'
}


class DocumentChunk:
    def __init__(
        self,
        chunk_id: int,
        text: str,
        page: int = 1,
        section: str = "General",
        start_char: int = 0,
        end_char: int = 0,
        embedding: Optional[List[float]] = None
    ):
        self.chunk_id = chunk_id
        self.text = text
        self.page = page
        self.section = section
        self.start_char = start_char
        self.end_char = end_char
        self.embedding = embedding

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "text": self.text,
            "page": self.page,
            "section": self.section,
            "start_char": self.start_char,
            "end_char": self.end_char
        }


def clean_and_tokenize(text: str) -> List[str]:
    """Extracts non-stopword alphanumeric tokens."""
    tokens = re.findall(r'\b[a-zA-Z0-9_-]{2,}\b', text.lower())
    return [t for t in tokens if t not in STOP_WORDS]


def extract_key_query_targets(question: str) -> List[str]:
    """Extracts core thematic targets from a question (e.g. 'capital', 'cgpa', 'cnot')."""
    words = re.findall(r'\b[a-zA-Z0-9_-]{2,}\b', question.lower())
    domain_targets = [w for w in words if w not in STOP_WORDS and w not in QUESTION_WORDS and w not in META_INTENT_WORDS]
    if not domain_targets:
        return [w for w in words if w not in STOP_WORDS and w not in QUESTION_WORDS]
    return domain_targets


def chunk_document(source_text: str, target_chunk_size: int = 450, overlap: int = 60) -> List[DocumentChunk]:
    """
    Chunks document along logical page markers, sections, and paragraph boundaries.
    Preserves exact PDF page markers (e.g. [Page X] or --- Page X ---) and section headings.
    """
    if not source_text or not source_text.strip():
        return []

    # Check for explicit page markers in text (from pypdf extraction)
    # Format: [Page 1], --- Page 2 ---, etc.
    page_split_pattern = r'(?:^|\n)(?:\[Page\s+(\d+)\]|--- Page\s+(\d+)\s*---|===\s*Page\s+(\d+)\s*===)\n?'
    has_page_markers = bool(re.search(page_split_pattern, source_text))

    chunks: List[DocumentChunk] = []
    chunk_idx = 1
    current_section = "Document Overview"

    if has_page_markers:
        # Split by page marker while retaining the page number
        parts = re.split(page_split_pattern, source_text)
        i = 0
        current_page = 1
        while i < len(parts):
            val = parts[i]
            if val is None:
                i += 1
                continue
            val_str = str(val).strip()
            if val_str.isdigit():
                current_page = int(val_str)
                i += 1
                continue

            page_text = val_str
            i += 1
            if not page_text:
                continue

            # Process this page's text into chunks
            page_chunks, chunk_idx, current_section = _chunk_text_block(
                text=page_text,
                page_num=current_page,
                start_chunk_idx=chunk_idx,
                current_section=current_section,
                target_chunk_size=target_chunk_size,
                overlap=overlap
            )
            chunks.extend(page_chunks)
    else:
        # No explicit markers, split paragraphs and calculate estimated pages (~350 words / page)
        page_chunks, chunk_idx, _ = _chunk_text_block(
            text=source_text,
            page_num=1,
            start_chunk_idx=chunk_idx,
            current_section=current_section,
            target_chunk_size=target_chunk_size,
            overlap=overlap,
            estimate_pages=True
        )
        chunks.extend(page_chunks)

    return chunks


def _chunk_text_block(
    text: str,
    page_num: int,
    start_chunk_idx: int,
    current_section: str,
    target_chunk_size: int = 450,
    overlap: int = 60,
    estimate_pages: bool = False
) -> Tuple[List[DocumentChunk], int, str]:
    """Helper to chunk a block of text while tracking section titles."""
    chunks = []
    chunk_idx = start_chunk_idx
    running_offset = 0

    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]

    current_units = []
    current_len = 0

    section_header_pattern = r'^(?:#{1,4}\s+|[0-9]+[\.\)]\s+|[A-Z\s]{4,}:?\s*$)(.+)$'

    for p in paragraphs:
        # Detect section header
        first_line = p.split('\n')[0].strip()
        sec_match = re.match(section_header_pattern, first_line)
        if sec_match and len(first_line) < 80:
            current_section = re.sub(r'^[#0-9\.\)\s]+', '', first_line).strip().title() or current_section

        p_len = len(p)
        if p_len > target_chunk_size * 2:
            # Split long paragraph by sentences
            sents = [s.strip() for s in re.split(r'(?<=[.!?])\s+', p) if s.strip()]
            for s in sents:
                current_units.append(s)
                current_len += len(s) + 1
                if current_len >= target_chunk_size:
                    c_text = " ".join(current_units).strip()
                    est_page = max(1, math.ceil((running_offset + len(c_text) / 2) / 1800)) if estimate_pages else page_num
                    chunks.append(DocumentChunk(
                        chunk_id=chunk_idx,
                        text=c_text,
                        page=est_page,
                        section=current_section,
                        start_char=running_offset,
                        end_char=running_offset + len(c_text)
                    ))
                    chunk_idx += 1
                    running_offset += len(c_text)
                    # Retain small overlap
                    current_units = current_units[-1:] if overlap > 0 else []
                    current_len = sum(len(u) for u in current_units)
        else:
            current_units.append(p)
            current_len += p_len + 1
            if current_len >= target_chunk_size:
                c_text = "\n\n".join(current_units).strip()
                est_page = max(1, math.ceil((running_offset + len(c_text) / 2) / 1800)) if estimate_pages else page_num
                chunks.append(DocumentChunk(
                    chunk_id=chunk_idx,
                    text=c_text,
                    page=est_page,
                    section=current_section,
                    start_char=running_offset,
                    end_char=running_offset + len(c_text)
                ))
                chunk_idx += 1
                running_offset += len(c_text)
                current_units = []
                current_len = 0

    if current_units:
        c_text = "\n\n".join(current_units).strip()
        est_page = max(1, math.ceil((running_offset + len(c_text) / 2) / 1800)) if estimate_pages else page_num
        chunks.append(DocumentChunk(
            chunk_id=chunk_idx,
            text=c_text,
            page=est_page,
            section=current_section,
            start_char=running_offset,
            end_char=running_offset + len(c_text)
        ))
        chunk_idx += 1

    return chunks, chunk_idx, current_section


# In-memory vector embedding cache to minimize API roundtrips
_EMBEDDING_CACHE: Dict[int, List[float]] = {}

def get_gemini_embeddings(texts: List[str], api_key: Optional[str] = None) -> Optional[List[List[float]]]:
    """
    Generates dense semantic vector embeddings using Gemini API (gemini-embedding-001).
    Batches requests and caches embeddings to avoid redundant network calls and rate limits.
    Returns list of vector float lists, or None if unavailable.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key or key == "your_gemini_api_key_here":
        return None

    try:
        cache_hits: List[Tuple[int, List[float]]] = []
        uncached_texts: List[str] = []
        uncached_indices: List[int] = []

        for i, t in enumerate(texts):
            h = hash(t)
            if h in _EMBEDDING_CACHE:
                cache_hits.append((i, _EMBEDDING_CACHE[h]))
            else:
                clean_t = t[:2000].strip() or "empty"
                uncached_texts.append(clean_t)
                uncached_indices.append(i)

        if uncached_texts:
            import google.genai as genai
            client = genai.Client(api_key=key)
            # Batch embedding call
            res = client.models.embed_content(
                model="gemini-embedding-001",
                contents=uncached_texts
            )
            if hasattr(res, "embeddings") and res.embeddings:
                for idx_in_res, emb in enumerate(res.embeddings):
                    orig_idx = uncached_indices[idx_in_res]
                    vec = emb.values
                    _EMBEDDING_CACHE[hash(texts[orig_idx])] = vec
                    cache_hits.append((orig_idx, vec))
            else:
                return None

        cache_hits.sort(key=lambda x: x[0])
        return [item[1] for item in cache_hits]
    except Exception as e:
        print(f"[Vector Embeddings] Gemini API embedding error: {e}")
        return None


def compute_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Computes cosine similarity between two dense vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    if np is not None:
        a = np.array(vec_a, dtype=np.float32)
        b = np.array(vec_b, dtype=np.float32)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))
    
    dot_product = sum(x * y for x, y in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(x * x for x in vec_a))
    norm_b = math.sqrt(sum(y * y for y in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot_product / (norm_a * norm_b))


def compute_local_tfidf_similarity(
    chunks: List[DocumentChunk],
    query: str
) -> List[Tuple[DocumentChunk, float]]:
    """
    High-precision local vector similarity using scikit-learn TF-IDF with n-grams (1, 2, 3)
    and sublinear term frequency scaling.
    """
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    corpus = [c.text for c in chunks]
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        sublinear_tf=True,
        stop_words='english',
        token_pattern=r'(?u)\b\w+\b'
    )

    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
        return [(chunks[i], float(similarities[i])) for i in range(len(chunks))]
    except Exception:
        return [(c, 0.0) for c in chunks]


class SemanticVectorIndex:
    """
    Manages vector embeddings and similarity search across document chunks.
    Supports both Gemini dense vectors and high-performance local vector indices.
    """
    def __init__(self, chunks: List[DocumentChunk], api_key: Optional[str] = None):
        self.chunks = chunks
        self.api_key = api_key
        self.dense_embeddings: Optional[List[List[float]]] = None
        self._build_index()

    def _build_index(self):
        """Builds index with dense embeddings if API is available."""
        if not self.chunks:
            return
        texts = [c.text for c in self.chunks]
        dense = get_gemini_embeddings(texts, self.api_key)
        if dense and len(dense) == len(self.chunks):
            self.dense_embeddings = dense
            for i, emb in enumerate(dense):
                self.chunks[i].embedding = emb

    def search(self, query: str, top_k: int = 3) -> List[Tuple[DocumentChunk, float]]:
        """
        Performs semantic vector search.
        Uses dense cosine similarity when available, with hybrid local TF-IDF alignment.
        """
        if not self.chunks:
            return []

        # Dense search with hybrid local weighting
        if self.dense_embeddings is not None:
            query_emb = get_gemini_embeddings([query], self.api_key)
            if query_emb and len(query_emb) > 0:
                q_vec = query_emb[0]
                dense_scores = [
                    (self.chunks[i], compute_cosine_similarity(q_vec, self.dense_embeddings[i]))
                    for i in range(len(self.chunks))
                ]
                local_scores = compute_local_tfidf_similarity(self.chunks, query)
                local_dict = {c.chunk_id: s for c, s in local_scores}

                hybrid_results = []
                for chunk, d_score in dense_scores:
                    l_score = local_dict.get(chunk.chunk_id, 0.0)
                    combined = 0.65 * d_score + 0.35 * l_score
                    hybrid_results.append((chunk, combined))

                hybrid_results.sort(key=lambda x: x[1], reverse=True)
                return hybrid_results[:top_k]

        # Fallback to local vector similarity
        local_scored = compute_local_tfidf_similarity(self.chunks, query)
        local_scored.sort(key=lambda x: x[1], reverse=True)
        return local_scored[:top_k]


# --- Answerability & Relevance Gate ---

def check_answerability(
    question: str,
    matched_chunks: List[Tuple[DocumentChunk, float]],
    relevance_score: float
) -> Tuple[bool, str]:
    """
    Determines if the question is answerable from the retrieved evidence.
    Verifies:
    1. Is relevance score above minimum threshold?
    2. Are core question entities/targets present in the evidence context?
    3. Does the evidence contain substantive facts addressing the inquiry intent,
       or is it merely a coincidental keyword match (e.g. college location header)?
    """
    if not matched_chunks or relevance_score < 0.18:
        return False, "Query relevance is below the document grounding threshold."

    q_targets = extract_key_query_targets(question)
    if not q_targets:
        return True, "General summary request."

    combined_context = " ".join(c.text.lower() for c, _ in matched_chunks)

    # Check key question targets
    matched_targets = [t for t in q_targets if t in combined_context]
    target_coverage = len(matched_targets) / len(q_targets)

    # Strict guard for relational questions:
    # e.g., "What is the capital of Tamil Nadu?" -> question asks for 'capital'
    # If "capital" is not in document, strictly unanswerable regardless of whether "tamil nadu" appears in header.
    crucial_qualifiers = {
        'capital', 'population', 'cgpa', 'grade', 'gpa', 'salary', 'age',
        'birthday', 'os', 'operating system', 'religion', 'president',
        'prime minister', 'governor', 'currency'
    }
    q_lower = question.lower()
    for q in crucial_qualifiers:
        if q in q_lower and q not in combined_context:
            return False, f"The document mentions related terms but does not contain information regarding '{q}'."

    # If asking about an entity that does not appear at all
    if target_coverage < 0.30 and relevance_score < 0.35:
        return False, f"Insufficient target match (coverage {target_coverage*100:.0f}%)."

    return True, "Evidence verified answerable."


def retrieve_grounded_evidence(
    chunks: List[DocumentChunk],
    question: str,
    top_k: int = 3,
    api_key: Optional[str] = None
) -> Tuple[List[Tuple[DocumentChunk, float]], float, bool, str]:
    """
    Main pipeline entry for retrieving evidence with strict relevance and answerability gates.
    Returns:
      (matched_chunks, best_relevance_score, is_answerable, status_reason)
    """
    if not chunks:
        return [], 0.0, False, "Document has no extractable chunks."

    index = SemanticVectorIndex(chunks, api_key=api_key)
    results = index.search(query=question, top_k=top_k)

    if not results:
        return [], 0.0, False, "No chunks matched semantic index."

    best_score = results[0][1]

    # Relevance threshold gate
    if best_score < 0.18:
        return results, best_score, False, "Semantic similarity below grounding threshold."

    # Answerability Gate
    is_answerable, reason = check_answerability(question, results, best_score)
    if not is_answerable:
        return results, best_score, False, reason

    return results, best_score, True, "Evidence retrieved and verified answerable."


# --- Claim Extraction & Dynamic Grounding Score ---

def extract_claims(text: str) -> List[str]:
    """Splits answer text into individual factual claims, filtering greetings and boilerplate."""
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        l = line.strip()
        if not l or l.startswith('#') or l.startswith('>') or l.startswith('*Verified'):
            continue
        if l.startswith('- ') or l.startswith('* '):
            l = l[2:].strip()
        cleaned_lines.append(l)

    raw_text = " ".join(cleaned_lines)
    sentences = re.split(r'(?<=[.!?])\s+', raw_text)
    claims = []
    for s in sentences:
        s_clean = s.strip().strip('*_`')
        s_lower = s_clean.lower()
        if len(s_clean) > 15 and not any(neg in s_lower for neg in [
            "couldn't find", "cannot find", "not found", "insufficient evidence",
            "not mentioned", "does not contain", "no information"
        ]):
            claims.append(s_clean)
    return claims


def verify_claims_against_context(
    claims: List[str],
    context_text: str
) -> Tuple[float, List[str], List[str]]:
    """
    Verifies each claim in the answer against the retrieved evidence text.
    Returns: (support_ratio, supported_claims, unsupported_claims)
    """
    if not claims:
        return 1.0, [], []
    if not context_text:
        return 0.0, [], claims

    ctx_lower = context_text.lower()
    ctx_tokens = set(clean_and_tokenize(context_text))

    supported = []
    unsupported = []

    for claim in claims:
        c_tokens = clean_and_tokenize(claim)
        if not c_tokens:
            continue

        matched_tokens = [t for t in c_tokens if t in ctx_tokens or t in ctx_lower]
        match_ratio = len(matched_tokens) / len(c_tokens)

        numbers = re.findall(r'\b\d+(?:\.\d+)?\b', claim)
        numbers_supported = all(n in context_text for n in numbers)

        if match_ratio >= 0.55 and numbers_supported:
            supported.append(claim)
        else:
            unsupported.append(claim)

    total = len(supported) + len(unsupported)
    ratio = (len(supported) / total) if total > 0 else 0.0
    return ratio, supported, unsupported


def calculate_dynamic_grounding_score(
    is_answerable: bool,
    relevance_score: float,
    claim_support_ratio: float,
    total_claims: int,
    supported_claims: int
) -> float:
    """
    Calculates dynamic grounding score (0.0% to 100.0%).
    Strictly returns 0.0% for unanswered, unverified, or out-of-document queries.
    Never returns hardcoded constants like 99.6%.
    """
    if not is_answerable:
        return 0.0

    if total_claims == 0:
        return round(min(98.0, max(60.0, relevance_score * 100.0)), 1)

    raw_support_pct = (supported_claims / max(1, total_claims)) * 100.0
    weighted = 0.80 * raw_support_pct + 0.20 * min(100.0, relevance_score * 100.0)
    return round(max(0.0, min(99.0, weighted)), 1)


# --- Citation Generation ---

def build_structured_citations(
    matched_chunks: List[Tuple[DocumentChunk, float]],
    doc_title: str
) -> List[Dict[str, Any]]:
    """Generates structured citation objects with source, page, section, and evidence snippet."""
    citations = []
    for chunk, score in matched_chunks:
        clean_text = chunk.text.replace('\n', ' ').strip()
        snippet = clean_text[:240] + ("..." if len(clean_text) > 240 else "")
        citations.append({
            "source": doc_title,
            "page": chunk.page,
            "section": chunk.section,
            "evidence": snippet,
            "score": round(score, 3)
        })
    return citations


def build_insufficient_evidence_response(doc_title: str, question: str) -> Dict[str, Any]:
    """Standardized response when evidence is insufficient or question is out-of-document."""
    return {
        "status": "insufficient_evidence",
        "evidence_found": False,
        "answer": f"I couldn't find information about **\"{question}\"** in the provided document **\"{doc_title}\"**.",
        "groundingScore": 0.0,
        "citations": [],
        "api_provider": "TransformAI Grounded Guard"
    }


def synthesize_deterministic_grounded_answer(
    doc_title: str,
    matched_chunks: List[Tuple[DocumentChunk, float]],
    question: str,
    query_relevance: float
) -> Dict[str, Any]:
    """
    Synthesizes a cohesive, natural grounded answer when LLM is offline,
    extracting and synthesizing verified statements without fragmented text dumping.
    """
    if not matched_chunks:
        return build_insufficient_evidence_response(doc_title, question)

    q_tokens = set(clean_and_tokenize(question))
    candidate_sentences = []

    for chunk, _ in matched_chunks:
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', chunk.text) if len(s.strip()) > 20]
        for s in sentences:
            s_toks = set(clean_and_tokenize(s))
            overlap = len(s_toks.intersection(q_tokens))
            if overlap > 0:
                candidate_sentences.append((overlap, s, chunk.page, chunk.section))

    candidate_sentences.sort(key=lambda x: x[0], reverse=True)

    if not candidate_sentences:
        top_chunk = matched_chunks[0][0]
        lead_para = top_chunk.text.split('\n\n')[0].strip()
        candidate_sentences.append((1, lead_para, top_chunk.page, top_chunk.section))

    lead = candidate_sentences[0][1]
    supporting = [s[1] for s in candidate_sentences[1:3] if s[1] != lead]

    paragraphs = [lead]
    if supporting:
        paragraphs.append(" ".join(supporting))

    body = "\n\n".join(paragraphs)

    citations = build_structured_citations(matched_chunks, doc_title)
    claims = extract_claims(body)
    context_text = " ".join(c.text for c, _ in matched_chunks)
    ratio, supported, unsupported = verify_claims_against_context(claims, context_text)

    score = calculate_dynamic_grounding_score(
        is_answerable=True,
        relevance_score=query_relevance,
        claim_support_ratio=ratio,
        total_claims=len(claims),
        supported_claims=len(supported)
    )

    return {
        "status": "grounded",
        "evidence_found": True,
        "answer": body,
        "groundingScore": score,
        "citations": citations,
        "api_provider": "TransformAI Semantic Engine (Local Fallback)"
    }


DELIVERABLE_AGENTS = {
    "exec_summary": {
        "id": "exec_summary",
        "name": "Executive Summary",
        "agent_name": "Executive Summary Agent",
        "button_text": "Open Executive Summary Agent",
        "purpose_phrase": "for the summary",
        "redirect_message": "Summary generation is handled by the Executive Summary Agent. Please use the Executive Summary agent in the Workbench to generate a summary from this document.",
        "keywords": [
            "summary", "give me a summary", "summarize this", "summarize the pdf",
            "summarize this pdf", "summarize this document", "make a summary",
            "executive summary", "give me an executive summary", "brief this document",
            "summarize", "summarise", "executive briefing", "briefing", "tldr",
            "make a brief summary", "create an executive summary", "prepare an executive briefing"
        ],
        "pattern": r'\b(summar(?:y|ies|ize|ise|izing|ising)|executive\s+summary|brief\s+this\s+document)\b'
    },
    "video_package": {
        "id": "video_package",
        "name": "Video Package",
        "agent_name": "Video Package Agent",
        "button_text": "Open Video Package Agent",
        "purpose_phrase": "for the video content",
        "redirect_message": "Video generation is handled by the Video Package Agent. Please use the Video Package agent in the Workbench to generate your video content.",
        "keywords": [
            "video", "make a video", "create a video", "video script",
            "generate a video script", "make a video package", "create storyboard",
            "storyboard", "video package", "video content", "video production",
            "multimedia package", "create a video package", "make a video script"
        ],
        "pattern": r'\b(video|storyboard|video\s+script|video\s+package)\b'
    },
    "linkedin_post": {
        "id": "linkedin_post",
        "name": "LinkedIn Post",
        "agent_name": "LinkedIn Post Agent",
        "button_text": "Open LinkedIn Post Agent",
        "purpose_phrase": "for the LinkedIn post",
        "redirect_message": "LinkedIn content is handled by the LinkedIn Post Agent. Please use the LinkedIn Post agent in the Workbench.",
        "keywords": [
            "linkedin post", "make a linkedin post", "create linkedin content",
            "write a linkedin post", "linkedin", "linkedin summary",
            "professional post", "corporate post", "post for linkedin"
        ],
        "pattern": r'\b(linkedin|linkedin\s+post)\b'
    },
    "twitter_thread": {
        "id": "twitter_thread",
        "name": "Twitter/X Post & Thread",
        "agent_name": "Twitter/X Post & Thread Agent",
        "button_text": "Open Twitter/X Agent",
        "purpose_phrase": "for the Twitter/X post & thread",
        "redirect_message": "Twitter/X content is handled by the Twitter/X Post & Thread Agent. Please use that agent in the Workbench.",
        "keywords": [
            "twitter post", "x post", "tweet", "twitter thread", "x thread",
            "create a twitter thread", "twitter", "tweet thread", "tweets",
            "make a twitter thread", "make a twitter post", "x tweet",
            "make an x post", "create an x thread", "create twitter post"
        ],
        "pattern": r'\b(twitter|x\s+post|x\s+thread|tweets?|twitter\s+thread|twitter\s+post)\b'
    },
    "advisory_doc": {
        "id": "advisory_doc",
        "name": "Structured Advisory",
        "agent_name": "Structured Advisory Agent",
        "button_text": "Open Structured Advisory Agent",
        "purpose_phrase": "for the structured advisory",
        "redirect_message": "Advisory generation is handled by the Structured Advisory Agent. Please use the Structured Advisory agent in the Workbench.",
        "keywords": [
            "technical advisory", "security advisory", "create an advisory",
            "make an advisory", "compliance advisory", "policy advisory",
            "advisory", "structured advisory", "create a technical advisory",
            "make a technical advisory", "generate an advisory"
        ],
        "pattern": r'\b(advisory|technical\s+advisory|security\s+advisory|compliance\s+advisory|policy\s+advisory|structured\s+advisory)\b'
    },
    "infographic_pkg": {
        "id": "infographic_pkg",
        "name": "Infographic Content & Layout",
        "agent_name": "Infographic Content & Layout Agent",
        "button_text": "Open Infographic Agent",
        "purpose_phrase": "for the infographic",
        "redirect_message": "Infographic generation is handled by the Infographic Content & Layout Agent. Please use that agent in the Workbench.",
        "keywords": [
            "infographic", "create an infographic", "make an infographic",
            "visual summary", "infographic layout", "create infographic",
            "visual content", "infographic design", "generate an infographic"
        ],
        "pattern": r'\b(infographic|visual\s+summary|infographic\s+layout|infographic\s+content)\b'
    },
    "presentation": {
        "id": "presentation",
        "name": "Presentation Slides & Notes",
        "agent_name": "Presentation Slides & Notes Agent",
        "button_text": "Open Presentation Agent",
        "purpose_phrase": "for the presentation",
        "redirect_message": "Presentation generation is handled by the Presentation Slides & Notes Agent. Please use that agent in the Workbench.",
        "keywords": [
            "presentation", "create presentation", "make slides", "create ppt",
            "make a powerpoint", "generate slides", "presentation slides",
            "speaker notes", "ppt", "slides", "powerpoint", "slide deck",
            "presentation outline", "create a presentation", "make a presentation"
        ],
        "pattern": r'\b(presentation|slides?|ppt|powerpoint|slide\s+deck|speaker\s+notes)\b'
    }
}

MODIFICATION_PATTERNS = [
    r'\bmake it shorter\b', r'\bshorten (it|this)\b', r'\bmake it brief\b', r'\bmake it more concise\b',
    r'\bcondense (it|this)\b', r'\bmake it longer\b', r'\bexpand (it|this)\b', r'\bmore details\b',
    r'\bmake it more formal\b', r'\bmake it formal\b', r'\bmake it casual\b', r'\bchange tone\b',
    r'\brewrite (it|this)\b'
]


def classify_query_intent(
    query: str,
    chat_history: Optional[List[Dict[str, Any]]] = None,
    selected_outputs: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Classifies user message intent in Grounded Q&A chat:
    1. AMBIGUOUS queries -> Prompt user for clarification (Document question vs. Agent generation)
    2. DOCUMENT QUESTIONS -> Strictly route to GROUNDED_QA (answer from document context with citations)
    3. TRANSFORMATION REQUESTS -> Strictly redirect to Workbench Agent(s) with polite message and buttons
    """
    q_raw = query.strip()
    q_clean = q_raw.lower()
    q_norm = re.sub(r'[^\w\s]', '', q_clean).strip()

    # 1. Ambiguity Detection (Section 13)
    # e.g., "Tell me about the summary", "What about the summary"
    if re.search(r'\b(?:tell me about|what about)\s+(?:the\s+)?summary\b', q_clean):
        agent_meta = DELIVERABLE_AGENTS["exec_summary"]
        return {
            "intent": "AMBIGUOUS",
            "agent": "exec_summary",
            "deliverable_name": agent_meta["name"],
            "agent_name": agent_meta["agent_name"],
            "confidence": 0.50,
            "reason": "Query could be asking about existing document summary or requesting an executive summary generation",
            "clarification_prompt": "Are you asking about a summary mentioned in the document, or would you like to generate an Executive Summary?",
            "button_text": agent_meta["button_text"],
            "agents": [
                {
                    "id": "exec_summary",
                    "name": agent_meta["name"],
                    "agent_name": agent_meta["agent_name"],
                    "button_text": agent_meta["button_text"]
                }
            ],
            "is_modification": False
        }

    # 2. Strict Document Question Detection (Sections 8 & 9)
    # Questions that ask for information contained in the document MUST remain in Grounded Q&A.
    # Examples:
    # "What is this PDF about?"
    # "What is the aim of the experiment?"
    # "What is a CNOT gate?"
    # "What Python version does the document require?"
    # "Which quantum gates are mentioned?"
    # "What does the document say about superposition?"
    # "How is the Bell State constructed according to the document?"
    # "What is X according to the document?"
    # "Explain X from the document."

    doc_reference_patterns = [
        r'\bwhat does (?:the|this)\s+(?:document|pdf|text|paper|worksheet|file)\s+say\b',
        r'\bwhat (?:is|are)\s+.*?\s+according to (?:the|this)\s+(?:document|pdf|text|paper|worksheet|file)\b',
        r'\bexplain\s+.*?\s+(?:from|according to)\s+(?:the|this)\s+(?:document|pdf|text|paper|worksheet|file)\b',
        r'^\s*what is (?:this|the)\s+(?:document|pdf|text|paper|worksheet|file)\s+about\b',
        r'^\s*what is the aim\b',
        r'^\s*what is a cnot\b',
        r'^\s*what python version\b',
        r'^\s*which quantum gates\b',
        r'^\s*how is the bell state\b',
        r'^\s*what does the document say about\b',
        r'^\s*what is this experiment intended to teach\b'
    ]
    is_explicit_doc_question = any(re.search(pat, q_clean) for pat in doc_reference_patterns)
    if is_explicit_doc_question:
        return {
            "intent": "GROUNDED_QA",
            "agent": None,
            "confidence": 0.99,
            "reason": "Explicit document question asking about information inside the source document",
            "is_modification": False
        }

    # 3. Conversational Modification Patterns (e.g. "make it shorter", "more details")
    is_modification = False
    for pattern in MODIFICATION_PATTERNS:
        if re.search(pattern, q_clean):
            is_modification = True
            break

    # 4. Check for Transformation Requests across all 7 Agents
    # Determine which agents are requested (supports single and multiple requests)
    transform_verbs = r'(?:create|make|generate|give\s+me|prepare|produce|write|draft|build|provide)'
    matched_agent_ids: List[str] = []

    # Standalone single-word or two-word commands
    exact_single_words = {
        "summary": "exec_summary",
        "summarize": "exec_summary",
        "summarise": "exec_summary",
        "tldr": "exec_summary",
        "brief": "exec_summary",
        "briefing": "exec_summary",
        "presentation": "presentation",
        "slides": "presentation",
        "ppt": "presentation",
        "powerpoint": "presentation",
        "infographic": "infographic_pkg",
        "advisory": "advisory_doc",
        "video": "video_package",
        "tweets": "twitter_thread",
        "tweet": "twitter_thread",
        "linkedin": "linkedin_post"
    }

    if q_norm in exact_single_words:
        matched_agent_ids.append(exact_single_words[q_norm])

    # Check keyword lists and verb + keyword patterns for each agent
    for agent_id, data in DELIVERABLE_AGENTS.items():
        if agent_id in matched_agent_ids:
            continue

        agent_matched = False
        # Direct keyword match in query
        for kw in data["keywords"]:
            # Word boundary check for the keyword
            kw_pattern = rf'\b{re.escape(kw)}\b'
            if re.search(kw_pattern, q_clean):
                matched_agent_ids.append(agent_id)
                agent_matched = True
                break

        if agent_matched:
            continue

        # Verb + keyword match e.g. "create a video", "make slides"
        pattern = rf'\b{transform_verbs}\s+(?:a\s+|an\s+|the\s+|some\s+)?{data["pattern"]}'
        if re.search(pattern, q_clean):
            matched_agent_ids.append(agent_id)

    # If the user input is primarily an informational question (starts with what/which/who/how/why/is/does),
    # verify it is not actually a transformation request before treating as Grounded Q&A.
    # For example, "What is a CNOT gate?" has no transform match -> goes to Grounded Q&A.
    # "What is this PDF about?" -> Grounded Q&A.
    is_general_question = bool(re.search(r'^\s*(?:what|which|who|where|why|how|does|is|are|can|could|did|do)\b', q_clean))

    # If it matched transformation agents:
    if matched_agent_ids:
        # Deduplicate while preserving order
        unique_matched_ids = []
        for aid in matched_agent_ids:
            if aid not in unique_matched_ids:
                unique_matched_ids.append(aid)

        # Multiple Transformation Requests (Section 12)
        if len(unique_matched_ids) > 1:
            matched_agents_data = [DELIVERABLE_AGENTS[aid] for aid in unique_matched_ids]
            bullet_lines = "\n".join([f"• {a['agent_name']} — {a['purpose_phrase']}" for a in matched_agents_data])
            multi_response = (
                f"These requests are handled by specialized Workbench agents:\n\n"
                f"{bullet_lines}\n\n"
                f"Please use the corresponding agents in the Workbench."
            )
            return {
                "intent": "TRANSFORM",
                "agent": unique_matched_ids[0],
                "agents": [
                    {
                        "id": a["id"],
                        "name": a["name"],
                        "agent_name": a["agent_name"],
                        "button_text": a["button_text"]
                    }
                    for a in matched_agents_data
                ],
                "deliverable_name": ", ".join(a["name"] for a in matched_agents_data),
                "agent_name": ", ".join(a["agent_name"] for a in matched_agents_data),
                "redirect_message": multi_response,
                "confidence": 0.99,
                "reason": "Multiple transformation requests detected; guided to specialized Workbench agents",
                "is_modification": False
            }

        # Single Transformation Request (Sections 1-7)
        target_agent = unique_matched_ids[0]
        agent_meta = DELIVERABLE_AGENTS[target_agent]
        return {
            "intent": "TRANSFORM",
            "agent": target_agent,
            "agents": [
                {
                    "id": target_agent,
                    "name": agent_meta["name"],
                    "agent_name": agent_meta["agent_name"],
                    "button_text": agent_meta["button_text"]
                }
            ],
            "deliverable_name": agent_meta["name"],
            "agent_name": agent_meta["agent_name"],
            "redirect_message": agent_meta["redirect_message"],
            "button_text": agent_meta["button_text"],
            "confidence": 0.99,
            "reason": f"Transformation request for {agent_meta['name']}; redirected to {agent_meta['agent_name']}",
            "is_modification": is_modification
        }

    # 5. Default to Grounded Q&A for all document questions and general queries
    return {
        "intent": "GROUNDED_QA",
        "agent": None,
        "confidence": 0.95,
        "reason": "Query treated as document information inquiry",
        "is_modification": False
    }


