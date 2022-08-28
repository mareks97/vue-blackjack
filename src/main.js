import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";

import "mdb-vue-ui-kit/css/mdb.min.css";

const store = createStore({
  state() {
    return {
      playerWins: 0,
      dealerWins: 0,
      totalBank: 1500,
    };
  },
  mutations: {
    incrementPlayer(state) {
      state.playerWins++;
    },
    incrementDealer(state) {
      state.dealerWins++;
    },
    bet(state, amount) {
      state.totalBank -= amount
    },
    win(state, pot){
      state.totalBank += pot
    }
  },
  getters: {
    totalBank: state => state.totalBank,
    playerWins: state => state.playerWins,
		dealerWins: state => state.dealerWins
  }
});

createApp(App).use(store).mount("#app");
