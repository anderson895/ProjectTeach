function admin_fetch_all_student() {
    $.ajax({
        type: "GET",
        url: "/admin_fetch_all_student", // Endpoint to fetch all counts and sales
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            // Clear the table before adding new data
            $('#AllstudentTable').empty();
            
            if (response.length === 0) {
                // If no records found, display a message
                $('#AllstudentTable').append(`
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-700 font-medium" colspan="5">
                            No records found
                        </td>
                    </tr>
                `);
            } else {
                // Loop through the student data and create rows
                response.forEach(student => {
                    $('#AllstudentTable').append(`
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
                                <a href="/admin/view_student?id=${student.id}" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 font-medium ml-2">View</a>
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


function admin_fetch_all_student_today() {
    $.ajax({
        type: "GET",
        url: "/admin_fetch_all_student_today", // Endpoint to fetch today's student attendance
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            console.log(response);
            // Clear the table before adding new data
            $('#studentTable').empty();
            
            if (response.length === 0) {
                // If no records found, display a message
                $('#studentTable').append(`
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-700 font-medium" colspan="5">
                            No records found
                        </td>
                    </tr>
                `);
            } else {
                // Loop through the student data and create rows
                response.forEach(student => {
                    $('#studentTable').append(`
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
                                <a href="#" class="absent-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium">Absent</a>
                                <a href="#" class="present-btn px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 font-medium ml-2">Present</a>
                            </td>
                        </tr>
                    `);
                });
                
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching student attendance:', error);
        }
    });
}


$(document).ready(function() {
    let currentStudentId = null; // To store the current student ID
    let currentStatus = null;    // To store the current status (Absent or Present)
    let currentStudentName = null;

    // Function to open the modal
    function openModal(status, studentId, studentName) {
        $('#attendanceModal').removeClass('hidden');
        $('#attendanceStatus').text(status);

        currentStudentId = studentId;
        currentStatus = status;
        currentStudentName = studentName;
    }

    // Function to close the modal
    function closeModal() {
        $('#attendanceModal').addClass('hidden');
    }

    // Handle "Absent" button click using event delegation
    $(document).on('click', '.absent-btn', function(event) {
        event.preventDefault();

        

        const studentId = $(this).closest('tr').find('th').data('student_id');
        const studentName = $(this).closest('tr').find('td').data('student_name');
        $('#currentStudentName').text(studentName);
        openModal('Absent', studentId, studentName);
    });

    // Handle "Present" button click using event delegation
    $(document).on('click', '.present-btn', function(event) {
        event.preventDefault();

      
        const studentId = $(this).closest('tr').find('th').data('student_id');
        const studentName = $(this).closest('tr').find('td').data('student_name');
        $('#currentStudentName').text(studentName);
        openModal('Present', studentId, studentName);
    });

    $('#cancelButton').click(function() {
        closeModal();
    });

    $('#confirmButton').click(function() {
        if (currentStudentId && currentStatus) {
            $.ajax({
                type: "POST",
                url: "/admin_record_Attendance", // Endpoint to update attendance
                data: JSON.stringify({
                    studentId: currentStudentId,
                    status: currentStatus
                }),
                contentType: "application/json",
                dataType: "json",
                success: function(response) {
                    // Show a success message using SweetAlert2
                    Swal.fire({
                        icon: 'success',
                        title: 'Attendance Updated',
                        text: `Attendance for ${currentStudentName} marked as ${currentStatus}`,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                    closeModal();
                },
                
                error: function(xhr, status, error) {
                    console.error('Error updating attendance:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed to update attendance',
                        text: error,
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });

    // Close modal when clicking outside of the modal (optional)
    $(document).click(function(event) {
        if ($(event.target).is('#attendanceModal')) {
            closeModal();
        }
    });
});

// Poll every 5 seconds (5000 milliseconds)
// setInterval(admin_fetch_all_student_today, 5000);
admin_fetch_all_student();
admin_fetch_all_student_today();
