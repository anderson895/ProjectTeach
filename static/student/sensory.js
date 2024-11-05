document.addEventListener("DOMContentLoaded", function() {
   

    

    // Randomly select a target item for counting
    const targetItem = items[Math.floor(Math.random() * items.length)];
    document.getElementById("target-item").textContent = targetItem.id;

    // Initialize counters for each item
    const counters = {
        pencil: 0,
        eraser: 0,
        crayons: 0,
        bag: 0,
        notebook: 0
    };

    // Populate the grid with 25 randomly selected items
    const gridContainer = document.getElementById("icon-grid");
    for (let i = 0; i < 25; i++) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        const imgElement = document.createElement("img");
        imgElement.src = randomItem.src;
        imgElement.alt = randomItem.id;
        imgElement.classList.add("w-16", "h-16", "mx-auto", "cursor-pointer");

        // Add click event listener to increment and reveal count, then remove
        imgElement.addEventListener("click", function() {
            counters[randomItem.id]++;
            document.getElementById(randomItem.id + "-count").value = counters[randomItem.id];

            // Remove the clicked item from the grid
            imgElement.remove();

            // Check if the target item count has reached 5
            if (randomItem.id === targetItem.id && counters[randomItem.id] === 5) {
                alert(`You found 5 ${targetItem.id}s! Great job!`);
            }
        });

        gridContainer.appendChild(imgElement);
    }
});