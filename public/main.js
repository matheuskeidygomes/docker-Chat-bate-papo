const socket = io();

let username = "";

let userlist = [];

let loginPage = document.querySelector("#loginPage"); 
let chatPage = document.querySelector("#chatPage"); 

let loginInput = document.querySelector(".loginInput"); 
let textInput = document.querySelector(".Input"); 

loginPage.style.display = 'flex';
chatPage.style.display = 'none';


// ----------------------------------------------------------//


loginInput.addEventListener('keyup', (e) => {

    if(e.keyCode === 13) {

        let name = loginInput.value.trim();

        if(name != "") {

            username = name;
            document.title = `Chat (${username})`;

            socket.emit('join-request', username);
        }
    }

});


textInput.addEventListener('keyup', (e) => {

    if(e.keyCode === 13) {

        let msg = textInput.value.trim();

        textInput.value = '';

        if(msg != "") {

            socket.emit('send-msg', msg);
        }
    }

});


// ----------------------------------------------------------//


function renderUserList() {

    let ul = document.querySelector('.userList');
    
    ul.innerHTML = '';

    userlist.forEach( (i) => {

        ul.innerHTML += `<li> ${i} </li>`;
    });

};


function addMessage(type, user, msg) {

    let ul = document.querySelector('.chatList');

    switch(type) {
        case 'status':

            ul.innerHTML += `<li class="m-status"> ${msg} </li>`;

            break;

        case 'msg':

            if(username == user) {

                ul.innerHTML += `<li class="m-txt me"> ${msg} </li>`;

            } else {
                
                ul.innerHTML += `<li class="m-txt other"> <span> ${user} </span> ${msg} </li>`;

            }

            break;
    }

    ul.scrollTop = ul.scrollHeight;
}


// ----------------------------------------------------------//


socket.on('user-ok', (list) => {

    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';    

    textInput.focus();

    addMessage('status', null, 'Você se conectou ao chat!');

    userlist = list;

    renderUserList();
});


socket.on('list-update', (data) => {

    if(data.joined) {
        
        addMessage('status', null, `${data.joined} entrou no chat.`);
    }

    if(data.left) {

        addMessage('status', null, `${data.left} saiu do chat.`);
    }

    userlist = data.list;
    renderUserList();
});


socket.on('show-msg', (data) => {

    addMessage('msg', data.username, data.msg);
});



socket.on('disconnect', () => {

    addMessage('status', null, 'Você foi desconectado.');
    
    userlist = [];
    
    renderUserList();
});


socket.on('connect_error', () => {

    addMessage('status', null, 'Reconectando...');

});


socket.on('connect', () => {

    if(username != '') {

        socket.emit('join-request', username);
    }
}); 

