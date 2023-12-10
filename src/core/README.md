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
  * setState(newState: Partial<S>): void: State를 업데이트하고 전체 업데이트를 수행하는 메서드로, 실제 DOM을 업데이트합니다.

  test

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


