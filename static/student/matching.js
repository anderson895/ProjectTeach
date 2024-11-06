document.addEventListener('DOMContentLoaded', function() {
    const user_id = document.getElementById('user_id').value;
    let currentLevel = 1;
  
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

    // Shuffle array function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    function loadLevel(level) {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        matches = 0;

        const levelItems = levels[level];
        shuffleArray(levelItems);

        const labels = levelItems.map(item => item.label);
        const images = levelItems.map(item => item.img);

        shuffleArray(labels);
        shuffleArray(images);

        levelItems.forEach((_, i) => {
            const labelItem = document.createElement('div');
            labelItem.classList.add('flex', 'items-center', 'space-x-2', 'label-item');
            labelItem.id = `label-${i}`;
            labelItem.setAttribute('data-label', labels[i]);
            labelItem.setAttribute('draggable', 'true');

            const labelText = document.createElement('div');
            labelText.classList.add('border', 'border-red-300', 'rounded-md', 'px-4', 'py-2', 'text-lg', 'font-semibold', 'text-center', 'w-24');
            labelText.innerText = labels[i];
            labelItem.appendChild(labelText);

            const dotLabel = document.createElement('button');
            dotLabel.classList.add('dot_label', 'w-3', 'h-3', 'bg-black', 'rounded-full');
            dotLabel.setAttribute('data-label', labels[i]);
            dotLabel.setAttribute('aria-label', `Dot label ${i}`);
            labelItem.appendChild(dotLabel);

            const imageItem = document.createElement('div');
            imageItem.classList.add('flex', 'items-center', 'space-x-2', 'image-item');
            imageItem.id = `image-${i}`;
            imageItem.setAttribute('data-label', labels[i]);

            const dotImage = document.createElement('button');
            dotImage.classList.add('dot_image', 'w-3', 'h-3', 'bg-black', 'rounded-full');
            dotImage.id = `dot-image-${i}`;
            imageItem.appendChild(dotImage);

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('w-24', 'h-24', 'bg-gray-300', 'rounded-md');
            const imgElement = document.createElement('img');
            imgElement.src = images[i];
            imgElement.alt = labels[i];
            imgElement.classList.add('w-full', 'h-full', 'object-cover', 'rounded-md');
            imageDiv.appendChild(imgElement);
            imageItem.appendChild(imageDiv);

            const containerDiv = document.createElement('div');
            containerDiv.classList.add('flex', 'items-center', 'justify-between', 'mb-4');
            containerDiv.appendChild(labelItem);
            containerDiv.appendChild(imageItem);
            gameContainer.appendChild(containerDiv);
        });
    }

    

  

    // Load the first level
    loadLevel(currentLevel);
});
