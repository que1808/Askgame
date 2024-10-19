// ask_game_script.js - Additional JavaScript functionality for the ASK Game

document.addEventListener('DOMContentLoaded', function() {
    // Function to show a hint
    function showHint() {
        const feedback = document.getElementById('feedback');
        if (!window.gameState.hintUsed) {
            feedback.textContent = `Hint: ${window.gameState.currentHint}`;
            feedback.className = 'alert-info';
            feedback.style.display = 'block';
            window.gameActions.setHintUsed(true);
        } else {
            feedback.textContent = 'Du har allerede brukt hint for dette ordet.';
            feedback.className = 'alert-warning';
            feedback.style.display = 'block';
        }
    }

    // Function to toggle sound effects
    let soundEnabled = true;
    function toggleSound() {
        soundEnabled = !soundEnabled;
        const soundToggleBtn = document.getElementById('sound-toggle');
        if (soundEnabled) {
            soundToggleBtn.textContent = 'Skru av lyd';
            correctSound.muted = false;
            incorrectSound.muted = false;
            timeUpSound.muted = false;
        } else {
            soundToggleBtn.textContent = 'Skru på lyd';
            correctSound.muted = true;
            incorrectSound.muted = true;
            timeUpSound.muted = true;
        }
    }

    // Function to show game instructions
    function showInstructions() {
        const instructionsContent = `
            <h2>Spillinstruksjoner</h2>
            <p>1. Velg en kategori for å starte spillet.</p>
            <p>2. Se på bildet og skriv inn riktig ord i svarfeltet.</p>
            <p>3. Du har ${window.gameState.maxAttempts} forsøk per bilde og ${window.gameState.timeLimit} sekunder på å svare.</p>
            <p>4. Bruk hint-knappen hvis du trenger hjelp, men du får færre poeng.</p>
            <p>5. Prøv å få høyest mulig poengsum og streak!</p>
        `;
        
        const instructionsModal = document.createElement('div');
        instructionsModal.className = 'modal';
        instructionsModal.innerHTML = `
            <div class="modal-content">
                ${instructionsContent}
                <button id="close-instructions" class="btn">Lukk</button>
            </div>
        `;
        
        document.body.appendChild(instructionsModal);
        
        document.getElementById('close-instructions').addEventListener('click', () => {
            document.body.removeChild(instructionsModal);
        });
    }

    // Add a hint button to your HTML if not already present
    const gameScreen = document.getElementById('game-screen');
    const hintButton = document.createElement('button');
    hintButton.id = 'hint-button';
    hintButton.className = 'btn hint-btn';
    hintButton.textContent = 'Hint';
    gameScreen.insertBefore(hintButton, document.getElementById('submit-answer').nextSibling);

    // Add a sound toggle button
    const soundToggleBtn = document.createElement('button');
    soundToggleBtn.id = 'sound-toggle';
    soundToggleBtn.className = 'btn sound-btn';
    soundToggleBtn.textContent = 'Skru av lyd';
    gameScreen.appendChild(soundToggleBtn);

    // Add an instructions button
    const instructionsBtn = document.createElement('button');
    instructionsBtn.id = 'instructions-btn';
    instructionsBtn.className = 'btn instructions-btn';
    instructionsBtn.textContent = 'Instruksjoner';
    document.getElementById('welcome-screen').appendChild(instructionsBtn);

    // Event listeners for new buttons
    hintButton.addEventListener('click', showHint);
    soundToggleBtn.addEventListener('click', toggleSound);
    instructionsBtn.addEventListener('click', showInstructions);

    // Additional styles for new elements
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: flex;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background-color: rgb(12, 12, 19);
            padding: 20px;
            border-radius: 10px;
            max-width: 80%;
            color: white;
        }
        .modal-content h2 {
            margin-bottom: 15px;
        }
        .modal-content p {
            margin-bottom: 10px;
        }
        .alert-info {
            background-color: rgba(23, 162, 184, 0.2);
            color: #17a2b8;
        }
        #feedback {
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
});