function admin_fetch_all_student() {
    $.ajax({
        type: "GET",
        url: "/admin_fetch_all_student", // Endpoint to fetch all counts and sales
        contentType: "application/json",
        dataType: "json",
        success: function(response) {

             // Clear the table before adding new data
             $('#studentTable').empty();
            
             // Loop through the student data and create rows
             response.forEach(student => {
                 $('#studentTable').append(`
                     <tr class="bg-yellow-50 border-b dark:bg-gray-50 dark:border-gray-300">
                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">
                             ${student.name}
                         </th>
                         <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">
                             ${student.age}
                         </td>
                         <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">
                             ${student.gender}
                         </td>
                         <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700 text-center">
                             <a href="#" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium">Absent</a>
                             <a href="#" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 font-medium ml-2">Present</a>
                             <a href="#" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 font-medium ml-2">View</a>
                         </td>
                     </tr>
                 `);
             });
            
            
        },
        error: function(xhr, status, error) {
            console.error('Error fetching counts:', error);
        }
    });
}

// Initial fetch when the page loads
admin_fetch_all_student();