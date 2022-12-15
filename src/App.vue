<template>
  <BetModal @onDeal="deal" v-if="showBetModal" @newGame="firstGame()"></BetModal>
  <MDBContainer>
    <BetStatus v-if="gameStarted && !showBetModal"></BetStatus>
    <div class="start-btn d-flex justify-content-center" v-if="!gameStarted">
      <button id="start" @click="firstGame()">START GAME</button>
    </div>
    <div class="d-flex justify-content-center"></div>
    <MDBRow>
      <MDBCol>
        <MDBModal
          centered
          id="winningModal"
          tabindex="-1"
          labelledby="winningModalLabel"
          v-model="winningModal"
          class="winningModal"
          @hidden="showModal()"
        >
          <div class="d-flex modal-text justify-content-center">
            <h2>{{ message.toUpperCase() }}</h2>
            <h1 v-if="winner=='player'">${{betAmount}}</h1>
          </div>
        </MDBModal>

        <div class="score d-flex align-items-center" v-if="gameStarted">
          <div class="total text-center">
            {{ currentValueDealer() }}
          </div>
          <div class="text">DEALER</div>
        </div>
      </MDBCol>
    </MDBRow>

    <div class="dealer-cards d-flex justify-content-center">
      <div v-for="card in dealerCards" :key="card" class="card-deck">
        <GameCard
          :suit="card.suit"
          :value="card.value"
          :secondCardDealer="card.secondCardDealer"
          :class="{ cardback: card.secondCardDealer }"
        />
      </div>
    </div>

    <div class="buttons text-center">
      <button
        class="game-btn"
        v-if="gameStarted && !winner"
        @click="onHit()"
        :disabled="disableButton"
      >
        HIT
      </button>
      <button
        class="game-btn"
        v-if="gameStarted && !winner"
        @click="onStand()"
        :disabled="disableButton"
      >
        STAND
      </button>
    </div>
    <div class="score d-flex align-items-center" v-if="gameStarted">
      <div class="total text-center">
        {{ currentValuePlayer() }}
      </div>
      <div class="text">PLAYER</div>
    </div>
    <div class="player-cards d-flex justify-content-center">
      <div v-for="card in playerCards" :key="card" class="card-deck">
        <GameCard :suit="card.suit" :value="card.value" />
      </div>
    </div>
  </MDBContainer>
</template>

<script>
import { MDBCol, MDBRow, MDBContainer, MDBModal } from "mdb-vue-ui-kit";
import { ref } from "vue";

import GameCard from "./components/GameCard.vue";

import BetModal from "./components/BetModal.vue";
import BetStatus from "./components/BetStatus.vue";

export default {
  name: "BlackJack",
  components: { MDBCol, MDBRow, MDBContainer, GameCard, MDBModal, BetModal, BetStatus },
  data() {
    return {
      deck: [],
      playerCards: [],
      dealerCards: [],
      gameStarted: false,
      hasAce: false,
      showBetModal: false,
      acesCount: 0,
      disableButton: false,
      betAmount: 0,


      message: "",
      winner: "",

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
  computed: {
    playerWins() {
      return this.$store.getters.playerWins;
    },
    dealerWins() {
      return this.$store.getters.dealerWins;
    },
    totalBank() {
      return this.$store.getters.totalBank;
    },
    currentBet() {
      return this.$store.getters.currentBet;
    },
  },
  watch: {
    totalBank(newValue) {
      if(newValue == 0 && this.winner){
        console.log('ashgdaskygdkasygd')
      }
    }
  },
  //create and shuffle deck on mounted lifecycle hook so it's ready when loading the page
  mounted() {
    this.createDeck();
    this.shuffleDeck(this.deck);
  },
  methods: {
    //at start game check cards left in deck, reset some variables and draw cards.
    //also check for a "BlackJack(A+10 or A+Figure)"
    firstGame(){
      this.reset()
      this.createDeck();
      this.shuffleDeck(this.deck);
      this.gameStarted= false
      this.$store.commit('restoreBank')
      this.showBetModal = true;
    },
    newGame() {
      if (this.deck.length >= 26) {
        this.createDeck();
        this.shuffleDeck(this.deck);
      }

      this.reset();
      (this.reducedValueAce = 0), (this.gameStarted = true);
      this.playerCards.push(this.deck.pop());
      this.dealerCards.push(this.deck.pop());

      this.playerCards.push(this.deck.pop());

      this.dealerCards.push(this.deck.pop());

      //cover dealer's second card
      this.dealerCards.forEach((card, index) => {
        if (index === 1) {
          card.secondCardDealer = true;
        } else {
          card.secondCardDealer = false;
        }
      });

      this.getWinner();
    },

    reset() {
      this.playerCards = [];
      this.dealerCards = [];
      this.winner = "";
      this.hasAce = false;
      this.disableButton = false;
    },

    deal() {
      this.betAmount = this.currentBet

      this.showBetModal = false;
      this.newGame();
    },

    //helper function to delay
    sleep(ms) {
      return new Promise((accept) => {
        setTimeout(() => {
          accept();
        }, ms);
      });
    },

    //added async code to delay dealer draw cards for better user experience
    async getDealerCards() {
      this.dealerCards[1].secondCardDealer = false;

      let dealerHand = 0;
      dealerHand = this.currentValueDealer();

      while (dealerHand < 17) {
        await this.sleep(500);
        this.dealerCards.push(this.deck.pop());
        dealerHand = this.currentValueDealer();
      }
    },


    onStand() {
      this.getDealerCards();
      setTimeout(() => {
        this.getWinner();
        this.winningModal = true;
      }, 1500);
      this.disableButton = true;
    },

    checkAces() {
      let numberOfAces = 0;
      this.playerCards.forEach((card) => {
        if (card.value === "A") {
          this.hasAce = true;
          numberOfAces++;
          this.acesCount = numberOfAces;
        }
      });
    },

    getWinner() {
      let playerHand = 0;
      let dealerHand = 0;
      playerHand = this.currentValuePlayer();
      dealerHand = this.currentValueDealer();

      if (playerHand > 21) {
        this.message = "Round Lost!";
        this.winner = "dealer";
        this.$store.commit("incrementDealer");
      }

      if (
        this.playerCards.length < 3 &&
        playerHand === 21 &&
        dealerHand != 21
      ) {
        this.message = "Round Won, BlackJack!";
        this.winner = "player";
        this.winningModal = true;
        this.$store.commit("incrementPlayer");
        this.$store.commit({
          type: 'win',
          pot: this.currentBet,
          bj: true,
        })
        this.betAmount *= 2.5 
      } else if (
        this.playerCards.length < 3 &&
        playerHand === 21 &&
        dealerHand === 21
      ) {
        this.message = "Round Tie";
        this.winner = "tie";
        this.$store.commit({
          type: 'win',
          pot: this.currentBet,
          tie: true
        })
        this.winningModal = true;
      }

      if (this.dealerCards[1].secondCardDealer === true) {
        return;
      }

      if (dealerHand > 21) {
        this.message = "Round Won";
        this.winner = "player";
        this.$store.commit("incrementPlayer");
        this.$store.commit({
          type: 'win',
          pot: this.currentBet,
        })
        this.betAmount *= 2
      }
      if (dealerHand <= 21) {
        if (dealerHand > playerHand) {
          this.message = "Round Lost";
          this.winner = "dealer";
          this.$store.commit("incrementDealer");

        } else if (dealerHand < playerHand) {
          this.message = "Round Won";
          this.winner = "player";
          this.$store.commit({
          type: 'win',
          pot: this.currentBet,
        })
          this.betAmount *= 2
        } else if (dealerHand <= 21 && dealerHand >= 17) {
          this.message = "Round Tie";
          this.$store.commit({
          type: 'win',
          pot: this.currentBet,
          tie: true
        })
          this.winner = "tie";
        }
      }
      if(this.winner != ""){
        this.$store.commit('setBet', 0)
      }
      return this.winner;
    },

    onHit() {
      this.playerCards.push(this.deck.pop());
      this.getWinner();
      if (this.winner) {
        this.winningModal = true;
      }
    },

    showModal(){
      this.showBetModal = true
    },

    //calculate current value of hand of player,
    //in case of going over 21 and having an ace
    //subtract 10 to the total (so ace is worth 1 instead of 11)
    currentValuePlayer() {
      let totalHandPlayer = 0;
      this.checkAces();
      let reduce = true;

      this.playerCards.forEach((card) => {
        totalHandPlayer = this.cardValues(card) + totalHandPlayer;
      });

      if (totalHandPlayer > 21 && this.hasAce && reduce) {
        totalHandPlayer = totalHandPlayer - 10;
        reduce = false;
      }
      return totalHandPlayer;
    },

    currentValueDealer() {
      let totalHandDealer = 0;
      this.dealerCards.forEach((card) => {
        if (card.secondCardDealer) {
          // eslint-disable-next-line no-self-assign
          totalHandDealer = totalHandDealer;
        } else {
          totalHandDealer = this.cardValues(card) + totalHandDealer;
        }
      });
      return totalHandDealer;
    },

    cardValues(card) {
      let value = 0;
      switch (card.value) {
        case "2":
          value = 2;
          break;
        case "3":
          value = 3;
          break;
        case "4":
          value = 4;
          break;
        case "5":
          value = 5;
          break;
        case "6":
          value = 6;
          break;
        case "7":
          value = 7;
          break;
        case "8":
          value = 8;
          break;
        case "9":
          value = 9;
          break;
        case "10":
          value = 10;
          break;
        case "J":
          value = 10;
          break;
        case "Q":
          value = 10;
          break;
        case "K":
          value = 10;
          break;
        case "A":
          value = 11;
          break;
      }
      return value;
    },

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

    createDeck() {
      this.suits.forEach((suit) => {
        this.values.forEach((value) => {
          let card = { value: value, suit: suit };
          this.deck.push(card);
        });
      });
    },
    shuffleDeck(deck) {
      for (let i = 0; i < 1000; i++) {
        let loc1 = Math.floor(Math.random() * deck.length);
        let loc2 = Math.floor(Math.random() * deck.length);
        let temp = deck[loc1];
        deck[loc1] = deck[loc2];
        deck[loc2] = temp;
      }
    },
  },
  //bootsrap modal
  setup() {
    const winningModal = ref(false);
    return {
      winningModal,
    };
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  padding: 60px;
  background: url("./assets/texture5.jpg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
.icon {
  width: 60px;
  height: auto;
}
.card-deck,
.cardback {
  display: inline-block;
}

.modal-content {
  height: 150px;
  background-color: whitesmoke;
  box-shadow: #9b9b9b 0px 9px 0px !important;
  font-size: 32px;
  justify-content: center;
}

.dealer-cards {
  margin-bottom: 10vh;
}

.cardback {
  background: url("./assets/back-card.jpg") center/100% no-repeat;
}

.text-start,
.text-end {
  margin: 0;
  padding: 0;
}
h1 {
  color: #444444;
}

.total {
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  width: 4rem;
  height: 4rem;
  color: white;
  font-size: 40px;
}

.text {
  color: greenyellow;
  font-size: 28px;
  margin: 0 15px 0 15px;
  margin-bottom: 0;
  font-weight: 500;
}

.modal-text{
  flex-direction: column;
  flex-wrap: wrap;
  text-align: center;
}

#start {
  position: relative;
  padding: 15px;
  border-radius: 10px;
  background-color: #f93154;
  color: #ffff;
  font-weight: 700;
  border: none;
  box-shadow: #862031 0px 9px 0px, 0px 9px 25px rgba(0, 0, 0, 0.7);
  display: block;
  transition: all 0.2ms ease;
}
#start:active {
  position: relative;
  box-shadow: 0px 3px 0px #862031, 0px 3px 6px rgba(0, 0, 0, 0.9);
  top: 6px;
}
.game-btn {
  margin-right: 15px;
  width: 80px;
  position: relative;
  padding: 15px;
  border-radius: 10px;
  background-color: #e9e9e9;
  color: rgb(38, 38, 38);
  font-weight: 700;
  border: none;
  box-shadow: #888888 0px 7px 0px, 0px 6px 20px rgba(0, 0, 0, 0.7);
  display: block;
  transition: all 0.2ms ease;
}
.game-btn:active {
  position: relative;
  box-shadow: 0px 3px 0px #888888, 0px 2px 6px rgba(0, 0, 0, 0.9);
  top: 4px;
}

.btn-startgame {
  padding: 50px !important;
  font-size: 30px !important;
}

.buttons {
  display: flex;
  justify-content: center;
  height: 60px;
}

.start-btn {
  margin-top: 25vh;
}
</style>
