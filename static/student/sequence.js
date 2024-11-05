document.addEventListener("DOMContentLoaded", () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    const pieces = Array.from(puzzleContainer.children);
    const successMessage = document.getElementById("success-message");
    const completeImage = document.getElementById("complete-image");

    // Shuffle puzzle pieces initially
    shufflePieces();

    let draggedPiece = null;

    pieces.forEach(piece => {
      piece.addEventListener("dragstart", () => {
        draggedPiece = piece;
        setTimeout(() => piece.classList.add("hidden"), 0);
      });

      piece.addEventListener("dragend", () => {
        piece.classList.remove("hidden");
        draggedPiece = null;
      });

      piece.addEventListener("dragover", (e) => e.preventDefault());

      piece.addEventListener("drop", () => {
        if (draggedPiece) {
          const draggedOrder = draggedPiece.getAttribute("data-order");
          const targetOrder = piece.getAttribute("data-order");

          if (draggedOrder && targetOrder) {
            // Swap the pieces in the DOM
            puzzleContainer.insertBefore(draggedPiece, piece.nextSibling);
            puzzleContainer.insertBefore(piece, draggedPiece);
            checkOrder();
          }
        }
      });
    });

    // Shuffle function
    function shufflePieces() {
      pieces.sort(() => Math.random() - 0.5);
      pieces.forEach(piece => puzzleContainer.appendChild(piece));
    }

    // Check if pieces are in the correct order
    function checkOrder() {
      const currentOrder = Array.from(puzzleContainer.children).map(
        piece => piece.getAttribute("data-order")
      );
      const isCorrectOrder = currentOrder.every((order, index) => order == index + 1);

      if (isCorrectOrder) {
        successMessage.classList.remove("hidden");
        completeImage.classList.remove("hidden");
      } else {
        successMessage.classList.add("hidden");
        completeImage.classList.add("hidden");
      }
    }
  });