$(document).ready(function() {


    $('#loginFormStudent').submit(function(event) {
        event.preventDefault();
        
        var username = $("#username").val();
    
        console.log('submited');
        
        // Ensure username is not empty before proceeding
        if (!username) {
            showAlert("Username is required.", "error");
            return;
        }
        
        // Proceed with AJAX request for login
        $.ajax({
            url: "/student/login",
            type: "POST",
            contentType: "application/json", // Set the content type to JSON
            data: JSON.stringify({
                username: username
            }),
            dataType: "json", // Expect JSON response
            success: function(response) {
                // Ensure that the response contains the expected 'message' or 'error'
                if (response && response.message === "Login successful!") {
                    showAlert(response.message, "success");
                    setTimeout(function() {
                        window.location.href = '/student/home'; // Redirect after login
                    }, 1500);
                } else if (response && response.error) {
                    showAlert(response.error, "error");
                } else {
                    showAlert("Unexpected response format.", "error");
                }
            },
            error: function(xhr, status, error) {
                // Log the raw response for debugging
                console.error(xhr.responseText);
                
                // Handle error response
                try {
                    var response = JSON.parse(xhr.responseText); // Safely parse the response
                    showAlert(response.error || "An unknown error occurred.", "error");
                } catch (e) {
                    showAlert("An error occurred with the server response.", "error");
                }
            }
        });
    });
    
    













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

