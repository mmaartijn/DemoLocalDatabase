var db;

$(document).ready(function(){
    document.addEventListener('deviceready', onDeviceReady, false);

    bindButtons();
});

function onDeviceReady(){
    $('.deviceNotReady').removeClass('deviceNotReady').addClass('deviceReady');
    
    // Open the database.
    db = window.openDatabase("dbName", "1.0", "DB Displayname", 1000000);
    db.transaction(createPersonsTable, errorCB, successCB);
}

// All in one transaction
function createPersonsTable(trans) {
    trans.executeSql('CREATE TABLE IF NOT EXISTS Person (name, age)');
    getAllPersons(trans);
}

function getAllPersons(trans) {
    trans.executeSql('SELECT * FROM Person', [], getAllPersonsCB, errorCB, successCB);
}

function getAllPersonsCB(trans, results){
    var htmlRows = '';
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        htmlRows += '<tr><td>' + results.rows.item(i).name+ '</td><td>' + results.rows.item(i).age + '</td></tr>';
    }

    $('#results tbody').html(htmlRows);
}

function bindButtons(){
    $('#btnSubmit').click(btnSubmitClicked);
    $('#btnClear').click(btnClearClicked);
}

function btnSubmitClicked(){
    var name = $('#txtName').val();
    var age = $('#txtAge').val();

    if(db){
        db.transaction(function(trans){ 
            addPerson(trans, name, age);
        }, errorCB, successCB);

        $('#txtName').val('');
        $('#txtAge').val('');
    }
}

function btnClearClicked(){
    if(db){
        alert('start');
        db.transaction(function(trans){ 
            trans.executeSql('DELETE FROM Person');
            getAllPersons(trans);
        }, errorCB, successCB);
    }
}

function addPerson(trans, name, age){
    trans.executeSql('INSERT INTO Person (name, age) VALUES (?,?)', [ name, age ]);
    getAllPersons(trans);
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.message);

    return true;
}

function successCB(){
    alert('success');
}