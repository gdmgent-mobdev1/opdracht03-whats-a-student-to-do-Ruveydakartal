import { signIn, googleSignInRedirect } from "../lib/firebase-init";
import Register from "./Register";

export default class LoginScherm {
    constructor() {
        this.render();
    }

    render() {

        const registerScherm = document.querySelector('.registerScherm') as HTMLInputElement;

        const ToDoScherm = document.getElementById('addTodoListDiv') as HTMLInputElement;
        ToDoScherm.classList.add('hide');

        const loginScherm = document.createElement('div');
        loginScherm.classList.add('loginScherm');
        const title = document.createElement('h2')
        title.innerText = "Log je hier in!"
        const loginForm = document.createElement('form');
        loginForm.classList.add('loginForm');
        
        // Create input fields for email, password, and username
        const emailInput = document.createElement('input');
        emailInput.classList.add('loginInput');
        emailInput.setAttribute('type', 'email');
        emailInput.setAttribute('placeholder', 'Enter your email');

        const passwordInput = document.createElement('input');
        passwordInput.classList.add('loginInput');
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('placeholder', 'Enter your password');
        
        const loginButton = document.createElement('button');
        loginButton.classList.add('loginButton', 'btn');
        loginButton.setAttribute('type', 'submit');
        loginButton.innerText = 'Meld Aan';

        // google login button 
        const googleButton = document.createElement('button');
        googleButton.classList.add('googleButton', 'btn');
        googleButton.setAttribute('type', 'submit');
        googleButton.innerText = 'Meld Aan met Google';

        const registerLink = document.createElement('a');
        registerLink.classList.add('registerLink');
        registerLink.innerText = ' Nog niet geregistreerd? Registreer hier.';

        
        loginForm.append(title, emailInput, passwordInput, loginButton, googleButton, registerLink);
        loginScherm.append(loginForm);
        document.body.append(loginScherm);

        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value;
            const password = passwordInput.value;

            
            try {
                await signIn(email, password); // Create user with email and password
              
                loginScherm.classList.add('hide');
                ToDoScherm.classList.remove('hide');
            } catch (error) {
                console.error('Error creating user:', error);
                // Handle error (display error message, etc.)
            }
        });

        registerLink.addEventListener('click', () => {
                new Register();
                registerScherm.classList.remove('hide');
                loginScherm.classList.add('hide');
        });

        googleButton.addEventListener('click', async () => {
            googleSignInRedirect();
        });
    }
}

