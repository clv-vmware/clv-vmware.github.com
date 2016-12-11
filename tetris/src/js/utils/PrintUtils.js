var PrintUtils = {

    printMatrix: function (matrix) {
        for (var i = 0; i < matrix.length; i++) {
            var row = '';
            for (var j = 0; j < matrix[0].length; j++) {
                row += matrix[i][j] + ' ';
            }
            console.log(row);
        }
    },

    printColInMatrix: function (matrix, col) {
        var row = '';
        
        for (var i = 0; i < matrix.length; i++) {
            
            for (var j = 0; j < matrix[0].length; j++) {
                if (j === col) row += matrix[i][j] + ', ';
            }
            
        }

        console.log(row);
    },
}

module.exports = PrintUtils;