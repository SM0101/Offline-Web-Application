


$(document).ready(function () {
    contactsNamespace.initialize();
});

(function () {
    this.contactsNamespace = this.contactsNamespace || {};
    var ns = this.contactsNamespace;
    var currentRecord;

    ns.initialize = function () {
        $("#btnSave").on('click', ns.save);
        ns.display();
    }

    function retrieveFromStorage() {
        var contactsJSON = localStorage.getItem('contacts');
        return contactsJSON ? JSON.parse(contactsJSON) : [];
    }

    ns.display = function () {
        $("#currentAction").html('Add Contact');
        currentRecord = { key: null, contact: {} };
        displayCurrentRecord();
        var results = retrieveFromStorage();
        bindToGrid(results);
    }

    function bindToGrid(results) {
        var html = "";
        for (var i = 0; i < results.length; i++) {
            var contact = results[i];
            html += '<tr><td>' + contact.firstName + ' ' + contact.lastName + '</td>';
            html += '<td>' + contact.email + '</td>';
            html += '<td>' + contact.phoneNumber + '</td>';
            html += '<td><a class="edit" href="javascript:void(0)" data-key=' + i + '>Edit</a></td></tr>';
        }
        html = html || '<tr><td colspan="4">No Records Available!!!</td></tr>'
        $("#contacts tbody").html(html);
        $('#contacts a.edit').on('click', ns.loadContact);
    }

    ns.loadContact = function () {
        var key = parseInt($(this).attr('data-key'));
        var results = retrieveFromStorage();
        $("#currentAction").html('Edit Contact');
        currentRecord = { key: key, contact: results[key] }
        displayCurrentRecord();
    }

    function displayCurrentRecord() {
        var contact = currentRecord.contact;
        $("#firstName").val(contact.firstName);
        $("#lastName").val(contact.lastName);
        $("#email").val(contact.email);
        $("#phoneNumber").val(contact.phoneNumber);
    }

    ns.save = function () {
        var contact = currentRecord.contact;
        contact.firstName = $("#firstName").val();
        contact.lastName = $("#lastName").val();
        contact.email = $("#email").val();
        contact.phoneNumber = $("#phoneNumber").val();

        var results = retrieveFromStorage();
        if (currentRecord.key != null) {
            results[currentRecord.key] = contact;
        }
        else {
            results.push(contact);
        }
        localStorage.setItem('contacts', JSON.stringify(results));
        ns.display();
    }

})();

//drag and drop
$(document).ready(function() {
    var filesTable = $('#filesTable');
    var target = $('#target');

    target.on('dragover', function(e) {
        e.preventDefault();
        target.addClass('dragging');
    });

    target.on('dragleave', function(e) {
        e.preventDefault();
        target.removeClass('dragging');
    });

    target.on('drop', function(e) {
        e.preventDefault();
        target.removeClass('dragging');

        $.each(e.originalEvent.dataTransfer.files, function(index, file) {
            var newRow = $('<tr>');

            var nameCell = $('<td>').text(file.name);
            var typeCell = $('<td>').text(file.type);
            var sizeCell = $('<td>').text(file.size);

            var downloadLink = $('<a>').text('Download');
            downloadLink.attr('href', URL.createObjectURL(file));
            downloadLink.attr('download', file.name);
            var downloadCell = $('<td>').append(downloadLink);

            newRow.append(nameCell);
            newRow.append(typeCell);
            newRow.append(sizeCell);
            newRow.append(downloadCell);

            filesTable.append(newRow);
        });
    });
});












