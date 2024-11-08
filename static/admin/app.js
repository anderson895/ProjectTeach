$(document).ready(function() {
    $('#registerForm').submit(function(event) {
        event.preventDefault();
        
        var username = $("#username").val();
        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        // Check if passwords match
        if (password !== confirmPassword) {
            showAlert("Passwords do not match!", "error"); // Using SweetAlert2 for error
            return;
        }

        // Proceed with AJAX request if passwords match
        $.ajax({
            url: "/admin/register",  // Corrected URL
            type: "POST",
            data: {
                username: username,
                password: password
            },
            success: function(response) {
                showAlert(response.message, "success"); // Success message from JSON response
                setTimeout(function() {
                    window.location.href = '/admin/login'; // Redirect after success
                }, 1500); // Delay redirection for 1.5 seconds
            },
            error: function(xhr, status, error) {
                // Handle error if JSON response is returned
                var response = JSON.parse(xhr.responseText); // Parse the JSON error response
                showAlert(response.error || "An unknown error occurred.", "error"); // Show error message
            }
        });
    });

    $('#loginForm').submit(function(event) {
        event.preventDefault();
        
        var username = $("#username").val();
        var password = $('#password').val();
    
        // Check if both fields are filled
        if (username === "" || password === "") {
            showAlert("Both fields are required!", "error");
            return;
        }
    
        // Proceed with AJAX request for login
        $.ajax({
            url: "/admin/login",
            type: "POST",
            data: {
                username: username,
                password: password
            },
            dataType: "json", // Ensure you expect JSON response
            success: function(response) {
                // Ensure that the response contains the expected 'message' or 'error'
                if (response && response.message === "Login successful!") {
                    showAlert(response.message, "success");
                    setTimeout(function() {
                        window.location.href = '/admin/dashboard'; // Redirect after login
                    }, 1500);
                } else if (response && response.error) {
                    showAlert(response.error, "error");
                } else {
                    showAlert("Unexpected response format.", "error");
                }
            },
            error: function(xhr, status, error) {
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
