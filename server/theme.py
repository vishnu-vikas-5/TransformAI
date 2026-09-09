"""
SyntaxX Unified Design System — Backend Theme
Centralized design tokens and color constants for all server-side artefacts:
- Executive Summary PDF (ReportLab Platypus)
- Structured Advisory PDF (ReportLab Platypus)
- Infographic / Poster PDF (ReportLab Platypus)
- Video Package PDF & Video Engine (Pillow / OpenCV / MoviePy)

Reference Palette:
- BLACK:       #000000
- DARK BROWN:  #1F150C
- DEEP BROWN:  #412D15
- CREAM:       #E1DCC9
"""

from reportlab.lib.colors import HexColor

# ---------------------------------------------------------------------------
# 1. Canonical Hex Strings
# ---------------------------------------------------------------------------
HEX_BLACK       = '#000000'
HEX_DARK_BROWN  = '#1F150C'
HEX_DEEP_BROWN  = '#412D15'
HEX_CREAM       = '#E1DCC9'

# Supporting Editorial Tints
HEX_CREAM_MUTED = '#B8B2A0'
HEX_CREAM_TINT  = '#F7F5EE'
HEX_CREAM_BORDER= '#D3CCA8'

# Alert Accents
HEX_ALERT_RED   = '#8B1E1E'
HEX_ALERT_RED_BG= '#F9ECEC'
HEX_ALERT_AMB   = '#A66A1E'
HEX_ALERT_AMB_BG= '#FAF1E4'
HEX_ALERT_GRN   = '#235E35'
HEX_ALERT_GRN_BG= '#EBF5EE'

# ---------------------------------------------------------------------------
# 2. ReportLab HexColor Tokens
# ---------------------------------------------------------------------------
# Core Palette
C_BLACK       = HexColor(HEX_BLACK)
C_DARK_BROWN  = HexColor(HEX_DARK_BROWN)
C_DEEP_BROWN  = HexColor(HEX_DEEP_BROWN)
C_CREAM       = HexColor(HEX_CREAM)
C_WHITE       = HexColor('#FFFFFF')

# Semantic Tokens for Document Generation
# Mapped to eliminate legacy Navy/Slate/Blue
C_NAVY_950    = HexColor('#000000')        # Pure black / primary heading
C_NAVY_900    = HexColor('#1F150C')        # Dark brown / structural headers
C_NAVY_800    = HexColor('#412D15')        # Deep brown / major accents & borders
C_BLUE_ACCENT = HexColor('#412D15')        # Deep brown accent fill
C_BLUE_LIGHT  = HexColor('#F4F1EA')        # Warm pale cream tint

C_SLATE_900   = HexColor('#1F150C')        # Primary high-contrast body text
C_SLATE_800   = HexColor('#1F150C')        # Secondary dark body text
C_SLATE_700   = HexColor('#2E2217')        # Regular body text
C_SLATE_600   = HexColor('#655442')        # Warm editorial muted secondary
C_SLATE_500   = HexColor('#82715F')        # Metadata, footnotes, running footers
C_SLATE_200   = HexColor('#D8D2BE')        # Clean subtle borders
C_SLATE_100   = HexColor('#EBE6D8')        # Light cream table header / card fill
C_SLATE_50    = HexColor('#F9F8F5')        # Alternating table row background

C_RED_800     = HexColor(HEX_ALERT_RED)    # Critical alert text
C_RED_100     = HexColor(HEX_ALERT_RED_BG) # Critical alert background
C_AMBER_800   = HexColor(HEX_ALERT_AMB)    # Warning / Amber text
C_AMBER_100   = HexColor(HEX_ALERT_AMB_BG) # Warning / Amber background
C_GREEN_800   = HexColor(HEX_ALERT_GRN)    # Verified text
C_GREEN_100   = HexColor(HEX_ALERT_GRN_BG) # Verified background

# ---------------------------------------------------------------------------
# 3. Video Engine RGB Tuples (Pillow / OpenCV / MoviePy)
# ---------------------------------------------------------------------------
RGB_BLACK        = (0, 0, 0)
RGB_DARK_BROWN    = (31, 21, 12)
RGB_DEEP_BROWN    = (65, 45, 21)
RGB_CREAM         = (225, 220, 201)

RGB_BG_DARK       = (0, 0, 0)           # Canvas
RGB_BG_CARD       = (31, 21, 12)        # Section Cards
RGB_BG_INNER      = (65, 45, 21)        # Sub-Cards / Inner Fills
RGB_BORDER        = (65, 45, 21)        # Structural borders

RGB_TEXT_LIGHT    = (225, 220, 201)     # High-contrast primary text
RGB_TEXT_MUTED    = (184, 178, 160)     # Subtitles & metadata

RGB_ACCENT_GOLD   = (225, 220, 201)     # Cream accent
RGB_ACCENT_RED    = (139, 30, 30)       # Critical red
RGB_ACCENT_AMBER  = (166, 106, 30)      # TLP amber
RGB_ACCENT_CYAN   = (225, 220, 201)     # Replaced with SyntaxX cream
RGB_ACCENT_GREEN  = (35, 94, 53)        # Editorial green

# Platform Brand Strings
BRAND_NAME        = "SyntaxX"
BRAND_NAME_SHORT  = "SyntaxX"
BRAND_NAME_FULL   = "SyntaxX Agentic Intelligence Engine"
BRAND_SUITE_NAME  = "SYNTAXX AGENTIC INTELLIGENCE SUITE"
PLATFORM_TAGLINE  = "SOURCE-GROUNDED GENAI CONTENT TRANSFORMATION"
