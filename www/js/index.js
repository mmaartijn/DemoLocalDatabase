var db;

$(document).ready(function(){
    document.addEventListener('deviceready', onDeviceReady, false);

    bindButtons();
});

function onDeviceReady(){
    $('.deviceNotReady').removeClass('deviceNotReady').addClass('deviceReady');
    db = window.openDatabase("MyDatabaseName", "1.0", "My database display name", 200000 /* Size */);
    db.transaction(createPersonsTable, errorCB, successCB);
}

function bindButtons(){
    $('#btnSubmit').click(function(){
        var name = $('#txtName').val();
        var age = $('#txtAge').val();

        if(db){
            db.transaction(function(trans){
                addPerson(trans, name, age);
            }, errorCB, successCB);
        }
    });
}

function addPerson(trans, name, age){
    trans.executeSql('INSERT INTO Person (name, age) VALUES ("' + name + '", "' + age + '")');
}

// All in one transaction
function createPersonsTable(trans) {
    trans.executeSql('DROP TABLE IF EXISTS Person');
    trans.executeSql('CREATE TABLE IF NOT EXISTS Person (name, age)');
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.message);
}

// Transaction success callback
//
function successCB() {
    db.transaction(function(trans){
        trans.executeSql('SELECT * FROM Person', [], allPersonsSelected, errorCB);
    }, errorCB);

    return false;
}

function allPersonsSelected(transaction, results){
    var htmlRows = '';
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        htmlRows += '<tr><td>' + rows.item(i).name+ '</td><td>' + rows.item(i).age + '</td></tr>';
    }

    if(htmlRows.length){
        $('#results tbody').html(htmlRows);
    }

    return false;
}