"use strict";

let cart = [];

function addToCart(coffeeId, buttonElement) {
    const sizeSelect = buttonElement.previousElementSibling; // Get the select element
    const size = sizeSelect.options[sizeSelect.selectedIndex].text;
    const price = parseInt(sizeSelect.value, 10);
    const coffee = coffees.find(coffee => coffee.id === coffeeId);

    const cartItem = {
        id: coffee.id,
        name: coffee.name,
        size: size,
        price: price
    };

    cart.push(cartItem);
    renderCartItems();
    updateCartTotal();
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear the cart list before re-rendering
    cart.forEach(item => {
        cartItemsContainer.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.name} - ${item.size}
                <span class="badge bg-danger rounded-pill">$${item.price}</span>
            </li>`;
    });
}

function updateCartTotal() {
    let total = 0;
    cart.forEach(item => total += item.price);
    document.getElementById('cart-total').textContent = 'Total: $' + total;
}

let coffees = loadCoffees();

function renderCoffee(coffee) {
    // Assign a class based on the roast type
    const roastClass = `card-${coffee.roast}`;

    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" data-id="${coffee.id}">
            <div class="card h-100 ${roastClass}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="card-title h5 mb-0">${coffee.name}</span>
                    <button type="button" class="btn-close" aria-label="Close" onclick="removeCoffee(${coffee.id})">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <p class="card-text">${coffee.roast}</p>
                    <select class="form-select coffee-size">
                        <option value="5">Small ($5)</option>
                        <option value="10">Medium ($10)</option>
                        <option value="15">Large ($15)</option>
                    </select>
                    <button type="button" class="btn btn-secondary mt-2" onclick="addToCart(${coffee.id}, this)">Add to Cart</button>
                </div>
            </div>
        </div>`;
}

function renderCoffees(coffees) {
    return coffees.map(coffee => renderCoffee(coffee)).join('');
}

function updateCoffees(e) {
    e.preventDefault();
    const selectedRoast = roastSelection.value;
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCoffees = coffees.filter(coffee => {
        return (coffee.roast === selectedRoast || selectedRoast === 'all') &&
            coffee.name.toLowerCase().includes(searchTerm);
    });
    coffeeContainer.innerHTML = renderCoffees(filteredCoffees);
}

function addCoffee(e) {
    e.preventDefault();
    const newName = newCoffeeNameInput.value.trim();
    const newRoast = newCoffeeRoastSelect.value;
    if(newName !== '') {
        const newCoffee = {
            id: coffees.length + 1,
            name: newName,
            roast: newRoast
        };
        coffees.push(newCoffee);
        coffeeContainer.innerHTML = renderCoffees(coffees);
        saveCoffees();
    } else {
        alert('Please enter a coffee name.');
    }
}

function removeCoffee(coffeeId) {
    const coffeeIndex = coffees.findIndex(coffee => coffee.id === coffeeId);
    if (coffeeIndex !== -1) {
        coffees.splice(coffeeIndex, 1);
        saveCoffees();
        coffeeContainer.innerHTML = renderCoffees(coffees);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    searchForm.addEventListener('submit', updateCoffees);
    searchInput.addEventListener('keyup', updateCoffees);
    roastSelection.addEventListener('change', updateCoffees);
    addCoffeeForm.addEventListener('submit', addCoffee);
});

// Page Initialization
const coffeeContainer = document.querySelector('#coffees');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search');
const roastSelection = document.querySelector('#roast-selection');
const addCoffeeForm = document.querySelector('#add-coffee-form');
const newCoffeeNameInput = document.querySelector('#new-coffee-name');
const newCoffeeRoastSelect = document.querySelector('#new-coffee-roast');

coffeeContainer.innerHTML = renderCoffees(coffees.sort((a, b) => a.id - b.id));

function saveCoffees() {
    localStorage.setItem('coffees', JSON.stringify(coffees));
}

function loadCoffees() {
    const savedCoffees = localStorage.getItem('coffees');
    return savedCoffees ? JSON.parse(savedCoffees) : [];
}
function removeAll() {
    coffees = [];

}

function removeAll() {
    // Clear the coffees array
    coffees = [];

    // Update the display
    coffeeContainer.innerHTML = '';

    // Remove the specific item from local storage
    localStorage.removeItem('coffees');

}

