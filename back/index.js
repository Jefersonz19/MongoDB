const express = require('express');
const graphql = require('graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const app = express();
const { graphqlHTTP} = require('express-graphql');


// Si fuera con Mongoose: Se importan las entidades:
// const mySecret = process.env['MONGO_URI'];
//const uri = mySecret;
const Producto = require('./entidades/Producto'); 
const Usuario = require('./entidades/Usuario');//modelo: conjunto de datos en la BD
// const port = 3000;
const cors = require('cors');

/* var objProducto = [{
     titulo: "Backpack ",
     precio: "105.9",
     descripcion: "Your perfect pack for everyday use and walks in the forest",
     categoria: "men's clothing",
     image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
   }];  */

// Schema Graphql: Define el tipo de consulta hacia la BD al definir los types en los resolvers e invocarlos en este schema. quedan disponibles en graphiql
const schema = buildSchema(`

  type Producto {
    _id: ID,
    titulo: String
    precio: Float
    descripcion: String
    categoria: String
    imagen: String
  }

  type Usuario {
    _id: ID,
    nombre: String
    password: String
  }

  type ListingRoles {
     name: String
  }

  type Query {
     oneProducto(_id: ID!): Producto
     getProductos: [Producto]
     allProductos: [Producto]
  }
  type Mutation {
    createUsuario(
     nombre: String,
     password: String): Usuario
    createProducto(
      titulo: String, 
      precio: Float, 
      descripcion: String, 
      categoria: String, 
      imagen: String): Producto
    deleteProductoById(_id: ID!): String
    updateProducto(
      _id:ID!,
      titulo: String, 
      precio: Float, 
      descripcion: String, 
      categoria: String, 
      imagen: String): Producto    
    }
`);


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


// resolvers: Recuperar a través del modelo y manipular o exponer el resultado de las consultas
  const rootValue  = {

    createUsuario: async ({nombre, password}) => {
      const newUsuario = new Usuario({nombre, password});
      await newUsuario.save();
      return newUsuario.toObject();
    },
    
    createProducto: async ({ titulo, precio, descripcion, categoria, imagen }) => {
      const newProducto = new Producto ({
        titulo, precio, descripcion, categoria, imagen
      });
      await newProducto.save();  // Promesa
      return newProducto.toObject();
    },

    allProductos: async () => {
      try {
        const Productos = await Producto.find();
        console.log(Productos);
        return Productos;
      } catch (error){
        throw new Error ("No se pudieron recuperar los productos");
      }
    },

    oneProducto: async (_, { _id }) => {
      try {
        const producto = await Producto.findOne(_id);
        return product;
      } catch (error) {
        throw new Error ("No se pudo encontrar el producto.");
      }
    },

    deleteProductoById: async (_, {_id}) => {
      try {
        const deleteProduct = await Producto.deleteOne(_id);

        if (!deleteProduct) {
           throw new Error ("No se pudo encontrar el producto");
        } return `Producto con ID ${_id} eliminado`;
      } catch(error){
        console.error ("Error al borrar el producto:", error)
        throw new Error ("No se pudo borrar el producto");
      } 
    },

    updateProducto: async (_, {_id, titulo, precio, descripcion, categoria, imagen }) => {
        try {
          const existingProduct = await Producto.findOne(_id);

          if (!existingProduct) {
            ("No se encontró el producto");
          }

          const updatedProduct = await Producto.updateOne(
            { _id},
            { $set: {titulo, precio, descripcion, categoria, imagen} },
            { new:true}
        ); return updatedProduct;
    
        } catch (error){
          throw new Error ("No se pudo actualizar el producto");
        }
    }
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

     // obtener productos por categoria
   getProductos: async (_, { _categoria }) => {
     try {
       const products = await Producto.find({categoria});
       console.log(products);
       return products;
     } catch (error) {
       throw new Error ("No se pudieron recuperar los productos.");
     }
   }
 
  oneProucto: async (_, { _id }) => {
     try {
       const product = await Producto.findOne(_id);
       return product;
     } catch (error) {
       throw new Error ("No se pudo encontrar el producto.");
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
