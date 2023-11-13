import { updateRealDOM } from "../index";

// Props와 State의 타입을 정의하는 인터페이스
export interface PropsType {}
export interface StateType {}

// Partial 타입을 재정의하여 모든 속성을 선택적으로 만듦
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 컴포넌트의 고유한 식별자 타입 정의
export type ComponentId = string;

// 컴포넌트 클래스 시작
const TAG: string = "C-";

export default class Component<
  P extends PropsType = PropsType, // Props의 기본값은 PropsType
  S extends StateType = StateType // State의 기본값은 StateType
> {
  props: P;
  state: S;

  id: ComponentId = TAG + Component.ID; // 컴포넌트 인스턴스마다 고유한 ID 생성
  $dom: Element; // 실제 DOM 엘리먼트

  static ID: number = 0; // 컴포넌트의 ID 초기값

  shouldUpdate = true; // 업데이트 여부를 나타내는 플래그

  constructor(props: P) {
    ++Component.ID; // 컴포넌트가 생성될 때마다 ID 증가
    this.props = props;
    this.state = {} as S; // 초기 state를 빈 객체로 설정
    this.$dom = document.createElement("code"); // 가상 DOM 엘리먼트 생성
  }

  willMount() {}
  willUpdate() {}
  didMount() {}
  didUpdate() {}

  // DOM을 설정하는 메서드
  setDom(): void {
    this.willMount();
    this.$dom = this.render() as Element; // 렌더링 결과를 DOM에 할당
    this.didMount();
  }

  // 렌더링 메서드. 자식 클래스에서 구현되어야 함
  render(): HTMLElement | ChildNode | DocumentFragment {
    throw new Error("need to be implemented");
  }

  // DOM 업데이트 메서드
  updateDOM(): void {
    const $copy = this.render(); // 새로운 렌더링 결과를 얻음
    this.$dom.parentNode?.replaceChild($copy, this.$dom); // 이전 DOM을 새로운 DOM으로 교체
    this.$dom = $copy as Element; // 새로운 DOM으로 업데이트
  }

  // 전체 업데이트 메서드
  update(): void {
    this.willMount();
    this.willUpdate();
    this.updateDOM();
    this.didUpdate();
  }

  // State를 업데이트하고 실제 DOM에 반영
  setState(newState: Partial<S>) {
    const nextState = { ...this.state, ...newState };
    if (JSON.stringify(this.state) === JSON.stringify(nextState)) {
      return; // 새로운 State와 현재 State가 같으면 업데이트를 수행하지 않음
    }
    this.state = nextState; // 새로운 State로 업데이트
    this.update(); // 전체 업데이트 수행
    updateRealDOM(); // 실제 DOM 업데이트
  }
}
