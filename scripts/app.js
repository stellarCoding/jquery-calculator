//cache some values
var $screen = $('#screen'),
    $clear = $('#clear'),
    $back = $('#back'),
    $darker = $('.darker'),
    $add = $('#add'),
    $substract = $('#substract'),
    $multiply = $('#multiply'),
    $divide = $('#divide');


var data = {
    entry: [],
    entries: [],
    currOperator: '',
    addToEntry: function(val) {
        this.entry.push(val);
    },
    clearAll: function() {
        this.entry = [];
        this.entries = [];
    },
    clearEntry: function() {
        this.entry = [];
    },
    backspaceEntry: function() {
        this.entry.pop();
    },
    toggleNegative: function() {
        if (this.entry[0] !== '-') {
            this.entry.unshift('-');
        } else if (this.entry[0] === '-') {
            this.entry.shift();
        }
    },
    insertDecimal: function() {
        if (this.entry.indexOf('.') === -1 && this.entry.length < 1) {
            this.entry.push('0', '.');
        } else if (this.entry.indexOf('.') === -1) {
            this.entry.push('.');
        }
    },
    calculate: function(operator) {
        // reset chain of operations if "=" is pressed with no operator afterwords
        if (this.currOperator === "=" && this.entry.length > 0) {
            this.entries = [];
        }

        // if current entry isn't blank, add to entries
        if (this.entry.length > 0) {
            this.entries.push(this.entry.join(''));
        }

        // perform operation for every two entries
        if (this.entries.length >= 2) {
            this.entries.splice(1, 0, this.currOperator);
            var total = eval(this.entries.join(' '));
            this.entries = [total];
            this.currOperator = '=';
        }

        if (operator) {
            this.currOperator = operator;
        }
        this.clearEntry();
    }
}

var controller = {
    init: function() {
        view.render();
        $('button').click(function() {

            var button = $(this).text();
            if (!isNaN(parseInt(button))) {
                button = parseInt(button);
            }

            if (button === "=") {
                data.calculate('=');
            } else if (button === "+/-") {
                data.toggleNegative();
            } else if (button === "AC") {
                data.clearAll();
            } else if (button === 'C') {
                data.clearEntry();
            } else if (button === ' ') {
                data.backspaceEntry();
            } else if (button === "+") {
                data.calculate('+');
            } else if (button === "-") {
                data.calculate('-');
            } else if (button === "×") {
                data.calculate('*');
            } else if (button === "÷") {
                data.calculate('/');
            } else if (button === ".") {
                data.insertDecimal();
            } else {
                data.addToEntry(button);
            }

            view.render();
        });
    },
    // get display number for screen  -- returns entry if not currently blank, returns previous entry if not
    getScreenVal: function() {
        if (data.entry.length > 0) {
            view.isEntryBlank = false;
            return data.entry.join('');
        } else if (data.entry.length === 0 && data.entries[0]) {
            view.isEntryBlank = true;
            return data.entries[0];
        } else {
            view.isEntryBlank = true;
            return 0;
        }
    },
    getCurrentOperator: function() {
        // return operator only when screen entry is blank
        if (data.currOperator && data.entries.length >= 1 && data.entry.length < 1) {
            return data.currOperator;
        }
    }
}

var view = {
    render: function() {
        // render current total
        var screenText = view.sciNotationFormat(controller.getScreenVal());
        $screen.text(screenText);
        view.highlightOperator();


        // switch between AC and C if entry on screen / dim backspace when no entry
        if (view.isEntryBlank) {
            $clear.text('AC');
            $back.addClass('dimmed');
        } else {
            $clear.text('C');
            $back.removeClass('dimmed');
        }
    },
    // highlight current operator (+, -, *, /)
    highlightOperator: function(target) {
        var op = controller.getCurrentOperator();
        $darker.removeClass('active');
        if (op === '+') {
            $add.addClass('active');
        } else if (op === '-') {
            $substract.addClass('active');
        } else if (op === '*') {
            $multiply.addClass('active');
        } else if (op === '/') {
            $divide.addClass('active');
        }
    },
    isEntryBlank: true,
    sciNotationFormat: function(num) {

        if (typeof num === 'string') {
            var numLength = num.length;
            num = parseInt(num);
        } else if (typeof num === 'number') {
            var numLength = num.toString().length;
        }

        if (numLength >= 8) {
            return num.toExponential(2);
        } else {
            return num;
        }
    }
}

$(document).ready(function() {
    controller.init();
});
