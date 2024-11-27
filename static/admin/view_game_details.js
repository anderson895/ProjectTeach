function admin_fetch_game_record_daily() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId'); 
    const userId = urlParams.get('userId'); 

    $.ajax({
        type: "GET",
        url: `/admin_fetch_game_record_details?gameId=${gameId}&&userId=${userId}`,
        contentType: "application/json",
        dataType: "json",
        
        success: function(response) {
            console.log(response);

            // Clear the table before appending new data
            $('#view_studentGameDetails').empty();
            $('#GameName').text(response[0][9]);

            console.log(response[9]);
            

            if (response.length === 0) {
                // If no records found, display a message
                $('#view_studentGameDetails').append(`
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-700 font-medium">
                            No records found
                        </td>
                    </tr>
                `);
            } else {
                // Loop through the student data and create rows
                response.forEach(record => {
                    var date = new Date(record[7]);
                    var formattedDate = date.getFullYear() + '-' +
                                        String(date.getMonth() + 1).padStart(2, '0') + '-' +
                                        String(date.getDate()).padStart(2, '0');
                
                    var current_level = record[3];
                    if (current_level == 'gr_lvl2') {
                        current_level = "Level 2";
                    } else if (current_level == 'gr_lvl3') {
                        current_level = "Level 3";
                    }
                
                    // Handling performance levels (checking for null)
                    var performance1 = record[4] === null ? "Not yet taken" : record[4];
                    var performance2 = record[5] === null ? "Not yet taken" : record[5];
                    var performance3 = record[6] === null ? "Not yet taken" : record[6];
                
                    // Function to determine the color class for performance
                    function getColorClass(performance) {
                        switch (performance) {
                            case 'Excellent':
                                return 'bg-yellow-400';  // Yellow for Excellent
                            case 'Very Good':
                                return 'bg-green-400';   // Green for Very Good
                            case 'Good':
                                return 'bg-gray-400';    // Gray for Good
                            default:
                                return 'bg-gray-200';    // Default gray for other values
                        }
                    }
                
                    // Append the row to the table with dynamic color classes for performance
                    $('#view_studentGameDetails').append(`
                        <tr class="bg-yellow-50 border-b dark:bg-gray-50 dark:border-gray-300">
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">${formattedDate}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">${current_level}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700 ${getColorClass(performance1)}">${performance1}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700 ${getColorClass(performance2)}">${performance2}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700 ${getColorClass(performance3)}">${performance3}</td>
                        </tr>
                    `);
                });
                
            }

        },
        error: function(xhr, status, error) {
            console.error('Error fetching counts:', error);
        }
    });
}

setInterval(admin_fetch_game_record_daily, 2000);
admin_fetch_game_record_daily();
