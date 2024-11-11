const express = require('express');
const fs = require('fs').promises;  // Uso de fs.promises para trabajar con async/await
const path = require('path');
const router = express.Router();

const productosPath = path.join(__dirname, '../../data/productos.json');

// Función para leer los productos
const readProductos = async () => {
    try {
        const data = await fs.readFile(productosPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Error al leer productos');
    }
};

// Función para escribir los productos
const writeProductos = async (productos) => {
    try {
        await fs.writeFile(productosPath, JSON.stringify(productos, null, 2), 'utf8');
    } catch (err) {
        throw new Error('Error al escribir productos');
    }
};

// Ruta para obtener todos los productos (con límite)
router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        let productos = await readProductos();
        if (limit) {
            productos = productos.slice(0, parseInt(limit));
        }
        res.json(productos);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para obtener un producto por id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const productos = await readProductos();
        const producto = productos.find(p => p.id === pid);
        if (!producto) return res.status(404).send('Producto no encontrado');
        res.json(producto);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const newProduct = {
        id: Date.now().toString(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    try {
        const productos = await readProductos();
        productos.push(newProduct);
        await writeProductos(productos);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;

    try {
        let productos = await readProductos();
        const productoIndex = productos.findIndex(p => p.id === pid);
        if (productoIndex === -1) return res.status(404).send('Producto no encontrado');

        const updatedProduct = { ...productos[productoIndex], ...updatedData };
        productos[productoIndex] = updatedProduct;
        await writeProductos(productos);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        let productos = await readProductos();
        productos = productos.filter(p => p.id !== pid);
        await writeProductos(productos);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
