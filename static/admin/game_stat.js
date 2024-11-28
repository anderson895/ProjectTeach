function AllstudentStat() {

    var gameId = $('#game-id').data('gameid');

    var gameName = $('#game-id').data('gamename');
    
    $.ajax({
        type: "GET",
        url: "/admin_fetch_all_student",
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            console.log(response);
            // Clear the table before adding new data
            $('#studentTable').empty();
            
            if (response.length === 0) {
                // If no records found, display a message
                $('#AllstudentStat').append(`
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-700 font-medium" colspan="5">
                            No records found
                        </td>
                    </tr>
                `);
            } else {
                // Loop through the student data and create rows
                response.forEach(student => {
                    $('#AllstudentStat').append(`
                        <tr class="bg-yellow-50 border-b dark:bg-gray-50 dark:border-gray-300">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700" data-student_id=${student.id}>
                                ${student.id}
                            </th>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700" data-student_name="${student.name}">
                                ${student.name}
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">
                                ${student.age}
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">
                                ${student.gender}
                            </td>
                          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700 text-center">
                                <a href="/admin/view_student_game_stat/${student.id}/${gameId}/${gameName}/${student.name}" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 font-medium ml-2">View</a>
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


AllstudentStat();
