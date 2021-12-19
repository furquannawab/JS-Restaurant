
// Global Declarations

let tableList = document.querySelector('.table-list');
let menuList = document.querySelector('.menu-list');
let modal = document.querySelector('.modal_ele');
let tPrice = [0 ,0 ,0];
let tItems = [0,0,0];
const menu = {
        'Crusty Garlic Focaccia with Melted Cheese': 105,
        'French Fries': 105,
        'Home Country Fries with Herbs &amp; Chilli Flakes': 105,
        'French Fries with Cheese &amp; Jalapenos': 135
        };



// Most used functions
function updateTotal(element, totalPrice){
    element.innerText = `Total: ${totalPrice}.00`;
}


function foodNameNumber(element, foodName){
    for(let child of element.children)
        if(child.children[1].innerText === foodName)
            return child;
}

function changeDisplay(element, displayStyle){
    element.style.display = displayStyle;
}

function addInnerHTML(element, innerHTML){
    element.innerHTML = innerHTML;
}




// Onload Start
window.onload = () => {



// Creating Tables
for(let i=0; i<3; i++){

    let newTable = document.createElement('li');

    newTable.innerHTML = `<div class="table-no">Table-${i+1}</div>
    <div class="table-price">Price: Rs.<span>${tPrice[i]}</span>
     | Total items: <span>${tItems[i]}</span></div>`;
    
    newTable.setAttribute('class','table-list-item');
    newTable.setAttribute('id', `table-${i+1}`);
    tableList.appendChild(newTable);

    let newSection = document.createElement('section');
    newSection.setAttribute('class', 'pop-up');
    // newSection.setAttribute('class', 'modal-dialog');
    newSection.setAttribute('id',`pop-up-table-${i+1}`);

    let innerHTML = `<header class="pop-up-header">
    <span>Table-${i+1} | Order Details</span>
    <button onclick="closePopUp(event)"><img src="images/delete-2-16.ico" alt="Close"></button>
    </header><table><thead><tr><th>S.No</th><th>Item</th><th>Price</th>
    <th></th><th></th></tr></thead><tbody></tbody></table><div id="total-${i+1}" class="total">
    Total: ${tPrice[i]}.00</div><footer class="pop-up-footer"><button onclick="endSession(event)">
    Close Session (Generate Bill)</button></footer>`;

    addInnerHTML(newSection, innerHTML);
    
    document.querySelector('.modal_ele').appendChild(newSection);
}



// Creating Menu Items
let flag = 1;
for(let item in menu){

    let newItem = document.createElement('li');
    newItem.setAttribute('class','menu-list-item');
    newItem.setAttribute('id', `menu-${flag}`)
    newItem.setAttribute('draggable','true');

    let innerHTML = `<div class="menu-item">${item}</div>
    <div class="menu-price">${menu[item]}.00</div>`;

    addInnerHTML(newItem, innerHTML);

    menuList.appendChild(newItem);
    flag++;
}



// Table and menu list items
const list = document.querySelectorAll('.menu-list-item');
const tableListItem = document.querySelectorAll(".table-list-item");



// Event listeners for menu list items
for(let menuItem of list){
    
    // Setting data as Food name and Food price
    menuItem.addEventListener("dragstart", (event) => {
        let desc = [event.target.firstElementChild, event.target.lastElementChild];
        event.dataTransfer.setData('text/plain', event.target.firstElementChild.innerText);
        event.dataTransfer.setData('text2', event.target.lastElementChild.innerText);
    })
}



// Event Listeners for table list items 
for(let table of tableListItem){
    let tableNo = table.childNodes[0].innerText.slice(6);

    table.addEventListener("dragover",(event) => {
        event.preventDefault();
    })


    // Get data from event and update the table and popUp of table
    table.addEventListener("drop",(event) => {
        
        let info = table.children[1];
        let foodName = event.dataTransfer.getData("text");
        let foodPrice = event.dataTransfer.getData('text2');

        tPrice[tableNo-1] += Number(foodPrice);
        tItems[tableNo-1] += 1;

        info.firstElementChild.innerText = tPrice[tableNo-1];
        info.lastElementChild.innerText = tItems[tableNo-1];

        let totalTable = document.querySelector(`#pop-up-table-${tableNo}`);
        let tableBody = document.querySelector(`#pop-up-table-${tableNo} tbody`);
        let total = document.getElementById(`total-${tableNo}`);
        let row = document.createElement('tr');

        let sNo = tableBody.children.length;
        // Check if the row exists
        let existingRow = foodNameNumber(tableBody, foodName);

        if(existingRow === undefined){

            let innerHTML = `<td>${sNo+1}.</td><td>${foodName}</td>
            <td>${foodPrice}</td><td><input type="number" name="Servings"
             value="1" onchange=changeValue(event)></td><td><button onclick="deleteItem(event)">
             <img src="images/icons8-delete-24.png" alt="Delete"></button></td>`;


            addInnerHTML(row, innerHTML);
            tableBody.appendChild(row);

        } else {

            let inputElement = existingRow.children[3].firstElementChild;
            let value = Number(inputElement.getAttribute('value'));
            inputElement.setAttribute('value', value+1);
        }

        updateTotal(total, tPrice[tableNo-1]);

    })    


    table.addEventListener("click", (event) => {
        
        let popUp = document.querySelector(`#pop-up-table-${tableNo}`);
        table.style.backgroundColor = "rgb(224, 182, 91)";
        changeDisplay(modal, "block");
        changeDisplay(popUp, "flex");
    })
}



} //Onload End



// Triggers when delete icon in the modal is clicked
function deleteItem(event){
    let id, currentRow,tableBody;
        
    id = event.path[6].getAttribute('id');
    currentRow = event.path[3];
    tableBody = event.path[4];

    let price = Number(currentRow.children[2].innerText);
    let noOfItems = Number(currentRow.children[3].firstElementChild.value);
    let totalPrice = price*noOfItems;
    let tableNo = id[id.length-1];
    let table = document.querySelector(`#table-${tableNo}`)
    let tablePrice = table.lastElementChild.children[0];
    let tableItems = table.lastElementChild.children[1];
    let total = document.getElementById(`total-${tableNo}`)
    

    // Remove the row and update values in the table
    tableBody.removeChild(currentRow);
    
    tablePrice.innerText = Number(tablePrice.innerText) - totalPrice;
    tPrice[tableNo-1] -= totalPrice;
    
    
    tableItems.innerText -= noOfItems;
    tItems[tableNo-1] -= noOfItems;
    
    updateTotal(total, tPrice[tableNo -1]);

    // Updating the serial numbers
    let count = 1;
    for( let row of tableBody.children){
        row.children[0].innerText = `${count}.`;
        count++; 
    }

}



// Triggers when the input value is changed
function changeValue(event){

    let id = event.path[5].getAttribute('id');
    let value = event.path[0].value; 
    let tableNo = id[id.length-1];
    let priceElement = Number(event.path[2].children[2].innerText);
    let tableElement = document.getElementById(`table-${tableNo}`);
    let tablePrice = tableElement.children[1].children[0];
    let tableItems = tableElement.children[1].children[1];
    let items = Number(tableItems.innerText);
    let price = Number(tablePrice.innerText);
    let total = document.getElementById(`total-${tableNo}`);
    
    if(Number(value) === 0) {
        event.path[3].removeChild(event.path[2]);
        tableItems.innerText = 0;
        price = 0;
    } else if(items > Number(value)){
        tableItems.innerText = items - 1; 
        price -= priceElement;
    } else {
        tableItems.innerText = items + 1;
        price += priceElement;
    }

    
    updateTotal(total, price);
    
    tablePrice.innerText = price;
    
    tPrice[tableNo-1] = Number(tablePrice.innerText);
    tItems[tableNo - 1] = Number(tableItems.innerText);
}



// Triggers when the cross button of modal is clicked
function closePopUp(event){
    let id;
    if(event.path.length === 8){
        changeDisplay(event.path[2], "none");
        id = event.path[2].getAttribute('id');
        
    } else {
        changeDisplay(event.path[3], "none");
        id = event.path[3].getAttribute('id');
    }
    changeDisplay(modal, "none");
    document.getElementById(`table-${id[id.length-1]}`).style.backgroundColor = 'white';
}



// Triggers when generate bill is clicked
function endSession(event){
    let popUp = event.path[2];
    let popUpId = popUp.getAttribute('id');
    let tableNo = popUpId[popUpId.length - 1];
    let table = document.getElementById(`table-${tableNo}`)
    let tablePrice = table.lastElementChild.children[0];
    let tableItems =  table.lastElementChild.children[1];
    let newElement = document.createElement('div');

    let innerHTML = `Total Bill: Rs.${tablePrice.innerText}.00`;

    addInnerHTML(newElement, innerHTML);
    newElement.setAttribute('class', `final-bill`);
    
    popUp.children[1].children[1].innerHTML = '';
    popUp.children[2].innerText = 'Total: 0.00'

    changeDisplay(popUp.children[1], 'none');
    changeDisplay(popUp.children[2], 'none');
    changeDisplay(popUp.lastElementChild, 'none');
    
    popUp.appendChild(newElement);

    // Display the bill for 10 seconds and reset
    setTimeout(() => {
    popUp.removeChild(popUp.lastElementChild);
    
    changeDisplay(popUp.children[1], 'inline-block');
    changeDisplay(popUp.children[2], 'block');
    changeDisplay(popUp.lastElementChild, 'block');

    },10000);

    tablePrice.innerText = 0;
    tableItems.innerText = 0;

    tPrice[tableNo-1] = 0;
    tItems[tableNo-1] = 0;
    
}



// Used for searching, checks if the given text exists in the list
function checkInput(inputText, elementList){
    for(let element of elementList){

        let currentElement = element.firstElementChild.innerText.toUpperCase();

        if(!(currentElement.includes(inputText)))
            changeDisplay(element, "none");
        else
            changeDisplay(element, "block");
    }
}



// Table search
function tableSearch(event){

    let inputText  = event.target.value.toUpperCase();
    let tableList = document.querySelectorAll(".table-list-item");

    checkInput(inputText, tableList);

}



// Menu item search
function menuSearch(event){
    
    let inputText = event.target.value.toUpperCase();
    let menuItems = document.querySelectorAll(".menu-list-item");

    checkInput(inputText, menuItems);
    
}

