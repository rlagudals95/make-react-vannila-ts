import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Component, { PropsType } from "@/core/Component";
import jsx from "@/core/JSX";
import { Gender, UserHealthInfo } from "@/utils/bmr";
import { ApiClient } from "@/api/ApiClient";

type MainState = UserHealthInfo & { apiHealthCheck: string };

export default class Main extends Component<PropsType, MainState> {
  $header: Element;
  $bottomNav: Element;

  handleChangeWeight: (e: InputEvent) => void;

  constructor(props: PropsType) {
    super(props);

    this.$header = new Header({}).$dom;
    this.$bottomNav = new BottomNav({}).$dom;

    this.state = {
      weight: 0,
      height: 0,
      gender: Gender.Male,
      age: 0,
      apiHealthCheck: "",
    } as MainState;

    this.willMount = () => {
      const api = new ApiClient("http://localhost:5001");

      api
        .get<{ data: string }>("health")
        .then((response) => {
          this.setState({ ...this.state, apiHealthCheck: response.data });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ ...this.state, apiHealthCheck: "shut down" });
        });
    };

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
          <div class='position-center'>
            <div class='flex-box-column'>
              <p>api status: ${this.state.apiHealthCheck}<p>
              <p>number: ${this.state.weight || "0"}<p>
              <input class='custom-input' type="number" value=${
                this.state.weight
              } onChange=${this.handleChangeWeight} required>
            </div>
          </div>
      </div>
    `;
  }
}
