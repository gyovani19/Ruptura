const TARGET_COUNT = 100;
const CONTAINER_TARGET = 20;
const containerCounts = [0, 0, 0, 0, 0];

function updateHeaderPercentage() {
  const totalCollected = containerCounts.reduce((a, b) => a + b, 0);
  const percent = Math.min(Math.floor((totalCollected / TARGET_COUNT) * 100), 100);
  document.querySelector(".header-percent").textContent = `${percent}% Complete`;
}

function updateFooterContainers() {
  document.querySelectorAll(".box").forEach((box, idx) => {
    const count = containerCounts[idx] || 0;
    const percent = Math.min(Math.floor((count / CONTAINER_TARGET) * 100), 100);
    box.querySelector(".bottom-label").textContent = `${percent}%`;
  });
  updateHeaderPercentage();
}

function getGridColumns() {
  const section = document.querySelector("section");
  const gridTemplateColumns = window.getComputedStyle(section).getPropertyValue("grid-template-columns");
  return gridTemplateColumns.split(" ").length;
}

function getGridDivs() {
  return Array.from(document.querySelectorAll("section div"));
}

const shapes = [
  { rows: 3, cols: 2 },
  { rows: 4, cols: 3 },
  { rows: 3, cols: 3 },
  { rows: 2, cols: 4 }
];

let currentScaryBlockIndices = [];
const suspenseAudio = new Audio('suspense.mp3');
suspenseAudio.loop = true;

let fadeInInterval = null;
let fadeOutInterval = null;
let fadeOutTimeout = null;
const FADE_DURATION = 1000;
let blockEliminated = false;
let scaryBlockHoverCount = 0;

function addHoverToBlock() {
  const gridDivs = getGridDivs();
  currentScaryBlockIndices.forEach(index => {
    const cell = gridDivs[index];
    if (cell) cell.classList.add("scary-hover");
  });
}

function removeHoverFromBlock() {
  const gridDivs = getGridDivs();
  currentScaryBlockIndices.forEach(index => {
    const cell = gridDivs[index];
    if (cell) cell.classList.remove("scary-hover");
  });
}

function fadeIn(audio, duration) {
  if (fadeOutInterval) {
    clearInterval(fadeOutInterval);
    fadeOutInterval = null;
  }
  audio.volume = 0;
  if (audio.paused) {
    audio.play().catch(err => console.warn("Erro ao iniciar áudio:", err));
  }
  const step = 50 / duration;
  fadeInInterval = setInterval(() => {
    let newVol = audio.volume + step;
    if (newVol >= 1) {
      audio.volume = 1;
      clearInterval(fadeInInterval);
      fadeInInterval = null;
    } else {
      audio.volume = newVol;
    }
  }, 50);
}

function fadeOut(audio, duration) {
  if (fadeInInterval) {
    clearInterval(fadeInInterval);
    fadeInInterval = null;
  }
  const step = 50 / duration;
  fadeOutInterval = setInterval(() => {
    let newVol = audio.volume - step;
    if (newVol <= 0) {
      audio.volume = 0;
      clearInterval(fadeOutInterval);
      fadeOutInterval = null;
      audio.pause();
    } else {
      audio.volume = newVol;
    }
  }, 50);
}

function scaryMouseEnter() {
  if (!blockEliminated) {
    if (scaryBlockHoverCount === 0) {
      addHoverToBlock();
      if (suspenseAudio.paused || suspenseAudio.volume === 0) {
        fadeIn(suspenseAudio, FADE_DURATION);
      }
    }
    scaryBlockHoverCount++;
    if (fadeOutTimeout) {
      clearTimeout(fadeOutTimeout);
      fadeOutTimeout = null;
    }
  }
}

function scaryMouseLeave() {
  if (!blockEliminated) {
    scaryBlockHoverCount = Math.max(scaryBlockHoverCount - 1, 0);
    if (scaryBlockHoverCount === 0) {
      removeHoverFromBlock();
      fadeOutTimeout = setTimeout(() => {
        fadeOut(suspenseAudio, FADE_DURATION);
      }, 200);
    }
  }
}

function initializeGridNumbers() {
  document.querySelectorAll("section div").forEach(div => {
    div.innerHTML = Math.floor(Math.random() * 10);
    const r = Math.floor(Math.random() * 10);
    if (r <= 1) {
      div.classList.add('b-20');
    } else if (r <= 3) {
      div.classList.add('l-20');
    }
    const d = Math.floor(Math.random() * 10);
    if (d <= 3) {
      div.classList.add('d-1');
    } else if (d <= 6) {
      div.classList.add('d-1_5');
    }
    const du = Math.floor(Math.random() * 10);
    if (du <= 1) {
      div.classList.add('du-2');
    } else if (du <= 6) {
      div.classList.add('du-8');
    }
  });
}

function createScaryBlock() {
  blockEliminated = false;
  scaryBlockHoverCount = 0;
  
  const gridDivs = getGridDivs();
  const totalDivs = gridDivs.length;
  const cols = getGridColumns();
  const rowsInGrid = Math.floor(totalDivs / cols);
  
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  
  const validStartRows = rowsInGrid - shape.rows + 1;
  const validStartCols = cols - shape.cols + 1;
  if (validStartRows <= 0 || validStartCols <= 0) {
    console.warn("A grade é pequena para o formato selecionado.");
    return;
  }
  
  const startRow = Math.floor(Math.random() * validStartRows);
  const startCol = Math.floor(Math.random() * validStartCols);
  
  currentScaryBlockIndices = [];
  for (let r = 0; r < shape.rows; r++) {
    for (let c = 0; c < shape.cols; c++) {
      const index = (startRow + r) * cols + (startCol + c);
      currentScaryBlockIndices.push(index);
    }
  }
  
  currentScaryBlockIndices.forEach(index => {
    const div = gridDivs[index];
    if (div) {
      div.addEventListener("click", handleScaryClick);
      div.addEventListener("mouseenter", scaryMouseEnter);
      div.addEventListener("mouseleave", scaryMouseLeave);
    }
  });
}

function handleScaryClick() {
  if (!blockEliminated) {
    eliminateScaryBlock();
  }
}

function eliminateScaryBlock() {
  blockEliminated = true;
  suspenseAudio.pause();
  suspenseAudio.currentTime = 0;
  
  const gridDivs = getGridDivs();
  const scaryDivs = currentScaryBlockIndices.map(i => gridDivs[i]).filter(div => div);
  
  const randomIndex = Math.floor(Math.random() * 5);
  const containerBox = document.querySelector(`.box[data-index="${randomIndex}"]`);
  containerBox.classList.add("open");
  
  scaryDivs.forEach(div => {
    div.removeEventListener("click", handleScaryClick);
    div.removeEventListener("mouseenter", scaryMouseEnter);
    div.removeEventListener("mouseleave", scaryMouseLeave);
    div.classList.remove("scary-hover");
    
    const clone = div.cloneNode(true);
    clone.classList.add("travel");
    clone.classList.remove("b-20", "l-20", "d-1", "d-1_5", "du-2", "du-8");
    
    const rect = div.getBoundingClientRect();
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    document.body.appendChild(clone);
    
    const boxRect = containerBox.getBoundingClientRect();
    const destX = boxRect.left + boxRect.width / 2 - rect.width / 2;
    const destY = boxRect.top + boxRect.height / 2 - rect.height / 2;
    
    clone.offsetWidth;
    clone.style.left = destX + "px";
    clone.style.top = destY + "px";
    clone.style.opacity = 0;
    clone.style.transform = "scale(0.8)";
    
    clone.addEventListener("transitionend", () => {
      clone.remove();
    });
    
    div.innerHTML = Math.floor(Math.random() * 10);
    div.classList.remove("transport", "scary-hover");
  });
  
  containerCounts[randomIndex] += scaryDivs.length;
  updateFooterContainers();
  
  setTimeout(() => {
    containerBox.classList.remove("open");
  }, 1000);
  
  setTimeout(() => {
    createScaryBlock();
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
  initializeGridNumbers();
  updateFooterContainers();
  setTimeout(() => {
    createScaryBlock();
  }, 5000);
});
