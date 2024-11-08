$(document).ready(function() {
    $('#registerForm').submit(function(event) {
        event.preventDefault();
        
        // Get form values
        var name = $("#name").val();
        var age = $('#age').val();
        var gender = $('#gender').val();
        

       
        

        // AJAX request to register
        $.ajax({
            url: "/student/register", 
            type: "POST",
            data: JSON.stringify({
                name: name,
                age: age,
                gender: gender
            }),
            contentType: 'application/json',  // Send data as JSON
            success: function(response) {
            
                showAlert(response.message, "success"); 
                
                // Redirect after a short delay
                setTimeout(function() {
                    window.location.href = '/student/login'; 
                }, 1500); 
            },
            error: function(xhr, status, error) {
                // Log and parse the response for error messages
                var response = JSON.parse(xhr.responseText);
                console.log(response);  // Log the response for debugging
                
                var errorMessage = response.error || "An unknown error occurred.";
                showAlert(errorMessage, "error"); 
            }
        });
    });
});

// Custom alert function using SweetAlert2
function showAlert(message, type) {
    Swal.fire({
        icon: type, // 'success' or 'error'
        title: type === "error" ? "Oops..." : "Success!",
        text: message,
        confirmButtonText: 'Close',
        confirmButtonColor: '#3085d6',
    });
}

