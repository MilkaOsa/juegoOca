// --- UIManager.js ---

// Clase UIManager que gestiona la interfaz de usuario
class UIManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.playPauseButton = document.getElementById("pauseButton");
    if (this.playPauseButton) {
      this.playPauseButton.addEventListener("click", () => this.togglePlayPause());
    } else {
      console.warn("El elemento pauseButton no se ha encontrado en el DOM.");
    }
    this.timeCounter = document.getElementById("timeCounter");
    this.livesCounter = document.getElementById("livesCounter");
    this.itemsCounter = document.getElementById("itemsCounter");
    this.levelCounter = document.getElementById("levelCounter");
    // Si deseas agregar un contador de score, podrías hacerlo aquí:
    //this.scoreCounter = document.getElementById("scoreCounter");

    this.verifyUIElements();
  }

  verifyUIElements() {
    if (!this.timeCounter) console.warn("El elemento timeCounter no se ha encontrado en el DOM.");
    if (!this.livesCounter) console.warn("El elemento livesCounter no se ha encontrado en el DOM.");
    if (!this.itemsCounter) console.warn("El elemento itemsCounter no se ha encontrado en el DOM.");
    if (!this.levelCounter) console.warn("El elemento levelCounter no se ha encontrado en el DOM.");
  }

  render() {
    if (this.timeCounter) {
      let seconds = Math.floor(this.gameManager.elapsedTime);
      let minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      this.timeCounter.innerHTML = `<img src="assets/images/clock.png" alt="Time" class="counter-icon"> : ${minutes}:${String(seconds).padStart(2, '0')}`;
    }
    if (this.livesCounter) {
      this.livesCounter.innerHTML = `<img src="assets/images/heart.png" alt="Lives" class="counter-icon"> : ${this.gameManager.player.health}`;
    }
    if (this.itemsCounter) {
      this.itemsCounter.innerHTML = `<img src="assets/images/star.png" alt="Items" class="counter-icon"> : ${this.gameManager.score}`;
    }
    this.updateLevelCounter();
  }


  updateLevelCounter() {
    if (this.levelCounter) {
      this.levelCounter.innerHTML = `<img src="assets/images/trophy.png" alt="Level" class="counter-icon"> : Nivel ${this.gameManager.currentLevelNumber}`;
    }
  }


  // Reinicia el contador de vidas en la interfaz
  resetLivesCounter() {
    if (this.livesCounter) {
      this.livesCounter.innerHTML = `<img src="assets/images/heart.png" alt="Lives" class="counter-icon"> : 100`;
    }
  }

  // Reinicia el contador de objetos en la interfaz
  resetItemCounter() {
    if (this.itemsCounter) {
      this.itemsCounter.innerHTML = '0';
    }
  }

  // Alterna entre el estado de pausa y reanudación del juego
  togglePlayPause() {
    if (this.gameManager.state === "gameover") {
      this.gameManager.startGame(); // Reinicia el juego si está en estado "gameover"
    } else {
      this.gameManager.pauseGame(); // Alterna entre pausa y reanudación
    }
    // Llamar a updateButtons para asegurar que el botón refleje el estado actual del juego
    this.updateButtons(this.gameManager.state);
  }

  // Actualiza el botón de pausa/play según el estado del juego
  updateButtons(state) {
    if (!this.playPauseButton) return;

    switch (state) {
      case "playing":
        this.playPauseButton.classList.remove('paused');
        this.playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        break;
      case "paused":
        this.playPauseButton.classList.add('paused');
        this.playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        break;
      case "gameover":
        this.playPauseButton.classList.remove('paused');
        this.playPauseButton.innerText = "Reiniciar";
        break;
      default:
        console.warn(`Estado desconocido: ${state}`);
    }
  }
  showGameOverScreen() {
    // Crea un overlay si no existe
    let overlay = document.getElementById("gameOverOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "gameOverOverlay";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "column";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "1000";
      
      const message = document.createElement("h1");
      message.style.color = "white";
      message.textContent = "Game Over";
      
      const resetButton = document.createElement("button");
      resetButton.textContent = "Reiniciar";
      resetButton.style.padding = "10px 20px";
      resetButton.style.fontSize = "16px";
      resetButton.addEventListener("click", () => {
        overlay.remove();
        this.gameManager.resetGame();
        this.gameManager.startGame();
      });
      
      overlay.appendChild(message);
      overlay.appendChild(resetButton);
      document.body.appendChild(overlay);
    } else {
      overlay.style.display = "flex";
    }
  }
  

  // Muestra un mensaje temporal al usuario
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    
    // Elimina la notificación después de 3 segundos
    setTimeout(() => notification.remove(), 3000);
  }
}

window.UIManager = UIManager;
