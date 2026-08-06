function textContent(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  return Array.isArray(node.children) ? node.children.map(textContent).join('') : '';
}

function walk(node, parent) {
  if (!node) return;
  if (node.type === 'element' && node.tagName === 'input' && node.properties?.type === 'checkbox') {
    const label = textContent(parent).trim().replace(/\s+/g, ' ');
    node.properties = {
      ...node.properties,
      ariaLabel: label ? `체크리스트 항목: ${label}` : '체크리스트 항목'
    };
  }
  if (Array.isArray(node.children)) node.children.forEach((child) => walk(child, node));
}

export default function rehypeTaskLabels() {
  return (tree) => walk(tree, undefined);
}
