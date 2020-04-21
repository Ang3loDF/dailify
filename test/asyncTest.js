var counter = 5;

function asyncTest(test, callback){

    console.log("precess started");
    repeat(test, callback);

    
}

function repeat(test, callback){
    // do things

    counter--;
    if(counter > 0){
        setTimeout(function(){
            repeat(test, callback);
        }, 1000);
    } else callback();
}

module.exports = asyncTest;