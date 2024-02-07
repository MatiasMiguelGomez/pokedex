//variables
const equipo = [];
const guardadoDeEquipo = [];
let contenedorPokedex = document.getElementById("contenedor-pokedex");
let URL = "https://pokeapi.co/api/v2/pokemon/";
let contenedorCreacionEquipo = document.getElementById("creacion-de-equipo");
let botonesHeader = document.querySelectorAll(".btn-header");
let guardarEquipo= document.getElementById("guardar-tu-equipo");
let mostrarEquipo= document.getElementById("mostrar-tu-equipo");
let eliminarEquipo= document.getElementById("eliminar-equipo");
let alerta = document.getElementById("alerta");

//funciones
const renderizarPokemon = (poke) => {
  let parrafoDinamico = poke.types.map((type) => `<p class="${type.type.name} tipos">${type.type.name}</p>`);
  parrafoDinamico = parrafoDinamico.join("");
  let tipos = poke.types.map((type) => type.type.name);

  let pokeId = poke.id.toString();
  if(pokeId.length === 1){
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2){
    pokeId = "0"+ pokeId;
  }

  let carta = document.createElement("div");
  carta.classList.add("carta-pokedex");
  carta.innerHTML = `
    <p class="id-fondo-pokedex">#${pokeId}</p>
    <div class="container-imagen-pokedex">
       <img src=${poke.sprites.front_default} alt="${poke.name}">
    </div>
    <div class="info-pokedex">
      <div class="container-info-pokedex">
       <p class="id-pokedex">#${pokeId}</p>
       <p class="nombre-pokedex">${poke.name}</p>
      </div>
      <div class="container-types-pokedex">
        ${parrafoDinamico}
      </div>
    </div>
  `;
  
  carta.addEventListener("click", () => {
    creacionEquipo(poke, tipos, parrafoDinamico);
    renderizadoEquipo()
    alertaAgregadoAlEquipo(poke.name, poke.sprites.front_default);
    verificacionTipos(equipo);
  });
  contenedorPokedex.append(carta);
}

const creacionEquipo = (poke, tipos, parrafoDinamico) => {
  if (equipo.length < 6) {
    const pokemonEquipo = {
      name: poke.name,
      tipos: tipos,
      imagen: poke.sprites.front_default,
      parrafoDinamico: parrafoDinamico,
    };
    equipo.push(pokemonEquipo);
    console.log(pokemonEquipo);
  } else {
    console.log("No puedes agregar más Pokémon a tu equipo");
  }
};

const verificacionTipos = (equipo) => {
  const tiposEquipos = equipo.map(pokemon => pokemon.tipos).flat();
  console.log(tiposEquipos);
  const contador = {};
  tiposEquipos.forEach(tipo => {
  contador[tipo] = (contador[tipo] || 0) + 1;
});

let tieneTiposRepetidos = false;
Object.values(contador).forEach(ocurrencias => {
  if (ocurrencias > 2) {
    tieneTiposRepetidos = true;
  }
});

if (tieneTiposRepetidos) {
  alerta.classList.add("alertaVisible");
}

  console.log(contador);
}

const renderizadoEquipo = () => {
  contenedorCreacionEquipo.innerHTML = "";
  equipo.forEach(pokemon => {
    let cartaEquipo = document.createElement("div");
    cartaEquipo.classList.add("cartas-de-equipo");
    cartaEquipo.innerHTML = `
    <img src=${pokemon.imagen} alt="${pokemon.name}" class="imagen-equipo-pokemon">
    <p class="equipo-nombre-pokemon">${pokemon.name}</p>
    ${pokemon.parrafoDinamico}
    `;
    contenedorCreacionEquipo.append(cartaEquipo);
  });
};

const alertaAgregadoAlEquipo = (nombre, imagen) =>{
  let nombreMayuscula = nombre.toUpperCase();
  Swal.fire({
    position: "top-end",
    heightAuto:"true",
    imageUrl:`${imagen}`,
    title:`${nombreMayuscula} SE AGREGO A TU EQUIPO`,
    showConfirmButton: false,
    timer: 1500
  });
};


for (let i = 1; i <= 151; i++) {
  fetch(URL + i)
    .then((response) => response.json())
    .then(data => renderizarPokemon(data))
    .catch((error) => console.error(error));
}

botonesHeader.forEach(boton => boton.addEventListener("click", (Event) => {
  const botonId = Event.currentTarget.id;

  contenedorPokedex.innerHTML = "";
  
  for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
      .then((response) => response.json())
      .then(data => {
        if(botonId === "ver-todos"){
          renderizarPokemon(data);
        }else{
          let filtrado = data.types.map(tipo => tipo.type.name);
          if(filtrado.some((filtrado) => filtrado.includes(botonId))){
            renderizarPokemon(data);
          }
        }
      })
      .catch((error) => console.error(error));
  }
}));

guardarEquipo.addEventListener("click", () => {
   let guardadoDeEquipo = localStorage.setItem("guardadoDeEquipo", JSON.stringify(equipo));
   Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Se guardo tu equipo correctamente",
    showConfirmButton: false,
    timer: 1500
  });
})

mostrarEquipo.addEventListener("click", () =>{
  let recuperarEquipo = localStorage.getItem("guardadoDeEquipo");
  equipo.length=0;
  renderizadoEquipo(JSON.parse(recuperarEquipo));
  equipo.push(...JSON.parse(recuperarEquipo));
  renderizadoEquipo()
})


eliminarEquipo.addEventListener("click", () => {
  localStorage.clear();
  equipo.length = 0;
  renderizadoEquipo();
  alerta.classList.remove("alertaVisible");
  Swal.fire({
    position: "top-end",
    icon: "error",
    title: "Ya no tienes mas equipo",
    showConfirmButton: false,
    timer: 1500
  });
})

/*
1)la api carga los elementos de manera desordenada si se recarga varias veces la pagina, no se como solucionar eso.
2)intente tambien hacer un archivo js unico para variables y aplicarles el export y otro para funciones pero al importarlos en main.js
algunas variables aparecian como que no las estaba usando en el documento y viceversa, que algunas funciones no las estaba usando en el documento
quizas es el orden en que son declaradas y llamadas? le di varias vueltas pero al final no lo pude resolver tampoco.
3)Para la verificacion tuve que usar Object.keys, que tengo entendido que es programacion orientada a objetos, no es el resultadomas optimo
por que no compara cuando tiene un unico tipo, compara si tiene 2 pero voy a seguir investigando sobre la programacion otientada a objetos
*/