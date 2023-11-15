// dirtyindex로 시작하는 특별한 태그를 처리하기 위한 상수들
const DIRTY_PREFIX = "dirtyindex:";
const DIRTY_REGEX = /dirtyindex:(\d+):/;
const DIRTY_REGEX_G = /dirtyindex:(\d+):/g;
const DIRTY_SEPERATOR_REGEX_G = /(dirtyindex:\d+:)/g;

// JSX 함수 정의
const jsx = (strings: TemplateStringsArray, ...args: any[]): HTMLElement => {
  // 첫 번째 문자열이 없는 경우, 하지만 args가 존재할 때 에러 발생
  if (!strings[0] && args.length) {
    throw new Error("Failed To Parse");
  }

  // 가상 DOM을 나타내는 frame 엘리먼트 생성
  let template = document.createElement("frame");
  // 템플릿 문자열을 dirtyindex로 치환한 문자열로 변환
  template.innerHTML = strings
    .map((str, index) => {
      const argsString = args.length > index ? `${DIRTY_PREFIX}${index}:` : "";
      return `${str}${argsString}`;
    })
    .join("");

  // 문자열 치환을 위한 함수
  function replaceSubstitution(match: string, index: string) {
    const replacement = args[Number(index)];
    if (typeof replacement === "string") {
      return replacement;
    } else if (typeof replacement === "number") {
      return `${replacement}`;
    }
    return "";
  }

  // 속성을 치환하는 함수
  function replaceAttribute(name: string, value: any, element: HTMLElement) {
    if (typeof value === "function") {
      // 함수인 경우 이벤트 리스너로 등록하고 해당 속성을 제거
      element.addEventListener(name.replace("on", "").toLowerCase(), value);
      element.removeAttribute(name);
    } else if (["string", "number"].includes(typeof value)) {
      // 문자열 또는 숫자인 경우, 해당 속성 값을 dirtyindex로 치환
      const attribute = element.getAttribute(name);
      const replaced_attr = attribute?.replace(
        DIRTY_REGEX_G,
        replaceSubstitution
      );
      element.setAttribute(name, replaced_attr ?? "");
    } else if (typeof value === "boolean") {
      // 불리언인 경우, 값이 true이면 속성을 추가하고, false이면 제거
      if (value === true) {
        element.setAttribute(name, "");
      } else {
        element.removeAttribute(name);
      }
    }
  }

  // 텍스트 노드를 처리하는 함수
  function handleTextNode(node: Node) {
    if (node.nodeType !== Node.TEXT_NODE) return;
    if (!node.nodeValue?.includes(DIRTY_PREFIX)) return;

    // dirtyindex를 기준으로 텍스트 노드를 분리하여 처리
    const texts = node.nodeValue.split(DIRTY_SEPERATOR_REGEX_G);
    const doms = texts.map((text) => {
      const dirtyIndex = DIRTY_REGEX.exec(text)?.[1];
      if (!dirtyIndex) return buildDocumentFragmentWith(text);

      const arg = args[Number(dirtyIndex)];
      if (arg instanceof Node) return arg;
      if (arg instanceof Array) {
        // 배열인 경우, 각 엘리먼트를 DocumentFragment에 추가
        const df = document.createDocumentFragment();

        arg.forEach(($el) => {
          // 문자열을 파싱하여 노드로 만든 후 DocumentFragment에 추가
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = $el;
          const childNodes = tempDiv.childNodes;

          // 모든 자식 노드를 DocumentFragment에 추가
          while (childNodes.length > 0) {
            df.appendChild(childNodes[0]);
          }
        });

        return df;
      }
      return buildDocumentFragmentWith(arg);
    });

    // 분리된 DOM들을 텍스트 노드 앞에 삽입
    for (const dom of doms) {
      node.parentNode?.insertBefore(dom, node);
    }
    node.nodeValue = ""; // 기존 텍스트 노드의 값을 비움
  }

  // DOM을 텍스트 노드로 만들어주는 함수
  function buildDocumentFragmentWith(str?: string) {
    const df = document.createDocumentFragment();
    if (!str) return df;
    df.appendChild(document.createTextNode(str));
    return df;
  }

  // 트리 순회를 위한 NodeIterator 생성
  let walker = document.createNodeIterator(template, NodeFilter.SHOW_ALL);
  let node;
  while ((node = walker.nextNode())) {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue?.includes(DIRTY_PREFIX)
    ) {
      // 텍스트 노드이면서 dirtyindex를 포함하고 있는 경우 처리
      handleTextNode(node);
      continue;
    }

    node = <HTMLElement>node;

    // 노드의 속성을 순회하며 dirtyindex를 가진 속성을 처리
    let attributes: Attr[] = Array.from(node.attributes ?? []);

    for (let { name, value } of attributes) {
      if (name && value.includes(DIRTY_PREFIX)) {
        // dirtyindex를 추출하여 해당 인덱스의 값으로 속성을 치환
        const match = DIRTY_REGEX.exec(value);
        if (!match) continue;
        value = args[Number(match[1])];

        replaceAttribute(name, value, node);
      }
    }
  }

  // 최종적으로 구성된 template의 첫 번째 자식 엘리먼트를 반환
  return <HTMLElement>template.firstElementChild ?? template;
};

// jsx 함수를 모듈로 내보냄
export default jsx;
