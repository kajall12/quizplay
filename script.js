
let questions = [
  { q: "Which tag is used to create a hyperlink in HTML?", options: ["<a>", "<link>", "<href>"], answer: "<a>" },
  { q: "Which CSS property controls text size?", options: ["font-style", "font-size", "text-size"], answer: "font-size" },
  { q: "Inside which HTML element do we put JavaScript?", options: ["<js>", "<javascript>", "<script>"], answer: "<script>" },
  { q: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Character"], answer: "Character" },
  { q: "Which symbol is used for comments in CSS?", options: ["// comment", "/* comment */", "# comment"], answer: "/* comment */" },
  { q: "Which SQL command is used to extract data?", options: ["GET", "SELECT", "OPEN"], answer: "SELECT" },
  { q: "Which company developed Java?", options: ["Microsoft", "Sun Microsystems", "Oracle"], answer: "Sun Microsystems" },
  { q: "In C language, which operator is used to access value at address?", options: ["*", "&", "%"], answer: "*" },
  { q: "Which of these is an Operating System?", options: ["Oracle", "Linux", "Python"], answer: "Linux" },
  { q: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const"], answer: "const" }
];

let currentQ = 0;
let score = 0;
let playerName = "";
let selectedAnswer = null;

// 🔹 Start Quiz
function startQuiz() {
  playerName = document.getElementById("playerName").value;
  if (playerName.trim() === "") {
    alert("Please enter your name!");
    return;
  }
  document.getElementById("namePage").style.display = "none";
  document.getElementById("quizPage").style.display = "flex";
  document.getElementById("resultPage").style.display = "none";
  document.getElementById("welcomeText").innerText = "Welcome, " + playerName + " 👋";

  currentQ = 0;
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  let q = questions[currentQ];
  document.getElementById("question").innerText = (currentQ + 1) + ". " + q.q;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  selectedAnswer = null;

  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.innerText = opt;
    btn.classList.add("optionBtn");
    btn.onclick = () => selectAnswer(btn, q.answer);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("nextBtn").style.display = "none"; 
}


function selectAnswer(btn, correct) {
  let allBtns = document.querySelectorAll(".optionBtn");

  allBtns.forEach(b => b.disabled = true); 
  if (btn.innerText === correct) {
    btn.style.background = "green";
    score++;
  } else {
    btn.style.background = "red";

    allBtns.forEach(b => {
      if (b.innerText === correct) {
        b.style.background = "green";
      }
    });
  }

  document.getElementById("nextBtn").style.display = "block"; // show Next button
}

// 🔹 Next Question
function nextQuestion() {
  currentQ++;

  if (currentQ < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

// 🔹 Show Result + Google Sheet POST
function showResult() {
  document.getElementById("quizPage").style.display = "none";
  document.getElementById("resultPage").style.display = "flex";

  // Update score text only
    document.getElementById("finalScore").innerHTML =
    `<h2>🎉 Quiz Finished!</h2>
     <p>${playerName}, your score is ${score} / ${questions.length}</p>`;

  // ✅ Send data to Google Sheet
  fetch("https://script.google.com/macros/s/AKfycbxo6xKqmR1wcizYGwLMkIrEhFhN9atS_cU4gufIJ3R0JKYvwaS09MtlqbK2RwEEaLXA/exec", {
    method: "POST",
    body: JSON.stringify({ name: playerName, score: score }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(data => console.log("Saved:", data))
  .catch(err => console.error("Error:", err));
}

// 🔹 Restart Quiz
function restartQuiz() {
  document.getElementById("resultPage").style.display = "none";
  document.getElementById("namePage").style.display = "flex";
  document.getElementById("playerName").value = "";

  // Reset quiz variables
  currentQ = 0;
  score = 0;
  selectedAnswer = null;
}