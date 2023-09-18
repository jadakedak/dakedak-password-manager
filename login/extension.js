let inputs = document.getElementsByName("login-field");
let logger = document.getElementById("logs");

for(let input of inputs){
    input.style.margin = "5px"
}

function openNewPopup() {
    window.close();
    chrome.windows.create({
        url: chrome.runtime.getURL("../src/main.html"),
        type: "popup",
        width: 850,
        height: 500
    });
}

const passwordInput = document.getElementById("password");
const showPasswordCheckbox = document.getElementById("ShowPassword")
showPasswordCheckbox.onchange = function(){
    if (showPasswordCheckbox.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

const passwordInput_create = document.getElementById("create-password");
const showPasswordCheckbox_create = document.getElementById("ShowCrtPassword")
showPasswordCheckbox_create.onchange = function(){
    if (showPasswordCheckbox_create.checked) {
        passwordInput_create.type = "text";
    } else {
        passwordInput_create.type = "password";
    }
}

document.getElementById("loginbtn").onclick = function(){
    chrome.storage.local.get(["user", "passwd", "CreatedAccount"], function(details){
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if(username === details.user && password === details.passwd){
            const logger = document.getElementById("logs");
            logger.textContent = "you are logged in!"
            
            chrome.runtime.sendMessage( { loggedin: true } )
            openNewPopup()
            //chrome.tabs.create({url: chrome.runtime.getURL("../src/main.html")}) 
        }else{
            chrome.runtime.sendMessage( { loggedin: false } )
            const logger = document.getElementById("logs");
            logger.textContent = "account doesnt exist!"
        }
    })
}

document.getElementById("create-account").addEventListener("click", () => {
    const min_password_length = 1;
    const max_password_length = 25;

    let ctr_username = document.getElementById("create-username").value;
    let ctr_password = document.getElementById("create-password").value;
    if(ctr_password.length >= min_password_length && ctr_password.length <= max_password_length){
        chrome.storage.local.get(["CreatedAccount"], function(details){
            if(details.CreatedAccount === undefined){
                chrome.storage.local.set( {user: ctr_username, passwd: ctr_password, CreatedAccount: true} )
                const logger = document.getElementById("logs");
                logger.textContent = "Account Created";
            }else{
                logger.textContent = "account allready"
            }
        })
    }else{
        logger.textContent = "something went wrong"
    }
})


