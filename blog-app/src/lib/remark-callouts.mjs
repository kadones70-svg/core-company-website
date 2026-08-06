const TYPES = {
  INFO: { label: '참고', className: 'callout--info' },
  WARNING: { label: '주의', className: 'callout--warning' },
  DANGER: { label: '금지 및 오류', className: 'callout--danger' }
};

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    if (child.type === 'blockquote') transformCallout(child);
    walk(child);
  }
}

function transformCallout(node) {
  const paragraph = node.children?.[0];
  const text = paragraph?.children?.[0];
  if (!paragraph || paragraph.type !== 'paragraph' || !text || text.type !== 'text') return;

  const match = text.value.match(/^\[!(INFO|WARNING|DANGER)\]\s*/);
  if (!match) return;

  const config = TYPES[match[1]];
  text.value = text.value.slice(match[0].length);
  node.data = {
    ...(node.data || {}),
    hName: 'aside',
    hProperties: {
      className: ['callout', config.className],
      role: match[1] === 'INFO' ? 'note' : 'alert',
      'aria-label': config.label
    }
  };
  paragraph.children.unshift({
    type: 'strong',
    children: [{ type: 'text', value: `${config.label} ` }]
  });
}

export default function remarkCallouts() {
  return (tree) => walk(tree);
}
