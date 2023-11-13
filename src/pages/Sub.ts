import Header from "@/components/Header";
import Component, { PropsType, StateType } from "@/core/Component";

export default class Sub extends Component<PropsType, StateType> {
  didMount(): void {
    const $header = this.target.querySelector("header");
    new Header($header as Element, { propTest: "subprop" });
  }

  template() {
    return `
      <div class='main-page'>
        <header></header>
        SubPagess
      </div>
    `;
  }
}
