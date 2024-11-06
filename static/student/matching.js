// $(document).ready(function() {
//     let user_id = $('#user_id').val();  
//     let currentLevel = 1;
//     let selectedLabel = null;
//     let selectedImage = null;
//     let matches = 0;

//     const levels = {
//         1: [
//             { label: "Blue", img: "/static/assets/Matching/ColorMatch/blue.png" },
//             { label: "Green", img: "/static/assets/Matching/ColorMatch/green.png" },
//             { label: "Orange", img: "/static/assets/Matching/ColorMatch/orange.png" },
//             { label: "Pink", img: "/static/assets/Matching/ColorMatch/pink.png" },
//             { label: "Purple", img: "/static/assets/Matching/ColorMatch/purple.png" },
//             { label: "Red", img: "/static/assets/Matching/ColorMatch/red.png" },
//             { label: "Yellow", img: "/static/assets/Matching/ColorMatch/yellow.png" }
//         ],
//         2: [
//             { label: "Circle", img: "/static/assets/Matching/ShapesMatch/circle.png" },
//             { label: "Heart", img: "/static/assets/Matching/ShapesMatch/heart.png" },
//             { label: "Octagon", img: "/static/assets/Matching/ShapesMatch/octagon.png" },
//             { label: "Square", img: "/static/assets/Matching/ShapesMatch/square.png" },
//             { label: "Star", img: "/static/assets/Matching/ShapesMatch/star.png" },
//             { label: "Trapezoid", img: "/static/assets/Matching/ShapesMatch/trapezoid.png" },
//             { label: "Triangle", img: "/static/assets/Matching/ShapesMatch/triangle.png" }
//         ],
//         3: [
//             { label: "Bird", img: "/static/assets/Matching/AnimalsMatch/bird.png" },
//             { label: "Butterfly", img: "/static/assets/Matching/AnimalsMatch/butterfly.png" },
//             { label: "Cat", img: "/static/assets/Matching/AnimalsMatch/cat.png" },
//             { label: "Dog", img: "/static/assets/Matching/AnimalsMatch/Dog.png" },
//             { label: "Fish", img: "/static/assets/Matching/AnimalsMatch/fish.png" },
//             { label: "Jellyfish", img: "/static/assets/Matching/AnimalsMatch/Jellyfish.png" },
//             { label: "Starfish", img: "/static/assets/Matching/AnimalsMatch/Starfish.png" }
//         ]
//     };

//     // Shuffle array function
//     function shuffleArray(array) {
//         for (let i = array.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [array[i], array[j]] = [array[j], array[i]]; // Swap elements
//         }
//     }

//     function loadLevel(level) {
//         $('#game-container').empty();
//         matches = 0;

//         const levelItems = levels[level];
//         shuffleArray(levelItems);

//         const labels = levelItems.map(item => item.label);
//         const images = levelItems.map(item => item.img);

//         shuffleArray(labels);
//         shuffleArray(images);

//         for (let i = 0; i < levelItems.length; i++) {
//             $('#game-container').append(`
//                 <div class="flex items-center justify-between mb-4">
//                     <div class="flex items-center space-x-2 label-item" id="label-${i}" data-label="${labels[i]}" draggable="true">
//                         <div class="border border-red-300 rounded-md px-4 py-2 text-lg font-semibold text-center w-24">${labels[i]}</div>
//                        <button class="dot_label w-3 h-3 bg-black rounded-full" data-label="${labels[i]}" id="dot-label-${i}" aria-label="Dot label ${i}"></button>

//                     </div>

//                     <div class="flex items-center space-x-2 image-item" id="image-${i}" data-label="${labels[i]}">
//                        <button class="btn btn-dot_image w-3 h-3 bg-black rounded-full" id="dot-image-${i}"></button>
//                         <div class="w-24 h-24 bg-gray-300 rounded-md">
//                             <img src="${images[i]}" alt="${labels[i]}" class="w-full h-full object-cover rounded-md">
//                         </div>
//                     </div>
//                 </div>
//             `);
//         }
//     }

//     // Draw line function
//     function drawLine(fromElement, toElement, color = 'black') {
//         const fromOffset = $(fromElement).offset();
//         const toOffset = $(toElement).offset();
        
//         const line = $('<div class="line"></div>');
//         line.css({
//             position: 'absolute',
//             top: fromOffset.top + 10,
//             left: fromOffset.left + 10,
//             width: Math.abs(toOffset.left - fromOffset.left) + 'px',
//             height: '2px',
//             backgroundColor: color,
//             transform: 'rotate(' + Math.atan2(toOffset.top - fromOffset.top, toOffset.left - fromOffset.left) + 'rad)',
//             transformOrigin: '0 0',
//         });
//         $('body').append(line);
//     }

//     // Event listeners for label and image click
//     $(document).on('click', '.label-item', function() {
//         selectedLabel = $(this).data('label');
//         if (selectedLabel && selectedImage) {
//             if (selectedLabel === selectedImage) {
//                 drawLine(`#dot-label-${selectedLabel}`, `#dot-image-${selectedImage}`, 'green');
//                 alert('Match found!');
//                 matches++;
//             } else {
//                 drawLine(`#dot-label-${selectedLabel}`, `#dot-image-${selectedImage}`, 'red');
//                 alert('Try again!');
//             }
//             selectedLabel = null;
//             selectedImage = null;
//         }
//     });

//     $(document).on('click', '.image-item', function() {
//         selectedImage = $(this).data('label');
//         if (selectedLabel && selectedImage) {
//             if (selectedLabel === selectedImage) {
//                 drawLine(`#dot-label-${selectedLabel}`, `#dot-image-${selectedImage}`, 'green');
//                 alert('Match found!');
//                 matches++;
//             } else {
//                 drawLine(`#dot-label-${selectedLabel}`, `#dot-image-${selectedImage}`, 'red');
//                 alert('Try again!');
//             }
//             selectedLabel = null;
//             selectedImage = null;
//         }
//     });

//     // Load the first level
//     loadLevel(currentLevel);
// });
