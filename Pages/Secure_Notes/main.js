function RandomNumbers(length){
    let Result = "";
    for(let i = 0; length > i; i++){
        Result += Math.floor(Math.random() * 9)
    }
    return Result;
}
