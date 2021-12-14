<template>
  <div class="tefuda-zone-wrapper">
    <div class="tefuda-zone" :class="side">
      <div
        class="open-tefuda"
        v-if="side === 'lower'"
        v-on:click="openWorkSpace(tefudaCards, 'tefudaCards')"
      >
        <span>開く</span>
      </div>

      <div
        class="scrollable-wrapper"
        :id="'tefuda-zone' + player"
        :class="{
          reverse: side === 'upper',
        }"
      >
        <div class="card in-battle" v-for="(card, index) in tefudaCards" :key="index">
          <span class="cost card-info">10</span>
          <span class="power card-info">12000</span>
          <img :src="card.imageUrl" v-if="side === 'lower'" />
          <img src="@/assets/images/card-back.jpg" v-else />
          <div class="menu-list hidden" :class="{ reverse: side === 'upper' }">
            <div>
              <span>|</span>
              <span class="click" v-on:click="moveCard('tefudaCards', 'battleCards', card)">f</span>
              <span>|</span>
              <span class="click" v-on:click="moveCard('tefudaCards', 'shieldCards', card)">s</span>
              <span>|</span>
              <span class="click" v-on:click="moveCard('tefudaCards', 'manaCards', card)">m</span>
            </div>
            <div>
              <span>|</span>
              <span class="click" v-on:click="moveCard('tefudaCards', 'bochiCards', card)">b</span>
              <span>|</span>
              <span
                class="click"
                v-on:click="moveCard('tefudaCards', 'yamafudaCards', card, true)"
              >yt</span>
              <span>|</span>
              <span class="click" v-on:click="moveCard('tefudaCards', 'yamafudaCards', card)">yb</span>
            </div>
            <!-- <div
                        ><span
            >bomb</span></div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/helpers/mixin.js'

export default {
  props: ['player', 'tefudaCards', 'side'],
  mixins: [mixin.zone],
}
</script>

<style lang="scss">
.tefuda-zone-wrapper {
  img {
    width: 70px;
  }
  .tefuda-zone {
    height: 100%;
  }

  .open-tefuda {
    background-color: black;
    width: 40px;
    text-align: center;
    color: white;
    padding: 3px;
    position: absolute;
    top: -20px;
    cursor: pointer;
  }
  .open-tefuda:hover {
    color: orange;
  }
  .scrollable-wrapper {
    background-color: aqua;
    position: absolute;
    display: flex;
    overflow: scroll;
    max-width: 300px;
  }
  .tefuda-zone .card {
    margin-right: 5px;
  }
  .card:hover {
    .menu-list {
      position: absolute;
      left: 0px;
      top: 20px;
      display: unset;
      background-color: black;
      div {
        border: lightgray 1px solid;
        color: whitesmoke;
      }
      div span.click:hover {
        color: orange;
        cursor: pointer;
      }
    }
  }

  .card.in-battle {
    position: relative;
  }
  .card .card-info {
    background-color: black;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    color: beige;
  }
  .card .cost {
    top: 2px;
    left: 2px;
  }
  .card .power {
    bottom: 2px;
    left: 2px;
  }
}
</style>
