<template>
  <div class="bet-modal">
    <div class="bet-modal-content">
      <div v-if="canPlay">
        <div class="total-bet">
          <p>AMOUNT LEFT: ${{ totalBank }}</p>
          <p>YOUR BET: ${{ totalBet }}</p>
        </div>
        <div class="fishes">
          <FishPoker class="fish" :value="1" @click="addToTotal(1)"></FishPoker>
          <FishPoker class="fish" :value="5" @click="addToTotal(5)"></FishPoker>
          <FishPoker
            class="fish"
            :value="25"
            @click="addToTotal(25)"
          ></FishPoker>
          <FishPoker
            class="fish"
            :value="100"
            @click="addToTotal(100)"
          ></FishPoker>
        </div>
        <div class="buttons">
          <button class="game-btn reset_btn" @click="resetBet()">RESET</button>
          <button
            class="game-btn deal_btn"
            :disabled="totalBet == 0"
            @click="$emit('onDeal', totalBet)"
          >
            DEAL
          </button>
        </div>
      </div>

      <div v-if="!canPlay" class="total-bet" @click="$emit('newGame')">
        <p>YOU LOST ALL THE MONEY :C</p>
        <button id="start">NEW GAME</button>
      </div>

    </div>
  </div>
</template>
<script>
import FishPoker from "./FishPoker.vue";

export default {
  components: { FishPoker },
  computed: {
    totalBank() {
      return this.$store.getters.totalBank;
    },
    canPlay() {
      if (this.totalBank < 1 && this.totalBet == 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    return {
      totalBet: 0,
      currentTotal: 0,
    };
  },
  methods: {
    addToTotal(value) {
      this.totalBet += value;
      this.$store.commit("bet", value);
      this.$store.commit("setBet", this.totalBet);
    },
    resetBet() {
      this.$store.commit("restoreBet", this.currentTotal);
      this.totalBet = 0;
    },
  },
  mounted() {
    this.currentTotal = this.$store.getters.totalBank;
  },
};
</script>

<style scoped>
.bet-modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  display: flex;
  align-items: center;
}
.total-bet {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;

}

.lost-modal {

}

p {
  color: #444;
  font-weight: 700;
  font-size: 2.25rem;
}

.buttons {
  margin-top: 24px;
}

.bet-modal-content {
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  color: black;

  box-shadow: 0px 10px 0px #888888;
}

.fishes {
  display: flex;
}
.fish {
  margin-right: 15px;
}

.deal_btn {
  background-color: rgb(147, 224, 147);
  box-shadow: #4c6d4f 0px 7px 0px, 0px 6px 20px rgba(0, 0, 0, 0.7);
}
</style>
