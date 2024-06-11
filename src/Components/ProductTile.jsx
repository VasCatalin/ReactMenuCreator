import React from "react";
import "../Style/ProductTile.css";

const ProductTile = ({startBuild}) => {
  const tiles = [
    { name:"Food", img: "Food-2", description: "Un pachet generos de mancare, foarte bun de luat in consideratie mai ales cand doresti sa creezi un meniu fain." },
    { name:"Drink", img: "Drink-1", description: "Un pachet generos de bauturi, foarte bun de luat in consideratie mai ales cand doresti sa creezi un meniu fain." },
    { name:"Mixt", img: "Drink-2", description: "Un pachet generos de mixt, foarte bun de luat in consideratie mai ales cand doresti sa creezi un meniu fain." },
  ];

  return (
    <>
      {tiles.map((tile, index) => (
        <div className="product-tile-box col-12 col-lg-4 mt-4" key={index}>
          <div className="product-tile m-1">
            <img src={`${process.env.PUBLIC_URL}/img/${tile.img}.png`} alt={`${tile.name}`} />
            <h3>{tile.name}</h3>
            <p>{tile.description}</p>
            <button onClick={() => startBuild(true)}>Start Build</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductTile;
