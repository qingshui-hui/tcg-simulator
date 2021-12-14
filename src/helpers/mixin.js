const mixin = {}
mixin.zone = {
  methods: {
    moveCard: function (from, to, card, prepend = false) {
      this.$emit('move-cards', from, to, [card], this.player, prepend);
    },
    shuffleCards: function (from, cards) {
      this.$emit('shuffle-cards', from, cards, this.player)
    },
    openWorkSpace: function (cards, from, faceDown = false) {
      this.$emit('open-work-space', cards, from, this.player, faceDown);
    },
  }
}

mixin.droppable = {
  methods: {
    dragOver: function () {
      event.preventDefault();
      event.target.style.opacity = 0.5;
    },
    dragLeave: function () {
      event.target.style.opacity = 1;
    },
  }
}

export default mixin
