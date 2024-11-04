// --- GameManager.js ---

// Clase principal GameManager que gestiona el flujo y la lógica principal del juego
class GameManager {
  constructor(canvas, config = {}) {
    // Inicialización del canvas y su contexto 2D
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = config.canvasWidth || canvas.width; // Ancho del canvas
    this.canvas.height = config.canvasHeight || canvas.height; // Alto del canvas

    // Inicialización de gestores del juego
    this.levelManager = new LevelManager(canvas, this); // Gestor de niveles
    this.enemyManager = new EnemyManager(this); // Gestor de enemigos
    this.objectManager = new ObjectManager(canvas, this); // Gestor de objetos
    this.player = new Player(100, 100, 5); // Jugador con posición y velocidad inicial

    // Estado del juego y variables adicionales
    this.state = "start"; // Estado inicial del juego
    this.score = 0; // Puntuación inicial
    this.keysPressed = {}; // Teclas presionadas

    // Configuración de eventos de teclado
    window.addEventListener('keydown', (e) => this.keysPressed[e.key] = true);
    window.addEventListener('keyup', (e) => this.keysPressed[e.key] = false);

    // Carga del fondo del nivel
    this.loadLevelBackground();
  }

  // Carga la imagen de fondo del nivel y comienza el juego cuando esté lista
  loadLevelBackground() {
    this.levelBackground = new Image();
    this.levelBackground.src = 'assets/images/Level1.png'; // Ruta de la imagen del nivel
    this.levelBackground.onload = () => this.startGame(); // Inicia el juego al cargar la imagen
  }

  // Método para iniciar el juego
  startGame() {
    this.state = "playing"; // Cambia el estado a "jugando"
    this.levelManager.setLevel(); // Configura el nivel inicial
    this.mainLoop(); // Comienza el bucle principal del juego
  }

  // Bucle principal del juego que se ejecuta de forma continua
  mainLoop() {
    if (this.state !== "playing") return; // Si el juego no está en estado "jugando", se detiene el bucle

    // Limpia el canvas y dibuja el fondo del nivel
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.levelBackground, 0, 0, this.canvas.width, this.canvas.height);

    // Dibuja los obstáculos en el canvas
    this.drawObstacles();

    // Captura el estado actual de las teclas presionadas para el movimiento del jugador
    const input = {
      up: this.keysPressed['ArrowUp'] || false,
      down: this.keysPressed['ArrowDown'] || false,
      left: this.keysPressed['ArrowLeft'] || false,
      right: this.keysPressed['ArrowRight'] || false
    };

    // Actualiza el estado del jugador, enemigos y otros objetos
    this.player.update(input); // Actualiza el jugador con el input de teclado
    this.enemyManager.updateEnemies(); // Actualiza los enemigos
    this.objectManager.renderObjects(this.ctx); // Renderiza los objetos del juego


    // Solicita la próxima animación para continuar el bucle
    requestAnimationFrame(() => this.mainLoop());
  }

  // Dibuja los obstáculos según la matriz del gestor de niveles
  drawObstacles() {
    const matrix = this.levelManager.obstacleMatrix; // Matriz que define la ubicación de los obstáculos
    const tileSize = this.levelManager.tileSize; // Tamaño de cada bloque de obstáculo
    this.ctx.fillStyle = "#8B0000"; // Color de los obstáculos

    // Recorre la matriz y dibuja un rectángulo donde hay un obstáculo (valor 1)
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] === 1) {
          this.ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize); // Dibuja el obstáculo
        }
      }
    }
  }
}

// Exporta GameManager al contexto global para que pueda ser usado en el juego
window.GameManager = GameManager;







  

  
