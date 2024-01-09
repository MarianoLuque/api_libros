const express = require('express');
const app = express();
const port = 3000;

const librosRouter = require('./routes/libros');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/libros', librosRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`)
});