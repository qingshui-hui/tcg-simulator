<script>
import { mapState, mapMutations } from "vuex";

// https://vuex.vuejs.org/ja/guide/modules.html#%E5%90%8D%E5%89%8D%E7%A9%BA%E9%96%93
export default {
  computed: {
    ...mapState("builder", {
      draggingCard: (state) => state.draggingCard,
    }),
  },
  methods: {
    ...mapMutations("builder", [
      "setDraggingCard", // -> this.foo()
    ]),
  },
};
</script>
