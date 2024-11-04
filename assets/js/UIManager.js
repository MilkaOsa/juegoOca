// --- UIManager.js ---

// Clase UIManager que gestiona la interfaz de usuario
class UIManager {
  constructor(gameManager) {
    this.gameManager = gameManager;

    // Referencia y configuración del botón de pausa/reanudación
    this.playPauseButton = document.getElementById("pauseButton");
    if (this.playPauseButton) {
      this.playPauseButton.addEventListener("click", () => this.togglePlayPause());
    } else {
      console.warn("El elemento pauseButton no se ha encontrado en el DOM.");
    }

    // Referencias a los contadores de la interfaz
    this.timeCounter = document.getElementById("timeCounter");
    this.livesCounter = document.getElementById("livesCounter");
    this.itemsCounter = document.getElementById("itemsCounter");
    this.levelCounter = document.getElementById("levelCounter");

    // Verifica que todos los elementos de la interfaz estén correctamente cargados
    this.verifyUIElements();
  }

  // Método para verificar que todos los elementos de la interfaz existan
  verifyUIElements() {
    if (!this.timeCounter) console.warn("El elemento timeCounter no se ha encontrado en el DOM.");
    if (!this.livesCounter) console.warn("El elemento livesCounter no se ha encontrado en el DOM.");
    if (!this.itemsCounter) console.warn("El elemento itemsCounter no se ha encontrado en el DOM.");
    if (!this.levelCounter) console.warn("El elemento levelCounter no se ha encontrado en el DOM.");
  }

  // Reinicia el contador de vidas en la interfaz
  resetLivesCounter() {
    if (this.livesCounter) {
      this.livesCounter.innerHTML = `<img src="assets/images/heart.png" alt="Lives" class="counter-icon"> : 3`;
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

  // Renderiza y actualiza los contadores de la interfaz
  render(score) {
    if (this.timeCounter) {
      this.timeCounter.innerHTML = `<img src="assets/images/clock.png" alt="Time" class="counter-icon"> : ${Math.floor(score / 60)}:${String(score % 60).padStart(2, '0')}`;
    }
    if (this.livesCounter) {
      this.livesCounter.innerHTML = `<img src="assets/images/heart.png" alt="Lives" class="counter-icon"> : ${this.gameManager.player.health}`;
    }
    if (this.itemsCounter) {
      this.itemsCounter.innerHTML = `<img src="assets/images/star.png" alt="Items" class="counter-icon"> : ${this.gameManager.objectManager.objects.length}`;
    }
    this.updateLevelCounter();
  }

  // Actualiza el contador de nivel en la interfaz
  updateLevelCounter() {
    if (this.levelCounter) {
      const currentLevel = this.gameManager.levelManager ? this.gameManager.levelManager.currentLevel || 1 : 1;
      this.levelCounter.innerHTML = `<img src="assets/images/trophy.png" alt="Level" class="counter-icon"> : Nivel ${currentLevel}`;
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
