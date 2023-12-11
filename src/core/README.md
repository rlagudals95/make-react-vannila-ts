## Component 클래스 

이 코드는 간단한 React 스타일의 Component 클래스를 정의한 TypeScript 코드입니다. 
해당 클래스는 컴포넌트의 생명주기와 DOM 업데이트를 관리하며, 각 컴포넌트 인스턴스는 고유한 ID를 갖습니다.

```typescript
  import Component, { PropsType, StateType } from './path-to-Component';

  // 사용자 정의 컴포넌트 생성
  class MyComponent extends Component<PropsType, StateType> {
    render(): HTMLElement {
      // 컴포넌트의 렌더링을 구현
      const element = document.createElement('div');
      element.textContent = 'Hello, World!';
      return element;
    }
  }
  
  // 컴포넌트 인스턴스 생성
  const myComponent = new MyComponent({});
  
  // 초기 렌더링 및 DOM 업데이트 수행
  myComponent.setDom();
  
  // State 업데이트 및 실제 DOM 업데이트 수행
  myComponent.setState({ newProp: 'new value' });
```

* 속성 및 메서드
  * props: P: 컴포넌트의 속성을 저장합니다.
  * state: S: 컴포넌트의 상태를 저장합니다.
  * id: ComponentId: 컴포넌트 인스턴스의 고유한 ID입니다.
  * $dom: Element: 실제 DOM 엘리먼트를 나타냅니다.
  * shouldUpdate: boolean: 업데이트 여부를 나타내는 플래그입니다.

* 생명주기 메서드
  * willMount(): 컴포넌트가 마운트되기 전에 호출되는 메서드입니다.
  * willUpdate(): 컴포넌트가 업데이트되기 전에 호출되는 메서드입니다.
  * didMount(): 컴포넌트가 마운트된 후에 호출되는 메서드입니다.
  * didUpdate(): 컴포넌트가 업데이트된 후에 호출되는 메서드입니다.

* 기타 메서드
  * setDom(): void: DOM을 설정하는 메서드로, willMount, render, didMount 메서드를 호출합니다.
  * render(): HTMLElement | ChildNode | DocumentFragment: 렌더링 메서드로, 자식 클래스에서 반드시 구현되어야 합니다.
  * updateDOM(): void: DOM을 업데이트하는 메서드로, 실제 DOM을 새로운 DOM으로 교체합니다.
  * update(): void: 전체 업데이트를 수행하는 메서드로, willMount, willUpdate, updateDOM, didUpdate 메서드를 호출합니다.
  * setState(newState: Partial): State를 업데이트하고 전체 업데이트를 수행하는 메서드로, 실제 DOM을 업데이트합니다.


* 예외 처리
  * render 메서드는 자식 클래스에서 반드시 구현되어야 하며, 그렇지 않으면 에러가 발생합니다.
  * 이 클래스를 사용하여 React 스타일의 컴포넌트를 만들고 관리할 수 있습니다. 해당 컴포넌트는 가상 DOM을 사용하여 업데이트를 추적하고, State 변경 시 실제 DOM을 업데이트하여 사용자 인터페이스를 반응적으로 유지합니다.



## React Diffing 알고리즘 구현
이 코드는 React의 가상 DOM 조정 프로세스에서 중요한 부분인 React Diffing 알고리즘의 구현입니다. 
이 알고리즘은 가상 DOM과 실제 DOM 간의 차이를 효율적으로 식별하고 실제 DOM을 업데이트합니다.

* 구현 세부사항
isDifferentNode 함수는 두 HTML 엘리먼트를 비교하여 다른지 여부를 결정합니다. 
엘리먼트의 태그 이름, 속성, 자식 및 텍스트 콘텐츠를 고려합니다. 
이러한 속성 중 어느 하나라도 다르면 함수는 true를 반환하여 노드가 다르다고 판단합니다

```typescript
  export const isDifferentNode = (node1: Element, node2: Element): boolean => {
    // 태그 이름이 다르면 다르다고 판단
    if (node1.tagName !== node2.tagName) {
      return true;
    }
  
    // 속성 노드 개수가 다르면 다르다고 판단
    const n1Attributes = node1.attributes;
    const n2Attributes = node2.attributes;
    if (n1Attributes.length !== n2Attributes.length) {
      return true;
    }
  
    // 각 속성을 비교하여 다른 속성이 있는지 확인
    for (const attribute of n1Attributes) {
      const { name } = attribute;
      const attribute1 = node1.getAttribute(name);
      const attribute2 = node2.getAttribute(name);
  
      if (attribute1 !== attribute2) {
        return true;
      }
    }
  
    // 자식 노드 개수가 다르면 다르다고 판단
    if (node1.children.length !== node2.children.length) {
      return true;
    }
  
    // 재귀적으로 각 자식 노드를 비교하여 다른 자식이 있는지 확인
    for (let i = 0; i < node1.children.length; i++) {
      const child1 = node1.children[i];
      const child2 = node2.children[i];
  
      if (isDifferentNode(child1, child2)) {
        return true;
      }
    }
  
    // 텍스트 콘텐츠가 다르면 다르다고 판단
    if (node1.textContent !== node2.textContent) {
      return true;
    }
  
    // 모든 비교를 통과하면 두 엘리먼트는 동일하다고 판단
    return false;
  };
```



* diff 함수는 가상 DOM(virtualNode)과 실제 DOM(realNode) 간의 차이를 계산하고 적용합니다. 노드 제거, 노드 추가, 노드 교체와 같은 시나리오를 처리합니다.

```typescript
  const diff = (parentNode: Element, realNode: Element, virtualNode: Element) => {
    // 만약 실제 노드가 있고, 가상 노드가 없다면 실제 노드를 제거
    if (realNode && !virtualNode) {
      realNode.remove();
      return;
    }
  
    // 만약 실제 노드가 없고, 가상 노드가 있다면 가상 노드를 부모 노드에 추가
    if (!realNode && virtualNode) {
      parentNode.appendChild(virtualNode);
      return;
    }
  
    // 두 노드가 다르면 가상 노드로 실제 노드를 교체
    if (isDifferentNode(virtualNode, realNode)) {
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
```


## JSX 구현

* 구현 세부사항
 * DirtyIndex 처리
  * "dirtyindex:"로 시작하는 특수 태그를 도입하여 JSX 표현식과 치환을 처리합니다.
  *  DIRTY_PREFIX, DIRTY_REGEX, DIRTY_REGEX_G, 및 DIRTY_SEPERATOR_REGEX_G 상수가 dirtyindex 태그를 다루기 위해 정의되어 있습니다.

 * JSX 함수
  * jsx라는 함수가 정의되어 JSX 표현식을 처리하고 가상 DOM을 생성합니다.
  * TemplateStringsArray와 추가 인수를 받아 JSX 템플릿과 동적 값들을 나타냅니다.
  * 이 함수는 frame 엘리먼트를 사용하여 가상 DOM을 시뮬레이션합니다.

 * 템플릿 처리
  * 템플릿 문자열은 표현식을 dirtyindex 태그로 대체하기 위해 처리됩니다.
  * 이벤트 리스너, 문자열 또는 숫자 값, 논리 속성은 적절히 대체되거나 가상 DOM에 추가됩니다.

 * 텍스트 노드 처리
  * dirtyindex 태그를 포함하는 가상 DOM의 텍스트 노드는 분할되어 해당하는 DOM 엘리먼트가 그 자리에 삽입됩니다.

* 순회를 위한 NodeIterator
  * NodeIterator가 사용되어 가상 DOM을 순회하고 속성 및 텍스트 노드의 dirtyindex 태그를 처리합니다.


```typescipt
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
            // 새로운 div를 만들지 않고, 바로 파싱하여 DocumentFragment에 추가
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = $el;
  
            // 모든 자식 노드를 DocumentFragment에 직접 추가
            df.append(...tempDiv.childNodes);
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
```




