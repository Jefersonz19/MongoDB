<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Tienda Virtual </title>
  <link href="style.css"  rel="stylesheet"  type="text/css" />
</head>
<body>
    <div class= "contenedor"></div>
    <div class= "detalles"  style="display: none;"></div>
  
<script>   
  async function obtenerProductos() {    
    try {
      const response = await fetch('https://fakestoreapi.com/products');   
      if(!response.ok){
         throw new Error('Error en la solicitud');
       }
      const data = await response.json();
      // console.log(data);
      return data;
  }  catch (error) {
     console.error('Error: ', error);
     return [];
   }
}
  // obtenerProductos();

   document.addEventListener("DOMContentLoaded", async () => {
      const contenedor = document.querySelector(".contenedor");
      const products = await obtenerProductos();
      let productos = "";
      //console.log(products);
      products.forEach((product) => {
        localStorage.setItem(`product_${product.id}`, JSON.stringify(product));
// template literal se guarda en backtick
      productos += ` <div class = "card" style="width: 18 rem">
      <img width: "100" src="${product.image}">   
      <div class="card-body">                                 
        <h5> ${product.title} </h5> 
        <p class="card-text"> ${product.price} </p>
        <a href="detalleproducto.html?id=${product.id}" 
        class="btn-primary"> Ver detalle </a>
       </div> 
    </div> `;                        
      });
    contenedor.innerHTML = productos;
      });
</script>

<!-- document.querySelector(‘.contenedor’).innerHTML = ‘Hola mundo’; -->

</body>
</html>
