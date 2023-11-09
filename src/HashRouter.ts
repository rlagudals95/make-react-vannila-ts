import Component from "./Component";

type Route = {
  path: string;
  page: typeof Component;
};

class Router {
  $app: HTMLElement;
  routes: {
    [key: string]: typeof Component;
  } = {};
  fallback: string = "/";

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

    routes.forEach((route: Route) => {
      this.routes[route.path] = route.page;
    });

    this.initEvent();
  }

  initEvent() {
    // hash가 변경되었을 때의 이벤트 init
    window.addEventListener("hashchange", () => this.onHashChangeHandler());
  }

  onHashChangeHandler() {
    // hash가 변경되었을 때의 이벤트 핸들러

    this.$app.innerHTML = "";

    const hash = window.location.hash;
    let path = hash.substring(1);

    this.renderPage(path);
  }

  hasRoute(path: string) {
    // 올바른 라우트인지 검증
    return typeof this.routes[path] !== "undefined";
  }

  getRoute(path: string) {
    return this.routes[path];
  }

  renderPage(path: string) {
    let route;

    /* 동적 라우팅 처리 */
    const regex = /\w{1,}$/; // 동적 라우팅으로 전달되는 :id 는 모두 [문자열 + 숫자] 조합으로 간주

    if (this.hasRoute(path)) {
      route = this.getRoute(path);
    } else if (regex.test(path)) {
      // 주소가 없는 경우를 동적 라우팅으로 간주하고 이를 :id 로 치환
      route = this.getRoute(path.replace(regex, ":id"));
    } else {
      // 그 외 입력되지 않은 모든 주소에 대해서는 fallback 실행
      route = this.getRoute(this.fallback);
    }

    new route(this.$app, {});
  }

  push(path: string) {
    window.location.hash = path;
  }
}

export let router: {
  push: (path: string) => void; // 라우터 push
};

export function initRouter(options: { $app: HTMLElement; routes: Route[] }) {
  const routerObj = new Router(options);

  router = {
    push: (path) => routerObj.push(path),
  };

  routerObj.onHashChangeHandler();
}
