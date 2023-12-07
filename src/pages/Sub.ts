import Header from "@/components/Header";
import Component, { PropsType, StateType } from "@/core/Component";
import jsx from "@/core/JSX";

export default class Sub extends Component<PropsType, StateType> {
  $header: Element;

  constructor(props: PropsType) {
    super(props);

    this.$header = new Header({}).$dom;

    this.setDom();
  }

  render() {
    return jsx`
      <div class='main-page'>
        ${this.$header}
        <div class='position-center'>
          <div class='flex-box-column'>
            <div class='title'>SubPage</div>
            <div>
              19951022 김형민
            </div>
          </div>  
        </div>
      </div>
    `;
  }
}
