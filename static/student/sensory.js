$(document).ready(function() {
    // Initialize variables
    let targetItem;
    const counters = { pencil: 0, eraser: 0, crayons: 0, bag: 0, notebook: 0 };
    let elapsedTime = 0; // Timer starts at 0 seconds
    let timerInterval;
    const gridContainer = $("#icon-grid");
    let currentLevel = 1; // Track the current level
    const targetCounts = [5, 10, 15]; // Target counts for level 1, 2, and 3
    const totalItems = [25, 50, 75]; // Total items for level 1, 2, and 3
    const levelResults = {}; // To store results for each level

    // Function to select a new target item and display it
    function setNewTargetItem() {
        targetItem = items[Math.floor(Math.random() * items.length)];
        $("#target-item").text(`Collect ${targetCounts[currentLevel - 1]} ${capitalize(targetItem.id)}`);
    }

    // Helper function to capitalize the first letter
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    // Function to start counting up
    function startTimer() {
        elapsedTime = 0; // Reset elapsed time
        clearInterval(timerInterval); // Clear any existing timer
        timerInterval = setInterval(() => {
            elapsedTime++;

            // Format and display the time as MM:SS
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            $("#timer").text(`Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
    }

    // Function to check elapsed time and give feedback
    function checkTimeAndProceed() {
        clearInterval(timerInterval); // Stop the timer
    
        // Determine performance based on elapsed time
        const performance = evaluatePerformance(elapsedTime);
        levelResults[currentLevel] = performance; // Store performance for the current level
    
        showAlert(performance.message);
        saveGameResults(); // Call the function to save game results
    
        if (currentLevel >= 3) {
            // If the player has completed Level 3
            $(".game_Card").hide(); // Hide the game grid
            $("#completion-message").show(); // Show the completion message
        } else {
            startNewLevel(); // Proceed to the next level
        }
    }

    // Custom alert function using SweetAlert2
    function showAlert(message, type) {
        Swal.fire({
            icon: type, // 'success' or 'error'
            title: type === "error" ? "Oops..." : "Level Completed!",
            text: message,
            confirmButtonText: 'Close',
            confirmButtonColor: '#3085d6',
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                confirmButton: 'custom-button',
            },
            // Inline styles
            didRender: () => {
                const popup = Swal.getPopup();
                const title = Swal.getTitle();
                const button = Swal.getConfirmButton();
    
                // Popup styles
                popup.style.background = '#f4f4f4'; // Light gray background
                popup.style.borderRadius = '10px'; // Rounded corners
                popup.style.padding = '20px'; // Add some padding
                popup.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)'; // Shadow effect
    
                // Title styles
                title.style.color = type === "error" ? '#d9534f' : '#4caf50'; // Red for error, green for success
                title.style.fontSize = '24px'; // Larger font size
                title.style.fontWeight = 'bold';
    
                // Button styles
                button.style.backgroundColor = '#3085d6';
                button.style.color = '#fff';
                button.style.border = 'none';
                button.style.borderRadius = '5px';
                button.style.padding = '10px 20px';
                button.style.fontSize = '16px';
                button.style.cursor = 'pointer';
            }
        });
    }
    


    // Function to evaluate performance
    function evaluatePerformance(time) {
        let message = "";
        if (time <= 60) {
            message = "Excellent";
            return { grade: "Excellent", message };
        } else if (time <= 120) {
            message = "Very good";
            return { grade: "Very Good", message };
        } else {
            message = "Good!";
            return { grade: "Good", message };
        }
    }

    // Function to save game results via AJAX
    function saveGameResults() {
        const gameData = {
            game_id: 1,
            user_id: user_id,
            gr_lvl1: levelResults[1]?.grade || null,
            gr_lvl2: levelResults[2]?.grade || null,
            gr_lvl3: levelResults[3]?.grade || null,
            DateToday: (() => {
                const date = new Date();
                const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
                const formattedDate = new Intl.DateTimeFormat('en-PH', options).format(date);
                // Split formatted date and rearrange to YYYY-MM-DD
                const [month, day, year] = formattedDate.split('/');
                return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
            })()
        };
        
        console.log(gameData)

        $.ajax({
            url: '/save_game_results',  // Your Flask endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(gameData),
            success: function(response) {
                console.log("Game results saved successfully:", response);
            },
            error: function(xhr, status, error) {
                console.error("Error saving game results:", status, error);
            }
        });
    }

    // Function to start a new, harder level
    function startNewLevel() {
        currentLevel++; // Increment the level
        $("#level-display").text(`Level: ${currentLevel}`); // Display current level
        gridContainer.empty(); // Clear the grid for the new level
        Object.keys(counters).forEach(key => counters[key] = 0); // Reset counters

        setNewTargetItem(); // Set a new target item for the next level
        populateGrid(); // Re-populate the grid with items
        startTimer(); // Restart the timer for the new level

        // Apply transition effect
        gridContainer.addClass("transition duration-500 opacity-0");
        setTimeout(() => {
            gridContainer.removeClass("opacity-0");
        }, 500);
    }

    // Function to show the level completed message
    function showCompletionMessage() {
        // Hide the game grid
        gridContainer.hide();

        // Show the completion message
        $("#completion-message").text("Congratulations! You've completed all levels!").show();
    }

    function populateGrid() {
        const itemCount = totalItems[currentLevel - 1]; // Get the total items for the current level
        const balancedItems = [];
        const itemDistribution = Math.floor(itemCount / Object.keys(counters).length); // Evenly distribute items

        // Fill the grid with a balanced number of each item
        Object.keys(counters).forEach(key => {
            for (let i = 0; i < itemDistribution; i++) {
                balancedItems.push({ id: key, src: items.find(item => item.id === key).src });
            }
        });

        // If there are leftover slots (in case itemCount isn't perfectly divisible), add random items
        const remainingItems = itemCount - balancedItems.length;
        for (let i = 0; i < remainingItems; i++) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            balancedItems.push(randomItem);
        }

        // Shuffle balancedItems to randomize their order
        balancedItems.sort(() => Math.random() - 0.5);

        balancedItems.forEach((item) => {
            const imgElement = $('<img>')
                .attr('src', item.src)
                .attr('alt', item.id)
                .addClass("w-16 h-16 mx-auto cursor-pointer transition duration-300 transform hover:scale-110 hover:shadow-lg");

            imgElement.on("click", function() {
                counters[item.id]++;
                $("#" + item.id + "-count").val(counters[item.id]);

                imgElement.remove();

                if (item.id === targetItem.id && counters[item.id] === targetCounts[currentLevel - 1]) {
                    checkTimeAndProceed();
                }
            });

            gridContainer.append(imgElement);
        });
    }

   // Fetch the existing record and set the current level
$.ajax({
    url: '/check_existing_record',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ user_id: user_id ,game_id:1}), // Ensure user_id is defined
    success: function(response) {
        console.log(response);

        if (response.status === 'success' && response.records.length > 0) {
            const currentRecord = response.records[0]; // Access the first record
            const gr_current_level = currentRecord[3]; // Index 3 for the current level
            
            // Determine the current level based on the retrieved data
            if (gr_current_level === 'gr_lvl2') {
                currentLevel = 2; // Start at Level 2
            } else if (gr_current_level === 'gr_lvl3') {
                currentLevel = 3; // Start at Level 3
            } else if (gr_current_level === 'Completed') {
                $(".game_Card").hide(); // Hide the game grid
                $("#completion-message").show(); // Show the completion message
            } else {
                currentLevel = 1; // Reset to Level 1 if no valid level is found
            }

            // Initialize game with the current level
            $("#level-display").text(`Level: ${currentLevel}`);
            setNewTargetItem(); // Initialize the target item
            populateGrid(); // Populate the grid for the current level
            startTimer(); // Start the timer
        } else {
            // No records found
            console.log('No existing records found, starting from Level 1.');

            // Start from Level 1
            currentLevel = 1; // Reset to Level 1
            $("#level-display").text(`Level: ${currentLevel}`); // Initial level display
            setNewTargetItem(); // Initialize the first target item
            populateGrid(); // Populate the grid for the first level
            startTimer(); // Start the timer on game load
        }
    },
    error: function(xhr, status, error) {
        console.error('Error fetching record:', error);
        // Optional: Display a user-friendly message

        // Start from Level 1 if there's an error fetching the record
        currentLevel = 1; // Reset to Level 1
        $("#level-display").text(`Level: ${currentLevel}`); // Initial level display
        setNewTargetItem(); // Initialize the first target item
        populateGrid(); // Populate the grid for the first level
        startTimer(); // Start the timer on game load
    }
});


    // Show instructions and hide after a few seconds
    const instructions = $("#instructions");
    instructions.show();
    setTimeout(() => {
        instructions.hide();
    }, 5000); // Hide instructions after 5 seconds
});
