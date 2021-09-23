$(document).ready(readyNow);

function readyNow(){ // runs on document load
    $('#submitButton').on('click', retrieveInputs); // on operand button click
}

function retrieveInputs(){
    let guestId = $('#guestId').val();
    let companyId = $('#companyId').val();
    let template = $('#template').val();
    const inputs = {
        guestId,
        companyId,
        template
    }

    $.ajax({
        method: 'POST',
        url: '/createMessage',
        data: {inputs}
    }).then(response => {
        displayDOM(response);
    }).catch(error => {
        console.log('Error', error)
    });
}

function displayDOM(response){
    $('#guestId').val('');
    $('#companyId').val('');
    $('#template').val('');
    $('#displayMessage').empty()
    $('#displayMessage').append(response)
}