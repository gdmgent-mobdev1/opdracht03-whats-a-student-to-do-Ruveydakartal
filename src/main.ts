import { Card, TodoList } from './components';
import { State, root } from './lib';
import LoginScherm from "./components/Login";
import Register from "./components/Register";
import { getAllCards, signOutUser } from "./lib/firebase-init";
import { fireStoreDb } from './lib/firebase-init';
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  addDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const addTodoListInput = document.getElementById('addTodoListInput') as HTMLInputElement;
  const addTodoListButton = document.getElementById('addTodoListButton') as HTMLElement;
  const logOutButton = document.getElementById('logOutButton') as HTMLElement;
  const appContainer = document.getElementById('app') as HTMLElement;

  const auth = getAuth();

  let isLoggedOut = false;


  const renderLoginScreen = () => {
    appContainer.innerHTML = '';
    if (!isLoggedOut) {
      logOutButton.removeEventListener('click', handleLogoutClick);
      isLoggedOut = true;
    }
    new Register();
    new LoginScherm();

  };

  const handleLogoutClick = async () => {
    await signOutUser();
    appContainer.innerHTML = '';
    isLoggedOut = true;
  };

  let currentUserId : any = null; 

  const colRef = collection(fireStoreDb, 'lists');

  const addTodoListFirebase = async (title: string, userId: string,) => {
    const docRef = await addDoc(colRef, {
      title: title,
      userId: userId,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  }

  const getCards = async (id: string, userId: string) => {
    const cardsSnapShot = query(
      collection(fireStoreDb, `lists/${id}/cards`),
      where("userId", "==", userId)
    );
    
    const qSnap = await getDocs(cardsSnapShot);

    return qSnap.docs.map(d => (
      {
        id: d.id, 
        title: d.data().title, 
        description: d.data().description, 
        comments: d.data().comments,
        deadline: d.data().deadline,
        parentId: d.data().parentId
      }
    ));
  };
  
  addTodoListButton.addEventListener('click', async () => {
    const inputValue = addTodoListInput.value.trim();
    if (inputValue !== '') {
      await addTodoListFirebase(inputValue, currentUserId);
      addTodoListInput.value = '';
    }
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUserId = user.uid;
      console.log('Current user ID:', currentUserId);
      appContainer.innerHTML = '';


      const createTodoList = ({id, cards, title}: { id: string; cards: State[], title: string} )  => {
        let newList: TodoList = new TodoList(root, title, id);
        
        cards.forEach((card: State) => {
                new Card(card.title, newList.div as HTMLElement, newList, card.id, id, card.deadline, card.description, card.comments);
                // newList.addToDo();
              }
          )
          return newList;
      }
      
      const filterColRef = query(collection(fireStoreDb, "lists"), where("userId", "==", currentUserId));
      onSnapshot(filterColRef, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const cards = await getCards(change.doc.id, currentUserId);
            const id = change.doc.id;
            const title = change.doc.data().title;
            const todoList = createTodoList({ title, id, cards, ...change.doc.data() });
            
            // Retrieve all cards from Firestore
            const allCards = await getAllCards(id);
            console.log(allCards)
           
            allCards.forEach((card) => {
              new Card(
                card.title,
                todoList.div as HTMLElement,
                todoList,
                card.id,
                id,
                card.deadline,
                card.description, 
                card.comments, 
              );
              
            });
          }
          if (change.type === "modified") {
            // rerendering
        }
        if (change.type === "removed") {
            // removing
        
          }
        }
        );
      });


      logOutButton.addEventListener('click', handleLogoutClick);
      isLoggedOut = false;
    } else {
      console.log('No user is logged in');
      appContainer.innerHTML = '';
      renderLoginScreen();
      isLoggedOut = true;
    }
  });
});
