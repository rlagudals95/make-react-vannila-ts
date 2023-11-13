import Header from "@/components/Header";
import Component, { PropsType, StateType } from "@/core/Component";

export default class Main extends Component<PropsType, StateType> {
  didMount(): void {
    const $header = this.target.querySelector("header");
    new Header($header as Element, { propTest: "mainprop" });
  }

  template() {
    return `
      <div class='main-page'>
        <header></header>
        MainPage
      </div>
    `;
  }
}
