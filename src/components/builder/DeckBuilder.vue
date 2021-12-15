<template>
  <div id="app">
    <div class="app-wrapper" @mousemove="traceMouseMove">
      <header>
        <div class="select-bar left">
          <DeckHeader
            :deckData="left.deckData"
            :deckList="deckList"
            :deckIndex="left.deckIndex"
            :side="'left'"
            v-on:change-deck="changeDeck"
            v-on:update-deck="updateDeck"
            v-on:create-deck="createDeck"
          ></DeckHeader>
        </div>
        <div class="select-bar right">
          <DeckHeader
            :deckData="right.deckData"
            :deckList="deckList"
            :deckIndex="right.deckIndex"
            :side="'right'"
            v-on:change-deck="changeDeck"
            v-on:update-deck="updateDeck"
            v-on:create-deck="createDeck"
          ></DeckHeader>
        </div>
      </header>

      <div class="content">
        <div class="deck-wrapper left">
          <div id="deck1">
            <CardList :cards="left['deckData']['cards']" :side="'left'"></CardList>
          </div>
        </div>

        <div class="deck-wrapper right">
          <div id="deck2">
            <CardList :cards="right['deckData']['cards']" :side="'right'"></CardList>
          </div>
        </div>
      </div>

      <ImageUploader
        :side="'left'"
        :imageSrc="preview['left'].src"
        :file="preview['left'].file"
        :files="preview['left'].files"
        v-on:drop-image="dropImage"
        v-on:select-image-file="selectImageFile"
        v-on:upload-image="uploadImage"
        v-on:upload-images="uploadImages"
      ></ImageUploader>

      <ImageUploader
        :side="'right'"
        :imageSrc="preview['right'].src"
        :file="preview['right'].file"
        :files="preview['right'].files"
        v-on:drop-image="dropImage"
        v-on:select-image-file="selectImageFile"
        v-on:upload-image="uploadImage"
        v-on:upload-images="uploadImages"
      ></ImageUploader>

      <div class="tool-footer">
        <div class="hidden">
          <div class="click">
            <label>
              <input type="checkbox" checked @change="display.hidden = !display.hidden" />ホバーで画像拡大
            </label>
          </div>
          <div class="click">
            <label>
              <input type="checkbox" @change="display.blur = !display.blur" />画像透過
            </label>
          </div>
        </div>
      </div>

      <div
        id="display"
        :class="{ hidden: display.hidden, blur: display.blur }"
        :style="[display.left ? { left: '5px' } : { right: '5px' }]"
        v-if="display.imageUrl"
        @dragover="onDragOver"
      >
        <div class="card-image">
          <img :src="display.imageUrl" />
        </div>
      </div>
      <div id="message-box" v-if="message">
        <span>{{ message }}</span>
      </div>
      <div class="separator"></div>
    </div>
  </div>
</template>
<script>
import { Deck } from '../../helpers/Deck.js'
import DeckHeader from './DeckHeader.vue'
import ImageUploader from './ImageUploader.vue'
import CardList from './CardList.vue'
const axios = require('axios')

export default {
  components: {
    DeckHeader,
    ImageUploader,
    CardList,
  },
  data() {
    return {
      // apiで取得
      deckList: {
        readyMade: [],
        custom: [],
      },
      left: {
        deckIndex: 0,
        deckData: {
          cards: [],
        },
      },
      right: {
        deckIndex: 1,
        deckData: {
          cards: [],
        },
      },
      display: {
        card: null,
        left: true,
        hidden: false,
        blur: false,
        imageUrl: '',
      },
      preview: {
        left: {
          src: '',
          input: null,
          file: null,
          files: null,
        },
        right: {
          src: '',
          input: null,
          file: null,
          files: null,
        },
      },
      message: '',
    }
  },
  created() {
    this.message = 'データを\n取得中です'
    axios.get('/api/decks')
      .then(function (res) {
        console.log(res.data);
        const deckList = res.data;
        this.deckList['custom'] = deckList;
        this.left.deckData = Deck.formatData(deckList[0], this.useConfig().IMAGE_HOST);
        this.right.deckData = Deck.formatData(deckList[1], this.useConfig().IMAGE_HOST);

        this.message = '';
      }.bind(this));
  },
  methods: {
    updateDeck(params, side) {
      this.message = '変更を\n保存中です'
      const data = this[side]['deckData'];
      if (params.name) {
        data.name = params.name;
      }
      axios({
        method: 'post',
        url: '/api/cards/' + data.id,
        data: data,
      })
        .then((res) => {
          console.log(res.data);
          this.message = '';
        })
        .catch((res) => {
          console.log(res);
          this.message = '';
        })
    },
    createDeck(params, side, selected) {
      this.message = "デッキを\n作成中です"
      const data = {
        name: params.name,
        cards: [],
      };
      axios({
        method: 'post',
        url: '/api/cards',
        data: data,
      })
        .then((res) => {
          this.deckList['custom'].push(res.data);
          this[side]['deckData'] = res.data;
          // selectedはv-model
          selected.index = this.deckList['custom'].length - 1;
          this.message = '';
        })
    },
    dropImage(side) {
      event.preventDefault()
      this.preview[side].file = event.dataTransfer.files[0];
      this.preview[side].files = event.dataTransfer.files;
      this.showPreview(side);
    },
    selectImageFile(side) {
      const file = event.target.files[0];
      const files = event.target.files;
      console.log(event.target.files)
      if (file) {
        this.preview[side].file = file;
        this.preview[side].files = files;
      } else {
        this.preview[side].file = null;
        this.preview[side].files = null;
      }
      this.showPreview(side);
    },
    showPreview(side) {
      const preview = this.preview[side];
      if (preview.file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          preview.src = event.target.result;
        }
        reader.readAsDataURL(preview.file);
      } else {
        preview.file = null;
        preview.src = '';
      }
    },
    uploadImage(side) {
      this.message = 'アップロード中\nです'

      event.preventDefault();
      const preview = this.preview[side];
      if (!preview.file) {
        return;
      }
      const formData = new FormData(event.target);
      formData.delete('input')
      formData.append('image', preview.file);
      preview.file = null;
      preview.src = '';

      axios({
        method: 'post',
        url: '/api/cards/upload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((res) => {
          // pushでも更新される
          // push, pop, unshift, splice, sort, reverse
          this[side]['deckData']['cards'].push(res.data.card)
          this.message = '';
        })
        .catch((res) => {
          console.log(res);
          this.message = '';
        })
    },
    uploadImages(side) {
      // 要編集
      event.preventDefault();
      console.log(this.preview[side].files)
      if (!this.preview[side].files) {
        return;
      }
      for (let file of this.preview[side].files) {

        this.preview[side].file = file;

        this.message = 'アップロード中\nです'

        const preview = this.preview[side];
        if (!preview.file) {
          return;
        }
        const formData = new FormData(event.target);
        formData.delete('input')
        formData.append('image', preview.file);
        preview.file = null;
        preview.src = '';

        axios({
          method: 'post',
          url: '/api/cards/upload',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
          .then((res) => {
            // pushでも更新される
            // push, pop, unshift, splice, sort, reverse
            for (let c of this[side]['deckData']['cards']) {
              if (c.imageUrl === res.data.card.imageUrl) {
                this.message = '';
                return;
              }
            }
            this[side]['deckData']['cards'].push(res.data.card)
            this.message = '';
          })
          .catch((res) => {
            console.log(res);
            this.message = '';
          })

      }
    },
    changeDeck(deckType, index, side) {
      if (deckType === 'custom') {
        this[side]['deckData'] =
          Deck.formatData(this.deckList['custom'][index], this.useConfig().IMAGE_HOST);

      }
    },
    totalNum(cards) {
      let result = 0;
      for (let card of cards) {
        result += card.time;
      }
      return result;
    },
    onDragOver() {
      event.preventDefault();
      this.display.imageUrl = null;
    },
    onDragStart() {
      // event.preventDefault()
    },
    traceMouseMove(event) {
      if (this.display.hidden) {
        return;
      }
      const imageSrc = event.target.src;
      if (!imageSrc) {
        this.display.imageUrl = '';
        return;
      }
      if (imageSrc.includes('storage.googleapis.com')) {
        // '/images/visible/' cause error
        this.display.imageUrl = imageSrc;
      } else {
        this.display.imageUrl = '';
      }
      let mX = event.pageX;
      // let mY = event.pageY;
      if (mX < 400) {
        this.display.left = false;
      } else {
        this.display.left = true;
      }
    },
  }
}

</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}

/* display */
#display {
  position: absolute;
  top: 10px;
  /* left: 10px; */
  z-index: 2;
}
.blur {
  opacity: 0.6;
}

#display:hover {
  opacity: 0.6;
}
#display .card-image img {
  width: 350px;
}
.separator {
  position: absolute;
  top: 0px;
  left: calc((100vw / 2) - 1px);
  height: calc(100vh - 2px);
  // border: 1px solid white;
  @media screen and (max-width: 800px) {
    & {
      left: 399px;
    }
  }
}
#message-box {
  position: absolute;
  width: 150px;
  padding: 10px;
  border-radius: 20px;
  background-color: aqua;
  top: 150px;
  left: calc((100vw / 2) - 85px);
  // border: 1px solid white;
  text-align: center;
  @media screen and (max-width: 800px) {
    & {
      left: 400px - 85px;
    }
  }
}
.tool-footer {
  $size: 60px;
  $half: 30px;
  position: absolute;
  left: calc((100vw / 2) - (30px));
  top: 81px;
  width: $size;
  height: calc($size / 2);
  border-top: 1px white solid;
  border-radius: 0 0 $size $size;
  background-color: blue;
  @media screen and (max-width: 800px) {
    & {
      left: (400px - ($half));
    }
  }
  &:hover {
    width: unset;
    height: unset;
    border-radius: unset;
    div.hidden {
      display: block;
      color: white;
    }
    .click {
      cursor: pointer;
      &:hover {
        cursor: pointer;
        color: lightgray;
      }
    }
  }
}
body {
  min-width: 800px;
}
header {
  display: flex;
  align-items: stretch;
  background-color: blue;
  /* marginはみ出し対策 */
  border-top: 1px blue solid;
  width: 100%;
  height: 80px;
  color: white;

  .select-bar {
    width: calc((100% / 2));
    padding: 10px 0 0 20px;
    &.left {
      border-right: 2px white solid;
    }

    .deck-select {
      margin-top: 10px;
    }
  }
}
.content {
  display: flex;
}
.deck-wrapper {
  width: calc(100% / 2);
  background-color: lightgray;
  /* flex-wrap: wrap; */
  &.left {
    border-right: 2px white solid;
  }
}
</style>
