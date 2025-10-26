import Star from "@/src/components/Star.jsx";
//import { Suspense } from "react";
import { getStarById } from "@/src/lib/firebase/firestore.js";
import {
  getAuthenticatedAppForUser,
  getAuthenticatedAppForUser as getUser,
} from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

export default async function Home(props) {
  // This is a server component, we can access URL
  // parameters via Next.js and download the data
  // we need for this page
  const params = await props.params;
  const { currentUser } = await getUser();
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const star = await getStarById(
    getFirestore(firebaseServerApp),
    params.id
  );

  return (
    <main className="main__restaurant">
      <Star
        id={params.id}
        initialStar={star}
        initialUserId={currentUser?.uid || ""}
      >
      </Star>
    </main>
  );
}