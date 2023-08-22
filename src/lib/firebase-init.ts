// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  deleteDoc, 
  collection,
  addDoc,
  setDoc, 
  getDocs,
  getDoc
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyA1G7PbgmRo7pXKHw7N1_bQ7GBJsTHJKro",
  authDomain: "whats-a-student-to-do-dd711.firebaseapp.com",
  projectId: "whats-a-student-to-do-dd711",
  storageBucket: "whats-a-student-to-do-dd711.appspot.com",
  messagingSenderId: "218621961007",
  appId: "1:218621961007:web:677400aa02a0714d9b77da"
};


// Initialize Firebase

export const fireStoreApp = initializeApp(firebaseConfig);


// get data from firestore
export const fireStoreDb = getFirestore(fireStoreApp);

export const addTodoFirebase = async(text: string, todoId: string, deadline:string) => {
  const cardsSnapShot = collection(fireStoreDb, `lists/${todoId}/cards`);
  
  const docRef = await addDoc(cardsSnapShot, {
    title: text,
    description: "",
    comments: [],
    deadline: deadline,
    }
  );
  return docRef.id;
}

export const updateTodoFirebase = async(todoListId: string, id: string, attribute: string, value: any ) => {
  console.log(todoListId, id, attribute, value);
  if(attribute === 'title'){
    const answer = await setDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id), {
      title: value
    }, { merge: true });
  }
  if(attribute === 'description'){
    const answer = await setDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id), {
      description: value
    }, { merge: true });

  }
  if (attribute === 'comments') {
    const answer = await setDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id), {
      comments: value // Pass the entire comments array
    }, { merge: true });
  }

  if(attribute === 'deadline'){
    const answer = await setDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id), {
      deadline: value
    }, { merge: true });

  }

}


export const updateTimeFirebase = async(todoListId: string,  attribute: string, value: any ) => {
console.log(todoListId, attribute, value);
if (attribute === 'elapsedTime') {
  // Handle updating elapsed time specifically
  const answer = await setDoc(doc(fireStoreDb, `lists/${todoListId}`), {
    elapsedTime: value 
  }, { merge: true });
}
}
export const deleteTodoListFirebase = async(id: string) => {
  await deleteDoc(doc(fireStoreDb, "lists", id));
}

export const deleteCardFromFirebase = async(todoListId: string, id: string) => {
  await deleteDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id));
}



// auth
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export const createUser = async(email: string, password: string,) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return user;
}

export const signIn = async(email: string, password: string,) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return user;
}


export const signOutUser = async() => {
  await signOut(auth);
  
}

// google auth form 

export const googleSignInRedirect = () => {
  const provider = new GoogleAuthProvider();

  signInWithRedirect(auth, provider);
};



export const getAllCards = async (todoListId: string) => {
  const cardsCollection = collection(fireStoreDb, `lists/${todoListId}/cards`);

  const querySnapshot = await getDocs(cardsCollection);

  const cards: any[] = [];

  querySnapshot.forEach((doc) => {
    const cardData = doc.data();
    cards.push({
      id: doc.id,
      title: cardData.title,
      description: cardData.description,
      comments: cardData.comments || [],
      deadline: cardData.deadline,
      parentId: cardData.parentId
    });
  });

  return cards;
};

// export const getElapsedTimeFromFirebase = async (todoListId: string) => {
//   const docRef = doc(fireStoreDb, `lists/${todoListId}`);
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     const data = docSnap.data();
//     console.log(data.elapsedTime);
//     return data.elapsedTime || 0 ; // Return 0 if elapsedTime doesn't exist
//   }
//   return 0; // Return 0 if document doesn't exist
// };

export const getElapsedTimeFromFirebase = async (todoListId: string): Promise<number> => {
  const docRef = doc(fireStoreDb, `lists/${todoListId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    if (data && typeof data.elapsedTime === 'string') {
      // Convert the time string to milliseconds (assuming format "hh:mm:ss")
      const timeParts = data.elapsedTime.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      // Calculate total milliseconds
      const elapsedTimeInMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;

      return elapsedTimeInMilliseconds;
    }
  }

  // Default value (0) if elapsed time doesn't exist or is invalid
  return 0;
};