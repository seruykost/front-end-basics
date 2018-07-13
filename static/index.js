
function addElement(idNumb, author, name, img, selected ) {
    let newDivItem = document.createElement('div');
        newDivItem.className = 'item';
        newDivItem.id = idNumb;
    let parentDivItem;

    if (selected === false) {
        parentDivItem = document.querySelector('div .left');
        } else {
        parentDivItem = document.querySelector('div .right');   
        };
    parentDivItem.insertBefore(newDivItem, parentDivItem.lastChild);
    
    let newDivPic = document.createElement('div');
    newDivPic.className = 'pic';    
    newDivItem.appendChild(newDivPic);

    let newDivPicSpan = document.createElement('span');
    newDivPic.appendChild(newDivPicSpan);
    
    let newDivPicSpanImg = document.createElement('img');
    newDivPicSpanImg.src = img;
    newDivPicSpan.appendChild(newDivPicSpanImg);
    
    let newDivTitle = document.createElement('div');
    newDivTitle.className = 'title';    
    newDivItem.appendChild(newDivTitle);

    let newDivTitleSpanName = document.createElement('span');
    newDivTitleSpanName.innerHTML = '<b>Название</b>:&nbsp"'+name+'"';
    newDivTitle.appendChild(newDivTitleSpanName);
    
    let newDivTitleSpanAuthor = document.createElement('span');
    newDivPic.className = 'author';
    newDivTitleSpanAuthor.innerHTML = '<b>Автор</b>:&nbsp'+author;
    newDivTitle.appendChild(newDivTitleSpanAuthor);
    
    let newDivAfter = document.createElement('div');
    
    if (selected === false) { 
        newDivAfter.className = 'after';
    } else {
        newDivAfter.className = 'before';   
    };
    newDivAfter.addEventListener('click', function(event){
        addElement(idNumb, author, name, img, !selected);
     
        newDivAfter.parentNode.parentNode.removeChild(newDivAfter.parentNode);
 
        });
    newDivItem.appendChild(newDivAfter);
}




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
        addElement(elementJsonObj, author, name, img, true);
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


