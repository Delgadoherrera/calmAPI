const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.post("/send-email", (req, res) => {
  const options = {
    auth: {
      api_key:
        "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", // Reemplaza con tu clave de API de SendGrid
    },
  };
  console.log("req,body", req.body);
  const { fname, email, presentacion, phone, lname, file } = req.body;

  if (file) {
    console.log("hay file");
    const base64Data = file.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, "base64");
    const mailOptions = {
      from: "contact@missingpets.art",
      to: "contactldelgado@gmail.com",
      subject: `Postulacion de ${fname} ${lname}`,
      text: `Nombre: ${fname}\nCorreo electrónico: ${email}\nMensaje: ${presentacion}\nTelefono:${phone}`,
      attachments: [
        {
          filename: "archivo.pdf", // Nombre del archivo adjunto que se mostrará en el correo
          content: pdfBuffer, // Contenido del archivo PDF
        },
      ],
    };
  }

  if (!file) {
    console.log("no hay archivo");
    const mailOptions = {
      from: "contact@calmhc.com",
      to: "contactldelgado@gmail.com",
      subject: `Postulacion de ${fname} ${lname}`,
      text: `Nombre: ${fname}\nCorreo electrónico: ${email}\nMensaje: ${presentacion}\nTelefono:${phone}`,
    };
    const transporter = nodemailer.createTransport(sgTransport(options));
    // Configura el contenido del correo electrónico
    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error al enviar el correo electrónico");
      } else {
        console.log("Correo electrónico enviado: " + info.response);
        res.status(200).send("Correo electrónico enviado con éxito");
      }
    });
  }

  // Configura el transportador de nodemailer con SendGrid
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
