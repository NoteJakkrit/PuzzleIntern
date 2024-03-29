let timerInterval; //จับเวลา
let timeElapsed = 0; //เวลาผ่านไป
let ranking = []; // เก็บข้อมูลเวลาและชื่อผู้เล่นที่เล่นเกมเสร็จสิ้น


const moves = document.getElementById("moves");
const grid = document.querySelector(".grid");
const puzzleButton = document.getElementById("puzzleButton");
const screen = document.querySelector(".screen");
const result = document.getElementById("result");

let currentElement = "";
let movesCount, 
  imagesArray = [];
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};



function updateRanking(name, time) {
  ranking.push({ name, time });
  ranking.sort((a, b) => a.time - b.time); 
}




function startTimer() {
    timerInterval = setInterval(() => {
      timeElapsed++;
      document.getElementById("timer").innerText = `เวลา: ${timeElapsed} วินาที`;
    }, 1000);

}
  function stopTimer() {
    clearInterval(timerInterval);
}



//ทำการสุ่ม
const randomNumber = () => Math.floor(Math.random() * 15) + 1;

//ทำการสุ่มภาพ
const randomImages = () => {
  while (imagesArray.length < 15) {
    let randomVal = randomNumber();
    if (!imagesArray.includes(randomVal)) {
      imagesArray.push(randomVal);
    }
  }
  imagesArray.push(16);
  return imagesArray;
};


const getCoords = (element) => {
  const [row, col] = element.getAttribute("position").split("_");
  return [parseInt(row), parseInt(col)];
};

const checkNear = (row1, row2, col1, col2) => {
  
  if (row1 == row2) {
    //ซ้าย-ขวา
    if (col2 == col1 - 1 || col2 == col1 + 1) {
      return true;
    }
  } else if (col1 == col2) {
    //บน-ล่าง
    if (row2 == row1 - 1 || row2 == row1 + 1) {
      return true;
    }
  }
  return false;
};



//ทำการแสดงภาพแต่ละภาพออกมา
const gridGenerator = () => {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    for (let n = 0; n < 4; n++) {
      let div = document.createElement("div");
      div.setAttribute("position", `${i}_${n}`);
      div.addEventListener("click", selectImage);
      div.classList.add("image-grid");
      div.innerHTML = `<img src="images/m${
        imagesArray[count]
      }.png" class="image ${
        imagesArray[count] == 16 ? "target" : ""
      }" index="${imagesArray[count]}"/>`;
      count += 1;
      grid.appendChild(div);
    }
  }

};






const selectImage = (e) => {
  e.preventDefault();

  currentElement = e.target;

  let targetElement = document.querySelector(".target");
  let currentParent = currentElement.parentElement;
  let targetParent = targetElement.parentElement;


  const [row1, col1] = getCoords(currentParent);
  const [row2, col2] = getCoords(targetParent);
  

  if (checkNear(row1, row2, col1, col2)) {

    currentElement.remove();
    targetElement.remove();

    let currentIndex = parseInt(currentElement.getAttribute("index"));
    let targetIndex = parseInt(targetElement.getAttribute("index"));

    currentParent.appendChild(targetElement);
    targetParent.appendChild(currentElement);

    let currentArrIndex = imagesArray.indexOf(currentIndex);
    let targetArrIndex = imagesArray.indexOf(targetIndex);
    [imagesArray[currentArrIndex], imagesArray[targetArrIndex]] = [
     imagesArray[targetArrIndex],
     imagesArray[currentArrIndex],
    ];
    

    if (imagesArray.join("") == "12345678910111213141516") {
        stopTimer();
        let playerName = prompt("ยินดีด้วยคุณเล่นผ่านแล้ว กรุณาใส่ชื่อของคุณ : ");
        updateRanking(playerName, timeElapsed);
        setTimeout(() => {
        
        screen.classList.remove("hide");
        grid.classList.add("hide");
        
        result.innerText = `จำนวนครั้งที่เลื่อน: ${movesCount}`;
        result.innerText += `\nใช้เวลาทั้งหมด: ${timeElapsed} วินาที`;
       
        puzzleButton.innerText = "เริ่มเกมใหม่";
      }, 1000);
    }

    movesCount += 1;
    moves.innerText = `จำนวนครั้ง: ${movesCount}`;
    console.log(imagesArray);
    
  }
};




function startNewGame() {
  grid.classList.remove("hide");
  screen.classList.add("hide");
  grid.innerHTML = "";
  imagesArray = [];
  randomImages();
  gridGenerator();
  movesCount = 0;
  moves.innerText = `จำนวนครั้ง: ${movesCount}`;
  timeElapsed = 0; 
  document.getElementById("timer").innerText = `เวลา: ${timeElapsed} วินาที`;
  startTimer();
}



puzzleButton.addEventListener("click", () => {

  startNewGame(); 
  for (let i = 0; i < ranking.length; i++) {
    document.getElementById(`time${i + 1}`).innerText = `ลำดับที่  ${i + 1}: ${ranking[i].name} - ใช้เวลา: ${ranking[i].time} วินาที`;
  }
});




