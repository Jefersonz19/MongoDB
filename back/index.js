const express = require('express');
const graphql = require('graphql');
const buildSchma = require('./entidades/Producto');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const app = express();
const { graphqlHTTP} = require('express-graphql');


// const mySecret = process.env['MONGO_URI'];
//const uri = mySecret;
const Producto = require('./entidades/Producto'); 
const Usuario = require('./entidades/User');//modelo: conjunto de datos en la BD
// const port = 3000;
const cors = require('cors');

/* var objProducto = [{
     titulo: "Backpack ",
     precio: "105.9",
     descripcion: "Your perfect pack for everyday use and walks in the forest",
     categoria: "men's clothing",
     image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
   }];  */

const connectDB = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
     console.log(error)
  }
} 
connectDB();

//Almacenar objeto en la BD
/* const almacenarObjetos = async () => {
  try {
        await producto.insertMany(objProducto, {
options: { timeout: 3000 } });
        //console.log(“Objeto almacenado en la BD creada”)
  } catch (error) {
        console.log(error)
   }
}
// Ejecutar la función
almacenarObjetos(); */


const schema = buildSchema(`

  type Producto {
    _id: ID,
    titulo: String
    precio: Float
    descripcion: String
    categoria: String
    imagen: String
  }

  type ListingRoles {
     name: String
  }
  
  type Query {
     allProductos: [Producto]
  }
  type Mutation {
     createProducto(
       titulo: String, 
       precio: Float, 
       descripcion: String, 
       categoria: String, 
       imagen: String): Producto
  }
`);

  const rootValue  = {

    createUsuario: async ({name}) => {
      const newUsuario = new Usuario({name});
      await newUsuario.save();
      return newUsuario.toObject();
    },
    
    createProducto: async ({ titulo, precio, descripcion, categoria, imagen }) => {
      const newProducto = new Producto ({
        titulo, precio, descripcion, categoria, imagen
      });
      await newProducto.save();
      return newProducto.toObject();
    },
  };

Query: {
  producto: async (_, { _id}) => {
    try {
    const product = await Productos.findById(_id);
    return product;
    } catch (error){
    throw new Error ("No se pudo encontrar el producto.");
  }
} 
   allProductos: async() => {
  try {
    const products = await Producto.find();
    console.log(products);
    return products;
  } catch (error) {
    throw new Error ("No se pudieron recuperar los productos.");
    }
   }
};


app.use('/graphql', graphqlHTTP({
  schema, 
  rootValue, 
  graphiql: true}));


app.get('/graphql', (req, res) => {
  const query = req.query.query || '';
  const variables = req.query.variables || '';
  const operationName = req.query.operationName || '';
  const result = graphql(schema, query, rootValue, null, variables, operationName);
  result.then((response) => {
    res.send(graphiql.renderGraphiQL({ query, variables, operationName, result: JSON.stringify(response) }));
  });  
});

app.use(cors());
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.listen(3000, () => {
  console.log('server started');
});