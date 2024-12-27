const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");


// Endpoint para crear un producto
router.post("/products", productController.createProduct);

// Endpoint para listar todos los productos
router.get("/products", productController.getAllProducts);

// Actualizar un producto
router.put("/products/:cCodPrd", productController.updateProduct);

// Elimina un producto
router.delete('/products/:cCodPrd', productController.deleteProduct);

// Ruta para habilitar un producto
router.put("/productos/habilitar/:cCodPrd", productController.habilitarProducto);

// Ruta para deshabilitar un producto
router.put("/productos/deshabilitar/:cCodPrd", productController.deshabilitarProducto);

// Endpoint para obtener detalles de un vale por productId
router.get('/ValesDetalles/:productId', productController.getFilteredValesDetalles);

// Ruta para obtener los detalles del kardex filtrados
router.get('/Kardex/:productId', productController.getFilteredKardex);

// Ruta para obtener los detalles del kardex filtrados
router.get('/OrdenDetalles/:productId', productController.getFilteredCompras);

// Endpoint para listar todos los productos
router.get("/proveedores", productController.getAllProveedores);

// Endpoint para listar todos los productos
router.get("/lineas", productController.getAllLineas);

// Endpoint para listar todos los productos
router.get("/medidas", productController.getAllMedidas);

// Ruta para obtener un vale específico
router.get('/vales/:nNumVal', productController.getValeByNum);

// Endpoint para listar todos los Usuarios
router.post("/users", productController.loginUsuario);

// Endpoint para listar todos los Usuarios
router.get("/users", productController.loginUsuario);


router.get("/pivot",productController.getPivotData)

router.post("/pivot",productController.getPivotData)

router.get("/pivots",productController.getPivotDatas)

router.post("/pivots",productController.getPivotDatas)



module.exports = router;
 