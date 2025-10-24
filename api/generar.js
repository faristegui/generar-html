import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido, usá GET" });
  }

  const { codigo } = req.query; 
  if (!codigo) {
    return res.status(400).json({ error: "Falta el parámetro 'codigo'" });
  }

  try {
    // URL de tu endpoint real
    const url = `https://api.tuendpoint.com/propiedades/${codigo}`;
    
    const datos = {
      titulo: "Departamento 2 ambientes, Almagro, Aber Propiedades",
      direccion: "RIO DE JANEIRO 500 p. 4 (G)",
      ubicacion: "ALMAGRO - CIUDAD AUTONOMA BUENOS AIRES",
      superficie: "Superficie cubierta propia: 40 m2<br>Superficie total uso propio UF: 40 m2",
      operacion: "Venta U$S 140.000",
      descripcion: `2 AMBIENTES - APTO PROFESIONAL<br>
                    IDEAL RENTA - POSIBILIDAD DE FINANCIACIÓN
                    Edificio de doble frente con amplias y luminosas unidades...`,
      imagenes: [
        "fotos/02059bda-4471-4e73-956d-351d0fdd5f15.jpg",
        "fotos/e623cd9b-1ed0-4bf1-b733-d4cebd791f16.jpg",
        "fotos/4a5e1eab-7a4d-457d-a42f-d096bd87faa3.jpg"
      ],
      mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.771003025041!2d-58.43053570000001!3d-34.609951699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca6843e39297%3A0x8a1b578785ba88a9!2sR%C3%ADo%20de%20Janeiro%20500%2C%20C1405%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1711130742125!5m2!1ses!2sar"
    };

    const phpTemplate = `<?php
// PHP generado dinámicamente para ${codigo}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${datos.titulo}</title>
<link rel='shortcut icon' type='image/x-icon' href='../favicon.ico?version=<?php echo time() ?>' />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="../css/materialize.min.css?version=<?php echo time() ?>" media="screen,projection"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="text/javascript" src="../js/scripts.js?version=<?php echo time(); ?>"></script>
<link href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700" rel="stylesheet"/>
<meta property="og:url" content="http://aberpropiedades.com.ar/fichas/${codigo}.php" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${datos.titulo}" />
<meta property="og:description" content="${datos.descripcion}" />
<meta property="og:image" content="http://aberpropiedades.com.ar/fichas/${datos.imagenes[0]}" />
</head>

<body>

<script type="text/javascript">loadheaderFichas();</script>

<div class="container padding">
  <div class="row col m12 full">
    <div class="row card padding">
      <div id="datosFicha" class="col m6">
        <table class="tablaDatos">
          <tbody>
            <tr><td><i class="material-icons blue-grey-text iconos">home</i></td><td><h5><span id="tipoPropiedad">DEPARTAMENTO - 2 AMBIENTES</span></h5></td></tr>
            <tr><td><i class="material-icons blue-grey-text iconos">place</i></td><td><h6><span id="direccion">${datos.direccion}</span></h6></td></tr>
            <tr><td><i class="material-icons blue-grey-text iconos">home</i></td><td><h6><span id="ubicacion">${datos.ubicacion}</span></h6></td></tr>
            <tr><td><i class="material-icons blue-grey-text iconos">crop_free</i></td><td><h6><span id="ubicacion">${datos.superficie}</span></h6></td></tr>
            <tr><td><i class="material-icons blue-grey-text iconos">attach_money</i></td><td><h6><span id="operacion">${datos.operacion}</span></h6></td></tr>
          </tbody>
        </table>
        <div class="col m12 full">&nbsp;</div>
      </div>

      <div class="col m6 blue-grey lighten-4 bordes padding full">
        <div id="galeria" class="galeria" style="padding-bottom: 10px;">
          <div class="slider col m12 fotoficha">
            <ul class="slides fotofichaslide">
              ${datos.imagenes.map(img => `<li><img src="${img}"></li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <div id="destacable" class="col m12 full">
        <h6 class="blue-text">Descripción: </h6>
        ${datos.descripcion}
      </div>

      <div class="col m12 full" id="mapa">
        <iframe src="${datos.mapa}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>

    </div>
  </div>
</div>

<script type="text/javascript">loadfooterFichas();</script>
<script type="text/javascript" src="../js/materialize.min.js"></script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    //res.setHeader("Content-Disposition", `attachment; filename="ficha-${codigo}.php"`);
    res.status(200).send(phpTemplate);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar el PHP" });
  }
}
