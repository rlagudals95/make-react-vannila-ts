import Component from "@/Component";
import { router } from "@/BrowserRouter";

interface HeaderProps {
  propTest: string;
}
interface HeaderState {
  stateTest: string;
}

export default class Header extends Component<HeaderProps, HeaderState> {
  setup() {
    this.state = {
      stateTest: "state",
    };
  }
  didMount() {
    const { propTest }: HeaderProps = this.props;
    this.setState({ stateTest: this.state.stateTest + propTest });
  }
  template() {
    const { stateTest } = this.state;
    return `
    <div class='header'>
      ${stateTest}
      <div id='main'>MainPage</div>
      <div id='sub'>SubPage</div>
    </div>
    `;
  }

  setEvent() {
    this.addEvent("click", "#main", () => {
      router.push("/");
    });
    this.addEvent("click", "#sub", () => {
      router.push("/sub");
    });
  }
}
