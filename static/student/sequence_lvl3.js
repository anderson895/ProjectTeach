document.addEventListener("DOMContentLoaded", () => {
  const user_id = $('#user_id').val();  // Get the user_id from an input field or wherever it's stored
  const puzzleContainer = document.getElementById("puzzle-container");
  const pieces = Array.from(puzzleContainer.children);
  const successMessage = document.getElementById("completeAllLevel-message");
  const completeImage = document.getElementById("complete-image");
  const timerDisplay = document.getElementById("timer");
  const levelDisplay = document.getElementById("level-display");
  const performanceMessage = document.getElementById("performance-message");
  const nextLevelContainer = document.getElementById("next-level-container");
  const nextLevelButton = document.getElementById("next-level-button");
  const levelResults = {}; // To store results for each level

  const images = [
    '/static/assets/Sequence/Animals.png', // Level 1
    '/static/assets/Sequence/Truck.png',   // Level 2
    '/static/assets/Sequence/Wave.png',    // Level 3
  ];

  let currentLevel = 2;  // Start from level 2
  let timer;
  let seconds = 0;
  let draggedPiece = null;

  startTimer();
  loadCurrentLevel();  // Load level 2 setup initially

  function loadCurrentLevel() {
    pieces.forEach(piece => {
      piece.style.backgroundImage = `url('${images[currentLevel]}')`;
    });

    levelDisplay.textContent = `Level: ${currentLevel + 1}`;
    shufflePieces();
  }


  pieces.forEach(piece => {
    piece.addEventListener("dragstart", () => {
      draggedPiece = piece;
      setTimeout(() => piece.classList.add("hidden"), 0);
    });

    piece.addEventListener("dragend", () => {
      piece.classList.remove("hidden");
      draggedPiece = null;
    });

    piece.addEventListener("dragover", (e) => {
      e.preventDefault();
      piece.classList.add("drag-hover");
    });

    piece.addEventListener("dragleave", () => {
      piece.classList.remove("drag-hover");
    });

    piece.addEventListener("drop", (e) => {
      e.preventDefault();
      piece.classList.remove("drag-hover");

      if (draggedPiece && piece !== draggedPiece) {
        const boundingRect = piece.getBoundingClientRect();
        const offset = e.clientX - boundingRect.left;

        if (offset < boundingRect.width / 2) {
          puzzleContainer.insertBefore(draggedPiece, piece);
        } else {
          if (piece.nextSibling) {
            puzzleContainer.insertBefore(draggedPiece, piece.nextSibling);
          } else {
            puzzleContainer.appendChild(draggedPiece);
          }
        }

        checkOrder();
      }
    });

    piece.addEventListener("touchstart", (e) => {
      draggedPiece = piece;
      piece.classList.add("drag-hover");
      e.preventDefault();
    });

    piece.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

      if (targetElement && targetElement !== draggedPiece && targetElement.parentNode === puzzleContainer) {
        const boundingRect = targetElement.getBoundingClientRect();
        const offset = touch.clientX - boundingRect.left;

        if (offset < boundingRect.width / 2) {
          puzzleContainer.insertBefore(draggedPiece, targetElement);
        } else {
          if (targetElement.nextSibling) {
            puzzleContainer.insertBefore(draggedPiece, targetElement.nextSibling);
          } else {
            puzzleContainer.appendChild(draggedPiece);
          }
        }
      }
    });

    piece.addEventListener("touchend", () => {
      piece.classList.remove("drag-hover");
      draggedPiece = null;
      checkOrder();
    });
  });

  function shufflePieces() {
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
  }

  function startTimer() {
    seconds = 1; // Start from 1
    timer = setInterval(() => {
      timerDisplay.textContent = `Time: ${formatTime(seconds)}`;
      seconds++;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  function evaluatePerformance(time) {
    let performanceText = '';
    let performanceClass = '';

    if (time <= 60) {
      performanceText = "Excellent";
      performanceClass = "text-green-500";
    } else if (time <= 120) {
      performanceText = "Very Good";
      performanceClass = "text-yellow-500";
    } else {
      performanceText = "Good";
      performanceClass = "text-red-500";
    }

    performanceMessage.textContent = performanceText;
    performanceMessage.classList.add(performanceClass);
    levelResults[currentLevel] = { performanceText, performanceClass }; // Store result for the current level
    performanceMessage.classList.remove("hidden"); // Show performance message
  }

  function checkOrder() {
    const currentOrder = Array.from(puzzleContainer.children).map(
      piece => piece.getAttribute("data-order")
    );
    const isCorrectOrder = currentOrder.every((order, index) => order == index + 1);
  
    if (isCorrectOrder) {
      successMessage.classList.remove("hidden");
      completeImage.classList.remove("hidden");
      stopTimer(); // Stop the timer when the puzzle is solved
      evaluatePerformance(seconds); // Evaluate performance based on time taken
      completeImage.innerHTML = `<img src="${images[currentLevel]}" alt="Completed Puzzle" class="w-64 mx-auto mt-4 border border-gray-400">`;
  
      saveGameResults(currentLevel + 1); // Save game result after each level completion
  
      // Show success message and "Next Level" button after the last level (level 3)
      if (currentLevel < images.length - 1) {
        setTimeout(() => {
          nextLevelContainer.classList.remove("hidden"); // Show the button only if it's not the last level
        }, 2000);
      }
  
      // Check if it's the last level
      if (currentLevel === images.length - 1) {
        successMessage.textContent = "Congratulations! You've completed all levels!";
        successMessage.classList.remove("hidden");
        nextLevelContainer.classList.add("hidden"); // Hide the "Next Level" button after the final level
      }
    } else {
      nextLevelContainer.classList.add("hidden"); // Hide the "Next Level" button if puzzle is not solved
      successMessage.classList.add("hidden");
      completeImage.classList.add("hidden");
    }
  }

  // Proceed to the next level when the "Next Level" button is clicked
  nextLevelButton.addEventListener("click", () => {
    currentLevel++;
    if (currentLevel < images.length) {
      pieces.forEach(piece => {
        piece.style.backgroundImage = `url('${images[currentLevel]}')`;
      });
  
      levelDisplay.textContent = `Level: ${currentLevel + 1}`;
      shufflePieces();
      seconds = 1; // Reset timer
      startTimer(); // Start timer again
  
      successMessage.classList.add("hidden");
      completeImage.classList.add("hidden");
      performanceMessage.classList.add("hidden");
      nextLevelContainer.classList.add("hidden"); // Hide the next level button until the next level is completed
    }
  });

  function saveGameResults(levelCompleted) {
    const gameData = {
      game_id: 3,
      user_id: user_id,
      gr_lvl1: levelResults[0]?.performanceText || null,  // Save performance for Level 1
      gr_lvl2: levelResults[1]?.performanceText || null,  // Save performance for Level 2
      gr_lvl3: levelResults[2]?.performanceText || null,  // Save performance for Level 3
      DateToday: (() => {
        const date = new Date();
        const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = new Intl.DateTimeFormat('en-PH', options).format(date);
        const [month, day, year] = formattedDate.split('/');
        return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
      })()
    };

    // Send the data via AJAX to Flask
    $.ajax({
      url: '/save_game_results',  // Your Flask route
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(gameData),
      success: function(response) {
        console.log(gameData);
        console.log('Game result saved successfully for level:', levelCompleted, response.message);
      },
      error: function(xhr, status, error) {
        console.error('Error saving game result for level:', levelCompleted, error);
      }
    });
  }
});
