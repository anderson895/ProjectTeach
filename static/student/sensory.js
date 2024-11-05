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

    // Ensure each item appears exactly 5 times
    const itemCounts = {};
    items.forEach(item => {
        itemCounts[item.id] = 5; // Each item will appear 5 times
    });

    // Create an array to hold the balanced item list
    const balancedItems = [];
    items.forEach(item => {
        for (let i = 0; i < 5; i++) {
            balancedItems.push(item);
        }
    });

    // Shuffle the balanced items to make the grid random
    balancedItems.sort(() => Math.random() - 0.5);

    // Populate the grid with the shuffled, balanced items
    const gridContainer = document.getElementById("icon-grid");
    balancedItems.forEach((item) => {
        const imgElement = document.createElement("img");
        imgElement.src = item.src;
        imgElement.alt = item.id;
        
        // Add classes for hover effect using Tailwind
        imgElement.classList.add("w-16", "h-16", "mx-auto", "cursor-pointer", "transition", "duration-300", "transform", "hover:scale-110", "hover:shadow-lg");

        // Add click event listener to increment and reveal count, then remove
        imgElement.addEventListener("click", function() {
            counters[item.id]++;
            document.getElementById(item.id + "-count").value = counters[item.id];

            // Remove the clicked item from the grid
            imgElement.remove();

            // Check if the target item count has reached 5
            if (item.id === targetItem.id && counters[item.id] === 5) {
                alert(`You found 5 ${targetItem.id}s! Great job!`);
            }
        });

        gridContainer.appendChild(imgElement);
    });
});
