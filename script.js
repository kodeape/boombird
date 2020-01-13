function randomNumber(min,max) {
    var number = Math.floor(Math.random() * (max-min+1)) + min;
    return number;
}
function randomArrayElement(array) {
    var elementIndex = Math.floor(Math.random() * array.length);
    var element = array[elementIndex];
    return element;
}
function randomColour() {
    var hexList = "123456789ABCDEF";
    var hexCode = "#";
    for(var i = 0; i < 6; i++) {
        var randomElement = Math.floor(Math.random() * hexList.length);
        hexCode += hexList[randomElement];
    }
    return hexCode;
}
function shuffleArray(array) {
    var shuffled = [];
    function addShuffledElem() {
        var elem = randomArrayElement(array);
        if(alreadyAdded(elem) == false){
            shuffled.push(elem);
        }
        else {
            addShuffledElem();
        }
    }
    function alreadyAdded(elem) {
        var added = false;
        for(var i = 0; i < shuffled.length; i++){
            if(elem == shuffled[i]){
                added = true;
            }
        }
        return added;
    }
    for(var i = 0; i < array.length; i++){
        addShuffledElem();
    }
    return shuffled;
}