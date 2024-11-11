const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const carritoPath = path.join(__dirname, '../../data/carrito.json');

// Función para leer los carritos
const readCarritos = async () => {
    try {
        const data = await fs.readFile(carritoPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Error al leer carritos');
    }
};

// Función para escribir los carritos
const writeCarritos = async (carritos) => {
    try {
        await fs.writeFile(carritoPath, JSON.stringify(carritos, null, 2), 'utf8');
    } catch (err) {
        throw new Error('Error al escribir carritos');
    }
};

// Ruta para obtener un carrito por id
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const carritos = await readCarritos();
        const carrito = carritos.find(c => c.id === cid);
        if (!carrito) return res.status(404).send('Carrito no encontrado');
        res.json(carrito);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    try {
        let carritos = await readCarritos();
        let carrito = carritos.find(c => c.id === cid);
        if (!carrito) return res.status(404).send('Carrito no encontrado');

        const productIndex = carrito.products.findIndex(p => p.product === pid);
        if (productIndex === -1) {
            carrito.products.push({ product: pid, quantity });
        } else {
            carrito.products[productIndex].quantity += quantity;
        }

        await writeCarritos(carritos);
        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
