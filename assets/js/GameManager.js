// --- GameManager.js ---
// Clase principal GameManager que gestiona el flujo principal del juego
class GameManager {
  constructor(canvas) {
    // Configuración de música de fondo
    this.music = new Audio('assets/mp3/gameplay-music.mp3'); 
    this.music.volume = 0.02; // Volumen de la música al 10%

    // Configuración del canvas y su contexto para dibujar
    this.canvas = canvas; 
    this.ctx = this.canvas.getContext("2d");

    // Inicialización de los diferentes gestores de juego
    this.levelManager = new LevelManager(canvas, this); // Niveles
    this.objectManager = new ObjectManager(canvas, this); // Objetos
    this.enemyManager = new EnemyManager(this); // Enemigos
    this.uiManager = new UIManager(this); // Interfaz de usuario

    // Configuración inicial del jugador
    this.player = new Player(100, 100, 5, this.levelManager);

    // Estado inicial del juego y variables de control
    this.state = "start"; // Estado actual ("start", "playing", "paused")
    this.score = 0; // Puntaje inicial
    this.level = 1; // Nivel inicial
    this.keysPressed = {}; // Teclas presionadas

    // Eventos de teclado para controlar al jugador
    window.addEventListener('keydown', (event) => {
      this.keysPressed[event.key] = true;
    });
    window.addEventListener('keyup', (event) => {
      this.keysPressed[event.key] = false;
    });

    // Configuración inicial del nivel
    this.levelManager.setLevel(this.level);
  }

  // Inicia el juego y establece el estado en "playing"
  startGame() {
    this.music.loop = true; // Música en bucle
    this.music.play(); // Inicia la música de fondo
    this.state = "playing"; // Cambia el estado del juego

    // Actualización de la interfaz de usuario al iniciar
    this.uiManager.updateButtons(this.state); 
    document.getElementById("startScreen").style.display = "none"; // Oculta pantalla de inicio
    document.getElementById("gameCanvas").classList.add("active"); // Muestra el canvas
    document.getElementById("controls").classList.add("active"); // Muestra los controles

    // Configura y genera objetos para el nivel actual
    this.levelManager.setLevel(this.level); 
    this.objectManager.generateObjectsForLevel(this.level, ['star', 'shield', 'health']);

    // Inicia el bucle principal del juego
    this.mainLoop();
  }

  // Pausa o reanuda el juego
  pauseGame() {
    if (this.state === "playing") {
      this.music.pause(); // Pausa la música
      this.state = "paused"; // Cambia el estado a "paused"
    } else if (this.state === "paused") {
      this.music.play(); // Reanuda la música
      this.state = "playing"; // Cambia el estado a "playing"
      this.mainLoop(); // Reanuda el bucle del juego
    }
    this.uiManager.updateButtons(this.state); // Actualiza los botones de UI
  }

  // Pasa al siguiente nivel
  nextLevel() {
    if (this.player) this.player.update({}, true); // Reinicia posición del jugador
    if (this.uiManager && typeof this.uiManager.resetItemCounter === 'function') {
      this.uiManager.resetItemCounter(); // Reinicia contador de objetos
    } else {
      console.warn("resetItemCounter no está definido en UIManager");
    }

    // Configuración del siguiente nivel
    this.music.play(); // Asegura que la música siga
    this.level++; // Incrementa el nivel
    this.levelManager.setLevel(this.level); // Establece el nuevo nivel
    this.objectManager.generateObjectsForLevel(this.level); // Genera nuevos objetos
    this.enemyManager.resetEnemies(); // Reinicia los enemigos
    this.uiManager.updateLevelCounter(this.level); // Actualiza el contador de nivel en la UI
    this.uiManager.resetLivesCounter(); // Reinicia el contador de vidas
    this.uiManager.showNotification(`¡Nivel ${this.level} Completado!`); // Notificación al jugador
    this.setupLevelDifficulty(this.level); // Ajusta la dificultad
  }

  // Configura la dificultad en función del nivel actual
  setupLevelDifficulty(level) {
    if (level > 1) {
      this.enemyManager.increaseDifficulty(level); // Aumenta dificultad con más enemigos
    }
  }

  // Bucle principal del juego
  mainLoop() {
    if (this.state !== "playing") return; // Pausa el bucle si no está en "playing"

    // Configuración de entrada del usuario (teclas presionadas)
    const input = {
      up: this.keysPressed['ArrowUp'] || false,
      down: this.keysPressed['ArrowDown'] || false,
      left: this.keysPressed['ArrowLeft'] || false,
      right: this.keysPressed['ArrowRight'] || false
    };
    
    this.drawGame(); // Dibuja el estado actual del juego
    this.player.update(input); // Actualiza al jugador
    this.enemyManager.updateEnemies(); // Actualiza enemigos
    this.objectManager.updateObjects(); // Actualiza objetos

    // Si todos los objetos se recolectaron, avanza de nivel
    if (this.objectManager.allCollected()) {
      this.nextLevel();
    }

    requestAnimationFrame(() => this.mainLoop()); // Continúa el bucle
  }

  // Dibuja el estado visual del juego en el canvas
  drawGame() {
    const backgroundImage = this.levelManager.backgroundImage;
    if (!backgroundImage || !backgroundImage.complete) {
        console.warn("Imagen de fondo no definida o no completamente cargada.");
        return;
    }

    this.ctx.drawImage(backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    this.levelManager.renderLevel(this.ctx);
    this.objectManager.renderObjects(this.ctx);
  }

}

// Exposición de GameManager en el contexto global
window.GameManager = GameManager;







  

  
