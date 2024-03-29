//variables
let equipo = [];
const guardadoDeEquipo = [];
let contenedorPokedex = document.getElementById("contenedor-pokedex");
let URL = "https://pokeapi.co/api/v2/pokemon/";
let contenedorCreacionEquipo = document.getElementById("creacion-de-equipo");
let botonesHeader = document.querySelectorAll(".btn-header");
let guardarEquipo = document.getElementById("guardar-tu-equipo");
let mostrarEquipo = document.getElementById("mostrar-tu-equipo");
let eliminarEquipo = document.getElementById("eliminar-equipo");
let alerta = document.getElementById("alerta");
let backdrop = document.getElementById("backdrop");
let body = document.getElementById("body");
let modal = document.createElement("dialog");
let infoTiposEquipo = document.createElement("info-tipos-equipo")



//funciones
const renderizarPokemon = (poke) => {
  let parrafoDinamico = poke.types.map((type) => `<p class="${type.type.name} tipos">${type.type.name}</p>`);
  parrafoDinamico = parrafoDinamico.join("");
  let tipos = poke.types.map((type) => type.type.name);

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
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
    mostrarDialog(poke, parrafoDinamico, pokeId, tipos,);
  });
  contenedorPokedex.append(carta);
}

const mostrarDialog = (poke, parrafoDinamico, pokeId, tipos) => {
  modal.classList.add("modalInfo")
  modal.show();
  backdrop.classList.add("backdropVisible")
  modal.innerHTML = `
  <div class="modalImagen">
  <img src="${poke.sprites.front_default}" alt="${poke.name}">
</div>
<div class="stats">
  <span class="stats-arriba">
      <p class="ghost tipos">#${pokeId}</p>
      <label for="" class="ghost tipos">${poke.name}</label>
      ${parrafoDinamico}
  </span>
  <span class="stats-izquierda">
      <label for="">HP: ${poke.stats[0].base_stat}</label>
      <label for="">ATTACK: ${poke.stats[1].base_stat}</label>
      <label for="">DEFENSE: ${poke.stats[2].base_stat}</label>
  </span>
  <span class="stats-derecha">
      <label for="">SPEED: ${poke.stats[5].base_stat}</label>
      <label for="">SPECIAL-ATTACK: ${poke.stats[3].base_stat}</label>
      <label for="">SPECIAL-DEFENSE: ${poke.stats[4].base_stat}</label>
  </span>

  <span class="stats-abajo">
      <label for="">HEIGHT : ${poke.height} M</label>
      <label for="">WEIGHT : ${poke.weight} KG</label>
  </span>
 </div>
  `;
  body.append(modal);
  let botones = document.createElement("div");
  botones.classList.add("botones");
  modal.append(botones);
  let botonAgregar = document.createElement("button");
  botonAgregar.classList.add("psychic", "tipos");
  botonAgregar.textContent = "AGREGAR";
  botones.append(botonAgregar);
  botonAgregar.addEventListener("click", () => {
    creacionEquipo(poke, tipos, parrafoDinamico,);
    renderizadoEquipo()
    alertaAgregadoAlEquipo(poke.name, poke.sprites.front_default);
    verificacionTipos(equipo);
    modal.remove();
    backdrop.classList.remove("backdropVisible");
  });
  let botonCancelar = document.createElement("button");
  botonCancelar.classList.add("psychic", "tipos");
  botonCancelar.textContent = "CANCELAR";
  botones.append(botonCancelar);
  botonCancelar.addEventListener("click", () =>{
    modal.remove();
    backdrop.classList.remove("backdropVisible");
  });

  backdrop.addEventListener("click", () =>{
    modal.remove();
    backdrop.classList.remove("backdropVisible");
  });
};

const creacionEquipo = (poke, tipos, parrafoDinamico) => {
  if (equipo.length < 6) {
    const pokemonEquipo = {
      name: poke.name,
      tipos: tipos,
      imagen: poke.sprites.front_default,
      parrafoDinamico: parrafoDinamico,
    };
    equipo.push(pokemonEquipo);
  } else {
    console.log("No puedes agregar más Pokémon a tu equipo");
  }
};

const verificacionTipos = (equipo) => {
  const tiposEquipos = equipo.map(pokemon => pokemon.tipos).flat();
   const contador = {};
  tiposEquipos.forEach(tipo => {
    contador[tipo] = (contador[tipo] || 0) + 1;
  });
    
  // Object.values(contador).forEach(ocurrencias => {
  //   if (ocurrencias > 2) {
  //     alerta.classList.add("alertaVisible");
  //   }
  //   else{
  //     alerta.classList.remove("alertaVisible");
  //   }
  // });
  const tiposRepetidos = Object.values(contador).some(ocurrencias => ocurrencias > 2);

  // Agregar o quitar la clase de alerta según corresponda
  if (tiposRepetidos) {
    alerta.classList.add("alertaVisible");
  } else {
    alerta.classList.remove("alertaVisible");
  }
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

    let quitarDeEquipo = document.createElement("button");
    quitarDeEquipo.classList.add("quitarDeEquipo");
    cartaEquipo.append(quitarDeEquipo);
    quitarDeEquipo.addEventListener("click", () => {
    eliminarPokemon(pokemon);
    console.log("click")
    });
  });
};


const eliminarPokemon = (pokemon) => {
  let index = equipo.indexOf(pokemon);
  if (index !== -1) {
    equipo.splice(index, 1);
    verificacionTipos(equipo); // Verificar tipos después de eliminar un Pokémon
    renderizadoEquipo(); // Renderizar equipo actualizado después de eliminar el Pokémon
  }
};

const alertaAgregadoAlEquipo = (nombre, imagen) => {
  let nombreMayuscula = nombre.toUpperCase();
  Swal.fire({
    position: "top-end",
    heightAuto: "true",
    imageUrl: `${imagen}`,
    title: `${nombreMayuscula} SE AGREGO A TU EQUIPO`,
    showConfirmButton: false,
    timer: 1500
  });
};

//codigo pagina

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
        if (botonId === "ver-todos") {
          renderizarPokemon(data);
        } else {
          let filtrado = data.types.map(tipo => tipo.type.name);
          if (filtrado.some((filtrado) => filtrado.includes(botonId))) {
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

mostrarEquipo.addEventListener("click", () => {
  let recuperarEquipo = localStorage.getItem("guardadoDeEquipo");
  equipo.length = 0;
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
