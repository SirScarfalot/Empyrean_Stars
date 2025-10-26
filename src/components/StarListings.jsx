"use client";

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStarsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const StarItem = ({ star }) => (
  <li key={star.id}>
    <Link href={`/star/${star.id}`}>
      <ActiveStar star={star} />
    </Link>
  </li>
);

const ActiveStar = ({ star }) => (
  <div>
    <StarDetails star={star} />
  </div>
);

const StarDetails = ({ star }) => (
  <div className = "restaurant__details">
    <h1>{star.name}</h1>
    <StarMetadata star={star} />
  </div>
);

const StarMetadata = ({ star }) => (
  <div className="restaurant__meta">
    <h2>
      {star.sector} | {star.GDP}
    </h2>
    <hr>---</hr>
    <p>Alpha fleet: {star.fightersAlpha}</p>
    <p>Beta fleet: {star.fightersBeta}</p>
    <p>Delta fleet: {star.fightersDelta}</p>
    <p>Gamma fleet: {star.fightersGamma}</p>
  </div>
);

export default function StarListings({
  initialStars,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    GDP: searchParams.GDP || "",
    name: searchParams.name || "",
  };

  const [stars, setStars] = useState(initialStars);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getStarsSnapshot((data) => {
      setStars(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="restaurants">
        {stars.map((star) => (
          <StarItem key={star.id} star={star} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}