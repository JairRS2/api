const sql = require("mssql");

// Configuración de la conexión
const config = {
  user: "xhodaraoz", // usuario de SQL Server
  password: "XmaiN16xDt@@MA", // contraseña
  server: "200.4.107.55", // Dirección IP del servidor
  options:{
    encrypt: false, // Cambia a true si usas conexiones encriptadas
    enableArithAbort: true, // Requerido en algunas configuraciones de SQL Server
          },
};

// Crear un pool de conexiones para la base de datos de líneas y unidades
const poolAlmacen = new sql.ConnectionPool({
  ...config,
  database: "dbAlmacen", 
});

// Crear un pool de conexiones para la base de datos de proveedores
const poolProveedores = new sql.ConnectionPool({
  ...config,
  database: "dbProveedores", // Esta es la base de datos de proveedores
});
(async () => {
  try {
    // Conectar a ambas bases de datos
    await poolAlmacen.connect();
    console.log("✅ Conexión a dbAlmacen exitosa");

    await poolProveedores.connect();
    console.log("✅ Conexión a dbProveedores exitosa");
  } catch (error) {
    console.error("❌ Error al conectar con SQL Server:", error.message);
  }
})();

module.exports = { poolAlmacen, poolProveedores };
