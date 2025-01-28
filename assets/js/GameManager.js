// --- GameManager.js ---

// Clase principal GameManager que gestiona el flujo y la lógica principal del juego
class GameManager {
  constructor(canvas, config = {}) {
    // Inicialización del canvas y su contexto 2D
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = config.canvasWidth ? config.canvasWidth * 2 : canvas.width * 2; // Mejora visual del canvas
    this.canvas.height = config.canvasHeight ? config.canvasHeight * 2 : canvas.height * 2; // Mejora visual del canvas
    this.enemies = []; // Lista de enemigos en el juego
    this.difficultyLevel = 1; // Nivel de dificultad inicial
    this.backgroundReady = false; // Variable para indicar si la imagen de fondo está lista

    this.ctx.imageSmoothingEnabled = false; // Desactiva el suavizado de imágenes para un estilo más nítido

    // Inicialización de gestores del juego
    this.levelManager = new LevelManager(canvas, this); // Gestor de niveles
    this.enemyManager = new EnemyManager(this); // Gestor de enemigos
    this.objectManager = new ObjectManager(canvas, this); // Gestor de objetos
    this.player = new Player(100, 100, 5, this); // Jugador con posición y referencia al gameManager

    // Inicialización del UIManager
    this.uiManager = new UIManager(this);

    // Estado del juego y variables adicionales
    this.state = "start"; // Estado inicial del juego
    this.score = 0; // Puntuación inicial
    this.keysPressed = {}; // Teclas presionadas

    // Configuración de eventos de teclado
    window.addEventListener('keydown', (e) => this.keysPressed[e.key] = true);
    window.addEventListener('keyup', (e) => this.keysPressed[e.key] = false);

    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.key] = true;
      if (e.key === " ") {
        this.pauseGame(); // Evento para pausar/reanudar el juego con la barra espaciadora
      }
    });
    window.addEventListener('keyup', (e) => this.keysPressed[e.key] = false);

    // Carga del fondo del nivel
    this.loadLevelBackground();

    // Carga de la imagen para los obstáculos
    this.obstacleImage = new Image();
    this.obstacleImage.src = "assets/images/obstacle1.png";
    this.obstacleImageLoaded = false;

    // Asegurarse de que la imagen se haya cargado antes de usarla
    this.obstacleImage.onload = () => {
      this.obstacleImageLoaded = true;
      console.log("Imagen de los obstáculos cargada correctamente.");
    }; 

    // Carga y configuración de la música del juego
    this.gameMusic = new Audio("assets/mp3/gameplay-music.mp3");
    this.gameMusic.loop = true; // La música se reproducirá en bucle
    this.gameMusic.volume = 0.02; // Ajustar el volumen de la música (opcional)
  }

  // Método para limpiar y reiniciar el juego
  resetGame() {
    console.log("Reiniciando el juego...");
    this.levelManager.clearObstacles(); // Limpia los obstáculos
    this.player.x = 100; // Reestablece la posición inicial del jugador (ajústala según sea necesario)
    this.player.y = 100;
    this.player.health = 100; // Restablece la salud del jugador
    this.player.score = 0; // Restablece la puntuación
    this.player.speed = this.player.defaultSpeed; // Restablece la velocidad
  
    // Aquí podrías reiniciar cualquier otro componente del juego, como objetos recolectables, enemigos, etc.
  }

  // (Los métodos restantes como startGame, mainLoop, drawObstacles, etc., van aquí)

} // Fin de la clase GameManager

// Exporta GameManager al contexto global para que pueda ser usado en el juego
window.GameManager = GameManager;

// Inicialización del juego al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const gameManager = new GameManager(canvas);

  document.getElementById("startButton").addEventListener("click", () => {
    if (gameManager.backgroundReady) {
      document.getElementById("startScreen").style.display = "none";
      document.getElementById("controls").style.display = "block";
      canvas.style.display = "block";
      gameManager.startGame(); // Inicia el juego solo si la imagen de fondo está lista
    } else {
      console.warn("La imagen de fondo no se ha cargado aún. Espera un momento.");
    }
  });
});









  

  
