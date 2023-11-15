import Component, { PropsType, StateType } from "@/core/Component";
import jsx from "@/core/JSX";
import { $router } from "@/core/Router";

export default class BottomNav extends Component<PropsType, StateType> {
  $headerDate: Element = jsx``;

  constructor(props: PropsType) {
    super(props);

    this.setDom();
  }

  render() {
    return jsx`
      <div class='bottom-nav'>
        <div>장바구니</div>
        <div>장바구니</div>
        <div>장바구니</div>
        <div>장바구니</div>
      </div>
    `;
  }
}
