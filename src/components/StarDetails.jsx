import React from "react";

const StarDetails = ({
  stars,
  userId,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="anthem__section">
      <iframe width="560" height="315" src={`https://www.youtube.com/embed/${stars.anthem}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

      <div>
        <div>
          <h2>{stars.name}</h2>

          <div className="stars__GDP">
            <p>{stars.gdp}</p>
          </div>

          <p>
            {stars.timeCreated} | {stars.sector}
          </p>
          <p>
            <hr></hr>
           Alpha fleet: {stars.fightersAlpha} | Beta fleet: {stars.fightersBeta} | Delta fleet: {stars.fightersDelta} | Gamma fleet: {stars.fightersGamma}
            <hr></hr>
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default StarDetails;