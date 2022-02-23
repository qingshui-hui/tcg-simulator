export interface Player {
  cards: {
    manaCards: Card[],
    battleCards: Card[],
    bochiCards: Card[],
    shieldCards: Card[],
    tefudaCards: Card[],
    yamafudaCards: Card[],
    chojigenCards: Card[],
    // cardGroups
    battleCardGroups: Card[],
    shieldCardGroups: Card[],
  },
  id: string,
  roomId: string,
  isReady: boolean,
  hasChojigen: boolean,
}

export interface Card {
  imageUrl: String,
  backImageUrl: String,
}

// vuex
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // `this.$store` の型付けを提供する
  interface ComponentCustomProperties {
    $store: Store<State>,
  }
}

// useConfig
import { useConfig } from '../src/plugins/useConfig'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    useConfig: useConfig,
  }
}
