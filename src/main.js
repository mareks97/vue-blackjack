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
      currentBet: 0,
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
      state.currentBet = amount
    },
    win(state, payload){
      if(payload.tie){
        state.totalBank += payload.pot
      } else if(payload.bj){
        state.totalBank += payload.pot*2.5
      } else {
        state.totalBank += payload.pot*2
      }
    },
    setBet(state, value){
      state.currentBet = value
    },
    restoreBet(state, prevValue){
      state.totalBank = prevValue
    },
    restoreBank(state){
      state.totalBank = 1500
      state.playerWins = 0
      state.dealerWins = 0
      state.currentBet = 0
    }

  },
  getters: {
    totalBank: state => state.totalBank,
    playerWins: state => state.playerWins,
		dealerWins: state => state.dealerWins,
    currentBet: state => state.currentBet
  }
});

createApp(App).use(store).mount("#app");
