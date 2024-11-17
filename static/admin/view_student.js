function all_record_Attendance() {
    // Get the ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id'); 

    if (!studentId) {
        console.error('Student ID not found in the URL');
        return;
    }

    $.ajax({
        type: "GET",
        url: `/all_record_Attendance?id=${studentId}`, 
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            // console.log(response);

            // Clear the table before appending new data
            $('#view_studentTable').empty();

            if (response.length === 0) {
                // If no records found, display a message
                $('#view_studentTable').append(`
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-700 font-medium">
                            No records found
                        </td>
                    </tr>
                `);
            } else {
                // Loop through the student data and create rows
                response.forEach(student => {
                    // Format the date to 'YYYY-MM-DD'
                    const formattedDate = new Date(student.date).toLocaleDateString('en-CA'); // 'en-CA' is for 'YYYY-MM-DD'

                    $('#view_studentTable').append(`
                        <tr class="bg-yellow-50 border-b dark:bg-gray-50 dark:border-gray-300">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700" data-student_id=${student.id}>
                                ${formattedDate}
                            </th>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700" data-student_name="${student.name}">
                                ${student.status}
                            </td>
                        </tr>
                    `);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching records:', error);
        }
    });
}

all_record_Attendance();
