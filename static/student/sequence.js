document.addEventListener("DOMContentLoaded", () => {
  const puzzleContainer = document.getElementById("puzzle-container");
  const pieces = Array.from(puzzleContainer.children);
  const successMessage = document.getElementById("success-message");
  const completeImage = document.getElementById("complete-image");

  shufflePieces();

  let draggedPiece = null;

  pieces.forEach(piece => {
    // Desktop drag events
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

    // Mobile touch events
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
