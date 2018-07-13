



function convertJSON(data){ 
  let elementJsonObj, innerElementJsonObj;
    let author, name, img;
    for(elementJsonObj in data){
        for(innerElementJsonObj in data[elementJsonObj]){
            switch (innerElementJsonObj) {
                case 'author' : author = data[elementJsonObj][innerElementJsonObj]; break;
                case 'name' : name = data[elementJsonObj][innerElementJsonObj]; break;
                case 'img' : img = data[elementJsonObj][innerElementJsonObj]; break;
                default : alert('errore! bed format of JSON file!');
            };

        };
                 console.log(author,name,img);
       // addElement();
    };
};

function scanJsonFile(fileJson, callbackFunc) {
    let rqstFile = new XMLHttpRequest();
    rqstFile.overrideMimeType('application/json');
    rqstFile.open('GET', fileJson, true);
    rqstFile.onreadystatechange = function() {
        if (rqstFile.readyState === 4 && rqstFile.status == '200') {
            callbackFunc(rqstFile.responseText);
        }
    }
    rqstFile.send(null);
};


scanJsonFile('/static/data.json', function(text){ // start function for load JSON-file

    let data = JSON.parse(text);
    convertJSON(data);
});


