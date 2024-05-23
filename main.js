import "./style.css";

const fetchData = async (param) => {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${param}`, {
    method: "GET",
  });
  return pokemon.json();
};

const createCard = (myPokemon, abilities, types) => {
  const main = document.getElementById("main");
  main.replaceChildren();
  main.insertAdjacentHTML(
    "beforeend",
    `
      <section id="card" class="card">
        <h2 class="card__title">${myPokemon.name}</h2>
        <div class="card__info">
          <img src="${myPokemon.sprites.front_default}" alt="" class="card__img">
          <span>Altura: ${myPokemon.height}</span>
          <div class="card__attributes">
            <div class="main-attribs">
              <h4>Habilidades:</h4>
              <ul class="card__abilities">
    |           ${abilities}
              </ul>
            </div>
            <div class="main-attribs">
              <h4>Tipos:</h4>
              <br>
              <ul class="card__abilities">
    |           ${types}
              </ul>
            </div>
           
          </div>
        </div>
      </section>
      `
  );
};

const getPokemon = async (randomPokemon = null) => {
  const pokemonToGet = document.getElementById("inputPokemon").value;
  let myPokemon;
  try {
    if (randomPokemon) myPokemon = await fetchData(randomPokemon);
    else if (pokemonToGet) myPokemon = await fetchData(pokemonToGet);
    else {
      alert("Pokemon no encontrado");
      return;
    }
    return myPokemon;
  } catch {
    alert("Ha ocurrido un error, intenta de nuevo.");
  }
};

const getAbilities = (myPokemon) => {
  let abilities = "";
  myPokemon.abilities.forEach((ability) => {
    abilities += `<li>${ability.ability.name}</li>`;
  });
  return abilities;
};

const getTypes = (myPokemon) => {
  let types = "";
  const typesList = myPokemon.types.forEach((type) => {
    types += `<li>${type.type.name}</li>`;
  });
  return types;
};

const getMoves = (myPokemon) => {
  let moves = "";
  myPokemon.moves.forEach((move) => {
    moves += `<li>${move.move.name}</li>`;
  });
  return moves;
};

const setPopoverInfo = (myPokemon) => {
  const moves = getMoves(myPokemon);
  const popoverInfo = document.getElementById("info");
  popoverInfo.replaceChildren();
  popoverInfo.insertAdjacentHTML(
    "beforeend",
    `
    <h3>${myPokemon.name}</h3>
    <p>Experiencia base: ${myPokemon.base_experience}</p>
    <p>Peso: ${myPokemon.weight}</p>
    <p>Orden: ${myPokemon.order}</p>

    <h4>Stats:</h4>
    <ul>
      <li>Velocidad: ${myPokemon.stats[0].base_stat}</li>
      <li>Defensa especial: ${myPokemon.stats[1].base_stat}</li>
      <li>Ataque especial: ${myPokemon.stats[2].base_stat}</li>
      <li>Defensa: ${myPokemon.stats[3].base_stat}</li>
      <li>Ataque: ${myPokemon.stats[4].base_stat}</li>
      <li>HP: ${myPokemon.stats[5].base_stat}</li>
    </ul>
    <h4>Movimientos:</h4>
    <ul>
      ${moves}
    </ul>
    `
  );
};

const deleteRow = (deleteButtons) => {
  deleteButtons?.forEach((button) => {
    button.addEventListener("click", ({ target }) => {
      target.parentElement.parentElement.remove();
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector("#pokemon");
  const randomSearch = document.getElementById("random");
  const moreInfo = document.getElementById("moreInfo");
  const addToTableButton = document.getElementById("addToTable");
  const table = document.getElementById("table");
  let deleteButtons;
  let auxPokemon;
  searchButton?.addEventListener("click", async () => {
    const myPokemon = await getPokemon();
    console.log(myPokemon);
    createCard(myPokemon, getAbilities(myPokemon), getTypes(myPokemon));
    moreInfo.classList.remove("d-none");
    addToTableButton.classList.remove("d-none");
    table.classList.remove("d-none");
    moreInfo.dataset.id = myPokemon.id;
    auxPokemon = structuredClone(myPokemon);
  });

  randomSearch?.addEventListener("click", async () => {
    const randomPokemon = Math.floor(Math.random() * 150) + 1;
    const myPokemon = await getPokemon(randomPokemon);
    createCard(myPokemon, getAbilities(myPokemon), getTypes(myPokemon));
    moreInfo.classList.remove("d-none");
    addToTableButton.classList.remove("d-none");
    table.classList.remove("d-none");
    moreInfo.dataset.id = myPokemon.id;
    auxPokemon = structuredClone(myPokemon);
  });

  moreInfo?.addEventListener("click", async ({ target }) => {
    console.log(auxPokemon);
    setPopoverInfo(auxPokemon);
  });

  addToTableButton?.addEventListener("click", async () => {
    const myPokemon = auxPokemon;
    let exist = false;
    const rows = document.querySelectorAll("tr");
    if (rows.length <= 6) {
      rows.forEach((row) => {
        if (row.id !== myPokemon.id.toString()) {
          return true;
        } else {
          alert("Este pokemon ya ha sido agregado a la tabla.");
          exist = true;
        }
      });
      if (!exist) {
        const row = document.createElement("tr");
        row.setAttribute("id", myPokemon.id);
        row.innerHTML = `
          <td>${myPokemon.name}</td>
          <td>${myPokemon.height}</td>
          <td>${myPokemon.weight}</td>
          <td>${myPokemon.base_experience}</td>
          <td>${getTypes(myPokemon)}</td>
          <td>${getAbilities(myPokemon)}</td>
          <td><img src="${myPokemon.sprites.front_default}" alt="sprite"></td>
          <td><button class="deleteRow">Eliminar</button></td>
        `;
        table.appendChild(row);
        deleteButtons = document.querySelectorAll(".deleteRow");
        deleteRow(deleteButtons);
      }
    } else {
      alert("No puedes agregar más de 5 pokemones a la tabla");
      return;
    }
  });
});
