"use client";

import { React, useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { getStarSnapshotById } from "@/src/lib/firebase/firestore.js";
import { useUser } from "@/src/lib/getUser";
import StarDetails from "@/src/components/StarDetails.jsx";

// const WarDialog = dynamic(() => import("@/src/components/WarDialog.jsx"));

export default function Star({
  id,
  initialStar,
  initialUserId,
  children,
}) {
  const [starDetails, setStarDetails] = useState(initialStar);
  const [isOpen, setIsOpen] = useState(false);

  // The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
  const userId = useUser()?.uid || initialUserId;
  /*const [war, setWar] = useState({
    sector: "",
  });

  const onChange = (value, sector) => {
    setWar({ ...war, [sector]: value });
  };

  const handleClose = () => {
    setIsOpen(false);
    setWar({ sector: "", });
  };*/

  useEffect(() => {
    return getStarSnapshotById(id, (data) => {
      setStarDetails(data);
    });
  }, [id]);

  return (
    <>
      <StarDetails
        star={starDetails}
        userId={userId}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </StarDetails>
    </>
  );
}