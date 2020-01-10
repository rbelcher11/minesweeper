//Global variables.
var smileyId = document.getElementById("smiley");
var mineRemainder = document.getElementsByClassName("mineRemainder");
var minefield = document.getElementsByClassName("minefield");
var box = document.getElementsByClassName("box");
var revealedBoxes = document.getElementsByClassName("boxAfter");
var flaggedBoxes = document.getElementsByClassName("flagged");
var hardBox = document.getElementsByClassName("hard_box");
var button = document.querySelectorAll("button");
var tableData = document.querySelectorAll("td");
var emptyArray = [];
var mineCount = 10;
var winCount = 71;
var flagCount = 10;
var rowLength = 9;
var winTime = 0;
var pass = false;
var gameOver = false;
var mineArray = [];
let mineLog = [];
var firstBox = true;
var fieldOfMines = [];
var test = 0;
var difficulty = "easy";

//This disables the right click context menu.
document.oncontextmenu = () => {
    return false;
};

adjustMineCounter();
rightClickHandler();
leftClickHandler();

hardMode();

//This checks if you are left clicking on a box, revealing the "afraid" face for the duration.
function isBox() {  
  for(let i=0;i<box.length;i++) {
  box[i].onmousedown = function(e) { 
       if (e.which===1&&!firstBox&&!this.classList.contains("flagged")) {              
         document.getElementById("smiley").style.backgroundImage = 'url("images/smiley02.png")';
        } else if (e.which===3) {
        }
      }
    }
  }

//Pressing left mouse button will trigger the function to see if you are pressing on a box.
document.getElementById("minesweeper").onmousedown = function(event) {
    if (event.which===1||event.which===3) {
      isBox();
      }}

//This passes on the values of the box that is right clicked.
function rightClickHandler() {
  for(let i =0;i<485;i++) {
    button[i].addEventListener("contextmenu", function() {
      if (this.classList.contains("box")) {
      rightClickBox(this);
      }
    }) 
  }
}

function leftClickHandler() {
  for(let i =0;i<485;i++) {
    button[i].addEventListener("click", function(e) {
      for(let j =0;j<box.length;j++) {
        if (this===box[j]) {
          selectBox(j);
        }
      }
    })
  }
}

//This adds a class to the button that causes it to be hidden, also returns the default smiley.
function selectBox(x) {
  if (firstBox) {
    createMinefield(x);
    firstBox = false;
    countSeconds();
  }
  smileyId.style.backgroundImage = 'url("images/smiley01.png")';
  if (!box[x].classList.contains("flagged")) {
    revealSelectedBox(x);
    smileyId.style.backgroundImage = 'url("images/smiley01.png")';
    checkForMine(x);
    checkForEmpty(x);
  }
  if (revealedBoxes.length===winCount) {
    winGame();
  }
  }

//This is used to reveal the box that is interacted with.
function revealSelectedBox(y) {
  if (!box[y].classList.contains("flagged")&&!box[y].classList.contains("boxAfter")) {
    box[y].classList.add('boxAfter');
  }
}

//This looks for right clicks and assigns flags on first click, and a question mark on the second click.
  var tar = 0;
function rightClickBox(x) {
  if (x.classList.contains("flagged")) {
    x.classList.remove("flagged");
    x.classList.add("question_mark");
  } else if (x.classList.contains("question_mark")) {
    x.classList.remove("question_mark");
  } else {
    x.classList.add("flagged");  
  }
  adjustMineCounter();
}

//This resets the board without refreshing the page.
function resetGame() {
  for (let z=0;z<box.length;z++) {
    box[z].classList.remove('boxAfter');
    box[z].classList.remove('flagged')
    box[z].classList.remove('question_mark')    
    minefield[z].style.backgroundImage = "";
    minefield[z].style.backgroundColor = "#CCCCCC";
    minefield[z].classList.remove("empty_space");
  }
    pass = false;
    gameOver = false;
    emptyArray = [];
    firstBox = true;
    adjustMineCounter();
    resetSmile();
    assignDigit(0, document.querySelector("#timer_digit_one"));
    assignDigit(0, document.querySelector("#timer_digit_two"));
    assignDigit(0, document.querySelector("#timer_digit_three"));
}

//This systematically reveals each square individually.
function revealAll() {
  for (let n=0;n<box.length;n++) {
    box[n].classList.add('boxAfter');
  }
}

//This sets the board to a losing state.
function loseGame() {
  if (firstBox) {
    resetGame();
    createMinefield(Math.floor(Math.random() * box.length));
  }
  smileyId.style.backgroundImage = 'url("images/smiley04.png")';
  gameOver = true;
  document.querySelector("#tipText").textContent = "Game Over!";
  checkFlags();
  }

//This sets the board to a winning state
function winGame() {
  if (firstBox) {
    resetGame();
    createMinefield(Math.floor(Math.random() * box.length));
  }
  smileyId.style.backgroundImage = 'url("images/smiley03.png")';
  gameOver = true;
  document.querySelector("#tipText").textContent = "You Win!";
 }

//This sets the smiley back to default, along with the mine counter.
function resetSmile() {
  smileyId.style.backgroundImage = 'url("images/smiley01.png")';
}

// This decides which boxes will have mines, executed after the firstBox is decided, then creates the array
function createMinefield(y) {
  makeMineArray(y);
  createMineLog(mineArray);
  makeNumbers(mineLog)
  changeToMine();
  assignValues();
}

//This makes the array telling the algorithm where the mines are located
function makeMineArray(x) {
  mineArray = [];
  mineArray.push(x);
  for(let i =0;i<mineCount;i++) {
    var n = Math.floor(Math.random() * minefield.length);
    if (mineArray.findIndex(function(e){return e===n})>=0) {
      i--
    } else if (mineArray.findIndex(function(e){return e===n})<0){
      mineArray.push(n);
    } 
    }
  mineArray.shift();
  mineArray.sort((a, b) => a - b);
}

//This is executed with selectBox() and will check if they have clicked a mine square.
function checkForMine(y) {
  for(let i =0;i<mineArray.length;i++) {
    if (y===mineArray[i]) {
      loseGame(y);
      revealAll();
      minefield[y].style.backgroundImage = 'url("images/mineblew.png")';
      minefield[y].style.backgroundColor = 'red';
      gameOver = true;
      // checkFlags();
    }
  }
}

function checkForEmpty(y) {
  if(minefield[y].classList.contains("empty_space")) {
    var a = emptyArray.length;
    var b = 0;
    emptyArray = [];
    pass = false;
    emptyArray.push(y);
    while (!pass) {
      a = emptyArray.length;
      emptyArray.forEach(function(e){
        findAllEmpty(e);
      })
      removeDuplicates();
      b = emptyArray.length;
      if (a===b) {
        pass = true;
      }
    }
    if (pass) {
      emptyArray.forEach(function(e){revealSurroundings(e);})
    }
  }
}

function findAllEmpty(y) {
  checkLeft(y);
  checkRight(y);
  if (y<rowLength) {
    checkBelow(y);     
  } else if (y>=minefield.length-rowLength) {
    checkAbove(y);
  } else {
    checkAbove(y);
    checkBelow(y);
  }
}

function filterEmpty(z) {
  if(minefield[z].classList.contains("empty_space")) {
    emptyArray.push(z)
  }
  
} 

function removeDuplicates() {
  emptyArray.sort((a, b) => a - b);
  for(let i =0;i<emptyArray.length-1;i++) {
    if (emptyArray[i]===emptyArray[i+1]) {
      emptyArray.splice(i, 1);
      i=-1;
    }
  }
}

function checkAbove(z) {
  if (Number.isInteger(z/rowLength)) {
    filterEmpty(z-(rowLength-1));
    filterEmpty(z-rowLength);
  } else if (Number.isInteger((z+1)/rowLength)) {
    filterEmpty(z-rowLength);
    filterEmpty(z-(rowLength+1));
  } else {
    filterEmpty(z-rowLength);
    filterEmpty(z-(rowLength-1));
    filterEmpty(z-(rowLength+1));
  }
}

function checkBelow(z) {
  filterEmpty(z+rowLength);
  if (Number.isInteger(z/rowLength)) {
    filterEmpty(z+(rowLength+1));
  } else if (Number.isInteger((z+1)/rowLength)) {
    filterEmpty(z+(rowLength-1));
  } else {
    filterEmpty(z+(rowLength-1));
    filterEmpty(z+(rowLength+1));
  }
}

function checkLeft(z) {
  if (!Number.isInteger(z/rowLength)) {
    filterEmpty(z-1);
  }
}

function checkRight(z) {
    if (!Number.isInteger((z+1)/rowLength)) {
    filterEmpty(z+1);
  }
}

function createMineLog(chosenArray) {
  mineLog = [];
  var a = [];
  var b = [];
  for(let i =0;i<box.length;i++) {
    a.push(false);
  }
  for(let i =0;i<chosenArray.length;i++) {
    for(let j =0;j<a.length;j++) {
      if (chosenArray[i]===j) {
        a.splice(j, 1, true);
      }
    }
  }
  for(let i =0;i<rowLength;i++) {
    b = [];
    for(let j =0;j<rowLength;j++) {
      b.push(a[0])
      a.shift();
    }
    mineLog.push(b);
  }
}

function makeNumbers(m) {
  let c = [];
  let a = [];
  let v = 0;
  let x = m[0].length;
  let y = m.length;
  for (let i=0;i<y;i++) {
    for (let j=0;j<x;j++) {
      c.push(0)
      }
      a.push(c)
    c=[]
  }
  for (let i=0;i<y;i++) {
    for(let j =0;j<x;j++) {
      for(let k=i-1;k<i+2;k++) {
        for(let l=j-1;l<j+2;l++) {
          if (k<0||l<0||k>y-1||l>x-1||(l===j&&k===i)) {
            v++
          } else if (m[k][l]) {
            a[i][j]++
          }
        }
      }   
    }
  }
  fieldOfMines = a;
}

function changeToMine() {
  for(let i =0;i<mineArray.length;i++) {
    var w = mineArray[i]/rowLength;
    var x = Math.floor(w);
    var y = Math.floor((w-x) * (rowLength+1));
    fieldOfMines[x].splice(y, 1, "x");
  }
}

function assignValues() {
  for(let i =0;i<minefield.length;i++) {
    var w = i/rowLength;
    var x = Math.floor(w);
    var y = Math.floor((w-x) * (rowLength+1));
    minefield[i].style.backgroundRepeat = "no-repeat";
    minefield[i].style.backgroundPosition = "center";
    if (fieldOfMines[x][y]==="x") {
      minefield[i].style.backgroundImage = 'url("images/minebomb.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===1) {
      minefield[i].style.backgroundImage = 'url("images/mine1.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===2) {
      minefield[i].style.backgroundImage = 'url("images/mine2.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===3) {
      minefield[i].style.backgroundImage = 'url("images/mine3.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===4) {
      minefield[i].style.backgroundImage = 'url("images/mine4.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===5) {
      minefield[i].style.backgroundImage = 'url("images/mine5.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===6) {
      minefield[i].style.backgroundImage = 'url("images/mine6.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===7) {
      minefield[i].style.backgroundImage = 'url("images/mine7.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===8) {
      minefield[i].style.backgroundImage = 'url("images/mine8.png")';
      minefield[i].style.backgroundSize = "80%";
    } else if (fieldOfMines[x][y]===0) {
      minefield[i].style.backgroundImage ='url("images/emptyspace.png")';
      minefield[i].classList.add("empty_space");
      minefield[i].style.backgroundSize = "50%";
    }
  }
}

//This is executed with selectBox() and will check if they have clicked an empty square, prompting other squares to reveal around it.
function revealSurroundings(z) {
  revealSelectedBox(z);
  revealLeft(z);
  revealRight(z);
  if (z<rowLength) {
    revealBelow(z);     
  } else if (z>=minefield.length-rowLength) {
    revealAbove(z);
  } else {
    revealAbove(z);
    revealBelow(z);
  }
}

function revealAbove(z) {
  if (Number.isInteger(z/rowLength)) {
    revealSelectedBox(z-(rowLength-1));
    revealSelectedBox(z-rowLength);
  } else if (Number.isInteger((z+1)/rowLength)) {
    revealSelectedBox(z-rowLength);
    revealSelectedBox(z-(rowLength+1));
  } else {
    revealSelectedBox(z-rowLength);
    revealSelectedBox(z-(rowLength-1));
    revealSelectedBox(z-(rowLength+1));
  }
}

function revealBelow(z) {
  revealSelectedBox(z+rowLength);
  if (Number.isInteger(z/rowLength)) {
    revealSelectedBox(z+(rowLength+1));
  } else if (Number.isInteger((z+1)/rowLength)) {
    revealSelectedBox(z+(rowLength-1));
  } else {
    revealSelectedBox(z+(rowLength-1));
    revealSelectedBox(z+(rowLength+1));
  }
}

function revealLeft(z) {
  if (!Number.isInteger(z/rowLength)) {
    revealSelectedBox(z-1);
  }
}

function revealRight(z) {
    if (!Number.isInteger((z+1)/rowLength)) {
    revealSelectedBox(z+1);
  }
  }

function adjustMineCounter() {
  var a = 0;
  var b = 0;
  var c = 0;
  var t = (flagCount - flaggedBoxes.length);
  if (t<0) {
    a = "-";
  } else {
    a = 0;
  }
  b = Math.floor(Math.abs(t) * 0.1);
  c = (Math.abs(t)-(b*10));
  assignDigit(a, document.querySelector("#mine_digit_one"));
  assignDigit(b, document.querySelector("#mine_digit_two"));
  assignDigit(c, document.querySelector("#mine_digit_three"));
}

function assignDigit(x, y) {
  if (x===0) {
    y.src = "images/digit0.png";
  } else if (x===1) {
    y.src = "images/digit1.png";
  } else if (x===2) {
    y.src = "images/digit2.png";
  } else if (x===3) {
    y.src = "images/digit3.png";
  } else if (x===4) {
    y.src = "images/digit4.png";
  } else if (x===5) {
    y.src = "images/digit5.png";
  } else if (x===6) {
    y.src = "images/digit6.png";
  } else if (x===7) {
    y.src = "images/digit7.png";
  } else if (x===8) {
    y.src = "images/digit8.png";
  } else if (x===9) {
    y.src = "images/digit9.png";
  } else if (x==="-") {
    y.src = "images/digitminus.png";
  } 
}

function countSeconds() {
  var t = 0;
  setInterval(function() { 
          if (!firstBox&&!gameOver) {
            var a = 0;
            var b = 0;
            var c = 0;
            t++
            a = Math.floor(t * 0.01);
            b = Math.floor(t * 0.1)-(a*10);
            c = (t-((b*10)+(a*100)));
            assignDigit(a, document.querySelector("#timer_digit_one"));
            assignDigit(b, document.querySelector("#timer_digit_two"));
            assignDigit(c, document.querySelector("#timer_digit_three"));
            if (t===999) {
              gameOver = true;
              clearInterval();
              t=0;
            }
        } else if (gameOver) {
            assignDigit(a, document.querySelector("#timer_digit_one"));
            assignDigit(b, document.querySelector("#timer_digit_two"));
            assignDigit(c, document.querySelector("#timer_digit_three"));
            clearInterval();
            t=0;
        } else  {
          clearInterval();
          t=0;
        }
  }, 1000);
}

function easyMode() {
  resetGame();
  rowLength = 9;
  flagCount = 10;
  mineCount = 10;
  winCount = 71;
  difficulty = "easy";
  for (let i=0;i<484;i++) {
    if (button[i+1].classList.contains("hard_box")) {
      button[i+1].classList.remove("box")
      button[i+1].classList.remove("flagged")
        }
    if (tableData[i].classList.contains("hard_box")) {
      tableData[i].classList.remove("minefield");
    }
  }
  for(let i =0;i<18;i++) {
    if (document.querySelectorAll("tr")[i].classList.contains("hard_row")) {
      document.querySelectorAll("tr")[i].classList.remove("mine_row");
    }
  }
  makeEasyBoard();
  resetGame();
}

function hardMode() {
  resetGame();
  rowLength = 30;
  flagCount = 99;
  mineCount = 99;
  winCount = 381;
  difficulty = "hard";
  resetGame();
  for (let i=1;i<484;i++) {
    if (button[i+1].classList.contains("hard_box")) {
          button[i+1].classList.add("box");
        }
    if (tableData[i].classList.contains("hard_box")) {
      tableData[i].classList.add("minefield");
    }
  }
  for(let i =0;i<18;i++) {
    if (document.querySelectorAll("tr")[i].classList.contains("hard_row")) {
      document.querySelectorAll("tr")[i].classList.add("mine_row");
    }
  }
  makeHardBoard();
}

function makeEasyBoard() {
  document.querySelector(".sweepBoard").classList.remove("hard_sweep_board");
  document.querySelector(".boardBox").classList.remove("hard_board_box");
  document.querySelector("#minesweeper").classList.remove("hard_minesweeper");
  document.querySelector("#tipBox").classList.remove("hard_tip_box");
  document.querySelector("#tipText").textContent = "Easy Mode";
  document.querySelector(".timer").classList.remove("hard_timer");
  document.querySelector("#smiley").classList.remove("hard_smiley");
  document.querySelector(".scoreKeeper").classList.remove("hard_score_keeper");
}

function makeHardBoard() {
  document.querySelector(".sweepBoard").classList.add("hard_sweep_board");
  document.querySelector(".boardBox").classList.add("hard_board_box");
  document.querySelector("#minesweeper").classList.add("hard_minesweeper");
  document.querySelector("#tipBox").classList.add("hard_tip_box");
  document.querySelector("#tipText").textContent = "Hard Mode";
  document.querySelector(".timer").classList.add("hard_timer");
  document.querySelector("#smiley").classList.add("hard_smiley");
  document.querySelector(".scoreKeeper").classList.add("hard_score_keeper");
}

function checkFlags() {
  for(let i =0;i<box.length;i++) {
    var p = false;
    if (box[i].classList.contains("flagged")) {
      for(let j =0;j<mineCount;j++) {
          if (i===mineArray[j]) {
            box[i].classList.add("boxAfter");
            minefield[i].style.backgroundImage = 'url("images/minewrong.png")';
          }
          }
      }

    }
  }

//Tools for diagnosing bugs:

document.querySelector("#tipText").addEventListener("click", function(){
  document.querySelector("#tipText").textContent = mineArray;
})

document.querySelector("#tipText").addEventListener("contextmenu", checkFlags)

document.getElementById('hard_mode_button').addEventListener('click', hardMode);
document.getElementById('easy_mode_button').addEventListener('click', easyMode);
document.getElementById('winner').addEventListener('click', function(){
  winGame();
  revealAll();
});
document.getElementById('loser').addEventListener('click', function(){
  loseGame();
  revealAll();
});
document.getElementById('smiley').addEventListener('click', function(){
  resetSmile();
  resetGame();
});