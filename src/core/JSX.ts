// "dirtyindex:"로 시작하는 prefix 및 이를 인식하기 위한 정규식들
const DIRTY_PREFIX = "dirtyindex:";
const DIRTY_REGEX = /dirtyindex:(\d+):/;
const DIRTY_SEPARATOR_REGEX_G = /(dirtyindex:\d+:)/g;

/** 속성 값이 함수일 경우 이벤트를 등록하는 함수 */
function replaceAttribute(name: string, value: any, element: Element) {
  if (typeof value === "function") {
    // 이벤트 리스너 등록
    element.addEventListener(name.replace("on", "").toLowerCase(), value);
    // 원래의 속성 제거
    element.removeAttribute(name);
  } else {
    console.log("This attribute is not a function");
  }
}

// DocumentFragment - 다른 노드를 담는 임시 컨테이너 역할을 하는 특수 목적의 노드이다. 가상의 노드 객체로서, 메모리상에서만 존재하는 비 문서 탬플릿으로 생각하면 된다. parentNode 프로퍼티는 항상 null이다.
// 주어진 문자열로 DocumentFragment를 만들어 반환하는 함수
function buildDocumentFragmentWith(str?: string) {
  const df = document.createDocumentFragment();
  if (!str) return df;
  // 주어진 문자열을 포함하는 텍스트 노드 추가
  df.appendChild(document.createTextNode(str));

  return df;
}

/** 순수 텍스트로 이루어지거나 내부에 속성이 없는 노드를 처리하는 함수 */
function handleNoAttribute(node: Node, args: any[]) {
  if (
    node.nodeType !== Node.TEXT_NODE ||
    !node.nodeValue?.includes(DIRTY_PREFIX)
  )
    return;

  // "dirtyindex:"로 분리된 텍스트를 배열로 만듦
  const texts = node.nodeValue.split(DIRTY_SEPARATOR_REGEX_G);

  // 텍스트를 노드로 변환하거나 해당하는 아규먼트로 대체하여 DocumentFragment로 만듦
  const doms = texts.map((text) => {
    const dirtyIndex = DIRTY_REGEX.exec(text)?.[1];
    if (!dirtyIndex) return buildDocumentFragmentWith(text);

    const arg = args[Number(dirtyIndex)];

    if (arg instanceof Node) {
      return arg;
    }

    return buildDocumentFragmentWith(arg);
  });

  // 만들어진 DocumentFragment들을 노드 이전에 삽입
  for (const dom of doms) {
    node.parentNode?.insertBefore(dom, node);
  }
  // 기존 텍스트 노드의 내용을 비움
  node.nodeValue = "";
}

/** 문자열 배열과 ${}에 포함된 아규먼트를 받아서, 처리를 거쳐 최종적으로 엘리먼트를 반환하는 함수 */
const jsx = (strings: TemplateStringsArray, ...args: any[]): Element => {
  if (!strings[0] && args.length) {
    throw new Error("Failed To Parse");
  }

  // 빈 DIV 엘리먼트를 생성하여 템플릿으로 사용
  let template = document.createElement("div");
  /**  문자열 배열이 나뉘어지기 때문에, 해당 아규먼트를 알맞게 할당해줄 수 있도록 표시를 하기 위한 프리픽스를 넣어주어 template에 값을 할당 */
  template.innerHTML = strings
    .map((str, index) => {
      const argsString = args.length > index ? `${DIRTY_PREFIX}${index}:` : "";
      return `${str}${argsString}`;
    })
    .join("");

  /** 대체된 프리픽스를 원래대로 되돌리기 위해 document 객체 내 이터레이터를 사용하여 모든 노드를 돌면서 확인함 */
  let walker = document.createNodeIterator(template, NodeFilter.SHOW_ALL);
  let node;
  while ((node = walker.nextNode())) {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue?.includes(DIRTY_PREFIX)
    ) {
      // 텍스트 노드가 "dirtyindex:"를 포함하면 해당 노드 처리
      handleNoAttribute(node, args);
      continue;
    }

    // 현재 노드를 Element로 타입 캐스팅
    node = <Element>node;

    // 노드의 속성들을 배열로 가져옴
    let attributes: Attr[] = Array.from(node.attributes ?? []);

    /** 함수와 같은 속성들을 변환 */
    for (let { name, value } of attributes) {
      console.log(name, value);
      // 속성 값이 "dirtyindex:"를 포함하면 처리
      if (name && value.includes(DIRTY_PREFIX)) {
        const match = DIRTY_REGEX.exec(value);
        if (!match) continue;
        // 해당하는 아규먼트로 속성 값을 대체하여 등록
        value = args[Number(match[1])];

        replaceAttribute(name, value, node);
      }
    }
  }

  // template의 첫 번째 자식 엘리먼트 반환. 없을 경우 template 반환
  return template.firstElementChild ?? template;
};

export default jsx;
