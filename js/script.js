const loot = [];
let party;
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
   
    renderLoot();
}

//removes the element at the index and then calls render
function removeLoot(index)
{
    
    loot.splice(index, 1);
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
        document.getElementById("validParty").classList.add("hidden");
        for (let el of document.getElementsByClassName("partyLoot")) {
            el.classList.remove("hidden");
        }
    } else 
    {
        document.getElementById("validParty").classList.add("hidden");
        for (let el of document.getElementsByClassName("partyLoot")) {
            el.classList.add("hidden");
        }
    }

    if (party)

    renderLoot();
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

//button listeners
document.getElementById("submit").addEventListener("click", submitLoot);
document.getElementById("splitLoot").addEventListener("click", splitLoot);
document.getElementById("party").addEventListener("input", () => splitLoot());
