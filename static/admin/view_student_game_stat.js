function admin_fetchGameStat() {
    var game_id = $('#Statids').data('game_id');
    var student_id = $('#Statids').data('student_id');

    $.ajax({
        type: "GET",
        url: "/admin_fetchGameStat", 
        data: {
            game_id: game_id,
            student_id: student_id
        },
        dataType: "json", 
        success: function(response) {
            console.log('Response:', response);

            // Prepare data for the chart
            var level1Data = [];
            var level2Data = [];
            var level3Data = [];
            var categories = []; // To store the "Day" and "Date" labels for x-axis

            // Iterate over the response array to process each day's data
            response.forEach(function(item) {
                // Map performance levels to numeric values
                var Lvl1 = mapPerformanceLevel(item.Lvl1);
                var Lvl2 = mapPerformanceLevel(item.Lvl2);
                var Lvl3 = mapPerformanceLevel(item.Lvl3);

                // Push the performance data into arrays
                level1Data.push(Lvl1);
                level2Data.push(Lvl2);
                level3Data.push(Lvl3);

                // Create a label combining Day and Date (e.g., "Day 1 (Mon, 11 Nov 2024)")
                var date = new Date(item.Date); // Convert the date string to a Date object
                var formattedDate = date.toLocaleDateString('en-GB', {
                    weekday: 'short', // "Mon"
                    day: '2-digit',   // "11"
                    month: 'short',   // "Nov"
                    year: 'numeric'   // "2024"
                });

                categories.push('Day ' + item.Day + ' (' + formattedDate + ')');
            });

            // Set up the chart options
            var options = {
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: false 
                    }
                },
                series: [{
                    name: 'Level 1',
                    data: level1Data
                }, {
                    name: 'Level 2',
                    data: level2Data
                }, {
                    name: 'Level 3',
                    data: level3Data
                }],
                xaxis: {
                    categories: categories, // Dynamically generated Day and Date labels
                },
                yaxis: {
                    title: {
                        text: 'Performance'
                    },
                    labels: {
                        style: {
                            colors: ['#000', '#000', '#000'],
                            fontSize: '14px',
                            fontWeight: 500,
                        },
                        formatter: function(value) {
                            // Map numeric values to qualitative labels
                            if (value === 1) {
                                return 'Good';      
                            } else if (value === 2) {
                                return 'Very Good';
                            } else if(value === 3){
                                return 'Excellent'; 
                            } else {
                                return ''; // For empty or undefined data
                            }
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false, 
                        columnWidth: '30%'
                    }
                },
                grid: {
                    borderColor: '#e0e0e0',
                    padding: {
                        left: 20 
                    }
                },
                colors: ['#FF5733', '#33FF57', '#3357FF'],
                dataLabels: {
                    enabled: false 
                },
                title: {
                    text: 'Performance Levels',
                    align: 'center',
                    margin: 10,
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#333'
                    }
                }
            };

            // Render the chart
            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();

        },
        error: function(xhr, status, error) {
            console.error('Error fetching counts:', error);
        }
    });
}

// Helper function to map performance level to numeric value
function mapPerformanceLevel(level) {
    if (level === "Excellent") {
        return 3;
    } else if (level === "Very Good") {
        return 2;
    } else if (level === "Good") {
        return 1;
    } else {
        return 0; // Handle null or undefined data
    }
}

// Call the function
admin_fetchGameStat();
