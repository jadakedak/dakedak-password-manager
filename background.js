const Sender_name = "background";
let Identifications = {}

// recive Credentials List
chrome.runtime.onMessage.addListener(function(details){
    if(details.Sender = "main"){
        if(details.type = "stored-creds"){
            Identifications = details.Identifications;
            console.log(Identifications)
        }
    }
})

function SendNewCredentials(){
    chrome.runtime.sendMessage({sender: Sender_name, Identifications: Identifications})
}

