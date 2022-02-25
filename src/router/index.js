import { createRouter, createWebHistory } from "vue-router";
import index from "../pages/index.vue";
import room from "../pages/room.vue";
import builder from "../pages/builder.vue";
import about from "../pages/about.vue";
import logIndex from "../pages/log/index.vue";
import logId from "../pages/log/_id.vue";

const routes = [
  { path: "", name: "index", component: index },
  { path: "/room", name: "room", component: room },
  { path: "/builder", name: "builder", component: builder },
  { path: "/about", name: "about", component: about },
  { path: "/log", name: "logIndex", component: logIndex },
  { path: "/log/:id", name: "logId", component: logId },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
