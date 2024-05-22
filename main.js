import "./style.css";
const fetchData = async (pokemonToGet) => {
  const pokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonToGet}`,
    {
      method: "GET",
    }
  );
  return pokemon.json();
};

const createCard = (myPokemon, abilities, types) => {
  main.insertAdjacentHTML("beforeend",
      `
      <section id="card" class="card">
        <h2 class="card__title">${myPokemon.name}</h2>
        <div class="card__info">
          <img src="${myPokemon.sprites.front_default}" alt="" class="card__img">
          <span>Altura: ${myPokemon.height}</span>
          <h4>Habilidades:</h4>
          <ul class="card__abilities">
|           ${abilities}
          </ul>
          <h4>Tipos:</h4>
          <ul class="card__abilities">
|           ${types}
          </ul>
        </div>
      </section>
      `
    )
  
}

// const getAbilities = (abilities) => {
//   const abilitiesList = abilities.forEach(ability => {
//     abilities +=`<li>${ability.ability.name}</li>`;
//   })
// }

document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main");
  const button = document.querySelector("#pokemon");
  const card = document.getElementById("card");
  const randButton = document.getElementById("random");

  button?.addEventListener("click", async () => {
    const pokemonToGet = document.getElementById("inputPokemon").value;
    const myPokemon = await fetchData(pokemonToGet);
    const pokeAbilities = myPokemon.abilities;
    console.log(myPokemon);
    let abilities ="";
    let types ="";
    pokeAbilities.forEach(ability => {
      abilities +=`<li>${ability.ability.name}</li>`;
    })
    myPokemon.types.forEach(type => {
      console.log(type.type.name);
      types +=`<li>${type.type.name}</li>`;
    })

    createCard(myPokemon, abilities, types);
  });

  randButton?.addEventListener("click", async () => {
    const randomPokemon = Math.floor(Math.random() * 150) + 1;
    const myPokemon = await fetchData(randomPokemon);
    console.log(myPokemon);
  });
});
