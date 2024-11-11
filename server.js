const express = require('express');
const fs = require('fs').promises;  // Uso de fs.promises para manejar asíncrono
const productRouter = require('./api/products/productRouter');
const cartRouter = require('./api/carts/cartRouter');

const app = express();
const PORT = 8080;

// Middleware para procesar el cuerpo de las peticiones
app.use(express.json());

// Rutas para manejar productos y carritos
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
