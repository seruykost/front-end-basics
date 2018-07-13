//front-end-basics. Тестове завдання на школу інтернів.

var divL = {}, divR ={}; //main objects with information about books in the left and the right divs

function localStrg(idNumb, books, selected, operation){ // function for created localStorage
/*selected 'true' = div right or 'false' = div left ||| operation 'true' = add item or 'false'  = replace item |||
idNumb = number of item ||| books = object data with information about book */
    console.log(idNumb, selected, operation);
    if (operation === true) {   // якщо додавання книжки в стек
        if (selected === false ) {  //якщо стек лівий
            divL[idNumb] = books;   // створюємо у об"єкта divL новий ключ idNumb з даними про книжку
        } else {   //інакше стек правий
            divR[idNumb] = books;  // створюємо у об"єкта divR новий ключ idNumb з даними про книжку
        };
    } else { // інакше обмін книжки між стеками
        if (selected === false ) { //якщо стек лівий
            if (divR.hasOwnProperty(idNumb) === true) { // якщо правий divR дійсно має таку книжку то...
                divL[idNumb] = divR[idNumb]; //перекидаємо книжку з правої в ліву панель
                delete divR[idNumb]; // видаляємо у об"єкта divR ключ idNumb з даними про книжку
            }; 
        } else {  //інашке стек правий
            if (divL.hasOwnProperty(idNumb) === true) { // якщо лівий divL дійсно має таку книжку то...
                divR[idNumb] = divL[idNumb]; // перекидаємо книжку з лівої в праву панель
                delete divL[idNumb]; // видаляємо у об"єкта divL ключ idNumb з даними про книжку
            };
        };
    };
    localStorage.clear(); //очищення поперденіх значень localStorage
    console.log(divL, divR);
    localStorage.setItem('structureL', JSON.stringify(divL)); //формування нового localStorage ключа structureL для лівої та правої 
    localStorage.setItem('structureR', JSON.stringify(divR)); //панелей книжок, попередньо джейсонимо відповідні об"єкти
};

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
        let obj = {};
        obj.author = author;
        obj.name = name;
        obj.img = img;
        localStrg(idNumb,obj,!selected, false);
        newDivAfter.parentNode.parentNode.removeChild(newDivAfter.parentNode);
 
        });
    newDivItem.appendChild(newDivAfter);
}

function convertJSON(data, restore, columL){ 
    let elementJsonObj, innerElementJsonObj;
    let author, name, img;
    for(elementJsonObj in data){
        if (restore !== true) {
            localStrg(elementJsonObj, data[elementJsonObj],false, true);
        };
        for(innerElementJsonObj in data[elementJsonObj]){
            switch (innerElementJsonObj) {
                case 'author' : author = data[elementJsonObj][innerElementJsonObj]; break;
                case 'name' : name = data[elementJsonObj][innerElementJsonObj]; break;
                case 'img' : img = data[elementJsonObj][innerElementJsonObj]; break;
                default : alert('errore! bed format of JSON file!');
            };
        };
        if (restore === false) {
            addElement(elementJsonObj, author, name, img, false);
        } else {
            if (columL === true) {
                addElement(elementJsonObj, author, name, img, false);
            } else {
                addElement(elementJsonObj, author, name, img, true);
            };
        };
    };
};

function scanJsonFile(fileJson, callbackFunc) {
    let rqstFile = new XMLHttpRequest(); // створюємо об"єкт XMLHttpRequest
    rqstFile.overrideMimeType('application/json'); // очікуємо отримати json файл
    rqstFile.open('GET', fileJson, true); //ініціалізуємо відкриття json файлу за методом GET
    rqstFile.onreadystatechange = function() { // метод буде викликатися, якщо readyState змінився
        if (rqstFile.readyState === 4 && rqstFile.status == '200') { // якщо операція завершена і все гуд, файл загружений то..
            callbackFunc(rqstFile.responseText); //викликаємо фукнцію, яку передали в параметрі
        }
    }
    rqstFile.send(null); //посилаємо запит на відкриття, тип запиту GET отже параметр null
};

scanJsonFile('/static/data.json', function(text){ // start function for load JSON-file
    divL = JSON.parse(localStorage.getItem('structureL')); // присваюємо об"єктам відповідні значення обох структур localStorage
    divR = JSON.parse(localStorage.getItem('structureR')); // якщо таких стркутур нема (перший запус), то об"єкти стануть null

    if ((divL === null) || (divR === null)) { //перевіряємо чи стали  об"єкти null і якщо так то ...
        divL = {};  // присваюємо змінним значення пустих об"єктів повторно
        divR = {};
        let data = JSON.parse(text); //а в змінну data вносимо всі розпарсені об"єкти, що завантажено з JSON файла при завантаженні сторінки
        convertJSON(data, false); //змінну data відправляєм у функцію розшифровки об"єктів з даними книжов і фомрування візуального списку
    } else { // інакше ключі localStorage були не пусті, сайт відвіданий не вперше, треба працювати зі збереженими даними
    convertJSON(divL,true,true); //збережені дані відправляєм у функцію розшифровки об"єктів з даними книжов і фомрування візуального списку
    convertJSON(divR,true,false); //(в ту саму функцію, що і трьома стрічками вище, але вводимо додаткий атрибут - колонка в якій будуть відрисовані книжки) 
    };

});