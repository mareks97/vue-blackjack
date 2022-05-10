# vue-blackjack

#### Project setup
```
npm install (in case of conflicts use "npm install --force")
```

#### Compiles and hot-reloads for development
```
npm run serve
```

### I recreated the famous card game BlackJack with Vue3.

At game start the dack is created and shuffled 1000 times to provide randomness. When half of the deck is reached it will get shuffled again.
The rules are the same od the official game:
1) The goal of blackjack is to beat the dealer's hand without going over 21.
2) Face cards are worth 10. Aces are worth 1 or 11, whichever makes a better hand. (in my game aces are worth 11 unless you draw another card and go over 21)
3) Each player starts with two cards, one of the dealer's cards is hidden until the end.
4) To 'Hit' is to ask for another card. To 'Stand' is to hold your total and end your turn.
5) If you go over 21 you bust, and the dealer wins regardless of the dealer's hand.
6) If you are dealt 21 from the start (Ace & 10), you got a blackjack.
7) Blackjack usually means you win 1.5 the amount of your bet. Depends on the casino.
8) Dealer will hit until his/her cards total 17 or higher.

My plan is to implement the betting system as well.
