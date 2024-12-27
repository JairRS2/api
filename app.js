const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const productRoutes = require("./routes/products.routes");
const testRoutes = require("./routes/products.routes");

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Configurar multer para almacenar imágenes en la carpeta 'images'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nombre único para la imagen
  }
});
const upload = multer({ storage: storage });

// Ruta para cargar imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    // Responder con la URL de la imagen almacenada
    res.json({ message: 'Imagen cargada exitosamente', imageUrl: `/images/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'No se ha cargado ninguna imagen' });
  }
});

// Servir imágenes estáticas desde la carpeta 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Rutas
app.use("/api", productRoutes);
app.use("/api/products", testRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
