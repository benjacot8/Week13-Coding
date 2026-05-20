// Old JS code from Week 12 project. Below is Week 13 conversion to Vite:

// Import Bootstrap:
import "bootstrap/dist/css/bootstrap.min.css";
// Import CSS:
import "./style.css";

// API endpoint---location of database
const API_URL = "http://127.0.0.1:3000/shoppingList";

const shoppingForm = document.getElementById("shoppingForm");
const itemInput = document.getElementById("itemInput");
const quantityInput = document.getElementById("quantityInput");
const shoppingList = document.getElementById("shoppingList");

// READ....this function fetches the items from the API and displays them on the page
async function fetchItems() {
  // Sends a GET request to the server and retrieves items from db.json
  const response = await fetch(API_URL);
  const items = await response.json();

  shoppingList.innerHTML = "";

  // Displays items on the page by creating list items for each item in the shopping list and appending them to the unordered list in the HTML
  
  // Goes through every item in the items array one at a time
  items.forEach((item) => {
    // creates a new HTML list element
    const li = document.createElement("li");
    li.className = "list-group-item";

    li.innerHTML = `
      ${item.item} - Quantity: ${item.quantity}

      <button onclick="updateItem('${item.id}', '${item.item}', '${item.quantity}')">
        Edit
      </button>

      <button onclick="deleteItem('${item.id}')">
        Delete
      </button>
    `;

    shoppingList.appendChild(li);
  });
}

// CREATE....this function adds a new item to the shopping list
shoppingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newItem = {
    item: itemInput.value,
    quantity: quantityInput.value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newItem)
  });

  itemInput.value = "";
  quantityInput.value = "";

  fetchItems();
});

// DELETE...this function deletes items from shopping list
async function deleteItem(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  fetchItems();
}

// Initial load
fetchItems();

// UPDATE...this function updates the quantity of an item in the shopping list
async function updateItem(id, currentItem, currentQuantity) {

  const newQuantity = prompt(
    `Enter new quantity for ${currentItem}:`,
    currentQuantity
  );

  if (newQuantity === null) return;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      item: currentItem,
      quantity: newQuantity
    })
  });

  fetchItems();
}

// Reconnecting edit and delete buttons:
(window as any).deleteItem = deleteItem;
(window as any).updateItem = updateItem;