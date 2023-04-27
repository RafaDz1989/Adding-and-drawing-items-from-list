const body = document.querySelector('body'); // nasze body
const btnIcon = document.querySelector('.btn-icon'); // button zmieniający tryb na jasny i ciemny
const darkmodeIcon = document.querySelector('.darkmode-icon'); // ikona odpowiedniego trybu

const addingElementInput = document.querySelector('.adding-element-input'); // miejsce, gdzie użytkownik wpisuje nazwę elementu do wylosowania
const addingElementBtn = document.querySelector('.adding-element-btn'); // przycisk dodający element o wybranej nazwie do listy oraz tablicy
const warningText = document.querySelector('.warning-text'); // info o braku elementów do losowania / konieczności wpisania nazwy elementu
const ulList = document.querySelector('.element-list ul'); // cała lista ul
const allElements = document.getElementsByTagName('li'); // aktualna ilość dodanych elementów
const elementsArr = []; // aktualna tablica z dodanymi nazwami elementów
const drawBtn = document.querySelector('.draw-btn'); // przycisk losujący element
const drawScore = document.querySelector('.draw-score'); // info o wylosowanym elemencie

const popup = document.querySelector('.popup'); // nasz popup - okno edycji nazwy elementu
const popupInfo = document.querySelector('.popup-info'); // alert w popupie w przypadku braku nazwy
const popupInput = document.querySelector('.popup-input'); // miejsce, gdzie zmieniamy nazwę elementu
const addPopupBtn = document.querySelector('.accept'); // przycisk zatwierdzający nową nazwę elementu 
const closePopupBtn = document.querySelector('.cancel'); // przycisk zamykający popup

let idNumber = 0; // nr id
let newElement; // dynamicznie nowo utworzony element li
let editedElement; // edytowany lub usuwany element
let currentIndex; // aktualny indeks z tablicy elementsArr edytowanego lub usuwanego elementu

// Zmieniamy tryb na jasny lub ciemny
const changeColorMode = () => {
    if (body.getAttribute('data-mode') === 'light') {
        body.setAttribute('data-mode', 'dark');
        darkmodeIcon.classList.remove('fa-moon');
        darkmodeIcon.classList.add('fa-sun');
        localStorage.setItem('dark-mode', 'true');
    } else {
        body.setAttribute('data-mode', 'light');
        darkmodeIcon.classList.remove('fa-sun');
        darkmodeIcon.classList.add('fa-moon');
        localStorage.removeItem('dark-mode');
    };
};

// Zapamiętanie motywu ciemnego w LocalStorage
const showDarkMode = () => {
    const darkMode = localStorage.getItem('dark-mode');

    if (darkMode) {
        body.setAttribute('data-mode', 'dark');
        darkmodeIcon.classList.add('fa-sun');
        darkmodeIcon.classList.remove('fa-moon');
    };
};

// Dodajemy nowy element do listy i tablicy
const addNewElement = () => {
    if (addingElementInput.value !== '') {
        idNumber++;
        newElement = document.createElement('li');
        newElement.innerText = addingElementInput.value;
        elementsArr.push(newElement.innerText);
        newElement.setAttribute('id', `${idNumber}`);
        ulList.append(newElement);

        addingElementInput.value = '';
        warningText.innerText = '';
        drawScore.innerText = '';
        drawScore.style.border = 'none';
        createToolsArea();
        newElement.classList.add('fade-in');
    } else {
        warningText.innerText = 'Musisz wpisać jakiś element!';
    };
};

// Sprawdzamy, czy użytkownik wciska enter przy dodawaniu nowego elementu do listy
const enterCheck = e => {
    if (e.key === 'Enter') {
        addNewElement();
    };
};

// Tworzymy przyciski edycji i usuwania elementu
const createToolsArea = () => {
    const toolsPanel = document.createElement('div');
    toolsPanel.classList.add('tools');
    newElement.append(toolsPanel);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.innerText = 'edytuj';
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    toolsPanel.append(editBtn, deleteBtn);
    // console.log(elementsArr)
};

// Zarządzamy kliknięciami w odpowiednie przyciski
const checkClick = e => {
    if (e.target.classList.value !== '') {
        editedElement = document.getElementById(e.target.closest('li').id);
        currentIndex = elementsArr.indexOf(editedElement.firstChild.data);

        if (e.target.closest('button').matches('.edit')) {
            editElement();
        } else if (e.target.closest('button').matches('.delete')) {
            deleteElement();
        };
    };
};

// Otwieramy okno edycji nazwy elementu
const editElement = () => {
    popupInput.value = editedElement.firstChild.textContent;
    popup.style.display = 'flex';
};

// Zmieniamy nazwę elementu na liście i w tablicy
const changeElementText = () => {
    if (popupInput.value !== '') {
        editedElement.firstChild.textContent = popupInput.value;
        elementsArr.splice(currentIndex, 1, popupInput.value);
        popup.style.display = 'none';
        popupInfo.innerText = '';
        // console.log(elementsArr)
    } else {
        popupInfo.innerText = 'Musisz podać jakąś treść!';
    };
};

// Usuwamy element z listy i tablicy oraz dodajemy animację zniknięcia
const deleteElement = () => {
    editedElement.classList.add('fade-out');
    setTimeout(() => {
        editedElement.remove()
    }, 800);
    elementsArr.splice(currentIndex, 1);
    // console.log(elementsArr)

    if (allElements.length === 0) {
        warningText.innerText = 'Brak elementów do wylosowania';
    };
};

// Zamykamy okno edycji nazwy elementu
const closePopup = () => {
    popup.style.display = 'none';
    popupInfo.innerText = '';
};

// Losujemy losowo wybrany element z tablicy, wyświetlamy go i po chwili usuwamy z tablicy i listy dodając animację zniknięcia
const drawElement = () => {
    if (allElements.length === 0) {
        warningText.innerText = 'Brak elementów do wylosowania';
        drawScore.innerText = 'Nie ma czego losować';
        drawScore.style.border = 'none';
    } else {
        const drawItem = Math.floor(Math.random() * elementsArr.length);
        const drawItemName = `${elementsArr[drawItem]}`;

        if (elementsArr.length !== 0) {
            drawScore.innerText = 'Wylosowałeś: ' + drawItemName;
            drawScore.style.border = '3px dotted rgb(225, 25, 25)';
            elementsArr.splice(drawItem, 1);
            const allElementsArr = Array.from(allElements);

            allElementsArr.filter(el => { 
                if (el.firstChild.data === drawItemName) {
                    el.classList.add('fade-out');
                    setTimeout(() => {
                        el.remove();
                    }, 800);
                };
            });
            // console.log(elementsArr)
        }; 
    };
};

showDarkMode();
btnIcon.addEventListener('click', changeColorMode);
addingElementBtn.addEventListener('click', addNewElement);
addingElementInput.addEventListener('keyup', enterCheck);
ulList.addEventListener('click', checkClick);
addPopupBtn.addEventListener('click', changeElementText);
closePopupBtn.addEventListener('click', closePopup);
drawBtn.addEventListener('click', drawElement);