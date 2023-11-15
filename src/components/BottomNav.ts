import Component, { PropsType, StateType } from "@/core/Component";
import jsx from "@/core/JSX";
import { $router } from "@/core/Router";

interface NavMockDatas {
  name: string;
  path: string;
}
export default class BottomNav extends Component<PropsType, StateType> {
  $headerDate: Element = jsx``;
  navMockDatas: NavMockDatas[] = [
    { name: "검색", path: "" },
    { name: "찜", path: "" },
    { name: "장바구니", path: "" },
  ];

  constructor(props: PropsType) {
    super(props);

    this.setDom();
  }

  render() {
    return jsx`
      <div class='bottom-nav'>
        ${this.navMockDatas.map(
          (data, index) =>
            `
          <div>${data.name}</div>
         `
        )}
      </div>
    `;
  }
}
