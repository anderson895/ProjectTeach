function fetchCounts() {
    $.ajax({
        type: "GET",
        url: "/admin_dashboard_analytics", // Endpoint to fetch all counts and sales
        contentType: "application/json",
        dataType: "json",
        success: function(response) {

           $("#count_users").text(response.count_users)
           $("#count_daily_activity").text(response.count_daily_activity)
            
            
        },
        error: function(xhr, status, error) {
            console.error('Error fetching counts:', error);
        }
    });
}





// Initial fetch when the page loads
fetchCounts();