"use client";

import React from "react";

const StarDetails = ({
  star,
}) => {
  return (
    <section className="anthem__section">
      <iframe width="560" height="315" src={`https://www.youtube.com/embed/${star.anthem}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

      <div>
        <div>
          <h1>{star.name}</h1>

          
            <p>GDP: {star.GDP}</p>

          <h2>
            Sector: {star.sector}
          </h2>
          <p>
            <hr></hr>
           Alpha fleet: {star.fightersAlpha} | Beta fleet: {star.fightersBeta} | Delta fleet: {star.fightersDelta} | Gamma fleet: {star.fightersGamma}
            <hr></hr>
          </p>
        </div>
      </div>
    </section>
  );
};

export default StarDetails;