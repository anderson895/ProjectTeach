function admin_fetch_game_record_daily() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id'); 

    $.ajax({
        type: "GET",
        url: `/admin_fetch_game_record_daily?id=${studentId}`,
        contentType: "application/json",
        dataType: "json",
        
        success: function(response) {
            console.log(response);

            // Clear the table before appending new data
            $('#view_studentGameRecord').empty();

            if (response.length === 0) {
                // If no records found, display a message
                $('#view_studentGameRecord').append(`
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-700 font-medium">
                            No records found
                        </td>
                    </tr>
                `);
            } else {
                // Loop through the student data and create rows
                response.forEach(student => {
                    // Assuming student[9] contains the game name
                    $('#view_studentGameRecord').append(`
                        <tr class="bg-yellow-50 border-b dark:bg-gray-50 dark:border-gray-300">
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">${student[9]}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">
                                <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    Details
                                </button>
                            </td>
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
