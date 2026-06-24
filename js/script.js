let loot = [];
const STORAGE_KEY = "lootSplitterState";
let party = 1;


let lootTotal = 0;
let lootRows = document.getElementById("lootRows");
document.getElementById("splitLoot").disabled = true;

function submitLoot()
{
    let inputName = document.getElementById('lootName').value;
    let inputValue = Number(document.getElementById('lootValue').value);
    let inputQuant = Number(document.getElementById('lootQuant').value);

    //ensures inputs are valid (not nothing or for value, not 0 or negative)
    if (inputName === "") 
    {
        document.getElementById("validAdd").innerHTML = "Enter a name.";
        document.getElementById("validAdd").classList.remove("hidden");
        return;
    } else if (inputValue < 1) 
    {
        document.getElementById("validAdd").innerHTML = "Enter a positive number for value."
        document.getElementById("validAdd").classList.remove("hidden");
    } else if (inputQuant < 1)
    {
        document.getElementById("validAdd").innerHTML = "Enter a positive number for quantity."
        document.getElementById("validAdd").classList.remove("hidden");
    } else
    {
        document.getElementById("validAdd").classList.add("hidden");
        loot.push({ name: inputName, value: inputValue, quantity: inputQuant});
    }
    saveState();
    renderLoot();
}

//removes the element at the index and then calls render
function removeLoot(index)
{
    
    loot.splice(index, 1);
    saveState();
    renderLoot();
}

//checks if party is valid, then calls the render (technically it would make more sense for
//the changing of the inner HTML to be here instead of in renderLoot, but it's for the 
//splitting of state and truth I guess
function splitLoot() 
{
    //sets party to the current value of the html input, and checks if it's a valid number
    party = Number(document.getElementById('party').value);
    if (party < 1 || isNaN(party))
    {
        document.getElementById("validParty").innerHTML = "Party size needs to be at least 1.";
        document.getElementById("validParty").classList.remove("hidden");
        for (let el of document.getElementsByClassName("partyLoot")) {
            el.classList.add("hidden");
        }
    } else 
    {
        document.getElementById("validParty").classList.add("hidden");
        for (let el of document.getElementsByClassName("partyLoot")) {
            el.classList.remove("hidden");
        }
        saveState();
        renderLoot();
    }

    
}

function renderLoot()
{
    lootRows.innerHTML = "";
    lootTotal = 0;

    if (loot.length > 0)
    {
        document.getElementById("noLootMessage").classList.add("hidden");
    } else
    {
        document.getElementById("noLootMessage").classList.remove("hidden");
    }
    for (let i = 0; i < loot.length; i++) {

        let row = document.createElement("div");
        row.className = "loot-row";

        let nameCell = document.createElement("div");
        nameCell.className = "loot-cell";
        nameCell.innerText = loot[i].name;

        let valueCell = document.createElement("div");
        valueCell.className = "loot-cell";
        valueCell.innerText = loot[i].value.toFixed(2);

        let quantityCell = document.createElement("div");
        quantityCell.className = "loot-cell";
        quantityCell.innerText = loot[i].quantity;

        let actionCell = document.createElement("div");
        actionCell.className = "loot-cell loot-actions";

        let removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.addEventListener("click", function () {
            removeLoot(i);
        });

        actionCell.appendChild(removeBtn);

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(quantityCell);
        row.appendChild(actionCell);

        lootRows.appendChild(row);

        //totals up
        lootTotal += loot[i].value * loot[i].quantity;
    }
    
    document.getElementById("totalLoot").innerHTML = lootTotal.toFixed(2);
    


    if (party > 0 && !isNaN(party)) 
    {
        document.getElementById("perLoot").innerHTML = `For a party of ${party}: ${(lootTotal/party).toFixed(2)}`;
    }
    
    //disables the split loot button
    if (loot.length < 1 || isNaN(party))
    {
        document.getElementById("splitLoot").disabled = true;
    } else
    {
        document.getElementById("splitLoot").disabled = false;
    }

    
}

function saveState()
{
    const state = { loot: loot, party: party };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restoreState()
{
    try 
    {
        if (!localStorage.getItem(STORAGE_KEY)) return;
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));

        //check if the parsed object is an object and if stored loot is still an array
        if (typeof parsed !== 'object') return;
        if (!Array.isArray(parsed.loot)) return;
        if (typeof parsed.party !== 'number' || parsed.party < 1) return;

        //set party and loot
        party = parsed.party;
        document.querySelector("#party").value = party;

        parsed.loot.forEach((item) =>
        {
            if (item.name !== "" && item.value >= 0 &&
                typeof item.value === "number" && item.quantity >= 1 &&
            typeof item.quantity === "number") 
            {
                loot.push(item);
            }
        })


    } catch
    {
        loot = [];
        party = 1;
    }
}

function reset()
{
    loot = [];
    party = 1;
    document.querySelector("#party").value = 1;

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("perLoot").innerHTML = "";
    document.getElementById("totalLoot").innerHTML = "0.00";
    document.getElementById("splitLoot").disabled = true;
    renderLoot();
}

//button listeners
document.getElementById("submit").addEventListener("click", submitLoot);
document.getElementById("splitLoot").addEventListener("click", splitLoot);
document.getElementById("reset").addEventListener("click", reset);

//every change to "party" will call splitLoot
document.getElementById("party").addEventListener("input", () => splitLoot());
document.addEventListener("DOMContentLoaded", () => {restoreState(); renderLoot();})

// The state is saved by putting the loot array and party size (party) in a const state,
// Then saves that to the browser’s local storage with the localStorage.setItem line 
// under the STORAGE_KEY label.
// This saveState() is called whenever data is mutated (changed),
// so after loot is added to loot or party is changed.

// updateUI(), or renderLoot() in my case,
// needs to be called after restoration since resetting loot only changes the “truth”,
// it doesn’t change what you see. 

// JSON.stringify() changes a JavaScript object (in my case, state, storing loot and party)
// into a JSON string. This is necessary to save it into the browser,into localStorage.
// JSON.parse() does the opposite, taking the JSON string from localStorage and converts
// it back into a JavaScript object, necessary in restoring state.

// In the restoring state, I split it into two parts.
// Firstly, the validations. In first half of the try loop,
// it returns the catch (which sets loot to empty and party to 1) if any of the validations fail
// Then, after all the validations pass alright, 
//each valid item in localStorage’s loot gets pushed to the actual loot.

// The restoration process shows the course outcomes,
// as we call on local storage in the browser to restore using the variables,
// conditionals, and loops we learned during this class.


