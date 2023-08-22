/* eslint-disable import/no-cycle */
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';
import { updateTodoFirebase } from '../lib/firebase-init';

export default class Comment {
  title: string;

  place: HTMLElement;

  card: Card;

  div?: HTMLDivElement;

  id: string;

  constructor(text: string, place: HTMLElement, card: Card) {
    this.title = text;
    this.place = place;
    this.card = card;
    this.id = uuidv4();
    this.render();
  }

  render(): void {
    // this.div = document.createElement('div');
    // this.div.className = 'comment';
    // this.card.id = this.id;
    // this.div.innerText = this.title;
    // this.place.append(this.div);

    this.div = document.createElement('div');
    this.div.className = 'comment';
    this.div.innerText = this.title;

    // const removeButton = document.createElement('button');
    // removeButton.innerText = 'Remove';
    // removeButton.addEventListener('click', () => {
    //   this.removeComment();
    // });

    // this.div.append(removeButton); // Add remove button

    this.place.append(this.div);
  }

  removeComment(): void {
    // Remove the comment from the local state
    const commentIndex = this.card.state.comments.indexOf(this.title);
    if (commentIndex !== -1) {
      this.card.state.comments.splice(commentIndex, 1);

      // Update comments in Firebase
      updateTodoFirebase(this.card.parentId, this.card.id, 'comments', this.card.state.comments);
    }

    // Remove the comment's DOM element
    if (this.div) {
      this.div.remove();
    }
}
}
