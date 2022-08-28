<template>
  <div class="card-deck d-flex justify-content-between">
    <div class="text-start h3 justify-content-start" v-if="!secondCardDealer">
      {{ value }}
    </div>
    <div class="d-flex justify-content-center">
      <Icon
        :icon="getIcon(suit)"
        class="icon d-flex align-items-center"
        v-if="!secondCardDealer"
      />
    </div>
    <div
      class="text-end h3 d-flex align-items-end justify-content-end"
      v-if="!secondCardDealer"
    >
      {{ value }}
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  components: { Icon },
  props: ["value", "suit", "secondCardDealer"],
  methods: {
    getIcon(suit) {
      if (suit === "spades") {
        return "fxemoji:blackspadesuit";
      } else if (suit === "diamonds") {
        return "fxemoji:blackdiamondsuit";
      } else if (suit === "clubs") {
        return "fxemoji:blackclubsuit";
      } else if (suit === "hearts") {
        return "fxemoji:blackheartsuit";
      }
    },
  },
  data() {
    return {
      suits: ["spades", "diamonds", "clubs", "hearts"],
      values: [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
      ],
    };
  },
};
</script>

<style scoped>
.icon {
  width: 45px;
  height: auto;
  /* z-index: 5; */
}
.text-start,
.text-end {
  margin: 0;
  padding: 0;
}

.card-deck {
  width: 120px;
  height: 180px;
  border: 1px solid #666;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
  background-color: white;

    box-shadow: 0px 3px 6px rgba(26, 26, 26, 0.9);
}
</style>