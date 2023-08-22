import { createUser } from "../lib/firebase-init";
import LoginScherm from "../components/Login";

export default class Register {
    constructor() {
        this.render();
    }

    render() {
        

        const loginScherm = document.querySelector('.loginScherm') as HTMLDivElement;

        const ToDoScherm = document.getElementById('addTodoListDiv') as HTMLInputElement;

        const registerScherm = document.createElement('div');
        registerScherm.classList.add('registerScherm');
        registerScherm.classList.add('hide');
        const title = document.createElement('h2')
        title.innerText = 'Registreer je hier!'
        const registerForm = document.createElement('form');
        registerForm.classList.add('registerForm');
        
        // Create input fields for email, password, and username
        const emailInput = document.createElement('input');
        emailInput.classList.add('registerInput');
        emailInput.setAttribute('type', 'email');
        emailInput.setAttribute('placeholder', 'Enter your email');

        const passwordInput = document.createElement('input');
        passwordInput.classList.add('registerInput');
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('placeholder', 'Enter your password');
        
        const registerButton = document.createElement('button');
        registerButton.classList.add('registerButton', 'btn' );
        registerButton.setAttribute('type', 'submit');
        registerButton.innerText = 'Registreer';

        const loginLink = document.createElement('a');
        loginLink.classList.add('loginLink');
        loginLink.innerText = ' Al geregistreerd? Meld hier aan.';
        
        
        registerForm.append(title,emailInput, passwordInput, registerButton, loginLink);
        registerScherm.append(registerForm);
        document.body.append(registerScherm);
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value;
            const password = passwordInput.value;

            
            try {
                await createUser(email, password); // Create user with email and password
              
                registerScherm.classList.add('hide');
                ToDoScherm.classList.remove('hide');
            } catch (error) {
                console.error('Error creating user:', error);
                // Handle error (display error message, etc.)
            }
        });

        
        loginLink.addEventListener('click', () => {
            const login = new LoginScherm();
            registerScherm.classList.add('hide');
            
        });
        }
    }
