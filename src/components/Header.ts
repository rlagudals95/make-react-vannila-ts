import Component, { PropsType, StateType } from "@/core/Component";
import jsx from "@/core/JSX";
import { $router } from "@/core/Router";

export default class Header extends Component<PropsType, StateType> {
  $headerDate: Element = jsx``;

  constructor(props: PropsType) {
    super(props);

    this.setDom();
  }

  render() {
    return jsx`
      <header class='header'>
        <div onClick=${() => $router.push("/")}>MainPage</div>
        <div onClick=${() => $router.push("/sub")}>SubPage</div>
      </header>
    `;
  }
}
