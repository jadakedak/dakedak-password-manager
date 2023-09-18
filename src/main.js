let Email;

function RandomChar(){
    const normal_letters = "abcdefghijklmnopqrstuvxyzæøå"
    const numbers_chars = "1234567890"
    const special_characters = "!#¤%&/()=?`^*_-"

    let charset = []

    for(let char of normal_letters){
        charset.push(char)
    }for(let char of numbers_chars){
        charset.push(char)
    }for(let char of special_characters){
        charset.push(char)
    }
    return charset[Math.floor(Math.random() * charset.length)]
}

let Id = {}

let headline = document.createElement("label")
    headline.textContent = "Stored Passwords"
    headline.style.fontSize = "50px"
    headline.style.borderRadius = "15px"
    //headline.style.backgroundColor = "grey"
    headline.style.marginBottom = "50px"
    headline.style.color = "white"

let container = document.createElement("div");
    container.className = "Stored-Passwords"

container.appendChild(headline)
document.body.appendChild(container)


const passwordInput = document.getElementById("password");
const showPasswordCheckbox = document.getElementById("ShowPassword")
try{
    showPasswordCheckbox.onchange = function(){
        if (showPasswordCheckbox.checked) {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    }
} catch(error){/* do nothing */}


// recive generated password
chrome.runtime.onMessage.addListener(function(details){
    if(details.action === "password-copied"){
        document.getElementById("password").value = details.password;
    }
})

class Password{
    constructor(username, password, website){
        this.id = "";
        this.length_of_id = 50;

        this.username = username;
        this.password = password;
        this.website = website;

        for(let i = 0; this.length_of_id > i; i++){
            this.id += RandomChar()
        }
    }
    Save(){
        // gemmer alle credentials i local memory
        localStorage.setItem(`username-${this.id}`, this.username)
        localStorage.setItem(`password-${this.id}`, this.password)
        localStorage.setItem(`website-${this.id}`, this.website)
    }

    getid(){
        return this.id
    }

    getUser(){
        return String(this.username)
    }
    getPassword(){
        return String(this.password)
    }
    getWebsite(){
        return String(this.website)
    }    

    getMemUser(){
        return String(localStorage.getItem(`username-${this.id}`))
    }
    getMemPassword(){
        return String(localStorage.getItem(`password-${this.id}`))
    }
    getMemWebsite(){
        return String(localStorage.getItem(`website-${this.id}`))
    }
}

function ExportPasswords(){
    // exportere localmemory id's til Id listen
    let saved_ids =  JSON.parse(localStorage.getItem("Id"));
    for(let key in saved_ids){
        let value = saved_ids[key]
        Id[key] = value
    }
    // laver et element for hvert element i Id listen
    for(let key in saved_ids){
        let value = saved_ids[key]
        Create_Password_box(value, key)
    }
}

function CheckIfEmail(usr){
    return usr.includes("@")
}

// Communicate With Background Script
function SendNewCredentials(){
    chrome.runtime.sendMessage({ Sender: "main", Identifications: Id })
}

// recive updated password list
chrome.runtime.onMessage.addListener(function(details){
    if(details.Sender === "background"){
        Id = details.Identifications
    }
})


function Create_Password_box(id, Website){
    let password_container = document.createElement("div")
        password_container.id = "password-storage-container"
        password_container.textContent = `${Website}`
        password_container.style.fontSize = "30px"
        password_container.style.backgroundColor = "grey"
        password_container.style.border = "2px solid black"
        password_container.style.margin = "5px"
        password_container.style.borderRadius = "10px"
        password_container.style.marginTop = "20px"

    let copy_username_btn = document.createElement("button")
        copy_username_btn.name = "password-setting-btn"
        copy_username_btn.id = "copy_username"
        if(Email || CheckIfEmail(localStorage.getItem(`username-${id}`))){
            copy_username_btn.textContent = "Copy Email"
        }else{
            copy_username_btn.textContent = "Copy Username"
        }
        copy_username_btn.style.backgroundColor = "grey"
        copy_username_btn.addEventListener("click", function(){
            for(let key in Id){
                let value = Id[key];
                if(key === Website){
                    navigator.clipboard.writeText(localStorage.getItem(`username-${value}`));
                }
            }
            copy_username_btn.textContent = "Copied to Clipboard!"
            copy_username_btn.style.backgroundColor = "lightgrey"
            setTimeout(function(){
                if(Email || CheckIfEmail(localStorage.getItem(`username-${id}`))){
                    copy_username_btn.textContent = "Copy Email"
                }else{
                    copy_username_btn.textContent = "Copy Username"
                }
                copy_username_btn.style.backgroundColor = "grey"
            }, 800)
        })

    let copy_password_btn = document.createElement("button")
        copy_password_btn.name = "password-setting-btn"
        copy_password_btn.id = "copy_password"
        copy_password_btn.textContent = "Copy Password"
        copy_password_btn.backgroundColor = "grey"
        copy_password_btn.addEventListener("click", function(){
            for(let key in Id){
                let value = Id[key];
                if(key === Website){
                    navigator.clipboard.writeText(localStorage.getItem(`password-${value}`))
                }
            }
            copy_password_btn.textContent = "Copied to Clipboard!"
            copy_password_btn.style.backgroundColor = "lightgrey"
            setTimeout(function(){
                copy_password_btn.textContent = "Copy Password"
                copy_password_btn.style.backgroundColor = "grey"
            }, 800)
        })

    let remove_credential_btn = document.createElement("button")
        remove_credential_btn.textContent = "remove"
        remove_credential_btn.name = "password-setting-btn"
        remove_credential_btn.id = "copy_password"
        remove_credential_btn.addEventListener("click", function(){
            for(let key in Id){
                let value = Id[key]
                if(key === Website){
                    password_container.removeChild(copy_username_btn)
                    password_container.removeChild(copy_password_btn)
                    container.removeChild(password_container)
                    localStorage.removeItem(`username-${value}`)
                    localStorage.removeItem(`password-${value}`)
                    localStorage.removeItem(`website-${value}`)
                    delete Id[Website];
                }
            }
            jsonId = JSON.stringify(Id)
            localStorage.setItem("Id", jsonId)
        })
    // appender objekterne til documentet
    container.appendChild(password_container)
    password_container.appendChild(copy_username_btn)
    password_container.appendChild(copy_password_btn)
    password_container.appendChild(remove_credential_btn)

    Id[Website] = id;
    let jsonId = JSON.stringify(Id)
    localStorage.setItem("Id", jsonId)
}

function CreatePassword(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const website = document.getElementById("website").value;
    if(CheckIfEmail(username)){
        Email = true;
    }else{
        Email = false;
    }
    if(username && password && website){
        var NewPassword = new Password(username, password, website)
        NewPassword.Save()
        Create_Password_box(NewPassword.getid(), `${NewPassword.getMemWebsite()}`)

        document.getElementById("username").value = null
        document.getElementById("password").value = null
        document.getElementById("website").value = null
    }
}

try{
    document.getElementById("Generator").addEventListener("click", function(){
        chrome.windows.create({
            url: chrome.runtime.getURL("../Pages/password_generator/generator.html"),
            type: "popup",
            width: 617,
            height: 570
        });
    })
} catch(error){
    // do nothing
}

try{ ExportPasswords() } catch(error){ console.log(error) }
try{
    document.getElementById("Save-Password").onclick = function(){
        CreatePassword()
    }
} catch(error){/* do nothing */}
