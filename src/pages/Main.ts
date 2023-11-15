import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Component, { PropsType, StateType } from "@/core/Component";
import jsx from "@/core/JSX";

interface MockData {
  image: string;
  title: string;
  desc: string;
}
export default class Main extends Component<PropsType, StateType> {
  $header: Element;
  $bottomNav: Element;
  $mockDadas: MockData[] = [
    { image: "image.png", title: "타이틀1", desc: "상세내용 입니다1." },
    { image: "image.png", title: "타이틀2", desc: "상세내용 입니다2." },
    { image: "image.png", title: "타이틀3", desc: "상세내용 입니다3." },
  ];

  constructor(props: PropsType) {
    super(props);

    this.$header = new Header({}).$dom;
    this.$bottomNav = new BottomNav({}).$dom;

    this.setDom();
  }

  render() {
    return jsx`
      <div class='main-page'>
        ${this.$header}
        <div class='grid-box'>
          ${this.$mockDadas.map(
            (data, index) =>
              `
              <div key='${index}' class='item-card'>
                <img src='${data.image}' class='square-image'/>
                <h1 class='title'>제목</h1>
              </div>
              `
          )}
        </div>
        ${this.$bottomNav}
      </div>
    `;
  }
}
