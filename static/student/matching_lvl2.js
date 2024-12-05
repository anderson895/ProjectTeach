var user_id = $("#user_id").val()

const levels = {
  1: [
    { label: "Blue", img: "/static/assets/Matching/ColorMatch/blue.png" },
    { label: "Green", img: "/static/assets/Matching/ColorMatch/green.png" },
    { label: "Orange", img: "/static/assets/Matching/ColorMatch/orange.png" },
    { label: "Pink", img: "/static/assets/Matching/ColorMatch/pink.png" },
    { label: "Purple", img: "/static/assets/Matching/ColorMatch/purple.png" },
    { label: "Red", img: "/static/assets/Matching/ColorMatch/red.png" },
    { label: "Yellow", img: "/static/assets/Matching/ColorMatch/yellow.png" }
  ],
  2: [
    { label: "Circle", img: "/static/assets/Matching/ShapesMatch/circle.png" },
    { label: "Heart", img: "/static/assets/Matching/ShapesMatch/heart.png" },
    { label: "Octagon", img: "/static/assets/Matching/ShapesMatch/octagon.png" },
    { label: "Square", img: "/static/assets/Matching/ShapesMatch/square.png" },
    { label: "Star", img: "/static/assets/Matching/ShapesMatch/star.png" },
    { label: "Trapezoid", img: "/static/assets/Matching/ShapesMatch/trapezoid.png" },
    { label: "Triangle", img: "/static/assets/Matching/ShapesMatch/triangle.png" }
  ],
  3: [
    { label: "Bird", img: "/static/assets/Matching/AnimalsMatch/bird.png" },
    { label: "Butterfly", img: "/static/assets/Matching/AnimalsMatch/butterfly.png" },
    { label: "Cat", img: "/static/assets/Matching/AnimalsMatch/cat.png" },
    { label: "Dog", img: "/static/assets/Matching/AnimalsMatch/Dog.png" },
    { label: "Fish", img: "/static/assets/Matching/AnimalsMatch/fish.png" },
    { label: "Jellyfish", img: "/static/assets/Matching/AnimalsMatch/Jellyfish.png" },
    { label: "Starfish", img: "/static/assets/Matching/AnimalsMatch/Starfish.png" }
  ]
};

let selectedElement = null;
const connections = new Map();

function shuffleArray(array) {
  // Shuffle array using Fisher-Yates (Durstenfeld) algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderLevel(level) {
      const leftColumn = $("#left-column");
      const rightColumn = $("#right-column");
      
      // Clear previous level's pairs
      leftColumn.empty();
      rightColumn.empty();

      // Get level data and shuffle them
      const levelData = levels[level];
      const leftPairs = levelData.map((pair, index) => ({ ...pair, id: index + 1 }));
      const rightPairs = levelData.map((pair, index) => ({ ...pair, id: String.fromCharCode(65 + index) }));

      // Shuffle both arrays independently
      shuffleArray(leftPairs);
      shuffleArray(rightPairs);

    // Create left column pairs
    leftPairs.forEach(pair => {
    leftColumn.append(`
    <div class="flex items-center space-x-2 label-item">

        <div class="pair border border-red-300 rounded-md px-4 py-2 text-lg font-semibold text-center w-24 hover:bg-gray-200 cursor-pointer" data-pair="${pair.id}">
          ${pair.label}
        </div>

    </div>
    `);
    });

    // Create right column pairs with images
    rightPairs.forEach(pair => {
    rightColumn.append(`
    <div class="flex items-center space-x-2 label-item">

    <div class="pair p-4 flex items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer" data-pair="${pair.id}">

        <div class="w-24 h-24 bg-gray-300 rounded-md">
                <img src="${pair.img}" alt="${pair.label}" >
          </div>
    
    </div>

    </div>
    `);
    });

}




$(document).ready(function () {
  // Default level
  renderLevel(2);


  let timer;
  let seconds = 0;
  let minutes = 0;
  let gameStarted = false;
  let gameCompleted = false;
  
  function startTimer() {
    if (!gameStarted) {
      gameStarted = true;
      timer = setInterval(function() {
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
        }
        updateTimerDisplay();
      }, 1000);
    }
  }
  
  function stopTimer() {
    if (!gameCompleted) {
      gameCompleted = true;
      clearInterval(timer);
      evaluatePerformance();
    }
  }
  
  function updateTimerDisplay() {
    const timeString = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    $('#timer').text(`Time: ${timeString}`);
  }
  
  function evaluatePerformance() {
    let performance = "Good"; 
    if (minutes === 0 && seconds <= 60) {
      performance = "Excellent";
    } else if (minutes === 1 && seconds <= 60) {
      performance = "Very Good";
    }
    console.log(`Game Completed in ${minutes}:${seconds < 10 ? "0" : ""}${seconds} - Performance: ${performance}`);
    return performance;
  }
  
  
  // Level change handler
  $(".pair").click(function () {
    // Start the timer when the first pair is selected
    if (!gameStarted) startTimer();
  
    // Determine which column the clicked element belongs to
    const isLeftColumn = $(this).closest("#left-column").length > 0;
    const isRightColumn = $(this).closest("#right-column").length > 0;
  
    if (selectedElement === null) {
      // First selection
      selectedElement = $(this);
      $(this).css("background-color", "lightgreen");
    } else {
      // Second selection - Check if from different columns
      if (isLeftColumn !== (selectedElement.closest("#left-column").length > 0) && isRightColumn == true) {
  
        const element1 = selectedElement;
        const element2 = $(this);
  
        // Remove existing connections if any
        removeConnection(element1);
        removeConnection(element2);
  
        // Draw the new line and save the connection
        drawSVGLine(element1, element2);
        connections.set(element1[0], element2);
        connections.set(element2[0], element1);
  
        // Check if label and image match
        const label1 = element1.text().trim();
        const label2 = element2.find("img").attr("alt").trim();
  
        if (label1 === label2) {
          console.log(`Correct Match: ${label1} with ${label2}`);
          element1.css("background-color", "lightblue");
          element2.css("background-color", "lightblue");
        } else {
          console.log(`Incorrect Match: ${label1} with ${label2}`);
        }
      } else if (isRightColumn !== (selectedElement.closest("#right-column").length > 0) && isLeftColumn == true) {
  
        const element2 = selectedElement;
        const element1 = $(this);
  
        // Remove existing connections if any
        removeConnection(element1);
        removeConnection(element2);
  
        // Draw the new line and save the connection
        drawSVGLine(element1, element2);
        connections.set(element1[0], element2);
        connections.set(element2[0], element1);
  
        // Check if label and image match
        const label1 = element1.text().trim();
        const label2 = element2.find("img").attr("alt").trim();
  
        if (label1 === label2) {
          console.log(`Correct Match: ${label1} with ${label2}`);
          element1.css("background-color", "lightblue");
          element2.css("background-color", "lightblue");
        } else {
          console.log(`Incorrect Match: ${label1} with ${label2}`);
        }
      }
  
      // Reset styles
      selectedElement.css("background-color", "");
      $(this).css("background-color", "");
      selectedElement = null;
  
      // Check if all pairs are connected
      checkIfAllPairsConnected(1);
    }
  });
  
  function checkIfAllPairsConnected(level) {
    const allLeftElements = $("#left-column .pair");
    const allRightElements = $("#right-column .pair");
  
    let allConnected = true;
    let allCorrectMatches = true;
  
    // Check if all left column elements have a connection
    allLeftElements.each(function () {
      const element = $(this);
      if (!connections.has(element[0])) {
        allConnected = false;
      } else {
        // Check if this pair is a correct match
        const connectedElement = connections.get(element[0]);
        const label1 = element.text().trim();
        const label2 = $(connectedElement).find("img").attr("alt").trim();
        
        if (label1 !== label2) {
          allCorrectMatches = false;
        }
      }
    });
  
    // Check if all right column elements have a connection
    allRightElements.each(function () {
      const element = $(this);
      if (!connections.has(element[0])) {
        allConnected = false;
      } else {
        // Check if this pair is a correct match
        const connectedElement = connections.get(element[0]);
        const label1 = $(connectedElement).text().trim();
        const label2 = element.find("img").attr("alt").trim();
        
        if (label1 !== label2) {
          allCorrectMatches = false;
        }
      }
    });
  
    if (allConnected && allCorrectMatches) {
        console.log("All pairs are connected and correctly matched!");
        stopTimer(); // Stop the timer when all pairs are matched and correct

        // Show alert and proceed only after clicking OK
        let performance = evaluatePerformance();
        Swal.fire({
            title: `Level 2 Complete!`,
            text: `Performance: ${performance}`,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
        }).then(() => {
            // Proceed after the user clicks OK
            saveGameResults(performance);
        });
    } else {
        console.log("Not all pairs are connected and correctly matched yet.");
    }
  }
  
  
  
  



  // Remove hover effect after deselection
  $(".pair").on('mouseover', function () {
    if (!selectedElement) {
      $(this).css("background-color", "lightgray");
    }
  }).on('mouseout', function () {
    if (!selectedElement) {
      $(this).css("background-color", "");
    }
  });
});



function saveGameResults(performance) {
  const gameData = {
      game_id: 2,
      user_id: user_id,
      gr_lvl1: null,  
      gr_lvl2: performance,    
      gr_lvl3: null,
      DateToday: (() => {
          const date = new Date();
          const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
          const formattedDate = new Intl.DateTimeFormat('en-PH', options).format(date);
          // Split formatted date and rearrange to YYYY-MM-DD
          const [month, day, year] = formattedDate.split('/');
          return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
      })()
  };

  console.log(gameData);

  $.ajax({
      url: '/save_game_results',  // Your Flask endpoint
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(gameData),
      success: function(response) {
          console.log("Game results saved successfully:", response);
          window.location.href = '/student/matching_game/'+user_id
      },
      error: function(xhr, status, error) {
          console.error("Error saving game results:", status, error);
      }
  });
}




//javascript to control screen

$(window).resize(function () {
updateAllLines();
});

function updateAllLines() {
// Clear existing lines
$("#svg-lines").empty();

// Redraw all connections
connections.forEach((element2, element1) => {
drawSVGLine($(element1), $(element2));
});
}

function drawSVGLine(element1, element2) {
const svg = $("#svg-lines")[0];
const svgRect = svg.getBoundingClientRect();
const pos1 = element1[0].getBoundingClientRect();
const pos2 = element2[0].getBoundingClientRect();

const x1 = pos1.left - svgRect.left + pos1.width / 2;
const y1 = pos1.top - svgRect.top + pos1.height / 2;
const x2 = pos2.left - svgRect.left + pos2.width / 2;
const y2 = pos2.top - svgRect.top + pos2.height / 2;

const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
line.setAttribute("x1", x1);
line.setAttribute("y1", y1);
line.setAttribute("x2", x2);
line.setAttribute("y2", y2);
line.setAttribute("stroke", "red");
line.setAttribute("stroke-width", 2);

svg.appendChild(line);

element1.data("line", line);
element2.data("line", line);
}


function removeConnection(element) {
  const connectedElement = connections.get(element[0]);
  if (connectedElement) {
    // Remove the line from both elements
    const line = element.data("line");
    if (line) {
      line.remove();
    }
    connections.delete(element[0]);
    connections.delete(connectedElement[0]);
  }
}



