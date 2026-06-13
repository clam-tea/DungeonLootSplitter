const loot = [];
let party;
let lootTotal = 0;

function submitLoot()
{
    let inputName = document.getElementById('lootName').value;
    let inputValue = Number(document.getElementById('lootValue').value);

    //ensures inputs are valid (not nothing or for value, not 0 or negative)
    if (inputName === "") 
    {
        document.getElementById("validAdd").innerHTML = "Enter a name.";
        return;
    } else 
    {
        document.getElementById("validAdd").innerHTML = "";
    }

    if (inputValue < 1) 
    {
        document.getElementById("validAdd").innerHTML = "Enter a positive number."
        return;
    } else 
    {
        document.getElementById("validAdd").innerHTML = "";
    }
   
    loot.push({ name: inputName, value: inputValue });

    renderLoot();
}

//removes the element at the index and then calls render
function remove(index)
{
    
    loot.splice(index, 1);
    renderLoot();
    
}

//checks if party is valid, then calls the render (technically it would make more sense for
//the changing of the inner HTML to be here instead of in renderLoot, but it's for the 
//splitting of state and truth I guess
function splitLoot() 
{
    party = Number(document.getElementById('party').value);
    if (party < 1 || isNaN(party))
    {
        document.getElementById("validParty").innerHTML = "Party size needs to be at least 1."
    } else 
    {
        document.getElementById("validParty").innerHTML = "";
    }

    renderLoot();
}

function renderLoot()
{
    let lootOutput = "";
    lootTotal = 0;

    //adds all the loot elements as <li> elements in the innerHTML of <ul>, along with calculating total value
    for (let i = 0; i < loot.length; i ++) 
    {
        lootOutput += `<li>${loot[i].name} - ${loot[i].value} <button class="remove" id="remove${i}">Remove</button></li>`;
        lootTotal += loot[i].value;
    }

    if (loot.length > 0) {
        document.getElementById('lootList').innerHTML = lootOutput;
    } else
    {
        document.getElementById('lootList').innerHTML = "<li>Add loot first.</li>";
    }
    document.getElementById('totalLoot').innerHTML = lootTotal;

    if (party > 0 && !isNaN(party)) 
    {
        document.getElementById("perLoot").innerHTML = `For a party of ${party}: ${limitDecimals(lootTotal/party)}`;
    }
    

    // attach remove button listeners
    document.querySelectorAll(".remove").forEach((btn, index) => {
    btn.addEventListener("click", () => remove(index));
    });

    
}

//button listeners
document.getElementById("submit").addEventListener("click", submitLoot);
document.getElementById("splitLoot").addEventListener("click", splitLoot);

//utility, just to make numbers show the least amount of decimals (up to two decimals)
function limitDecimals(num) 
{
    return parseFloat(num.toFixed(2));
}