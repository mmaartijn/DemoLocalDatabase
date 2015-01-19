$(document).ready(function(){
    document.addEventListener('deviceready', onDeviceReady, false);

    $('#btnSubmit').click(btnSubmitClicked);
    $('#btnClear').click(btnClearClicked);
});

function btnSubmitClicked(){
    var name = $('#txtName').val();
    var age = $('#txtAge').val();

    addPerson(name, age);

    $('#txtName').val('');
    $('#txtAge').val('');
}

function btnClearClicked(){
    getDB().transaction(function(trans){ 
        trans.executeSql('DELETE FROM Person');
        getAllPersons(trans);
    }, errorCB);
}

function getDB(){
    // Open the database.
    return window.openDatabase("Database", "1.0", "Demo", -1);
}

function onDeviceReady(){
    $('.deviceNotReady').removeClass('deviceNotReady').addClass('deviceReady');
    initializeDatabase();
}

// All in one transaction
function initializeDatabase() {
    getDB().transaction(function(trans){ 
        trans.executeSql('CREATE TABLE IF NOT EXISTS Person (name, age)');
        getAllPersons(trans);
    }, errorCB);
}

function getAllPersons(trans) {
    trans.executeSql('SELECT * FROM Person', [], function(trans, results){
        var htmlRows = '';
        var len = results.rows.length;
        for (var i=0; i<len; i++){
            htmlRows += '<tr><td>' + results.rows.item(i).name+ '</td><td>' + results.rows.item(i).age + '</td></tr>';
        }

        $('#results tbody').html(htmlRows);
    }, errorCB);
}

function addPerson(name, age){
    getDB().transaction(function(trans){ 
        trans.executeSql('INSERT INTO Person (name, age) VALUES (?,?)', [ name, age ]);
        getAllPersons(trans);
    }, errorCB);
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.message);

    return true;
}