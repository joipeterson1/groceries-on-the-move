import React from "react";
import ProductList from "../ProductList";

function Home({products, AddToCart}) {

    return(
        <div>
        <h1>View our products below!</h1>
        <ProductList products={products} AddToCart={AddToCart}/>
        </div>
    )
}

export default Home