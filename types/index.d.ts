import { Player, Card, CardGroup, Room } from "./entities";

export { Player, Card, CardGroup, Room };

// vuex
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";

export interface State {
  selectMode: boolean;
  selectedCard: Card;
  hoveredCard: Card;
  workSpace: {
    active: boolean;
    cards: Card[];
    zone: string;
    player: Player;
    minimal: boolean;
    single: boolean;
  };
  settings: {
    dropdownTriggers: string[];
  };
}

declare module "@vue/runtime-core" {
  // `this.$store` の型付けを提供する
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

// useConfig
import { useConfig } from "../src/plugins/useConfig";
import { Socket } from "socket.io-client";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    useConfig: useConfig;
    $socket: Socket;
  }
}
