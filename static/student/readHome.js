$(document).ready(function() {
    // Open Modal
    $('.image').on('click', function() {
      var largeImage = $(this).data('large');
      $('#modalImage').attr('src', largeImage);
      $('#imageModal').removeClass('hidden');
    });

    // Close Modal
    $('#closeModal').on('click', function() {
      $('#imageModal').addClass('hidden');
    });

    // Close Modal when clicking outside the image
    $('#imageModal').on('click', function(event) {
      if ($(event.target).is('#imageModal')) {
        $('#imageModal').addClass('hidden');
      }
    });
  });