<template>
  <MDBContainer>
    <div class="start-btn d-flex justify-content-center" v-if="!gameStarted">
      <MDBBtn
        outline="danger"
        class="btn-startgame"
        size="lg"
        @click="newGame()"
        >START GAME</MDBBtn
      >
    </div>
    <div class="d-flex justify-content-center">
      <MDBBtn
        v-if="gameStarted && winner"
        outline="danger"
        size="lg"
        @click="newGame()"
        >New Game</MDBBtn
      >
    </div>
    <MDBRow>
      <MDBCol>
        <MDBModal
          id="exampleModal"
          tabindex="-1"
          labelledby="exampleModalLabel"
          v-model="exampleModal"
          class="winningModal"
        >
          <div class="d-flex justify-content-center">
            <h2>{{ message }}</h2>
          </div>
        </MDBModal>

        <div class="score d-flex align-items-center" v-if="gameStarted">
          <div class="total text-center">
            {{ currentValueDealer() }}
          </div>
          <div class="text">Dealer</div>
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
      <MDBBtn
        v-if="gameStarted"
        color="light"
        :disabled="winner != ''"
        @click="onHit()"
      >
        Hit
      </MDBBtn>
      <MDBBtn
        v-if="gameStarted"
        color="light"
        :disabled="winner != ''"
        @click="onStand()"
      >
        Stand
      </MDBBtn>

    </div>
    <div class="score d-flex align-items-center" v-if="gameStarted">
      <div class="total text-center ">
        {{ currentValuePlayer() }}
      </div>
      <div class="text">Player</div>
    </div>
    <div class="player-cards d-flex justify-content-center">
      <div v-for="card in playerCards" :key="card" class="card-deck">
        <GameCard :suit="card.suit" :value="card.value" />
      </div>
    </div>
  </MDBContainer>
</template>

<script>
import { MDBCol, MDBRow, MDBContainer, MDBBtn, MDBModal } from "mdb-vue-ui-kit";
import { ref } from "vue";

import GameCard from "./components/GameCard.vue";

export default {
  name: "BlackJack",
  components: { MDBCol, MDBRow, MDBContainer, MDBBtn, GameCard, MDBModal },
  data() {
    return {
      deck: [],
      playerCards: [],
      dealerCards: [],
      gameStarted: false,
      hasAce: false,

      acesCount: 0,


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
//create and shuffle deck on mounted lifecycle hook so it's ready when loading the page
  mounted() {
    this.createDeck();
    this.shuffleDeck(this.deck);
  },
  methods: {

//at start game check cards left in deck, reset some variables and draw cards.
//also check for a "BlackJack(A+10 or A+Figure)"
    newGame() {
      if (this.deck.length >= 26) {
        this.createDeck();
        this.shuffleDeck(this.deck);
      }

      this.playerCards = [];
      this.dealerCards = [];
      this.winner = "";
      this.hasAce = false;
      (this.reducedValueAce = 0), (this.gameStarted = true);
      this.playerCards.push(this.deck.pop());
      this.dealerCards.push(this.deck.pop());

      this.playerCards.push(this.deck.pop());

      this.dealerCards.push(this.deck.pop());
      this.dealerCards.forEach((card, index) => {
        if (index === 1) {
          card.secondCardDealer = true;
        } else {
          card.secondCardDealer = false;
        }
      });

      this.getWinner();
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
        this.exampleModal = true;
      }, 1000);
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
      }

      if (
        this.playerCards.length < 3 &&
        playerHand === 21 &&
        dealerHand != 21
      ) {
        this.message = "Round Won, BlackJack!";
        this.winner = "player";
        this.exampleModal = true;
      } else if (
        this.playerCards.length < 3 &&
        playerHand === 21 &&
        dealerHand === 21
      ) {
        this.message = "Round Tie";
        this.winner = "tie";
        this.exampleModal = true;
      }

      if (this.dealerCards[1].secondCardDealer === true) {
        return;
      }

      if (dealerHand > 21) {
        this.message = "Round Won";
        this.winner = "player";
      }
      if (dealerHand <= 21) {
        if (dealerHand > playerHand) {
          this.message = "Round Lost";
          this.winner = "dealer";
        } else if (dealerHand < playerHand) {
          this.message = "Round Won";
          this.winner = "player";
        } else if (dealerHand <= 21 && dealerHand >= 17) {
          this.message = "Round Tie";
          this.winner = "tie";
        }
      }
      console.log(this.winner);
      return this.winner;
    },

    onHit() {
      this.playerCards.push(this.deck.pop());
      this.getWinner();
      if (this.winner) {
        this.exampleModal = true;
      }
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

      if (
        totalHandPlayer > 21 &&
        this.hasAce &&
        reduce
      ) {
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
    const exampleModal = ref(false);
    return {
      exampleModal,
    };
  },
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  padding: 60px;
  background: url("./assets/texture3.jpg") center/100%;
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
  color: aliceblue;
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

.btn-startgame {
  padding: 50px !important;
  font-size: 30px !important;
}

.start-btn {
  margin-top: 25vh;
}
</style>
