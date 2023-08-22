/* eslint-disable import/no-cycle */
import { v4 as uuidv4 } from 'uuid';
import { root, State } from '../lib/index';
import { dragstartHandler } from '../lib/dragAndDrop';
import { deleteCardFromFirebase } from '../lib/firebase-init';
import { updateTodoFirebase } from '../lib/firebase-init';
import Comment from './Comment';
import EditableText from './EditableText';
import TodoList from './TodoList';

export default class Card {
  place: HTMLElement;

  todoList: TodoList;

  state: State;

  menuContainer?: HTMLElement;

  card?: HTMLDivElement ;

  deleteButton?: HTMLButtonElement ;

  p?: HTMLParagraphElement ;

  menu?: HTMLDivElement ;

  menuTitle?: HTMLDivElement ;

  menuDescription?: HTMLDivElement ;

  commentsInput?: HTMLInputElement ;

  commentsButton?: HTMLButtonElement ;

  menuComments?: HTMLDivElement;

  editableDescription?: EditableText ;

  editableText?: EditableText;
  id: string;

  parentId: string;

  deadlineElement?: HTMLParagraphElement; 

  deadlineInput?: HTMLInputElement ; 

  static editableTextMap: Record<string, EditableText> = {};


  constructor(title: string, place: HTMLElement, todoList: TodoList, id = '_'+uuidv4(), parentId:string, deadline: string, description:string = 'Click to write a description...', comments: string[] ) {
    this.id = id;
    this.place = place;
    this.todoList = todoList;
    this.state = {
      id,
      title,
      description: description || 'Click to write a description...',
      comments,
      deadline,
    };
    this.parentId = parentId;

    this.render();
    
  }

  render(): void {
    this.card = document.createElement('div');
    this.card.classList.add('card');
    this.card.setAttribute('draggable', 'true');
    this.card.id = this.id;
    this.deleteButton = document.createElement('button');
    this.deleteButton.classList.add('delete-btn')
    this.card.addEventListener('click', (e) => {
      if (e.target !== this.deleteButton) {
        this.showMenu.call(this);
      }
    });
    this.card.addEventListener('dragstart', dragstartHandler);

    this.p = document.createElement('p');
    this.p.innerText = this.state.title;

    this.deadlineElement = document.createElement('p'); 
    this.deadlineElement.innerText = `Deadline: ${this.state.deadline}`; 

    this.deleteButton = document.createElement('button');
    this.deleteButton.classList.add('delete-btn')

    this.deleteButton.addEventListener('click', () => {
      this.deleteCard.call(this);
      deleteCardFromFirebase(this.parentId!, this.id);
    });

 

    this.card.append(this.p);
    this.card.append(this.deadlineElement); 
    this.card.append(this.deleteButton);

    this.place.append(this.card);
  }

  deleteCard(): void {
    this.card?.remove();
    const i = this.todoList.cardArray.indexOf(this);
    this.todoList.cardArray.splice(i, 1);
  }

  showMenu(): void {
    // Create elements
    this.menu = document.createElement('div');
    this.menuContainer = document.createElement('div');
    this.menuTitle = document.createElement('div');
    this.menuDescription = document.createElement('div');
    this.commentsInput = document.createElement('input');
    this.commentsButton = document.createElement('button');
    this.menuComments = document.createElement('div');

    // Add class names
    this.menu.className = 'menu';
    this.menuContainer.className = 'menuContainer';
    this.menu.setAttribute('data-id', this.id);
    this.menu.setAttribute('data-todolist-id', this.parentId )
    this.menuTitle.className = 'menuTitle';
    this.menuDescription.className = 'menuDescription';
    this.menuComments.className = 'menuComments';
    this.commentsInput.className = 'commentsInput comment';
    this.commentsButton.className = 'commentsButton btn-save';
    
    // Add inner title
    this.commentsButton.innerText = 'Add';
    this.commentsInput.placeholder = 'Write a comment...';

    // Create the deadline input element
    this.deadlineInput = document.createElement('input');
    this.deadlineInput.className = 'deadlineInput';
    this.deadlineInput.type = 'date';
    this.deadlineInput.value = this.state.deadline;


    // Event listeners
    this.menuContainer.addEventListener('click', (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains('menuContainer') && (this.menuContainer != null)) {
        this.menuContainer?.remove();
      }
    });

    this.commentsButton.addEventListener('click', () => {
      if (this.commentsInput?.value !== '' && (this.commentsInput != null)) {
        this.addComment(this.commentsInput.value);
        
                if (this.menuComments instanceof HTMLElement) {
                  this.menuComments.innerHTML='';
                  this.state.comments?.forEach((comment) => {
                  // eslint-disable-next-line no-new
                  new Comment(comment, this.menuComments, this);
                } );
                this.commentsInput.value = '';
                } 
      }
    });

    // Append
    this.menu.append(this.menuTitle);
    this.menu.append(this.menuDescription);
    this.menu.append(this.deadlineInput);
    this.menu.append(this.commentsInput);
    this.menu.append(this.commentsButton);
    this.menu.append(this.menuComments);
    this.menuContainer.append(this.menu);
    root.append(this.menuContainer);
    this.editableDescription = new EditableText(this.state.description, this.menuDescription, this, 'description', 'textarea', this.id, this.parentId);
    this.editableText = new EditableText(this.state.title, this.menuTitle, this, 'title', 'input', this.id, this.parentId);

    this.menuComments = document.createElement('div');
    this.menuComments.className = 'menuComments';
    this.menu.append(this.menuComments);

    this.state.comments.forEach((comment) => {
      new Comment(comment, this.menuComments, this); // Pass this.menuComments as place
    });

  
    this.deadlineInput.addEventListener('change', () => {
      if (this.deadlineInput instanceof HTMLInputElement) {
        this.state.deadline = this.deadlineInput.value;
        this.deadlineElement!.innerText = `Deadline: ${this.state.deadline}`;
        updateTodoFirebase(this.parentId, this.id, 'deadline', this.deadlineInput.value);
      }
    });
  
  }

  addComment(newComment: string): void {
    if (this.state.comments) {
      // Add the new comment to the local state
      this.state.comments.push(newComment);
  
      // Update comments in Firebase
      updateTodoFirebase(this.parentId, this.id, 'comments', this.state.comments);
    }
  }

    // renderComments(): void {
  //   if (this.menuComments instanceof HTMLElement && this.menuComments != null) {
  //     const currentCommentsDOM = Array.from(this.menuComments.childNodes);
  //     currentCommentsDOM.forEach((commentDOM) => {
  //       commentDOM.remove();
  //     });

  //     this.state.comments?.forEach((comment) => {
  //       if (this.menuComments instanceof HTMLElement) {
  //         // eslint-disable-next-line no-new
  //         new Comment(comment, this.menuComments, this);
  //       }
  //     });
  //   }
  // }

}
