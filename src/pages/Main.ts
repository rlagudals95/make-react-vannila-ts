import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Component, { PropsType, StateType } from "@/core/Component";
import jsx from "@/core/JSX";
import { Gender, UserHealthInfo } from "@/utils/bmr";

type MainState = UserHealthInfo & {};

export default class Main extends Component<PropsType, MainState> {
  $header: Element;
  $bottomNav: Element;

  handleChangeWeight: (e: InputEvent) => void;
  handleClickWeight: () => void;

  constructor(props: PropsType) {
    super(props);

    this.$header = new Header({}).$dom;
    this.$bottomNav = new BottomNav({}).$dom;

    this.state = {
      weight: 0,
      height: 0,
      gender: Gender.Male,
      age: 0,
    } as MainState;

    this.handleChangeWeight = (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      this.setState({ ...this.state, weight: parseFloat(target.value) });
    };

    this.setDom();
  }

  render() {
    return jsx`
      <div class='main-page'>
        ${this.$header}
        ${this.state.weight}
        <div class='flex-box-column'>
          <input type="number" value=${this.state.weight} onChange=${this.handleChangeWeight} required>
        </div>
     
      </div>
    `;
  }
}
