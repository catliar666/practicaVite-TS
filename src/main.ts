import { Convert, Activity } from "./utils/activity";

const baseEndpoint = 'http://bored.api.lewagon.com/api/activity';
const endpointImagenes = 'https://api.pexels.com/v1/search?query=';
const apiKey = 'OgAtblPfmaO5T2a5FqJfkL4dXjbfX7LpAohSgKNhRBy4SMyhlHbjVSRz';
const tarjeta = document.getElementById("informacion");
const botonAleatorio = document.getElementById("traerInfo");
const botonTipos = document.getElementById("traerInfoTipo");
const botonParticipante = document.getElementById("traerInfoParticipante");

async function peticion(tipoPeticion: string) {
    try {
        let endpoint = baseEndpoint;
        if (tipoPeticion === 'tipos') {
            endpoint += '?type=recreational';
        } else if (tipoPeticion === 'participante') {
            endpoint += '?participants=1';
        }
        
        const respuesta = await fetch(endpoint);
        const data = await respuesta.json();
        console.log(data);
        let actividad: Activity = data;

        const urlImagen = await peticionImagenes(actividad.activity);
        console.log(urlImagen);

        if (tarjeta != null && urlImagen) {
            tarjeta.innerHTML = `
            <div class="card">
                <div class="image">
                    <img src="${urlImagen}" alt="${actividad.activity}" />
                </div>
                <div class="content">
                    <a href="${actividad.link}">
                        <span class="title">${actividad.activity}</span>
                    </a>
                    <p class="desc">
                        Tipo de actividad: ${actividad.type} 
                        </p>
                        <p class="desc">
                        Número de participantes: ${actividad.participants}
                        </p>
                        <p class="desc">
                        Nivel accesibilidad: ${actividad.accessibility}
                        </p>
                        <p class="desc">
                        Llave: ${actividad.key}
                        </p>
                        <p class="desc">
                        Link: ${actividad.link}
                        </p>
                    
                    <a class="action" href="#">
                        Precio: ${actividad.price}
                        <span aria-hidden="true">€</span>
                    </a>
                </div>
            </div>`;
        } else {
            console.error('No se pudo cargar la imagen.');
        }
    } catch (error) {
        console.log('Error en la solicitud:', error);
    }
}


async function peticionImagenes(activity: string): Promise<string | undefined> {
    try {
        const respuesta = await fetch(endpointImagenes + activity, {
            headers: {
                Authorization: apiKey
            }
        });
        const data = await respuesta.json();
        
        if (data.photos && data.photos.length > 0) {
            console.log(data.photos[0].src.original);
            return data.photos[0].src.original;
        } else {
            console.error('No se encontraron fotos para la actividad.');
            return undefined;
        }
    } catch (error) {
        console.error('Error en la solicitud de imágenes:', error);
        return undefined;
    }
}

if (botonAleatorio != null) {
    botonAleatorio.addEventListener("click", () => peticion('aleatorio'));
}

if (botonTipos != null) {
    botonTipos.addEventListener("click", () => peticion('tipos'));
}

if (botonParticipante != null) {
    botonParticipante.addEventListener("click", () => peticion('participante'));
}
