window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;

$(document).ready(function () {
    contactsNamespace.initialize();
});

(function () {
    this.contactsNamespace = this.contactsNamespace || {};
    var ns = this.contactsNamespace;
    var currentRecord;
    var db;

    ns.initialize = function () {
        $("#btnSave").on('click', ns.save);
        var request = indexedDB.open("myDB_1272311", 1);

        request.onupgradeneeded = function (response) {
            var options = { keypath: "id", autoIncrement: true };
            response.currentTarget.result.createObjectStore("contacts", options);
        }
        request.onsuccess = function (response) {
            db = request.result;
            ns.display();
        }        
    }

    ns.display = function () {
        $("#currentAction").html('Add Contact');
        currentRecord = { key: null, contact: {} };
        displayCurrentRecord();

        var trans = db.transaction('contacts', 'readonly');
        var request = trans.objectStore("contacts").openCursor();
        var results = [];

        request.onsuccess = function (response) {
            var cursor = response.target.result;
            if (!cursor) {
                bindToGrid(results);
                return;
            }
            results.push({ key: cursor.key, contact: cursor.value });
            cursor.continue();
        }        
    }

    function bindToGrid(results) {
        var html = "";
        for (var i = 0; i < results.length; i++) {
            var key = results[i].key;
            var contact = results[i].contact;

            html += '<tr id="contact_'+key+'"><td>' + contact.firstName + ' ' + contact.lastName + '</td>';
            html += '<td>' + contact.email + '</td>';
            html += '<td>' + contact.age + '</td>';
            html += '<td>' + contact.mobileNumber + '</td>';
            html += '<td>' + contact.address + '</td>';
            html += '<td><a class="edit" href="javascript:void(0)" data-key=' + key + '>Edit</a></td>';
            html += '<td><a class="delete" href="javascript:void(0)" data-key=' + key + '>Delete</a></td></tr>';
        }
        html = html || '<tr><td colspan="7">No Records Available!!!</td></tr>'
        $("#contacts tbody").html(html);
        $('#contacts a.edit').on('click', ns.loadContact);
        $('#contacts a.delete').on('click', ns.removeContact);
    }

    ns.loadContact = function () {
        var key = parseInt($(this).attr('data-key'));
        var trans = db.transaction('contacts', 'readonly');
        var store = trans.objectStore("contacts");
        var request = store.get(key);

        request.onsuccess = function (response) {
            $("#currentAction").html('Edit Contact');
            currentRecord = { key: key, contact: response.target.result }
            displayCurrentRecord();
        }        
    }

    ns.removeContact = function () {
        var key = parseInt($(this).attr('data-key'));
        var trans = db.transaction('contacts', 'readwrite');
        var store = trans.objectStore("contacts");
        var request = store.delete(key);

        request.onsuccess = function (response) {
           alert("Contact removed");
           $('#contact_'+key).remove();
            displayCurrentRecord();
        }    
    }

    function displayCurrentRecord() {
        var contact = currentRecord.contact;
        $("#firstName").val(contact.firstName);
        $("#lastName").val(contact.lastName);
        $("#email").val(contact.email);
        $("#age").val(contact.age);
       
        $("#mobileNumber").val(contact.mobileNumber);
        $("#address").val(contact.address);
    }

    ns.save = function () {
        var contact = currentRecord.contact;
        contact.firstName = $("#firstName").val();
        contact.lastName = $("#lastName").val();
        contact.email = $("#email").val();
        contact.age = $("#age").val();
       
        contact.mobileNumber = $("#mobileNumber").val();
        contact.address = $("#address").val();

        var trans = db.transaction('contacts', 'readwrite');
        var contacts = trans.objectStore("contacts");
        var request = currentRecord.key != null
            ? contacts.put(contact, currentRecord.key)
            : contacts.add(contact);

        request.onsuccess = function (response) {
            ns.display();
        }
    }
})();
