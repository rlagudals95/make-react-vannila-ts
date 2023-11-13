import { initRouter, Route } from "./core/Router";
import diff from "./core/Diff";
import Main from "./pages/Main";
import Component from "@/core/Component";
import "./scss/index.scss";
import Sub from "./pages/Sub";

declare global {
  interface Window {
    virtualDOM: HTMLElement;
  }
}

const routes: Route[] = [
  { path: "/", page: Main as typeof Component },
  { path: "/sub", page: Sub as typeof Component },
];

const $app = document.querySelector("#app");
// 가상 DOM을 기반으로 실제 DOM을 업데이트하는 함수
export const updateRealDOM = () => {
  // requestAnimationFrame을 사용하여 다음 프레임에 업데이트를 예약
  window.requestAnimationFrame(() => {
    // $app이 존재하면 diff 함수를 호출하여 가상 DOM과 실제 DOM 간의 차이를 계산하고 업데이트 수행
    if ($app) diff(document.body, $app, window.virtualDOM);
  });
};

// $app이 존재하는 경우 초기화 및 라우터 설정을 수행
if ($app) {
  // window.virtualDOM에 새로운 div 엘리먼트를 생성하여 할당
  window.virtualDOM = document.createElement("div");
  // virtualDOM에 "app"이라는 id를 부여
  window.virtualDOM.id = "app";
  // initRouter 함수를 호출하여 라우터 초기화. $app과 라우터 설정(routes)을 전달
  initRouter({ $app: window.virtualDOM, routes });
}

// "forceRender" 이벤트가 발생할 때마다 updateRealDOM 함수를 호출하는 이벤트 리스너 등록
window.addEventListener("forceRender", () => {
  updateRealDOM();
});
