document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    let currentPlayer = null;
    let categories = [];
    let categoryStats = {};
    let imagePool = [];
    let score = 0;
    let streak = 0;
    let highScore = 0;
    let answeredQuestions = 0;
    let totalQuestions = 0;
    let currentCategory = null;
    let correctAnswer = "";
    let attempts = 0;
    let maxAttempts = 3;
    let hintUsed = false;
    let timeLimit = 15; // seconds
    let timer = null;

    // Define categories and images
    const categoryImages = {
        "Daglig-Behov": ["vente.jpg", "Spise.jpg", "Ferdig.jpg", "God-morgen.jpg", "do.jpg", "Takk.jpg", "Sove.jpg", "Hjelpe.jpg"],
        "Dyr": ["Edderkopp.jpg", "Ekorn.jpg", "Elefant.jpg", "Elg.jpg", "Fisk.jpg", "Gris.jpg", "Hund.jpg", "Katt.jpg"],
        "Farger": ["Rød.jpg", "Blå.jpg", "Brun.jpg", "Grønn.jpg", "Hvit.jpg", "Lilla.jpg", "oransje.jpg", "Rosa.jpg", "Svart.jpg"],
        "Frukt-og-Gronnsaker": ["Eple.jpg", "Appelsin.jpg", "Banan.jpg", "Gulrot.jpg", "Jordbær.jpg", "Melon.jpg", "Pære.jpg"],
        "Garderoben": ["Jakke.jpg", "kle på.jpg", "Lue.jpg", "Refleks.jpg", "Regndress.jpg", "Sekk.jpg", "Sko.jpg", "Votter.jpg"],
        "Tilfeldig": ["Ball.jpg", "Sykkel.jpg"]
    };

    // Hints for the "Daglig-Behov" category
    const dagligBehovHints = {
        "Tannbørste": ["Du bruker dette hver morgen og kveld for å holde tennene rene.", "Et hygieneverktøy for tennene dine.", "Det starter med 'Tann'"],
        "Såpe": ["Du bruker dette for å vaske hendene dine.", "Det skummer når det blandes med vann.", "Det starter med 'Så'"]
        // Add more hints for other items if desired
    };

    function showWindow(windowId) {
        document.querySelectorAll('.game-window').forEach(window => {
            window.classList.remove('active');
        });
        document.getElementById(windowId).classList.add('active');
    }

    function loadCategories() {
        categories = Object.keys(categoryImages);
        const categoryButtons = document.getElementById('category-buttons');
        categoryButtons.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.replace(/-/g, ' ');
            button.className = 'button category-btn';
            button.onclick = () => startCategory(category);
            categoryButtons.appendChild(button);
        });
    }

    function loadExistingPlayers() {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const existingPlayers = document.getElementById('existing-players');
        existingPlayers.innerHTML = '';
        players.forEach(player => {
            const button = document.createElement('button');
            button.textContent = player;
            button.className = 'button';
            button.onclick = () => selectPlayer(player);
            existingPlayers.appendChild(button);
        });
    }

    function selectPlayer(playerName) {
        currentPlayer = playerName;
        const data = JSON.parse(localStorage.getItem(`player_${playerName}`)) || {};
        categoryStats = data.category_stats || {};
        score = data.score || 0;
        streak = data.streak || 0;
        highScore = data.high_score || 0;
        updateScoreDisplay();
        showStartMenu();
    }

    function createPlayer() {
        const newPlayerName = document.getElementById('new-player-name').value.trim();
        if (newPlayerName) {
            let players = JSON.parse(localStorage.getItem('players')) || [];
            if (players.includes(newPlayerName)) {
                alert('Spillernavnet eksisterer allerede.');
                return;
            }
            players.push(newPlayerName);
            localStorage.setItem('players', JSON.stringify(players));
            createPlayerData(newPlayerName);
            selectPlayer(newPlayerName);
            loadExistingPlayers();
        } else {
            alert('Vennligst skriv inn et spillernavn.');
        }
    }

    function createPlayerData(playerName) {
        const playerData = {
            category_stats: {},
            score: 0,
            streak: 0,
            high_score: 0
        };
        localStorage.setItem(`player_${playerName}`, JSON.stringify(playerData));
    }

    function savePlayerProgress() {
        if (!currentPlayer) return;
        const playerData = {
            category_stats: categoryStats,
            score: score,
            streak: streak,
            high_score: highScore
        };
        localStorage.setItem(`player_${currentPlayer}`, JSON.stringify(playerData));
    }

    function startCategory(category) {
        currentCategory = category;
        imagePool = [...categoryImages[category]];
        totalQuestions = imagePool.length;
        answeredQuestions = 0;
        score = 0;
        streak = 0;
        updateProgressDisplay();
        showGameScreen();
        loadNextImage();
    }

    function loadNextImage() {
        if (imagePool.length > 0) {
            const randomIndex = Math.floor(Math.random() * imagePool.length);
            const imageName = imagePool.splice(randomIndex, 1)[0];
            correctAnswer = imageName.split('.')[0];

            const img = document.getElementById('current-image');
            img.src = `images/${currentCategory}/${imageName}`;
            img.alt = `ASK Tegn: ${correctAnswer}`;

            document.getElementById('answer-input').value = '';
            document.getElementById('feedback').style.display = 'none';
            answeredQuestions++;
            attempts = 0;
            hintUsed = false;
            updateProgressDisplay();
            startTimer();
        } else {
            showQuizResults();
        }
    }

    function checkAnswer() {
        const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
        const feedback = document.getElementById('feedback');
        if (userAnswer === correctAnswer.toLowerCase()) {
            feedback.textContent = 'Riktig!';
            feedback.className = 'alert alert-success';
            score += hintUsed ? 5 : 10;
            streak++;
            if (streak > highScore) {
                highScore = streak;
            }
            savePlayerProgress();
            setTimeout(loadNextImage, 2000);
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                feedback.textContent = `Feil. Du har ${maxAttempts - attempts} forsøk igjen.`;
                feedback.className = 'alert alert-warning';
            } else {
                feedback.textContent = `Feil. Riktig svar er: ${correctAnswer}`;
                feedback.className = 'alert alert-danger';
                streak = 0;
                savePlayerProgress();
                setTimeout(loadNextImage, 2000);
            }
        }
        feedback.style.display = 'block';
        updateScoreDisplay();
    }

    function showDagligBehovHint() {
        if (currentCategory === 'Daglig-Behov' && !hintUsed) {
            const hints = dagligBehovHints[correctAnswer];
            if (hints && hints.length > 0) {
                const hintIndex = Math.floor(Math.random() * hints.length);
                alert(hints[hintIndex]);
                hintUsed = true;
            } else {
                alert('Ingen hint tilgjengelig for dette ordet.');
            }
        }
    }

    function startTimer() {
        clearInterval(timer);
        let timeLeft = timeLimit;
        updateTimerDisplay(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer();
            }
        }, 1000);
    }

    function updateTimerDisplay(time) {
        document.getElementById('timer').textContent = time;
    }

    function updateScoreDisplay() {
        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        document.getElementById('high-score').textContent = highScore;
    }

    function updateProgressDisplay() {
        const percentage = (answeredQuestions / totalQuestions) * 100;
        document.getElementById('progress-percentage').textContent = percentage.toFixed(1);
        document.getElementById('answered-questions').textContent = answeredQuestions;
        document.getElementById('total-questions').textContent = totalQuestions;
    }

    function showStartMenu() {
        showWindow('start-menu');
        document.getElementById('welcome-player').textContent = `Velkommen, ${currentPlayer}!`;
    }

    function showGameScreen() {
        showWindow('game-screen');
        document.getElementById('category-title').textContent = `Kategori: ${currentCategory.replace(/-/g, ' ')}`;
        document.getElementById('show-hint').style.display = currentCategory === 'Daglig-Behov' ? 'inline-block' : 'none';
    }

    function showQuizResults() {
        showWindow('quiz-results');
        document.getElementById('final-score').textContent = score;
        document.getElementById('final-high-score').textContent = highScore;
        savePlayerProgress();
    }

    function resetProgress() {
        if (confirm('Er du sikker på at du vil tilbakestille all fremgang?')) {
            categoryStats = {};
            score = 0;
            streak = 0;
            highScore = 0;
            updateScoreDisplay();
            savePlayerProgress();
        }
    }

    // Event Listeners
    document.getElementById('start-game').addEventListener('click', () => {
        showWindow('player-menu');
        loadExistingPlayers();
    });

    document.getElementById('create-player').addEventListener('click', createPlayer);
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    document.getElementById('show-hint').addEventListener('click', showDagligBehovHint);
    document.getElementById('back-to-menu').addEventListener('click', showStartMenu);
    document.getElementById('play-again').addEventListener('click', () => startCategory(currentCategory));
    document.getElementById('back-to-categories').addEventListener('click', showStartMenu);
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    document.getElementById('player-menu-btn').addEventListener('click', () => {
        showWindow('player-menu');
        loadExistingPlayers();
    });
    document.getElementById('answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Initialize the game
    loadCategories();
    showWindow('welcome-screen');
});