import { config, RouterLinkStub } from "@vue/test-utils";

// @ts-nocheck
import { createApp } from "vue";
import App from "@/app";

const vueApp = createApp(App);

// vue router
import router from "@/router";
vueApp.use(router);

// vuex
import store from "@/store";
vueApp.use(store);

//
// useConfig
import useConfig from "@/plugins/useConfig";
vueApp.use(useConfig);

//
// oruga ui
import { useOruga } from "@/plugins/oruga";
useOruga(vueApp);

import ClientOnlyStub from "./stub/ClientOnlyStub.vue";
// Mock Router components
config.global.stubs["router-link"] = RouterLinkStub;
config.global.stubs["client-noly"] = ClientOnlyStub;
config.global.stubs["dropdown"] = ClientOnlyStub;
config.global.stubs["o-icon"] = ClientOnlyStub;

// raw-loader
// https://stackoverflow.com/questions/55118947/how-to-test-raw-loaded-data-with-react
jest.mock("raw-loader!../assets/markdown/about.md", () => "", {
  virtual: true,
});
