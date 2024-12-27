
const { poolAlmacen, poolProveedores }= require("../config/db");
const sql = require("mssql");
const moment = require("moment");
const bcrypt = require('bcrypt'); // Para manejar contraseñas cifradas


function isValidDate(date) {
  return moment(date, "YYYY-MM-DD", true).isValid();
}

function setRequestInputs(request, params) {
  Object.entries(params).forEach(([key, value]) => {
    const type = typeof value === "number" ? sql.Decimal : sql.NVarChar;
    if (key.includes("Date")) {
      request.input(key, sql.Date, value); // Maneja fechas explícitamente
    } else {
      request.input(key, type, value);
    }
  });
}

exports.createProduct = async (req, res) => {
  try {
    const {
      cCodPrd, cDesPrd, nUniPrd, nMinPrd, nMaxPrd, dAltPrd, dUltPrd,
      nLinPrd, nCosPrd, nPrePrd, nInvIPrd, nInvAPrd, nUltPrd,
      cPosPrd, cPtePrd, cPrv1Prd, cPrv2Prd
    } = req.body;

    if (!cCodPrd || !cDesPrd) {
      return res.status(400).json({ message: "Los campos cCodPrd y cDesPrd son obligatorios" });
    }

    if (!isValidDate(dAltPrd) || !isValidDate(dUltPrd)) {
      return res.status(400).json({ message: "Formato de fecha inválido (debe ser yyyy-MM-dd)" });
    }

    const query = `
      INSERT INTO Productos(
        cCodPrd, cDesPrd, nUniPrd, nMinPrd, nMaxPrd, dAltPrd, dUltPrd,
        nLinPrd, nCosPrd, nPrePrd, nInvIPrd, nInvAPrd, nUltPrd,
        cPosPrd, cPtePrd, cPrv1Prd, cPrv2Prd
      ) VALUES (
        @cCodPrd, @cDesPrd, @nUniPrd, @nMinPrd, @nMaxPrd, @dAltPrd, @dUltPrd,
        @nLinPrd, @nCosPrd, @nPrePrd, @nInvIPrd, @nInvAPrd, @nUltPrd,
        @cPosPrd, @cPtePrd, @cPrv1Prd, @cPrv2Prd
      )
    `;

    const request = poolAlmacen.request();
    setRequestInputs(request, {
      cCodPrd, cDesPrd, nUniPrd, nMinPrd, nMaxPrd, dAltPrd, dUltPrd,
      nLinPrd, nCosPrd, nPrePrd, nInvIPrd, nInvAPrd, nUltPrd,
      cPosPrd, cPtePrd, cPrv1Prd, cPrv2Prd
    });

    await request.query(query);
    res.status(201).json({ message: "Producto creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(500).json({ message: "Error al crear el producto", details: error.message });
  }
};


// Actualizar un producto
exports.updateProduct = async (req, res) => {
  const { cCodPrd } = req.params;
  const {
    cDesPrd, nUniPrd, nMinPrd, nMaxPrd, dAltPrd, dUltPrd,
    nLinPrd, nCosPrd, nPrePrd, nInvIPrd, nInvAPrd, nUltPrd,
    cPosPrd, cPtePrd, cPrv1Prd, cPrv2Prd
  } = req.body;
 
  try {
    const query = `
      UPDATE Productos SET
        cDesPrd = @cDesPrd,
        nUniPrd = @nUniPrd,
        nMinPrd = @nMinPrd,
        nMaxPrd = @nMaxPrd,
        dAltPrd = @dAltPrd,
        dUltPrd = @dUltPrd,
        nLinPrd = @nLinPrd,
        nCosPrd = @nCosPrd,
        nPrePrd = @nPrePrd,
        nInvIPrd = @nInvIPrd,
        nInvAPrd = @nInvAPrd,
        nUltPrd = @nUltPrd,
        cPosPrd = @cPosPrd,
        cPtePrd = @cPtePrd,
        cPrv1Prd = @cPrv1Prd,
        cPrv2Prd = @cPrv2Prd
      WHERE cCodPrd = @cCodPrd
    `;

    const request = poolAlmacen.request();
    request.input('cCodPrd', sql.NVarChar, cCodPrd);
    request.input('cDesPrd', sql.NVarChar, cDesPrd);
    request.input('nUniPrd', sql.TinyInt, nUniPrd);
    request.input('nMinPrd', sql.Decimal, nMinPrd);
    request.input('nMaxPrd', sql.Decimal, nMaxPrd);
    request.input('dAltPrd', sql.Date, dAltPrd);
    request.input('dUltPrd', sql.Date, dUltPrd);
    request.input('nLinPrd', sql.TinyInt, nLinPrd);
    request.input('nCosPrd', sql.Decimal, nCosPrd);
    request.input('nPrePrd', sql.Decimal, nPrePrd);
    request.input('nInvIPrd', sql.Decimal, nInvIPrd);
    request.input('nInvAPrd', sql.Decimal, nInvAPrd);
    request.input('nUltPrd', sql.Decimal, nUltPrd);
    request.input('cPosPrd', sql.NVarChar, cPosPrd);
    request.input('cPtePrd', sql.NVarChar, cPtePrd);
    request.input('cPrv1Prd', sql.NVarChar, cPrv1Prd);
    request.input('cPrv2Prd', sql.NVarChar, cPrv2Prd);

    await request.query(query);
    res.status(200).json({ message: "Producto actualizado exitosamente1" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error.message);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const query = "SELECT * FROM Productos"; // Incluye habilitado en la selección
    const result = await poolAlmacen.request().query(query);

    // Asigna la ruta de la imagen para cada producto
    result.recordset.forEach(product => {
      product.imageUrl = `http://localhost:3000/images/${product.cDesPrd}.jpg`;
    });

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los productos:", error.message);  
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};


// Deshabilitar producto
exports.deshabilitarProducto = async (req, res) => {
  let { cCodPrd } = req.params; // Clave primaria

  try {
    
    const query = "UPDATE Productos SET habilitado = 0 WHERE cCodPrd = @cCodPrd";
    const request = poolAlmacen.request();
    request.input("cCodPrd", cCodPrd);
    await request.query(query);

    res.status(200).json({ message: `Producto con código ${cCodPrd} deshabilitado.` });
  } catch (error) {
    console.error("Error al deshabilitar el producto:", error.message);
    res.status(500).json({ message: "Error al deshabilitar el producto" });
  }
};


exports.habilitarProducto = async (req, res) => {
  let { cCodPrd } = req.params;
  try {
    const query = "UPDATE Productos SET habilitado = 1 WHERE cCodPrd = @cCodPrd";
    const request = poolAlmacen.request();
    request.input("cCodPrd", cCodPrd);
    await request.query(query);
    res.status(200).json({ message: `Producto con código ${cCodPrd} habilitado.` });
  } catch (error) {
    console.error("Error al habilitar el producto:", error.message);
    res.status(500).json({ message: "Error al habilitar el producto" });
  }
};


// Obtener todos los proveedores
exports.getAllProveedores = async (req, res) => {
  try {
    const query = "SELECT * FROM Proveedores";
    const result = await poolProveedores.request().query(query);


    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los proveedores:", error.message);
    res.status(500).json({ message: "Error al obtener los proveedores" });
  }
};


// Obtener todos las Lineas
exports.getAllLineas = async (req, res) => {
  try {
    const query = "SELECT * FROM Lineas";
    const result = await poolAlmacen.request().query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las Lineas:", error.message);
    res.status(500).json({ message: "Error al obtener las Lineas" });
  }
};


// Obtener todas las unidades
exports.getAllMedidas = async (req, res) => {
  try {
    const query = "SELECT * FROM tbUnidadMedida";
    const result = await poolAlmacen.request().query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las unidades de medida:", error.message);
    res.status(500).json({ message: "Error al obtener las unidades de medida" });
  }
};


// Login de usuarios con roles
exports.loginUsuario = async (req, res) => {
  const { cClaveEmpleado, cClaveUsuario } = req.body;

  // Validación de entrada
  if (!cClaveEmpleado || !cClaveUsuario) {
    return res.status(400).json({ message: 'Por favor, proporciona ambos campos' });
  }

  try {
    // Consulta SQL para obtener el usuario
    const query = `
      SELECT cClaveEmpleado, cClaveUsuario, nNivelUsuario, cNombreEmpleado
      FROM usuario
      WHERE cClaveEmpleado = @cClaveEmpleado
    `;

    const result = await poolAlmacen
      .request()
      .input('cClaveEmpleado', sql.VarChar, cClaveEmpleado)
      .query(query);

    // Verificar si el usuario existe
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const usuario = result.recordset[0];

    // Verificar la contraseña en texto plano
    if (usuario.cClaveUsuario !== cClaveUsuario) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Mapeo de roles basado en el nivel de usuario
    const roles = {
      5: 'Administrador',
      1: 'Usuario',
      0: 'Usuario'
    };

    const role = roles[usuario.nNivelUsuario] || 'Rol no autorizado';

    // Si el rol no es válido
    if (role === 'Rol no autorizado') {
      return res.status(403).json({ message: 'Rol no autorizado' });
    }

    // Respuesta exitosa
    return res.status(200).json({
      message: `Inicio de sesión exitoso: ${usuario.cNombreEmpleado}`,
      nombre: usuario.cNombreEmpleado,
      nNivelUsuario: usuario.nNivelUsuario,
      role: role,
    });
  } catch (error) {
    console.error('Error en el login:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.getFilteredValesDetalles = async (req, res) => {
  const { productId } = req.params; // Obtener productId desde los parámetros de la URL
  const { startDate, endDate } = req.query; // Fechas opcionales
  const { page = 1, limit = 10000 } = req.query;

  const formattedStartDate = startDate ? new Date(startDate) : null;
  const formattedEndDate = endDate ? new Date(endDate) : null;

  try {
    const offset = (page - 1) * limit;

    // Consulta con JOIN para combinar datos de ValesDetalle y Vales
    const query = `
      SELECT 
        vd.*, 
        v.nCveEmp -- Agrega cualquier otro campo necesario de la tabla Vales
      FROM 
        ValesDetalle vd
      LEFT JOIN 
        Vales v
      ON 
        vd.nNumVal = v.nNumVal
      WHERE 
        vd.cCodPrd = @productId
        ${formattedStartDate ? 'AND vd.dFecFac >= @startDate' : ''}
        ${formattedEndDate ? 'AND vd.dFecFac <= @endDate' : ''}
      ORDER BY 
        vd.dFecFac DESC
      OFFSET 
        @offset ROWS FETCH NEXT @limit ROWS ONLY;
    `;

    // Ejecutar la consulta
    const result = await poolAlmacen.request()
      .input('productId', sql.NVarChar, productId)
      .input('startDate', sql.Date, formattedStartDate || null)
      .input('endDate', sql.Date, formattedEndDate || null)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit))
      .query(query);

    // Responder con los datos combinados
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los Detalles del Vale:', error);
    res.status(500).json({ error: 'Error al obtener los Detalles del Vale' });
  }
};


// Método para Obtener Detalles de un Vale Específico
exports.getValeByNum = async (req, res) => {
  const { nNumVal } = req.params; // Obtener nNumVal desde los parámetros de la URL

  try {
    // Consulta para obtener información del vale
    const query = `
      SELECT * FROM Vales
      WHERE nNumVal = @nNumVal
    `;

    const result = await poolAlmacen.request()
      .input('nNumVal', sql.NVarChar, nNumVal) // Pasar el número del vale como parámetro
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Vale no encontrado' });
    }

    res.status(200).json(result.recordset[0]); // Devolver el primer registro encontrado
  } catch (error) {
    console.error("Error al obtener los detalles del Vale:", error.message);
    res.status(500).json({ message: "Error al obtener los detalles del Vale" });
  }
};


//Metodo Para Obterer el Kardex
exports.getFilteredKardex = async (req, res) => {
  const { productId } = req.params;  // Obtener productId desde los parámetros de la URL
  const { startDate, endDate } = req.query;  // Las fechas pueden seguir llegando por query
  const { page = 1, limit = 10000 } = req.query;  // Paginación
   // Si las fechas son válidas, convertirlas a Date
   const formattedStartDate = startDate ? new Date(startDate) : null;
   const formattedEndDate = endDate ? new Date(endDate) : null;

  try {
    // Calcula el inicio del paginado
    const offset = (page - 1) * limit;

    // Consulta con filtros
    let query = `SELECT * FROM Kardex WHERE cCodPrd = @productId`;

    if (formattedStartDate) query += ` AND dFecKdx >= @startDate`;
    if (formattedEndDate) query += ` AND dFecKdx <= @endDate`;
    query += ` ORDER BY dFecKdx DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    // Ejecuta la consulta
    const result = await poolAlmacen.request()
      .input('productId', sql.NVarChar, productId)
      .input('startDate', sql.Date, startDate || null)
      .input('endDate', sql.Date, endDate || null)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit))
      .query(query);

    // Responder con los resultados
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los detalles del Kardex:", error.message);
    res.status(500).json({ message: "Error al obtener los detalles del Kardex" });
  }
};


//Metodo Para Obterer el DetalleCompras
exports.getFilteredCompras = async (req, res) => {
  const { productId } = req.params;  // Obtener productId desde los parámetros de la URL
  const { startDate, endDate } = req.query;  // Las fechas pueden seguir llegando por query
  const { page =1, limit = 10000 } = req.query;  // Paginación
   // Si las fechas son válidas, convertirlas a Date
   const formattedStartDate = startDate ? new Date(startDate) : null;
   const formattedEndDate = endDate ? new Date(endDate) : null;

  try {
    // Calcula el inicio del paginado
    const offset = (page - 1) * limit;

    // Consulta con filtros
    let query = `SELECT * FROM OrdenDetalle WHERE cCodPrd = @productId`;

    if (formattedStartDate) query += ` AND dFecFac >= @startDate`;
    if (formattedEndDate) query += ` AND dFecFac <= @endDate`;
    query += ` ORDER BY dFecFac DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    // Ejecuta la consulta
    const result = await poolAlmacen.request()
      .input('productId', sql.NVarChar, productId)
      .input('startDate', sql.Date, startDate || null)
      .input('endDate', sql.Date, endDate || null)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit))
      .query(query);

    // Responder con los resultados
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los detalles de la orden de compras:", error.message);
    res.status(500).json({ message: "Error al obtener los detalles de la orden de compras" });
  }
};


// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  const { cCodPrd } = req.params;

  try {
    // Verifica si el producto existe antes de intentar eliminarlo
    const checkQuery = "SELECT * FROM Productos WHERE cCodPrd = @cCodPrd";
    const checkRequest = poolAlmacen.request();
    checkRequest.input('cCodPrd', sql.NVarChar, cCodPrd);
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Elimina el producto
    const deleteQuery = "DELETE FROM Productos WHERE cCodPrd = @cCodPrd";
    const deleteRequest = poolAlmacen.request();
    deleteRequest.input('cCodPrd', sql.NVarChar, cCodPrd);
    await deleteRequest.query(deleteQuery);

    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
    res.status(500).json({ message: "Error al eliminar el producto", details: error.message });
  }
};


exports.  getPivotData = async (req, res) => {
  const { filters, relations } = req.query; // Obtener los filtros desde los parámetros de la consulta

  // Definir las tablas base
  let baseQuery = "SELECT top 200000";
  let joins = [];
  let columnsSelected = [];

  // Establecer las tablas a consultar según las relaciones
  if (relations && relations.length > 0) {
    relations.forEach(table => {
      switch (table) {
        case "Productos":
          columnsSelected.push("p.cCodPrd, p.cDesPrd");
          break;
        case "kardex":
          columnsSelected.push("k.cDocKdx");
          joins.push("JOIN kardex k ON p.cCodPrd = k.cCodPrd");
          break;
        case "valesDetalle":
          columnsSelected.push("vd.cNumFac");
          joins.push("JOIN valesDetalle vd ON p.cCodPrd = vd.cCodPrd");
          break;
        case "ordenDetalle":
          columnsSelected.push("od.nCtdOrd");
          joins.push("JOIN ordenDetalle od ON p.cCodPrd = od.cCodPrd");
          break;
        case "vales":
          columnsSelected.push("v.nFolBit");
          joins.push("LEFT JOIN vales v ON vd.nnumval = v.nnumval");
          break;
        default:
          break;
      }
    });

    baseQuery += columnsSelected.join(", ");
    baseQuery += " FROM Productos p ";
    baseQuery += joins.join(" ");
  } else {
    return res.status(400).json({ message: "No relations specified." });
  }

  // Aplicar filtros si existen
  if (filters) {
    const filterClauses = Object.entries(filters).map(([field, value]) => {
      return `${field} = '${value}'`; // Generar las cláusulas de filtro
    });
    if (filterClauses.length > 0) {
      baseQuery += ` WHERE ${filterClauses.join(' AND ')}`;
    }
  }

  try {
    const result = await poolAlmacen.request().query(baseQuery);
    res.status(200).json(result.recordset); // Retornar los datos filtrados
  } catch (error) {
    console.error("Error al obtener los datos para el Pivot Grid:", error.message);
    res.status(500).json({ message: "Error al obtener los datos" });
  }
};


exports.getPivotDatas = async (req, res) => {
  try {
    const { tables, filters } = req.query;

    // Validación de 'tables'
    if (!tables) {
      return res.status(400).json({ message: "El parámetro 'tables' es obligatorio." });
    }

    const tableList = JSON.parse(tables);

    // Relaciones definidas
    const tableRelations = {
      kardex: "Productos.cCodPrd = kardex.cCodPrd",
      valesDetalle: "Productos.cCodPrd = valesDetalle.cCodPrd",
      OrdenDetalle: "Productos.cCodPrd = OrdenDetalle.cCodPrd",
    };

    const allowedTables = ["Productos", ...Object.keys(tableRelations)];

    // Validación de tablas solicitadas
    const invalidTables = tableList.filter(table => !allowedTables.includes(table));
    if (invalidTables.length > 0) {
      return res.status(400).json({ message: `Tablas no válidas: ${invalidTables.join(', ')}` });
    }

    // Construcción dinámica del SELECT
    let query = "SELECT TOP 200000";
    query += tableList.map(table => `${table}.*`).join(", ");
    query += " FROM Productos ";

    // Construcción dinámica de los JOIN
    const joins = [];
    if (tableList.includes("kardex")) {
      joins.push(`INNER JOIN kardex ON ${tableRelations.kardex}`);
    }
    if (tableList.includes("valesDetalle")) {
      joins.push(`INNER JOIN valesDetalle ON ${tableRelations.valesDetalle}`);
    }
    if (tableList.includes("OrdenDetalle")) {
      joins.push(`INNER JOIN OrdenDetalle ON ${tableRelations.OrdenDetalle}`);
    }

    query += joins.join(" ");

    // Construcción de filtros (si existen)
    if (filters) {
      try {
        const filterConditions = JSON.parse(filters);
        if (Object.keys(filterConditions).length > 0) {
          const whereClauses = Object.entries(filterConditions).map(
            ([key, value]) => `${key} = '${value}'`
          );
          query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
      } catch (error) {
        return res.status(400).json({ message: "Los filtros proporcionados no son válidos." });
      }
    }
    // Ejecuta la consulta
    const result = await poolAlmacen.request().query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener datos:", error.message);
    res.status(500).json({ message: "Error al obtener los datos" });
  }
};


