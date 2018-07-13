//front-end-basics. Тестове завдання на школу інтернів.

var divL = {}, divR ={}; //main objects with information about books in the left and the right divs

function localStrg(idNumb, books, selected, operation){ // function for created localStorage
/*selected 'true' = div right or 'false' = div left ||| operation 'true' = add item or 'false'  = replace item |||
idNumb = number of item ||| books = object data with information about book */
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
    localStorage.clear(); //очищення попередніх значень localStorage
    localStorage.setItem('structureL', JSON.stringify(divL)); //формування нового localStorage ключа structureL для лівої та правої 
    localStorage.setItem('structureR', JSON.stringify(divR)); //панелей книжок, попередньо джейсонимо відповідні об"єкти
};

function addElement(idNumb, author, name, img, selected ) { //add new div-element about book
/*idNumb = number of item |||  author, name, img = parameters of book ||| selected 'true' = div right or 'false' = div left */
    let newDivItem = document.createElement('div'); //створюєм елемент div - загальний контейнер для книжки
        newDivItem.className = 'item';//призначаєм йому клас item
        newDivItem.id = idNumb; //і індентифікатор - порядковий номер в каталозі
    let parentDivItem; // оголошуєм змінну для збереження батьківського елемента для div

    if (selected === false) { //якщо  книжка повинна знаходитися в лівій частині то...
        parentDivItem = document.querySelector('div .left');  //батьківський контейнер буде div класу left
        } else {
        parentDivItem = document.querySelector('div .right');  //батьківський контейнер буде div класу right  
        };
    parentDivItem.insertBefore(newDivItem, parentDivItem.lastChild); //вставляємо створений div на сторінку
    
    let newDivPic = document.createElement('div'); //... аналогічно створюємо контейнер для зображення обкладинки книжки
    newDivPic.className = 'pic';    
    newDivItem.appendChild(newDivPic);

    let newDivPicSpan = document.createElement('span'); 
    newDivPic.appendChild(newDivPicSpan);
    
    let newDivPicSpanImg = document.createElement('img');
    newDivPicSpanImg.src = img;  //атрибуту src тега img присвоюємо гіпертекстове посилання на зображення обкладинки 
    newDivPicSpan.appendChild(newDivPicSpanImg);
    
    let newDivTitle = document.createElement('div'); //... аналогічно створємо контейнер для заголовку книжки
    newDivTitle.className = 'title';    
    newDivItem.appendChild(newDivTitle);

    let newDivTitleSpanName = document.createElement('span');
    newDivTitleSpanName.innerHTML = '<b>Название</b>:&nbsp"'+name+'"'; // вставляємо в створений span блок назву книжки
    newDivTitle.appendChild(newDivTitleSpanName);
    
    let newDivTitleSpanAuthor = document.createElement('span');
    newDivPic.className = 'author';
    newDivTitleSpanAuthor.innerHTML = '<b>Автор</b>:&nbsp'+author; // вставляємо в створений span блок автора
    newDivTitle.appendChild(newDivTitleSpanAuthor);
    
    let newDivAfter = document.createElement('div');  //... аналогічно створємо контейнер для стрілки - елементу керування списком
    
    if (selected === false) {  //визначаємо де повинна розрашовуватися стрілка - якщо зліва то...
        newDivAfter.className = 'after';  // новому контейнеру присвоюємо клас after
    } else {
        newDivAfter.className = 'before'; // інакше новому контейнеру присвоюємо клас before
    };
    newDivAfter.addEventListener('click', function(event){ //елементу керування - стрілці - призначаємо обробник події - на клацання мишки.
        addElement(idNumb, author, name, img, !selected); //виклик процедури додавання нової книги в іншому списку (інакшому від поточного)
        (selected === true) ? counter('left',true) : counter('right',true); // виклик функції зміни лічильника при додаванні нового елемента книжки в іншу панель(+1)
        let obj = {}; // створюємо новий об"єкт, що буде містити дані про поточну книжку, яку вирішено перемістити
        obj.author = author; // присвоєння параметрів книги відповідним властивостям об"єктів 
        obj.name = name;
        obj.img = img;
        localStrg(idNumb,obj,!selected, false);// виклик функції модифікації localStorage і побудови нового списку книжок на обох панелях
        newDivAfter.parentNode.parentNode.removeChild(newDivAfter.parentNode); // видалення поточної книжки в поточному списку
        (selected === false) ? counter('left',false) : counter('right',false); // виклик функції зміни лічильника при видаленні елемента книжки з поточної панелі(1)
       });
    newDivItem.appendChild(newDivAfter); // відрисовування управляючого блоку зі стрілочкою
}

var counter = function(selected, increment) { // function for counter increment/decrement.
/*selected 'left' =  left panel of counter of 'reght' = right panel ||| inctement 'true' = ++counter or 'false' = --counter*/
    let changeValue = (selected==='left') ? document.getElementById('#countLeft') : document.getElementById('#countRight'); // вибираємо панель для зміни даних
    changeValue.innerText =  (increment === true) ? ++changeValue.innerText : --changeValue.innerText; // обираємо дію - інкремент або деккремент і змінюємо поточне значення
}

function convertJSON(data, restore, columL){ // convert object, which create after JSON-parce, into set of book parameters and call function 'addElement'
/*data = object, which consist of books after parce JSON-file of localStorage ||| columL 'true' = div left or 'false' = div right ('undefined' if restore = 'false' )
restore 'true' = load object data from localStorage or 'false' = load from JSON-file (if site first start)  */
    let elementJsonObj, innerElementJsonObj; //оголошення змінних для перебору ключів параметрів об"єктів 
    let author, name, img; //оголошення змінних для збереження значень параметрів об"єктів
    for(elementJsonObj in data){ //перебір елементів загального об"єкту з набором книжок, почергово для кожної книги
        if (restore !== true) { // якщо ми НЕ відновлюємо дані з localStorage то...
            localStrg(elementJsonObj, data[elementJsonObj],false, true); // викликаємо функцію початкового формування localStorage 
        };
        for(innerElementJsonObj in data[elementJsonObj]){ //перебір всіх властивостей кожної книжки 
            switch (innerElementJsonObj) { // розділяємо властивості по їх семантичному значенню
                case 'author' : author = data[elementJsonObj][innerElementJsonObj]; break; // якщо ключ автор, то присвоюємо значення відповідній змінній
                case 'name' : name = data[elementJsonObj][innerElementJsonObj]; break; //аналогічно - для назви
                case 'img' : img = data[elementJsonObj][innerElementJsonObj]; break; // аналогічно - для посиланя на зображення
                default : alert('errore! bed format of JSON file!'); // інаше - видаємо помилку
            };
        };
        if (restore === false) {   //якщо ми не відновлюємо дані з localStorage, то
            addElement(elementJsonObj, author, name, img, false); // виликаємо фукнцію відрисовування відуальних елементів на сторінці ЛИШЕ для лівого div
            counter('left',true); // викликаємо функцію інкременту лічильника для лівої панелі
        } else { // інакше ... (якщо відновлюємо дані з localStorage, то дані можуть бути в обох колонках)
            if (columL === true) { // якщо функція передана для відрисовування елементів лівої колонки, то...
                addElement(elementJsonObj, author, name, img, false); // виликаємо фукнцію відрисовування відуальних елементів на сторінці для лівого div
                counter('left',true); // викликаємо функцію інкременту лічильника для лівої панелі
            } else {
                addElement(elementJsonObj, author, name, img, true); // виликаємо фукнцію відрисовування відуальних елементів на сторінці для правого div
                counter('right',true); // викликаємо функцію інкременту лічильника для правої панелі
            };
        };
    };
};

function inputLisnt(){  // listen input element for find books in the left and the right lists
    
    let removeAllChild = function(parentNode){ // function for clear all div-item with books information 
        let lastChild; // змінна для збереження останнього нащадка для DOM об"єкта
        while (lastChild = parentNode.lastChild)  // поки існують дочірні елементи 
            parentNode.removeChild(lastChild); // видаляєм дочірні елементи
    };

    let author, name, img; // оголошення змінних для збереження параметрів книжки
    let input = document.querySelector('input'); //знаходимо на html сторінці перший і єдиний об"єкт input
    input.oninput = function() { // встановлюємо йому обробник на введення даних - oninput
        if (input.value.length > 2) { //якщо в input введено 3 і більше символів то..
            removeAllChild(document.querySelector('div .left')); // видаляємо всі книжки що були відображені на панелях
            removeAllChild(document.querySelector('div .right')); // обох панелях...
            document.getElementById('#countLeft').innerText = 0; // обнуляємо значення лічильників для панелі
            document.getElementById('#countRight').innerText = 0; // обох панелей...
            for (i=0; i<=1; i++) { // запускаємо цикл на 2 ітерації - для лівої і правої панелей
                let dataJson = (i === 0) ? divL : divR; // в залежності від ітерації вибираємо один з двох глобальних об"єктів що містять інфу про вміст панелей
                let elementJsonObj, innerElementJsonObj; //оголошення змінних для перебору ключів параметрів об"єктів 
                for (elementJsonObj in dataJson){ //перебір елементів загального об"єкту з набором книжок, почергово для кожної книги
                    for(innerElementJsonObj in dataJson[elementJsonObj]){ //перебір всіх властивостей кожної книжки 
                        switch (innerElementJsonObj) { // розділяємо ключі параметрів по їх семантичному значенню і присваюємо значення відповідним змінним
                            case 'author' : author = dataJson[elementJsonObj][innerElementJsonObj]; break;
                            case 'name' : name = dataJson[elementJsonObj][innerElementJsonObj]; break;
                            case 'img' : img = dataJson[elementJsonObj][innerElementJsonObj]; break;
                            default : alert('errore! bed format of JSON file!'); //якщо щось пішло не так, видаємо помилку
                        };                      
                    };
                    if (author.toLowerCase().indexOf(input.value.toLowerCase()) >= 0) { //якщо в процесі перебору книжок метод indexOf знаходить частину введеної
                        // в input стрічки, то її позиція буде більшою, ніж "-1" - отже відповідність знайдена, пошук книжки успішний, і пошук регістроНЕзалежний!
                        let selected = (i===0) ? false : true; // визначаємо в якій панелі відбувся пошук.
                        addElement(elementJsonObj, author, name, img, selected);  //викликаємо функцію відрисовування нового div item елемента про успішно знайдену книжку
                        (i === 0) ? counter('left',true) : counter('right',true); // викликаємо функцію зміни лічильника книжок для лівої або правої панелей
                    };
                };
            };
        }; 
        if (input.value.length === 0)   { //якщо поле пошуку повністю очищенне то..
            removeAllChild(document.querySelector('div .left')); //очищення списку всіх виведених div item з книжками в лівій частині 
            removeAllChild(document.querySelector('div .right')); //аналогічно для правої частині 
            document.getElementById('#countLeft').innerText = 0; // обнулення лічильників книжок 
            document.getElementById('#countRight').innerText = 0; // і для правої панелі теж
            convertJSON(divL,true,true); //виклик функції розшировки глобальних об"єктів з книжками для подальшої відрисовки їх в лівій частині
            convertJSON(divR,true,false); //аналогічні для правого списку (обидваі завжди відновлюються зі збережених глобальних об"єктів,тому 2-й параметр true)
        };
    };
};

function scanJsonFile(fileJson, callbackFunc) { // function for load JSON file with information about books
    /* fileJson = name of JSON file ||| callbackFunc - exec if JSON file is load*/
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

var modifiсationHTML = function(){ // function for drawing elements for book`s counters
    //ця функція тут лише тому, що булоа вимога не змінювати верстку html файла
    let newDivL = document.createElement('div'); // створення div для лічильника лівої панелі книжок
    newDivL.id = '#countLeft'; // присвоєння div ідентифікатора
    newDivL.innerText='0'; // запис в div нуля
    newDivL.style = 'overflow-y: auto; min-width: 450px; text-align: center'; //присвоєння стилів для div

    let newDivR = document.createElement('div'); // аналогічно для іншої панелі
    newDivR.id = '#countRight';
    newDivR.innerText='0';
    newDivR.style = 'overflow-y: auto; min-width: 450px; text-align: center';

    let newDivWidth = document.createElement('div'); // створення загального контейнера для лічильників
    newDivWidth.style='width: 100%; display: flex; flex-wrap: wrap;';
    
    let parentDiv = document.querySelector('.content'); // визначення батьківського контейнера 
    parentDiv.insertBefore(newDivWidth, parentDiv.lastChild); // вставлення на сторінку елементів для відображення лічильників
    newDivWidth.insertBefore(newDivR, newDivWidth.lastChild);
    newDivWidth.insertBefore(newDivL, newDivWidth.lastChild);
};

scanJsonFile('/static/data.json', function(text){ // start function for load JSON-file
    divL = JSON.parse(localStorage.getItem('structureL')); // присваюємо об"єктам відповідні значення обох структур localStorage
    divR = JSON.parse(localStorage.getItem('structureR')); // якщо таких стркутур нема (перший запус), то об"єкти стануть null

    modifiсationHTML(); // виклик функції відрисовування недостаючих елементів html сторінки

    if ((divL === null) || (divR === null)) { //перевіряємо чи стали  об"єкти null і якщо так то ...
        divL = {};  // присваюємо змінним значення пустих об"єктів повторно
        divR = {};
        let data = JSON.parse(text); //а в змінну data вносимо всі розпарсені об"єкти, що завантажено з JSON файла при завантаженні сторінки
        convertJSON(data, false); //змінну data відправляєм у функцію розшифровки об"єктів з даними книжов і фомрування візуального списку
    } else { // інакше ключі localStorage були не пусті, сайт відвіданий не вперше, треба працювати зі збереженими даними
    convertJSON(divL,true,true); //збережені дані відправляєм у функцію розшифровки об"єктів з даними книжок і формування візуального списку
    convertJSON(divR,true,false); //(в ту саму функцію, що і трьома стрічками вище, але вводимо додаткий атрибут - колонка в якій будуть відрисовані книжки) 
    };
    inputLisnt(); // виклик функції присвоєння обробника для зміни вмісту поля пошуку (організація слідкування за введенням даних в поле пошуку)
});