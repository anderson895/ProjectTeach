function admin_fetchGame() {
    $.ajax({
        type: "GET",
        url: "/admin_fetchGame", // Endpoint to fetch all counts and sales
        contentType: "application/json",
        dataType: "json",
        success: function(response) {

            console.log(response);
            
            
        },
        error: function(xhr, status, error) {
            console.error('Error fetching counts:', error);
        }
    });
}





// Initial fetch when the page loads
admin_fetchGame();