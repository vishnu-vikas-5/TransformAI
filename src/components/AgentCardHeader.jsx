import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * AgentCardHeader - Standardized Header for all SyntaxX Agent Cards
 * 
 * Header layout:
 * ┌─────────────────────────────────────────────┐
 * │ [ AGENT TAG ]          [ VALIDATION BADGE ] │
 * │                                             │
 * │ Agent Title                                 │
 * └─────────────────────────────────────────────┘
 * 
 * Design Standards (Strict CSS Grid):
 * - AGENT TAG and VALIDATION BADGE locked on the SAME horizontal row via CSS Grid
 * - Never wraps to a second row; flex-wrap: wrap is forbidden
 * - AGENT TITLE is a separate block element directly BELOW the top row
 * - All titles start at the left edge of card content
 * - Reserved consistent title height (min-height: 54px) for uniform vertical rhythm across cards
 * - Zero absolute positioning; 100% responsive document flow
 */
export default function AgentCardHeader({
  agentLabel,
  title,
  validation,
  validationValue,
  validationType = 'grounded',
  icon: CustomIcon
}) {
  const rawValue = String(validation || validationValue || '99.5% GROUNDED').trim();
  const upperVal = rawValue.toUpperCase();

  // Multi-line formatting for fact badges (e.g. "18/18 FACTS VERIFIED" or "12/12 KEY FACTS VERIFIED")
  let lines = [];
  if (upperVal.includes(' FACTS VERIFIED')) {
    const prefix = upperVal.replace(/\s+VERIFIED$/, '');
    lines = [prefix, 'VERIFIED'];
  } else if (upperVal.includes(' KEY FACTS VERIFIED')) {
    const prefix = upperVal.replace(/\s+VERIFIED$/, '');
    lines = [prefix, 'VERIFIED'];
  } else {
    lines = [upperVal];
  }

  const isMultiLine = lines.length > 1;

  return (
    <div className="agent-card-header">
      {/* TOP ROW: CSS Grid locking Tag on Left and Badge on Right on the SAME row */}
      <div className="agent-header-top">
        <span className="agent-tag" title={agentLabel}>
          {agentLabel}
        </span>

        <span className="grounding-badge" title={upperVal} data-validation-type={validationType}>
          <div className="badge-content">
            {CustomIcon ? (
              <CustomIcon size={12} className="badge-icon" />
            ) : (
              <CheckCircle2 size={12} className="badge-icon" />
            )}
            {isMultiLine ? (
              <div className="badge-text-stack">
                <span>{lines[0]}</span>
                <span>{lines[1]}</span>
              </div>
            ) : (
              <span className="badge-text-single">{lines[0]}</span>
            )}
          </div>
        </span>
      </div>

      {/* TITLE ROW: Starts at left edge of card content, strictly BELOW top row */}
      <h3 className="agent-title">
        {title}
      </h3>
    </div>
  );
}
