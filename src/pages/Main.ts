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
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀1",
      desc: "상세내용 입니다1.",
    },
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀2",
      desc: "상세내용 입니다2.",
    },
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀3",
      desc: "상세내용 입니다3.",
    },
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀4",
      desc: "상세내용 입니다4.",
    },
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀4",
      desc: "상세내용 입니다4.",
    },
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀4",
      desc: "상세내용 입니다4.",
    },
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀4",
      desc: "상세내용 입니다4.",
    },
    {
      image:
        "https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg",
      title: "타이틀4",
      desc: "상세내용 입니다4.",
    },
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
                <h1 class='title'>${data.title}</h1>
                <p class='desc'>${data.desc}</p>
              </div>
              `
          )}
        </div>
        ${this.$bottomNav}
      </div>
    `;
  }
}
