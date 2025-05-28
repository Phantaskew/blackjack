var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hiddenCard;
var deck = [];

var canHit = true; // will become false if yourSum is greater than or equal to 21

window.onload = function(){
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck(){
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["D", "H", "S", "C"];

    for (let i = 0; i < values.length; i++){
        for (let j = 0; j < types.length; j++){
            deck.push(values[i] + "-" + types[j]);
        }
    }
}

function shuffleDeck(){
    for (let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame(){
    hiddenCard = deck.pop();
    dealerSum += getValue(hiddenCard);
    dealerAceCount += isAce(hiddenCard) ? 1 : 0;
    console.log(hiddenCard);

    while (dealerSum < 17){
        card = deck.pop();
        dealerSum += getValue(card);
        dealerAceCount += isAce(card) ? 1 : 0;

        cardImg = document.createElement("img");
        cardImg.src = "cards/" + card + ".png";
        document.getElementById("dealerCards").append(cardImg);
    }

    for (let i = 0; i < 2; i++){
        card = deck.pop();
        yourSum += getValue(card);
        yourAceCount += isAce(card) ? 1 : 0;

        cardImg = document.createElement("img");
        cardImg.src = "cards/" + card + ".png";
        document.getElementById("yourCards").append(cardImg);
    }
    
    if (reduceAce(yourSum, yourAceCount) >= 21){
        canHit = false;
    }

    document.getElementById("hitBtn").addEventListener("click", hit);
    document.getElementById("stayBtn").addEventListener("click", stay);
}

function hit(){
    if (!canHit){
        return;
    }

    card = deck.pop();
    yourSum += getValue(card);
    yourAceCount += isAce(card) ? 1 : 0;
    cardImg = document.createElement("img");
    cardImg.src = "cards/" + card + ".png";
    document.getElementById("yourCards").append(cardImg);

    console.log(yourSum);

    if (reduceAce(yourSum, yourAceCount) >= 21){
        canHit = false;
    }
}

function stay(){
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;

    document.getElementById("hiddenCard").src = "cards/" + hiddenCard + ".png";

    document.getElementById("dealerTotal").innerText = dealerSum;
    document.getElementById("yourTotal").innerText = yourSum;

    let message = "";
    let reason = "";
    if (dealerSum > 21 && yourSum > 21){
        message = "You lose";
        reason = "Your total exceeded 21.";
    }
    else if (dealerSum > 21){
        message = "You win";
        reason = "Dealer's total exceeded 21.";
    }
    else if (yourSum > 21){
        message = "You lose";
        reason = "Your total exceeded 21.";
    }
    else if (yourSum > dealerSum){
        message = "You win";
        reason = "Your total exceeded the dealer's.";
    }
    else if (yourSum < dealerSum){
        message = "You lose";
        reason = "Dealer's total exceeded the yours.";
    }
    else if (yourSum == dealerSum){
        message = "It's a tie";
        reason = "Both totals are equal.";
    }
    document.getElementById("result").innerText = message;
    document.getElementById("reason").innerText = reason;

    document.getElementById("extraMsg").innerText = "Please refresh the page to play again.";
}

function getValue(card){
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)){
        if (value === "A"){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function isAce(card){
    if (card.charAt(0) === "A"){
        return true;
    }
    return false;
}

function reduceAce(sum, aceCount){
    while (aceCount !== 0 && sum > 21){
        aceCount -= 1;
        sum -= 10;
    }
    return sum;
}