import { updateTimeFirebase } from "../lib/firebase-init";

export default class Timer {
    timerElement: HTMLDivElement;
    timeDisplay: HTMLSpanElement;
    startButton: HTMLButtonElement;
    stopButton: HTMLButtonElement;
    timerInterval: any;
    startTime: number = 0;
    elapsedTime: number = 0;
    todoListId: string;

  
    constructor(todoListId: string,  initialElapsedTime: number = 0) {
        this.todoListId = todoListId;
        this.elapsedTime = initialElapsedTime;
        this.startTime = Date.now() - this.elapsedTime;

      this.timerElement = document.createElement('div');
      this.timerElement.classList.add('timer');
      this.timeDisplay = document.createElement('span');

      this.elapsedTime = Date.now() - this.startTime;
      const formattedTime = this.formatTime(this.elapsedTime);
      this.timeDisplay.innerText = formattedTime;
      this.startButton = document.createElement('button');
      this.startButton.innerText = 'Start';
      this.startButton.classList.add('btn-start');
      this.stopButton = document.createElement('button');
      this.stopButton.innerText = 'Stop';
      this.stopButton.classList.add('btn-stop');
  
      this.timerElement.append(this.timeDisplay);
      this.timerElement.append(this.startButton);
      this.timerElement.append(this.stopButton);
  
      this.startButton.addEventListener('click', () => this.startTimer());
      this.stopButton.addEventListener('click', () => this.stopTimer());
    }

  
    startTimer() {
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            const formattedTime = this.formatTime(this.elapsedTime);
            console.log(formattedTime)
            this.timeDisplay.innerText = formattedTime;
        }, 1000);
    }
  
    stopTimer() {
        clearInterval(this.timerInterval);

        // Calculate the elapsed time and convert it to the desired format
         const formattedElapsedTime = this.formatTime(this.elapsedTime);
        // Update the Firebase entry with the elapsed time
        // Pass the appropriate arguments (todoListId, cardId, attribute, value)
        updateTimeFirebase(this.todoListId, 'elapsedTime', formattedElapsedTime);
        
      }

  
    formatTime(milliseconds: number) {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  
    getElement() {
      return this.timerElement;
    }
  }
  