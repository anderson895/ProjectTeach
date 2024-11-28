function AllstudentStat() {
    // Retrieve the data attributes from the element
    var game_id = $('#Statids').data('game_id');
    var student_id = $('#Statids').data('student_id');

    // Make the AJAX request
    $.ajax({
        type: "GET",
        url: "/admin_fetchGameStat", // Ensure this URL matches your backend route
        data: {
            game_id: game_id,
            student_id: student_id
        },
        dataType: "json", // Expected data type in response
        success: function(response) {
            console.log('Response:', response);
            // Handle the response as needed
        },
        error: function(xhr, status, error) {
            console.error('Error fetching counts:', error);
            // You can also log xhr.responseText to see the response from the server
        }
    });
}

// Call the function
AllstudentStat();
