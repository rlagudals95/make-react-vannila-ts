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
        SubPage

      
        <div class='name'>
          19951022 김형민
        <div>
      </div>
    `;
  }
}
