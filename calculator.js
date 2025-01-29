$(document).ready(function() {
    let chart;

    $('#calculatorForm').submit(function(e) {
        e.preventDefault();
        
        let equations = $('#equations').val().split(','); // Split equations by comma
        let minX = parseFloat($('#minX').val());
        let maxX = parseFloat($('#maxX').val());
        let minY = parseFloat($('#minY').val());
        let maxY = parseFloat($('#maxY').val());
        let selectedGraphType = $('#graphType').val();

        if (isNaN(minX) || isNaN(maxX) || minX >= maxX) {
            alert('Invalid X range. Please check your input.');
            return;
        }

        if (isNaN(minY) || isNaN(maxY) || minY >= maxY) {
            alert('Invalid Y range. Please check your input.');
            return;
        }

        let canvas = document.getElementById('graph').getContext('2d');
        let xValues = [];
        let datasets = [];

        // Process equations
        for (let equation of equations) {
            equation = equation.trim(); // Remove leading/trailing spaces
            let yValues = [];

            try {
                // Iterate over x with an increment of 1 to use only integers
                for (let x = minX; x <= maxX; x++) {
                    xValues.push(x);
                    let equationForEval = equation;
                    equationForEval = equationForEval.replace(/(sin|cos|tan|sqrt|log|exp|pi|e)(?=\()|pi|e/g, 'Math.$&');
                    equationForEval = equationForEval.replace(/\^/g, '**');
                    let result = eval(equationForEval);

                    if (!isNaN(result)) {
                        yValues.push(result);
                    } else {
                        throw new Error('Invalid Equation');
                    }
                }

                datasets.push({
                    label: equation,
                    data: yValues,
                    borderColor: getRandomColor(),
                    borderWidth: 4,
                    showLine: true,
                    lineTension: 0.3,

                    // Disable points on the line
                    // radius: 0,
                    // hoverRadius: 0,
                });
            } catch (error) {
                console.error(error);
                alert(`Invalid equation: "${equation}". Please check your input.`);
                return;
            }
        }

        if (chart) chart.destroy();

        chart = new Chart(canvas, {
            type: selectedGraphType,
            data: {
                labels: xValues,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'X'
                        },
                        // ticks: {
                        //     callback: function(value) {
                        //         // Only display integer values on the X-axis
                        //         if (Number.isInteger(value)) {
                        //             return value;
                        //         }
                        //     }
                        // }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Y'
                        },
                        min: minY,
                        max: maxY,
                        ticks: {
                            callback: function(value) {
                                // Only display integer values on the Y-axis
                                if (Number.isInteger(value)) {
                                    return value;
                                }
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'xy',
                    intersect: false
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                // Round the X and Y values for display
                                let xLabel = Math.round(context.parsed.x);
                                let yLabel = Math.round(context.parsed.y);
                                return `x: ${xLabel}, y: ${yLabel}`;
                            }
                        }
                    }
                }
            }
        });

        $('.graphic-container').addClass('active');
    });

    $('#resetBtn').on('click', () => {
        if (chart) chart.destroy();
        $('.graphic-container').removeClass('active');
    });
});

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
