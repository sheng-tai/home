// budget controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calculatePercentage = function(totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc * 100));
        } else {
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    var Incom = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var totalsBudget = function(type) {
        var sum = 0;
        //totals incom and totals exp
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });


        if (type === 'inc') {
            data.totals.totalInc = sum;
        } else if (type === 'exp') {
            data.totals.totalExp = sum;
        }
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            totalExp: 0,
            totalInc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val) {
            var newItem;
            var ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 1;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Incom(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteDate: function(type, id) {
            var idArray = data.allItems[type].map(function callback(cur) {
                return cur.id;
            });
            var index = idArray.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function() {

            // totals inc and expense
            totalsBudget('inc');
            totalsBudget('exp');
            // budget icom - expenses
            data.budget = data.totals.totalInc - data.totals.totalExp;
            // percentage exp / inc
            if (data.totals.totalInc > 0) {
                data.percentage = Math.round(data.totals.totalExp / data.totals.totalInc * 100);
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentage: function() {
            data.allItems.exp.forEach(function callback(cur) {
                cur.calculatePercentage(data.totals.totalInc);
            });
        },
        getBudget: function() {
            return {
                totalExp: data.totals.totalExp,
                totalInc: data.totals.totalInc,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        getPercentage: function() {
            var percentage = data.allItems.exp.map(function callback(cur) {
                return cur.percentage;
            });
            return percentage;
        },
        testItem: function() {
            console.log(data);
        }
    }
}());


// UI
var UIController = (function() {

    var DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        inputIncomeContainer: '.income__list',
        inputExpensesContainer: '.expenses__list',
        labelBudget: '.budget__value',
        labelIncom: '.budget__income--value',
        labelExpenses: '.budget__expenses--value',
        labelPercentage: '.budget__expenses--percentage',
        container: '.container',
        expensePercentage: '.item__percentage',
        month: '.budget__title--month'
    }

    var formatNumber = function(num) {
        var numSplit, int;
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            num = int.substr(0, int.length - 3) + ',' + int.substr(-3) + '.' + numSplit[1];
        }
        return num;
        //123.00
        //1234.00 1,234 12,345 123,456
    }

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstring.inputType).value, //inc or exp
                description: document.querySelector(DOMstring.inputDescription).value, //description text
                value: parseFloat(document.querySelector(DOMstring.inputValue).value) //value
            }
        },
        addListItem: function(obj, type) {
            var html;
            var newHtml;
            // copy html
            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace html id value add__description
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));
            // write html to DOM
            if (type === 'inc') {
                document.querySelector(DOMstring.inputIncomeContainer).insertAdjacentHTML('beforeend', newHtml);
            } else if (type === 'exp') {
                document.querySelector(DOMstring.inputExpensesContainer).insertAdjacentHTML('beforeend', newHtml);
            }
        },
        deleteListItem: function(selectorID) {
            var ID = document.getElementById(selectorID);
            ID.parentNode.removeChild(ID);
        },
        clearFiled: function() {
            var filed = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);
            var filedArray = Array.prototype.slice.call(filed);
            filedArray.forEach(function(current, index, array) {
                current.value = '';
            });
            filedArray[0].focus();
        },
        displayBudget: function(obj) {
            document.querySelector(DOMstring.labelBudget).textContent = formatNumber(obj.budget);
            document.querySelector(DOMstring.labelIncom).textContent = formatNumber(obj.totalInc);
            document.querySelector(DOMstring.labelExpenses).textContent = formatNumber(obj.totalExp);
            if (obj.percentage > 0) {
                document.querySelector(DOMstring.labelPercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstring.labelPercentage).textContent = '----';
            }
        },
        displayPercentage: function(percentage) {
            var filed = document.querySelectorAll(DOMstring.expensePercentage);

            nodeListForEach(filed, function(cur, index) {
                if (percentage > 0) {
                    cur.textContent = percentage[index] + '%';
                } else {
                    cur.textContent = '--'
                }
            });
        },
        displayDate: function() {
            var month, yaer, months;
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMstring.month).textContent = months[month] + ' ' + year;

        },
        changeType: function() {
            change = document.querySelectorAll(DOMstring.inputType + ',' + DOMstring.inputDescription + ',' + DOMstring.inputValue );
            nodeListForEach(change, function(cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstring.inputButton).classList.toggle('red');
        },
        getDOMstring: function() {
            return DOMstring;
        }
    }
}());


// global controller
var controller = (function(budgetCtrl, UICtrl) {
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstring();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.charCode === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    }

    var updataBudget = function() {
        // 1. calculate
        budgetCtrl.calculateBudget();
        // 2. return budget
        var budget = budgetCtrl.getBudget();
        //3. display budget on UI
        UICtrl.displayBudget(budget);
    }

    var updataPercentage = function() {
        // calculate percentage
        budgetCtrl.calculatePercentage();
        // read percentage
        var percentage = budgetCtrl.getPercentage();
        // updata and show percentage
        UICtrl.displayPercentage(percentage);
    }

    var ctrlAddItem = function() {
        // 1. get file data
        var input = UICtrl.getinput();
        if (input.description !== '' && input.value > 0) {
            // 2. add item to the budget
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add item to UI
            UICtrl.addListItem(newItem, input.type);
            // 4. clear filed
            UICtrl.clearFiled();
            // 5. show and updata budget
            updataBudget();
            // 6. show and updata percentage
            updataPercentage();
        }
    }

    var ctrlDeleteItem = function(event) {
        var typeID, type, id;
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            typeID = itemID.split('-');
            type = typeID[0];
            id = parseInt(typeID[1]);
            console.log(typeID);
        }

        // delete data from budgetController
        budgetCtrl.deleteDate(type, id);
        // delete item from UI
        UICtrl.deleteListItem(itemID);
        // updata budget
        updataBudget();
        // updataPercentage
        updataPercentage();
    }

    return {
        init: function() {
            setupEventListeners();
            console.log('ready start');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                totalExp: 0,
                totalInc: 0,
                budget: 0,
                percentage: -1
            })
        }
    }

}(budgetController, UIController));

controller.init();
