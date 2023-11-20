import { updateRealDOM } from "../index";
import Component from "@/core/Component";
import { customEventEmitter } from "@/utils/helpers";

// 라우터의 라우트 구조를 정의하는 타입
export type Route = {
  path: string; // 경로
  page: typeof Component; // 해당 경로에 매핑되는 페이지 컴포넌트
  redirect?: string; // 리다이렉트할 경로 (옵션)
};

// Router 클래스 정의
class Router {
  $app: HTMLElement; // 라우터가 사용할 루트 엘리먼트
  routes: { [key: string]: typeof Component } = {}; // 경로와 컴포넌트 매핑
  fallback: string = "/"; // 기본적으로 사용할 경로

  constructor({
    $app,
    routes,
    fallback = "/",
  }: {
    $app: HTMLElement;
    routes: Route[];
    fallback?: string;
  }) {
    this.$app = $app;
    this.fallback = fallback;

    // 라우터 초기화 시 라우트 매핑 생성
    this.generateRoutes(routes);

    // 라우터 이벤트 초기화
    this.initEvent();
  }

  // 라우트 매핑 생성
  generateRoutes(routes: Route[]): void {
    this.routes = {};

    routes.forEach((route: Route) => {
      this.routes[route.path] = route.page;
    });
  }

  // 라우터 이벤트 초기화
  initEvent() {
    // 커스텀 이벤트 'moveroutes'에 대한 이벤트 핸들러 등록
    document.addEventListener(
      "moveroutes",
      this.moveroutesHandler.bind(this) as EventListener
    );
    // 브라우저 popstate 이벤트에 대한 이벤트 핸들러 등록
    window.addEventListener(
      "popstate",
      this.popstateHandler.bind(this) as EventListener
    );
  }

  // 주어진 경로가 라우트 매핑에 있는지 확인
  hasRoute(path: string) {
    return typeof this.routes[path] !== "undefined";
  }

  // 'not_found' 페이지 컴포넌트 반환
  getNotFoundRouter() {
    return this.routes["not_found"];
  }

  // 주어진 경로에 대한 라우터 반환
  getRouter(path: string) {
    return this.routes[path];
  }

  // 'moveroutes' 커스텀 이벤트 핸들러
  moveroutesHandler(event: CustomEvent) {
    const path: string = event.detail.path;
    // 브라우저 히스토리에 pushState를 이용해 경로 변경
    history.pushState(event.detail, "", path);
    // 해당 경로에 대한 컴포넌트 렌더링
    this.renderComponent(path);
  }

  // 브라우저 popstate 이벤트 핸들러
  popstateHandler() {
    // 현재 히스토리 상태의 경로에 대한 컴포넌트 렌더링
    this.renderComponent(history.state.path);
  }

  // 주어진 경로에 대한 컴포넌트 렌더링
  renderComponent(path: string) {
    // 기본적으로 'not_found' 페이지 컴포넌트를 사용
    let route = this.getNotFoundRouter();
    const regex = /\w{1,}$/;

    // 주어진 경로가 라우트 매핑에 있는 경우 해당 컴포넌트로 변경
    if (this.hasRoute(path)) {
      route = this.getRouter(path);
    }
    // 주어진 경로가 라우트 매핑에 없지만 ':id'를 포함하는 경우 ':id' 부분을 포함하는 컴포넌트로 변경
    else if (regex.test(path)) {
      route = this.getRouter(path.replace(regex, ":id"));
    }
    // 위 두 경우가 아니면 fallback 경로로 변경
    else {
      route = this.getRouter(this.fallback);
    }

    // 해당 컴포넌트를 인스턴스화하고, DOM을 렌더링한 후 실제 DOM을 업데이트
    const page = new route({});
    if (this.$app.lastElementChild)
      this.$app.replaceChild(page.$dom, this.$app.lastElementChild);
    else this.$app.appendChild(page.$dom);
    updateRealDOM();
  }

  // 주어진 경로로 이동하는 함수
  push(path: string) {
    // 'moveroutes' 커스텀 이벤트 발생
    customEventEmitter("moveroutes", {
      ...history.state,
      path,
    });
  }
}

// $router 객체 및 초기화 함수를 내보냄
export let $router: {
  push: (path: string) => void;
};

export function initRouter({
  $app,
  routes,
}: {
  $app: HTMLElement;
  routes: Route[];
}): void {
  const router = new Router({ $app, routes });

  $router = {
    push: (path) => router.push(path),
  };

  // 초기 라우터 설정
  customEventEmitter(
    "moveroutes",
    history.state ?? {
      path: "/",
    }
  );
}
