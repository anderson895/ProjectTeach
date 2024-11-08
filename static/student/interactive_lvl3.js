
document.addEventListener("DOMContentLoaded", function () {

    var user_id = $("#user_id").val()
    const pencilContainer = document.querySelector(".pencil-container");

    // Define pencil types with their images and sizes
    const pencilTypes = [

        { src: "/static/assets/Sorting/Sorting_Shapes/circle.png", width: "w-12", height: "h-12", type: "circle" },
        { src: "/static/assets/Sorting/Sorting_Shapes/square.png", width: "w-16", height: "h-16", type: "square" },
        { src: "/static/assets/Sorting/Sorting_Shapes/star.png", width: "w-20", height: "h-20", type: "star" },
        { src: "/static/assets/Sorting/Sorting_Shapes/triangle.png", width: "w-20", height: "h-20", type: "triangle" }
    ];

   
    const numberOfPencils = 30;
    let correctlyPlaced = 0;
    let gameCompleteTime = null; // Store the time when the game is completed

    // Randomly create 8 pencils and add them to the container
    for (let i = 0; i < numberOfPencils; i++) {
        const pencil = pencilTypes[Math.floor(Math.random() * pencilTypes.length)];

        // Create an img element for the pencil
        const pencilElement = document.createElement("img");
        pencilElement.src = pencil.src;
        pencilElement.alt = `${pencil.type.charAt(0).toUpperCase() + pencil.type.slice(1)} Pencil`;
        pencilElement.className = `${pencil.width} ${pencil.height} cursor-pointer absolute`;
        pencilElement.dataset.type = pencil.type;

        // Make pencil draggable
        $(pencilElement).draggable({
            helper: 'original',
            revert: 'invalid',
            containment: 'document',
            zIndex: 9999,
        });

        // Append pencil to container
        pencilContainer.appendChild(pencilElement);
    }

    // Enable sorting boxes to be droppable
    $(".sorting-box").droppable({
        accept: ".cursor-pointer",
        drop: function(event, ui) {
            const pencil = ui.helper[0];
            const box = $(this);
            const boxType = box.find('span').text().toLowerCase();
            const pencilType = pencil.dataset.type;

            // Check if the pencil type matches the box type
            if (boxType === pencilType) {
                $(pencil).appendTo(box).css({
                    position: 'relative',
                    left: '0',
                    top: '0',
                    margin: 'auto',
                    bottom: '5px'
                }).draggable('disable').addClass("border-green-500");

                // Log success to the console
                console.log(`Correct! The ${pencilType} pencil was placed in the ${boxType} box.`);

                // Increment correctly placed pencils
                correctlyPlaced++;

                // Check if all pencils are placed correctly
                if (correctlyPlaced === numberOfPencils && !gameCompleteTime) {
                    gameCompleteTime = timer; // Record the time when the game is completed
                    displayRating(gameCompleteTime); // Display rating based on completion time
                    alert("All pencils have been placed correctly!");
                }
            } else {
                // Allow the pencil to revert if it's the wrong box
                $(pencil).addClass("border-red-500");
                setTimeout(() => {
                    $(pencil).removeClass("border-red-500");
                }, 500);

                // Log mismatch to the console
                console.log(`Incorrect! The ${pencilType} was placed in the ${boxType} box.`);
            }
        }
    });

    // Timer initialization
    let timer = 0; // Timer in seconds
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(function () {
            timer++;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            document.getElementById('timer').textContent = `Time: ${formatTime(minutes)}:${formatTime(seconds)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    // Start the timer when the page is ready
    startTimer();

    // Function to display the rating based on completion time
    function displayRating(completionTime) {
        let rating = '';
        if (completionTime <= 60) {
            rating = 'Excellent';
        } else if (completionTime <= 120) {
            rating = 'Very Good';
        } else if (completionTime <= 180) {
            rating = 'Good';
        }

        // Display rating in a message or alert
        alert(`You completed the task in ${completionTime} seconds. Your performance: ${rating}`);

        saveGameResults(rating)

    }



    
function saveGameResults(performance) {
  const gameData = {
      game_id: 4,
      user_id: user_id,
      gr_lvl1: null,  
      gr_lvl2: null,    
      gr_lvl3: performance,
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
            window.location.href = '/student/interactive_game/'+user_id
        },
        error: function(xhr, status, error) {
            console.error("Error saving game results:", status, error);
        }
    });
    }
});
