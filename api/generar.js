import axios from "axios";

// Función para generar HTML a partir de los datos
function generarHTML(codigo, datos) {
  // Dirección completa
  const direccion = `${datos.Calle || ''} ${datos.Altura || ''} ${datos.Piso ? 'Piso ' + datos.Piso : ''} ${datos.Unidad ? 'Unidad ' + datos.Unidad : ''}`.trim();
  
  // Precio
  const precio = datos.Importe ? `${datos.Moneda || ''}${datos.Importe}` : 'Consultar';

  // Lista de imágenes grandes
  const imagenesHTML = (datos.fotos && datos.fotos.length) 
    ? datos.fotos.map(img => `<li><img src="${img.url}"></li>`).join('') 
    : '<li><img src="default.jpg"></li>';

  // Mapa con coordenadas
  const mapaURL = datos.Latitud && datos.Longitud 
    ? `https://www.google.com/maps?q=${datos.Latitud},${datos.Longitud}&hl=es;z=14&output=embed` 
    : 'https://www.google.com/maps';

  // Videos
  const videosHTML = (datos.videos && datos.videos.length) 
    ? datos.videos.map(v => `<a href="${v.url}" target="_blank">Ver Video</a>`).join('<br/>') 
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>${datos.TipoPropiedad || 'Propiedad'}</title>
    <link rel='shortcut icon' type='image/x-icon' href='../favicon.ico' />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="../css/materialize.min.css" media="screen,projection"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="../js/scripts.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700" rel="stylesheet"/>
    <meta property="og:url" content="http://aberpropiedades.com.ar/fichas/${codigo}.php" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${datos.TipoPropiedad || 'Propiedad'}" />
    <meta property="og:description" content="${datos.Destacable || ''}" />
    <meta property="og:image" content="${datos.fotos && datos.fotos[0] ? datos.fotos[0].url : 'default.jpg'}" />
    </head>

    <body>
    <script type="text/javascript">loadheaderFichas();</script>

    <div class="container padding">
      <div class="row col m12 full">
        <div class="row card padding">
          <div id="datosFicha" class="col m6">
            <table class="tablaDatos">
              <tbody>
                <tr><td><i class="material-icons blue-grey-text iconos">home</i></td><td><h5>${datos.TipoPropiedad || ''} - ${datos.SubtipoPropiedad || ''}</h5></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">place</i></td><td><h6>${direccion}</h6></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">attach_money</i></td><td><h6>${precio}</h6></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">crop_free</i></td><td><h6>${datos.SupTot ? datos.SupTot + ' ' + (datos.UnidadMedida || 'm2') : ''}</h6></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">map</i></td><td><h6>${datos.Ubicacion || ''}</h6></td></tr>
              </tbody>
            </table>
            <div class="col m12 full">&nbsp;</div>
          </div>

          <div class="col m6 blue-grey lighten-4 bordes padding full">
            <div id="galeria" class="galeria" style="padding-bottom: 10px;">
              <div class="slider col m12 fotoficha">
                <ul class="slides fotofichaslide">
                  ${imagenesHTML}
                </ul>
              </div>
            </div>
          </div>

          <div id="destacable" class="col m12 full">
            <h6 class="blue-text">Descripción: </h6>
            ${datos.Destacable || ''}
          </div>

          <div class="col m12 full" id="mapa">
            <iframe src="${mapaURL}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>

          ${videosHTML ? `<div class="col m12 full"><h6 class="blue-text">Videos:</h6>${videosHTML}</div>` : ''}

        </div>
      </div>
    </div>

    <script type="text/javascript">loadfooterFichas();</script>
    <script type="text/javascript" src="../js/materialize.min.js"></script>
    </body>
    </html>
`;
}


// Handler del endpoint
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido, usá GET" });
  }

  const { codigo } = req.query; 
  if (!codigo) {
    return res.status(400).json({ error: "Falta el parámetro 'codigo'" });
  }

  try {
    // Hacer GET al endpoint que devuelve JSON
    const url = `https://apmovil.som.com.ar/BusquedaServiceV2.aspx?token=GUID&codigoInmobiliaria=SOM&codigoSucursal=00&Id=${codigo}`;
    const response = await axios.get(url);

    const datosJSON = response.data;

    const datos = {
      destacable: datosJSON.Destacable,
      titulo: datosJSON.titulo || "Título no disponible",
      direccion: datosJSON.direccion || "Dirección no disponible",
      ubicacion: datosJSON.ubicacion || "Ubicación no disponible",
      superficie: datosJSON.superficie || "",
      operacion: datosJSON.operacion || "",
      descripcion: datosJSON.descripcion || "",
      imagenes: Array.isArray(datosJSON.imagenes) && datosJSON.imagenes.length ? datosJSON.imagenes : ["default.jpg"],
      mapa: datosJSON.mapa || "https://www.google.com/maps"
    };


    // Generamos el HTML usando la función externa
    const html = generarHTML(codigo, datos);

/*res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="ficha-${codigo}.php"`);
    res.status(200).send(phpTemplate);*/

    // Enviamos como HTML al navegador
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json({ contenido: html });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar la ficha" });
  }
}
