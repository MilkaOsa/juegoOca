// --- UIManager.js ---
// Clase UIManager que gestiona y actualiza la interfaz de usuario del juego
class UIManager {
  constructor(gameManager) {
    // Referencia a GameManager para obtener estado y puntaje
    this.gameManager = gameManager;

    // Configuración del botón de pausa/reanudación
    this.playPauseButton = document.getElementById("pauseButton");
    this.playPauseButton.addEventListener("click", () => this.togglePlayPause());

    // Elementos de la interfaz para mostrar contadores de tiempo, vidas, objetos y nivel
    this.timeCounter = document.getElementById("timeCounter");
    this.livesCounter = document.getElementById("livesCounter");
    this.itemsCounter = document.getElementById("itemsCounter");
    this.levelCounter = document.getElementById("levelCounter");
  }

  // Reinicia el contador de vidas en la interfaz
  resetLivesCounter() {
    if (this.livesCounter) {
      // Reinicia las vidas a un valor predeterminado, por ejemplo, 3
      this.livesCounter.innerHTML = `<img src="assets/images/heart.png" alt="Lives" class="counter-icon"> : 3`;
    }
  }
  // Reinicia el contador de objetos en la interfaz
  resetItemCounter() {
    if (this.itemsCounter) {
        this.itemsCounter.innerHTML = '0'; // Reinicia a 0 o al valor deseado
    }
}


  // Alterna el estado entre pausa y reanudación
  togglePlayPause() {
    if (this.gameManager.state === "gameover") {
      this.gameManager.startGame(); // Reinicia el juego si está en "gameover"
    } else {
      this.gameManager.pauseGame(); // Alterna pausa/reanudación
    }
  }

  // Actualiza el botón de pausa/play según el estado del juego
  updateButtons(state) {
    if (state === "playing") {
      this.playPauseButton.classList.remove('paused');
      this.playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Ícono de pausa
    } else if (state === "paused") {
      this.playPauseButton.classList.add('paused');
      this.playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Ícono de play
    } else if (state === "gameover") {
      this.playPauseButton.classList.remove('paused');
      this.playPauseButton.innerText = "Reiniciar";
    }
  }

  // Renderiza los contadores en la interfaz, como tiempo, vidas, objetos y nivel
  render(score, level) {
    // Formatea el tiempo de juego en minutos y segundos
    this.timeCounter.innerHTML = `<img src="assets/images/clock.png" alt="Time" class="counter-icon"> : ${Math.floor(score / 60)}:${String(score % 60).padStart(2, '0')}`;

    // Muestra las vidas actuales del jugador
    this.livesCounter.innerHTML = `<img src="assets/images/heart.png" alt="Lives" class="counter-icon"> : ${this.gameManager.player.health}`;

    // Muestra el conteo de objetos actuales
    this.itemsCounter.innerHTML = `<img src="assets/images/star.png" alt="Items" class="counter-icon"> : ${this.gameManager.objectManager.objects.length}`;

    // Actualiza el marcador de nivel
    this.updateLevelCounter(level);

    // Cambia el estilo del contador de vidas si las vidas son críticas (por ejemplo, 2 o menos)
    if (this.gameManager.player.health <= 2) {
      this.livesCounter.classList.add('critical');
    } else {
      this.livesCounter.classList.remove('critical');
    }

    // Añade un estilo de bonificación si el jugador recolecta múltiples objetos especiales
    if (this.gameManager.objectManager.objects.length % 5 === 0 && this.gameManager.objectManager.objects.length > 0) {
      this.itemsCounter.classList.add('bonus');
    } else {
      this.itemsCounter.classList.remove('bonus');
    }
  }

  // Actualiza el marcador de nivel en la interfaz
  updateLevelCounter(level) {
    if (this.levelCounter) {
      this.levelCounter.innerHTML = `<img src="assets/images/trophy.png" alt="Level" class="counter-icon"> : Nivel ${level}`;
    }
  }

  //muestre un mensaje temporal al usuario.
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000); // Duración de 3 segundos
}

}

// Exporta UIManager al contexto global
window.UIManager = UIManager;

  

