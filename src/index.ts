import { initRouter, Route } from "@/core/BrowserRouter";
import Main from "./pages/Main";
import Sub from "./pages/Sub";
import Component from "@/core/Component";
import "./style.css";

const routes: Route[] = [
  { path: "/", page: Main as typeof Component },
  { path: "/sub", page: Sub as typeof Component },
];

const $app = document.querySelector("#app") as HTMLElement;

initRouter({ $app, routes });
