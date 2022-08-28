<template>
  <div class="bet-modal">
    <div class="bet-modal-content">
      <div class="total-bet">
        <p>AMOUNT LEFT: ${{ totalBank }}</p>
        <p>YOUR BET: ${{ totalBet }}</p>
      </div>
      <div class="fishes">
        <FishPoker class="fish" :value="1" @click="addToTotal(1)"></FishPoker>
        <FishPoker class="fish" :value="5" @click="addToTotal(5)"></FishPoker>
        <FishPoker class="fish" :value="25" @click="addToTotal(25)"></FishPoker>
        <FishPoker
          class="fish"
          :value="100"
          @click="addToTotal(100)"
        ></FishPoker>
      </div>
      <div class="buttons">
        <button class="game-btn" @click="resetBet()">RESET</button>
        <button class="game-btn" @click="$emit('onDeal', totalBet)">DEAL</button>
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
  },
  data() {
    return {
      totalBet: 0,
      no: false,
    };
  },
  methods: {
    addToTotal(value) {
      if (value > this.totalBank) {
        this.no = true;
      }
      this.totalBet += value;
      this.$store.commit("bet", value);
      this.$store.commit("setBet", this.totalBet)
    },
    resetBet() {
      this.$store.commit("win", this.totalBet);
      this.totalBet = 0;
    },
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
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.total-bet {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  font-size: 2.25rem;
}

p {
  color: #444;
  font-weight: 700;
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
  margin: 20% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
  color: black;
  box-shadow: 0px 10px 0px #888888;
}

.fishes {
  display: flex;
}
.fish {
  margin-right: 15px;
}
</style>
