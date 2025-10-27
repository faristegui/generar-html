import axios from "axios";

// Función para generar HTML a partir de los datos
function generarHTML(codigo, datos) {
  // Dirección completa
  const direccion = `${datos.Calle || ''} ${datos.Altura || ''} ${datos.Piso ? 'Piso ' + datos.Piso : ''} ${datos.Unidad ? 'Unidad ' + datos.Unidad : ''}`.trim();
  
  // Precio
  const precio = datos.Importe 
  ? `${datos.TipoOperacion || ''} ${datos.Moneda || ''}${datos.Importe}` 
  : 'Consultar';

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

    const atributosHTML = datos.Atributos
  ? datos.Atributos
      .split(';') // separa por ;
      .filter(item => item.trim() !== '') // descartamos strings vacíos
      .map(item => {
        const [clave, valor] = item.split(':');
        return `<li>${clave.trim()}: <b>${valor ? valor.trim() : ''}</b></li>`;
      })
      .join('')
  : '';

  var destacable = datos.Destacable.replace(/\r\n\r\n/g, '<br>');

  return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Aber Propiedades</title>
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
    <meta property="og:description" content="" />
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
                <tr><td><i class="material-icons blue-grey-text iconos">home</i></td><td><h5>${datos.TipoPropiedad.toUpperCase() || ''} - ${datos.SubtipoPropiedad.toUpperCase() || ''}</h5></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">place</i></td><td><h6>${direccion} - Entre calles: ${datos.Referencia}</h6></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">home</i></td><td><h6>${datos.Ubicacion || ''}</h6></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">crop_free</i></td><td><h6>Superficie cubierta propia: ${datos.SubCub ? datos.SubCub + ' ' + (datos.UnidadMedida || 'm2') : ''}<br>Superficie total uso propio UF: ${datos.SupTot ? datos.SupTot + ' ' + (datos.UnidadMedida || 'm2') : ''}</h6></td></tr>
                <tr><td><i class="material-icons blue-grey-text iconos">attach_money</i></td><td><h6>${precio}${precio}</h6></td></tr>

              </tbody>
            </table>
            <div class="col m12 full">&nbsp;</div>
          </div>

          <div class="col m6 blue-grey lighten-4 bordes padding full">
            <div id="galeria" class="galeria" style="padding-bottom: 10px;">
            <script type="text/javascript">cargarFicha();</script>
              <div class="slider col m12 fotoficha">
                <ul class="slides fotofichaslide">
                  ${imagenesHTML}
                </ul>
              </div>
            </div>
          </div>

          <div id="destacable" class="col m12 full">
            <h6 class="blue-text">Descripción: </h6>
            ${destacable || ''}
          </div>

        <div class="col m12 full" id="atributosFicha">
          <h6 class="blue-text">Características generales: </h6>
          <ul class="atributos">
            ${atributosHTML}
          </ul>
        </div>


          <div class="col m12 full" id="mapa">
            <iframe src="${mapaURL}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>

          <div class="col m12 full center">
            <h6 class="blue-text">Compartir: </h6>
            <a class="share btn blue-grey darken-4" href='https://api.whatsapp.com/send?text=http://aberpropiedades.com.ar/fichas/${codigo}.php' target='_blank'>
              <img class='iconocontacto' src='../img/whatsapp.png'>Compartir
            </a>&nbsp;
            <a class="share btn blue-grey darken-4" href='https://www.facebook.com/sharer/sharer.php?u=http://aberpropiedades.com.ar/fichas/${codigo}.php' target='_blank'>
              <img class='iconocontacto' src='../img/facebook.png'>Compartir
            </a>&nbsp;
            <a class="share btn blue-grey darken-4" href='https://twitter.com/intent/tweet?text=http://aberpropiedades.com.ar/fichas/${codigo}.php' target='_blank'>
              <img class='iconocontacto' src='../img/twitter.png'>Compartir
            </a>&nbsp;
            <a class="share btn blue-grey darken-4" href="mailto:?body=http://aberpropiedades.com.ar/fichas/${codigo}.php">
              <i class="material-icons left">email</i>Compartir
            </a>
          </div>


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

    const datosJSON = response.data


    // Generamos el HTML usando la función externa
    const html = generarHTML(codigo, datosJSON);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="ficha-${codigo}.php"`);
    res.status(200).send(html);

    // Enviamos como HTML al navegador
    //res.setHeader("Content-Type", "application/json; charset=utf-8");
    //res.status(200).json({ contenido: html });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar la ficha" });
  }
}
