$(document).ready(function() {
    let user_id = $('#user_id').val();  
    let currentLevel = 1;
    let selectedLabel = null;
    let selectedImage = null;
    let matches = 0;

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

    function loadLevel(level) {
        $('#game-container').empty();
        matches = 0;

        levels[level].forEach(item => {
            $('#game-container').append(`
                <div class="flex items-center justify-between mb-4">
                    <!-- Left dot next to label -->
                    <div class="flex items-center space-x-2 label-item" data-label="${item.label}">
                        <div class="border border-red-300 rounded-md px-4 py-2 text-lg font-semibold text-center w-24">${item.label}</div>
                      <span class="dot w-3 h-3 bg-black rounded-full" data-label="${item.label}"></span>
                    </div>

                    <!-- Right dot next to image -->
                    <div class="flex items-center space-x-2 image-item" data-label="${item.label}">
                        <span class="w-3 h-3 bg-black rounded-full"></span>
                        <div class="w-24 h-24 bg-gray-300 rounded-md">
                            <img src="${item.img}" alt="${item.label}" class="w-full h-full object-cover rounded-md">
                        </div>
                    </div>
                </div>
            `);
        });
    }


    
    function checkMatch() {
        if (selectedLabel && selectedImage) {
            if (selectedLabel === selectedImage) {
                alert("Match found!");
                matches++;
                
                // Hide matched items
                $(`.label-item[data-label='${selectedLabel}']`).fadeOut();
                $(`.image-item[data-label='${selectedImage}']`).fadeOut();
                
                selectedLabel = null;
                selectedImage = null;

                // Check if level is completed
                if (matches === levels[currentLevel].length) {
                    currentLevel++;
                    if (currentLevel <= 3) {
                        loadLevel(currentLevel);
                        $('#currentLevel').text(`Level ${currentLevel}`);
                    } else {
                        $('#game-container').empty();
                        $('#success-container').removeClass('hidden');
                    }
                }
            } else {
                alert("Try again!");
                selectedLabel = null;
                selectedImage = null;
            }
        }
    }

    // Load the first level
    loadLevel(currentLevel);

    // Event listeners for label and image selection
    $(document).on('click', '.label-item', function() {
        selectedLabel = $(this).data('label');
        checkMatch();
    });

    $(document).on('click', '.image-item', function() {
        selectedImage = $(this).data('label');
        checkMatch();
    });
});
