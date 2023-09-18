let result = ""

// Math.floor(Math.random() * 10)
chars = []

let normal_letters = "abcdefghijklmnopqrstuvxyzæøå"
let numbers_chars = "1234567890"
let special_characters = "!#¤%&/()=?^*_"

document.getElementById("copy_password").addEventListener("click", function(){
    if(result != ""){
        navigator.clipboard.writeText(result)
        let cpy_btn = document.getElementById("copy_password")
    
        cpy_btn.textContent = "adding password..."
        cpy_btn.style.backgroundColor = "lightgrey"
        // Send generated password
        chrome.runtime.sendMessage( { action: "password-copied", password: result } )

        setTimeout(function(){
            cpy_btn.textContent = "Copy"
            cpy_btn.style.backgroundColor = "Use"
            window.close()
        }, 500)
    }else{
        document.getElementById("logger").textContent = "you havent generated a password!"
    }
})
/*
document.getElementById("length").onchange = function(){
    let showlen = document.getElementById("showlength");
    showlen.textContent = document.getElementById("length").value;
}
*/
setInterval(() => {
    let showlen = document.getElementById("showlength");
    showlen.textContent = document.getElementById("length").value;
}, 50)

function checkNumbers(){
    let numbers = document.getElementById("include-numbers");
    if(numbers.checked){
        for(char of numbers_chars)
        chars.push(char)
    }else{
        // do nothing
    }
}

function checkSpecial(){
    let spcl_chars = document.getElementById("include-special-characters");
    if(spcl_chars.checked){
        for(char of special_characters)
        chars.push(char)
    }else{
        // do nothing
    }
}

//result += chars[Math.floor(Math.random() * 2)]
document.getElementById("generate").addEventListener("click", function(){
    result = ""
    let length_of_chars = 0;
    let length = document.getElementById("length").value;
    
    for(letter of normal_letters){
        chars.push(letter)
    }
    checkNumbers()
    checkSpecial()

    for(element in chars){
        length_of_chars += 1
    }

    for(let i = 0; i < length; i++){
        result += chars[Math.floor(Math.random() * length_of_chars)]
    }
    document.getElementById("result").value = result

    length_of_chars = 0;
    chars = []
})