import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { codigo } = req.body || {};

  if (!codigo) {
    return res.status(400).json({ error: "Falta el parámetro 'codigo'" });
  }

  try {

    const phpTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Aber Propiedades</title>
    <link rel='shortcut icon' type='image/x-icon' href='../favicon.ico?version=<?php echo time() ?>' />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="../css/materialize.min.css?version=<?php echo time() ?>"  media="screen,projection"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="../js/scripts.js?version=<?php echo time(); ?>"></script>
    <link href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700" rel="stylesheet"/>
    <meta property="og:url" content="http://aberpropiedades.com.ar/fichas/${codigo}.php" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${datos.titulo}" />
    <meta property="og:description" content="${datos.descripcion}" />
    <meta property="og:image" content="http://aberpropiedades.com.ar/${datos.imagenes?.[0] || ''}" />
  </head>

  <body>
  <script type="text/javascript">loadheaderFichas();</script>

  <div class="container padding">
    <div class="row col m12 full">
      <div class="row card padding">
        <div id="datosFicha" class="col m6">
          <table class="tablaDatos">
            <tbody>
              <tr>
                <td><i class="material-icons blue-grey-text iconos">home</i></td>
                <td><h5><span id="tipoPropiedad">${datos.titulo}</span></h5></td>
              </tr>
              <tr>
                <td><i class="material-icons blue-grey-text iconos">place</i></td>
                <td><h6><span id="direccion">${datos.direccion}</span></h6></td>
              </tr>
              <tr>
                <td><i class="material-icons blue-grey-text iconos">home</i></td>
                <td><h6><span id="ubicacion">${datos.barrio}</span></h6></td>
              </tr>
              <tr>
                <td><i class="material-icons blue-grey-text iconos">attach_money</i></td>
                <td><h6><span id="operacion">${datos.precio}</span></h6></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col m6 blue-grey lighten-4 bordes padding full">
          <div id="galeria" class="galeria" style="padding-bottom: 10px;">
            <div class="slider col m12 fotoficha">
              <ul class="slides fotofichaslide">
                ${(datos.imagenes || [])
                  .map((img) => `<li><img src="${img}"></li>`)
                  .join("\n")}
              </ul>
            </div>
          </div>
        </div>

        <div id="destacable" class="col m12 full">
          <h6 class="blue-text">Descripción: </h6>
          ${datos.descripcion || ""}
        </div>
      </div>
    </div>
  </div>

  <script type="text/javascript">loadfooterFichas();</script>
  <script type="text/javascript" src="../js/materialize.min.js"></script>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(phpTemplate);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando el PHP" });
  }
}
