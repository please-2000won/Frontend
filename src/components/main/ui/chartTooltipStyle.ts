import type { CSSProperties } from 'react';

// Recharts 기본 툴팁은 항목 글씨를 시리즈 색으로 칠하는데,
// 옅은 민트 계열은 흰 배경에서 잘 안 보인다. 항상 진한 글씨로 강제한다.
export const TOOLTIP_CONTENT_STYLE: CSSProperties = {
  borderRadius: 8,
  border: '1px solid #e5e5e5',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  fontSize: 13,
};

export const TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: '#013e39',
  fontWeight: 600,
  marginBottom: 4,
};

export const TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: '#1a1a1a',
};
