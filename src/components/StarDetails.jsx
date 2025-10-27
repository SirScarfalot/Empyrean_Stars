import React from "react";

const StarDetails = ({
  star,
  children,
}) => {
  return (
    <section className="anthem__section">
      <iframe width="560" height="315" src={`https://www.youtube.com/embed/${star.anthem}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

      <div>
        <div>
          <h2>{star.name}</h2>

          <div className="stars__GDP">
            <p>{star.gdp}</p>
          </div>

          <p>
            {star.timeCreated} | {star.sector}
          </p>
          <p>
            <hr></hr>
           Alpha fleet: {star.fightersAlpha} | Beta fleet: {star.fightersBeta} | Delta fleet: {star.fightersDelta} | Gamma fleet: {star.fightersGamma}
            <hr></hr>
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default StarDetails;