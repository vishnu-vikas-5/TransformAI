"""
TransformAI Unified Design System — Backend Theme
Centralized design tokens and color constants for all server-side artefacts:
- Executive Summary PDF (ReportLab Platypus)
- Structured Advisory PDF (ReportLab Platypus)
- Infographic / Poster PDF (ReportLab Platypus)
- Video Package PDF & Video Engine (Pillow / OpenCV / MoviePy)

Strict Reference Visual System:
- OBSIDIAN BLACK:   #000000
- DEEP ONYX:        #121212
- WARM SAND GOLD:   #DFD0B8
- WARM CREAM:       #E1DCC9
- PURE WHITE:       #FFFFFF
"""

from reportlab.lib.colors import HexColor

# ---------------------------------------------------------------------------
# 1. Canonical Hex Strings (Official Palette Source of Truth)
# ---------------------------------------------------------------------------
HEX_BLACK       = '#000000'  # Pure Obsidian Black: Main Page Background, Modal Backdrops & Deep Surfaces
HEX_ONYX        = '#121212'  # Dark Onyx Surface: Panel backgrounds, Cards, Code Blocks & Dropdowns
HEX_SAND_GOLD   = '#DFD0B8'  # Warm Sand Gold: Primary Accents, Active Indicators, Card Borders, Primary Buttons, & Icons
HEX_CREAM       = '#E1DCC9'  # Warm Cream Sand: Secondary Text, Sub-accents, Button Hover States & Badge Borders
HEX_WHITE       = '#FFFFFF'  # Pure Crisp White: Primary Headings, Main Body Text & High Contrast Elements
HEX_MUTED       = '#A0A0A0'  # Muted Grey: Subtitles, Muted Metadata & Placeholder text

# Aliases for backward compatibility with existing generator modules
HEX_DARK_BROWN  = '#121212'
HEX_DEEP_BROWN  = '#181818'
HEX_PURPLE_800  = '#121212'
HEX_PURPLE_100  = '#F7F5EE'

# Supporting Editorial Tints
HEX_CREAM_MUTED = '#DFD0B8'
HEX_CREAM_TINT  = '#F7F5EE'
HEX_CREAM_BORDER= '#DFD0B8'

# Alert Accents
HEX_ALERT_RED   = '#8B1E1E'
HEX_ALERT_RED_BG= '#F9ECEC'
HEX_ALERT_AMB   = '#DFD0B8'
HEX_ALERT_AMB_BG= '#FAF1E4'
HEX_ALERT_GRN   = '#235E35'
HEX_ALERT_GRN_BG= '#EBF5EE'

# ---------------------------------------------------------------------------
# 2. ReportLab HexColor Tokens
# ---------------------------------------------------------------------------
# Core Palette
C_BLACK       = HexColor(HEX_BLACK)
C_ONYX        = HexColor(HEX_ONYX)
C_DARK_BROWN  = HexColor(HEX_DARK_BROWN)
C_DEEP_BROWN  = HexColor(HEX_DEEP_BROWN)
C_SAND_GOLD   = HexColor(HEX_SAND_GOLD)
C_CREAM       = HexColor(HEX_CREAM)
C_WHITE       = HexColor(HEX_WHITE)
C_MUTED       = HexColor(HEX_MUTED)
C_PURPLE_800  = HexColor(HEX_PURPLE_800)
C_PURPLE_100  = HexColor(HEX_PURPLE_100)

# Semantic Tokens for Document Generation
C_NAVY_950    = HexColor('#000000')        # Pure black / primary heading
C_NAVY_900    = HexColor('#121212')        # Dark onyx / structural headers
C_NAVY_800    = HexColor('#DFD0B8')        # Warm sand gold / major accents & borders
C_BLUE_ACCENT = HexColor('#DFD0B8')        # Warm sand gold accent fill
C_BLUE_LIGHT  = HexColor('#F7F5EE')        # Warm pale cream tint

C_SLATE_900   = HexColor('#000000')        # Primary high-contrast body text
C_SLATE_800   = HexColor('#121212')        # Secondary dark body text
C_SLATE_700   = HexColor('#181818')        # Regular body text
C_SLATE_600   = HexColor('#505050')        # Warm editorial muted secondary
C_SLATE_500   = HexColor('#757575')        # Metadata, footnotes, running footers
C_SLATE_200   = HexColor('#DFD0B8')        # Clean subtle borders (#DFD0B8)
C_SLATE_100   = HexColor('#F5F2E9')        # Light cream table header / card fill
C_SLATE_50    = HexColor('#FAFAF8')        # Alternating table row background

C_RED_800     = HexColor(HEX_ALERT_RED)    # Critical alert text
C_RED_100     = HexColor(HEX_ALERT_RED_BG) # Critical alert background
C_AMBER_800   = HexColor('#A66A1E')        # Warning / Amber text
C_AMBER_100   = HexColor(HEX_ALERT_AMB_BG) # Warning / Amber background
C_GREEN_800   = HexColor(HEX_ALERT_GRN)    # Verified text
C_GREEN_100   = HexColor(HEX_ALERT_GRN_BG) # Verified background

# ---------------------------------------------------------------------------
# 3. Video Engine RGB Tuples (Pillow / OpenCV / MoviePy)
# ---------------------------------------------------------------------------
RGB_BLACK        = (0, 0, 0)
RGB_ONYX         = (18, 18, 18)
RGB_SAND_GOLD    = (223, 208, 184)
RGB_CREAM        = (225, 220, 201)
RGB_WHITE        = (255, 255, 255)
RGB_MUTED        = (160, 160, 160)

RGB_DARK_BROWN    = (18, 18, 18)
RGB_DEEP_BROWN    = (24, 24, 24)

RGB_BG_DARK       = (0, 0, 0)           # Canvas
RGB_BG_CARD       = (18, 18, 18)        # Section Cards
RGB_BG_INNER      = (24, 24, 24)        # Sub-Cards / Inner Fills
RGB_BORDER        = (223, 208, 184)     # Structural borders

RGB_TEXT_LIGHT    = (255, 255, 255)     # High-contrast pure white primary text
RGB_TEXT_MUTED    = (225, 220, 201)     # Warm cream subtitles & metadata

RGB_ACCENT_GOLD   = (223, 208, 184)     # Warm sand gold accent
RGB_ACCENT_RED    = (139, 30, 30)       # Critical red
RGB_ACCENT_AMBER  = (223, 208, 184)     # Warm sand gold
RGB_ACCENT_CYAN   = (223, 208, 184)     # Warm sand gold
RGB_ACCENT_GREEN  = (35, 94, 53)        # Editorial green

# Platform Brand Strings
BRAND_NAME        = "TransformAI"
BRAND_NAME_SHORT  = "TransformAI"
BRAND_NAME_FULL   = "TransformAI Agentic Intelligence Engine"
BRAND_SUITE_NAME  = "TRANSFORMAI AGENTIC INTELLIGENCE SUITE"
PLATFORM_TAGLINE  = "SOURCE-GROUNDED GENAI CONTENT TRANSFORMATION"
