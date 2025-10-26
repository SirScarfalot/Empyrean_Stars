import { generateFakeStars } from "@/src/lib/fakeStars.js";

import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";

export async function updateRestaurantImageReference(
  restaurantId,
  publicImageUrl
) {
  const restaurantRef = doc(collection(db, "restaurants"), restaurantId);
  if (restaurantRef) {
    await updateDoc(restaurantRef, { photo: publicImageUrl });
  }
}

const updateWithRating = async (
  transaction,
  docRef,
  newRatingDocument,
  review
) => {
  const restaurant = await transaction.get(docRef);
  const data = restaurant.data();
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
  const newSumRating = (data?.sumRating || 0) + Number(review.rating);
  const newAverage = newSumRating / newNumRatings;

  transaction.update(docRef, {
    numRatings: newNumRatings,
    sumRating: newSumRating,
    avgRating: newAverage,
    lastReviewUserId: review.userId,
  });

  transaction.set(newRatingDocument, {
    ...review,
    timestamp: Timestamp.fromDate(new Date()),
  });
};

export async function addReviewToRestaurant(db, restaurantId, review) {
  if (!restaurantId) {
          throw new Error("No restaurant ID has been provided.");
  }

  if (!review) {
          throw new Error("A valid review has not been provided.");
  }

  try {
          const docRef = doc(collection(db, "restaurants"), restaurantId);
          const newRatingDocument = doc(
                  collection(db, `restaurants/${restaurantId}/ratings`)
          );

          // corrected line
          await runTransaction(db, transaction =>
                  updateWithRating(transaction, docRef, newRatingDocument, review)
          );
  } catch (error) {
          console.error(
                  "There was an error adding the rating to the restaurant",
                  error
          );
          throw error;
  }
}

export async function addWar(db, starId) {
  if (!starId) {
          throw new Error("No star ID has been provided.");
  }

  try {
          const docRef = doc(collection(db, "stars"), starId);
          const newWarInstance = doc(
                  collection(db, `stars/${starId}/wars`)
          );

          // corrected line
          await runTransaction(db, transaction =>
                  updateWar(transaction, docRef, newWarInstance)
          );
  } catch (error) {
          console.error(
                  "There was an error declaring war",
                  error
          );
          throw error;
  }
}

function applyQueryFilters(q, { sector, sort }) {
  if (sector) {
    q = query(q, where("sector", "==", sector));
  }
  if (sort === "GDP" || !sort) {
    q = query(q, orderBy("GDP", "desc"));
  } else if (sort === "name") {
    q = query(q, orderBy("name", "desc"));
  }
  return q;
}

export async function getRestaurants(db = db, filters = {}) {
  let q = query(collection(db, "restaurants"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

export async function getStars(db = db, filters = {}) {
  let q = query(collection(db, "stars"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
}

export function getRestaurantsSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "restaurants"));
  q = applyQueryFilters(q, filters);

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    cb(results);
  });
}

export function getStarsSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "stars"));
  q = applyQueryFilters(q, filters);

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        // timestamp: doc.data().timestamp.toDate(),
      };
    });

    cb(results);
  });
}

export async function getRestaurantById(db, restaurantId) {
  if (!restaurantId) {
    console.log("Error: Invalid ID received: ", restaurantId);
    return;
  }
  const docRef = doc(db, "restaurants", restaurantId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}

export async function getStarById(db, starId) {
  if (!starId) {
    console.log("Error: Invalid ID received: ", starId);
    return;
  }
  const docRef = doc(db, "stars", starId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
  //  timestamp: docSnap.data().timestamp.toDate(),
  };
}

export function getRestaurantSnapshotById(restaurantId, cb) {
  return;
}

export function getStarSnapshotById(starId, cb){
  return;
}

export async function getWarsByStarId(db, starId) {
  if (!starId) {
    console.log("Error: Invalid starId received: ", starId);
    return;
  }

  const q = query(
    collection(db, "stars", starId, "wars"),
    orderBy("timestamp", "desc")
  );

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      // timestamp: doc.data().timestamp.toDate(),
    };
  });
}

export async function getReviewsByRestaurantId(db, restaurantId) {
  if (!restaurantId) {
    console.log("Error: Invalid restaurantId received: ", restaurantId);
    return;
  }

  const q = query(
    collection(db, "restaurants", restaurantId, "ratings"),
    orderBy("timestamp", "desc")
  );

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

export function getReviewsSnapshotByRestaurantId(restaurantId, cb) {
  if (!restaurantId) {
    console.log("Error: Invalid restaurantId received: ", restaurantId);
    return;
  }

  const q = query(
    collection(db, "restaurants", restaurantId, "ratings"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });
    cb(results);
  });
}

export async function addFakeStars() {
  const data = await generateFakeStars();
  for (const starData of data) {
    try {
      const docRef = await addDoc(collection(db, "stars"), starData);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.log("There was an error adding new stars");
      console.error("Error adding new stars: ", e);
    }
  }
}
