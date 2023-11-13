import { deepEqual } from "../utils/compare";

export interface PropsType {}
export interface StateType {}

export default class Component<P extends PropsType, S extends StateType> {
  target: Element; // 해당 컴포넌트가 들어갈 Element
  props: P;
  state: S;

  constructor(target: Element, props: P) {
    this.target = target;
    this.props = props;
    this.state = {} as S;
    this.setup();
    this.mount();
    this.setEvent();
  }

  setup() {}
  template() {
    // 실제 element를 그리는 메소드
    return "";
  }

  render() {
    const template = this.template();
    if (template) {
      this.target.innerHTML = template;
    }
  }

  mount() {
    // react life cycle의 didmount
    this.render();
    this.didMount();
  }

  update(): void {
    // react life cycle의 didUpdate
    this.render();
    this.didUpdate();
  }

  didMount() {}
  didUpdate() {}

  setState(newState: Partial<S>) {
    const nextState = { ...this.state, ...newState };
    if (deepEqual(this.state, nextState)) {
      return;
    }
    this.state = nextState;
    this.update();
  }

  setEvent() {}
  addEvent(eventType: string, selector: string, callback: Function) {
    const children: Element[] = [...this.target.querySelectorAll(selector)];
    const isTarget = (target: Element) =>
      children.includes(target) || target.closest(selector);
    this.target.addEventListener(eventType, (event: any) => {
      if (!isTarget(event.target)) return false;
      callback(event);
    });
  }
}
