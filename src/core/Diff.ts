// 주어진 두 엘리먼트가 다른지 여부를 확인하는 함수
export const isDiffrentNode = (node1: Element, node2: Element) => {
  // 두 엘리먼트의 속성 노드를 가져옴
  const n1Attributes = node1.attributes;
  const n2Attributes = node2.attributes;

  // 속성의 개수가 다르면 두 엘리먼트가 다르다고 판단
  if (n1Attributes.length !== n2Attributes.length) {
    return true;
  }

  // 각 속성을 비교하여 다른 속성이 있는지 확인
  const differentAttribute = Array.from(n1Attributes).find((attribute) => {
    const { name } = attribute;
    const attribute1 = node1.getAttribute(name);
    const attribute2 = node2.getAttribute(name);

    return attribute1 !== attribute2;
  });

  // 다른 속성이 있다면 두 엘리먼트가 다르다고 판단
  if (differentAttribute) {
    return true;
  }

  // 두 엘리먼트의 자식이 모두 없고, 텍스트 콘텐츠가 다르면 다르다고 판단
  if (
    node1.children.length === 0 &&
    node2.children.length === 0 &&
    node1.textContent !== node2.textContent
  ) {
    return true;
  }

  // 모든 비교를 통과하면 두 엘리먼트는 동일하다고 판단
  return false;
};

// 가상 DOM과 실제 DOM 간의 차이를 계산하여 적용하는 함수
// parentNode - body
const diff = (parentNode: Element, realNode: Element, virtualNode: Element) => {
  // 만약 실제 노드가 있고, 가상 노드가 없다면 실제 노드를 제거
  // if (realNode && !virtualNode) {
  //   realNode.remove();
  //   return;
  // }

  // 만약 실제 노드가 없고, 가상 노드가 있다면 가상 노드를 부모 노드에 추가
  if (!realNode && virtualNode) {
    parentNode.appendChild(virtualNode);
    return;
  }

  // 두 노드가 다르면 가상 노드로 실제 노드를 교체
  if (isDiffrentNode(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode);
    return;
  }

  // 실제 노드와 가상 노드의 자식 노드를 가져옴
  const realChildren = Array.from(realNode.children);
  const virtualChildren = Array.from(virtualNode.children);

  // 두 자식 노드 배열 중 최대 길이를 구함
  const max = Math.max(realChildren.length, virtualChildren.length);

  // 각 인덱스에 대해 재귀적으로 diff 함수 호출
  for (let i = 0; i < max; i++) {
    diff(realNode, realChildren[i], virtualChildren[i]);
  }
};

// diff 함수를 모듈로 내보냄
export default diff;
