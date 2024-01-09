const express = require('express');
const router = express.Router();
const libros = require('../data');
const Joi = require('joi');

const libroSchema = Joi.object({
    titulo: Joi.string().required().label('Titulo'),
    autor: Joi.string().required().label('Autor')
});

router.get('/', (req, res, next) => {
    try{
        res.json(libros)
    } catch(err){
        next(err)
    }
});

router.get('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const libro = libros.find(libro => libro.id === id);

        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        res.json(libro)
    } catch (err) {
        next(err)
    }
});

//Crear un nuevo libro
router.post('/', (req, res, next) => {
    try {
        const libro = req.body;
        const {error, value} = libroSchema.validate(libro);

        if (error) {
            const ValidationError = new Error('Error de validación al crear un libro');
            ValidationError.status = 400;
            ValidationError.datails = error.details.map(detail => detail.message);
            throw ValidationError;
        }

        const {titulo, autor} = value

        const nuevoLibro = {
            id: libros.length + 1,
            titulo,
            autor
        }

        libros.push(nuevoLibro);
        res.status(201).json(nuevoLibro);
    } catch (err) {
        next(err)
    }
});

//Actualizar un libro
router.put('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("hola")
        const {error, value} = libroSchema.validate(req.body);

        if (error) {
            const ValidationError = new Error('Error de validación al actualizar un libro');
            ValidationError.status = 400;
            ValidationError.datails = error.details.map(detail => detail.message);
            throw ValidationError;
        }

        const libro = libros.find(libro => libro.id === id);

        if (!libro) {
            const ValidationError = new Error('Libro no encontrado');
            ValidationError.status = 404;
            throw ValidationError;
        }

        const {titulo, autor} = value

        libro.titulo = titulo || libro.titulo;
        libro.autor = autor || libro.autor;

        res.json(libro);
    } catch (err) {
        next(err)
    }
});

//Eliminar un libro
router.delete('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const libro = libros.find(libro => libro.id === id);

        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }

        const index = libros.indexOf(libro);
        libros.splice(index, 1);

        res.json(libro);
    } catch (err) {
        next(err)
    }
});

module.exports = router;