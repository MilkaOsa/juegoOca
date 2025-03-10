

// --- GameManager.js ---
class GameManager {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.currentLevelNumber = 1;
     // Define un tileSize unificado para todo el juego, por ejemplo, 20
    this.tileSize = config.tileSize || 20;
    this.levelJustUp = false;

    // Instanciar managers
    this.levelManager = new LevelManager(canvas, this, this.tileSize);
    this.objectManager = new ObjectManager(canvas, this);
    this.enemyManager = new EnemyManager(this);
    this.uiManager = new UIManager(this);

    // Instanciar el jugador; el tercer parámetro (tileSize) se utiliza para calcular el tamaño visual.
    this.player = new Player(100, 100, this.tileSize, this);

    // Configuración de entradas de teclado
    this.keysPressed = {};
    window.addEventListener("keydown", (e) => {
      this.keysPressed[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keysPressed[e.key] = false;
    });

    // Variables de control del juego
    this.state = "paused";
    this.score = 0;
    this.elapsedTime = 0; // Tiempo en segundos
    this.lastFrameTime = 0;
  }

  // Método para iniciar el juego
  startGame() {
    // Inicializa el nivel y genera la matriz de obstáculos y recintos
    this.levelManager.initLevel();

    // Genera objetos dentro de los recintos definidos en el nivel
    this.objectManager.generateObjectsInRectangles(this.levelManager.currentLevel.rectangles);

    // Agrega algunos enemigos de ejemplo
    this.enemyManager.addEnemy(200, 150, "chaser");
    this.enemyManager.addEnemy(300, 250, "patroller");

    // Cambia el estado y arranca el ciclo principal
    this.state = "playing";
    this.lastFrameTime = performance.now();
    this.gameLoop(this.lastFrameTime);
  }

  // Ciclo principal de juego utilizando requestAnimationFrame
  gameLoop(timestamp) {
    if (this.state !== "playing") return;

    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    // Acumula tiempo (deltaTime está en milisegundos)
    this.elapsedTime += deltaTime / 1000;
    
    this.update(deltaTime);
    this.render();

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  // Actualiza la lógica del juego
  update(deltaTime) {
    // Actualiza al jugador basado en las teclas presionadas
    this.player.update(this.keysPressed);

    // Actualiza a todos los enemigos
    this.enemyManager.updateEnemies();

    // Comprueba colisiones entre jugador, enemigos y objetos
    this.checkCollisions();

    // Actualiza la interfaz (por ejemplo, puntaje, salud, etc.)
    this.uiManager.render();
  }

  // Renderiza en el canvas todos los elementos del juego
  // render() {
  //   // Limpia el canvas
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Renderiza el nivel (fondo y obstáculos)
  //   this.levelManager.render(this.ctx);

  //   // Renderiza los objetos recolectables
  //   this.objectManager.renderObjects(this.ctx);

  //   // Renderiza los enemigos
  //   this.enemyManager.renderEnemies(this.ctx);

  //   // Renderiza al jugador
  //   this.player.render(this.ctx);
  // }
  render() {
    // Limpia el canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    // Renderiza el nivel, objetos, enemigos y jugador
    this.levelManager.render(this.ctx);
    this.objectManager.renderObjects(this.ctx);
    this.enemyManager.renderEnemies(this.ctx);
    this.player.render(this.ctx);
  
    // Dibuja los bounding boxes en azul para el jugador y en verde para los objetos
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(this.player.x, this.player.y, this.player.visualSize, this.player.visualSize);
    this.objectManager.objects.forEach(object => {
      this.ctx.strokeStyle = "green";
      this.ctx.strokeRect(object.x, object.y, object.size, object.size);
    });
  }

  // Comprueba las colisiones entre el jugador y otros elementos
  checkCollisions() {
    // Colisión entre jugador y enemigos (delegado en EnemyManager)
    this.enemyManager.checkCollisionsWithPlayer();
    
    console.log("Array antes: ", this.objectManager.objects.length);
    
    // Colisión entre jugador y objetos recolectables:
    for (let i = this.objectManager.objects.length - 1; i >= 0; i--) {
      const obj = this.objectManager.objects[i];
      console.log("Jugador:", this.player.x, this.player.y, "Tamaño:", this.player.visualSize);
      console.log("Objeto:", obj.x, obj.y, "Tamaño:", obj.size);

      console.log("Dentro bucle Array antes: ", this.objectManager.objects.length);
      if (!obj.isCollected() && this.isColliding(this.player, obj)) {
        console.log("Colisión detectada con objeto. Array antes: ", this.objectManager.objects.length);
        obj.collect();
        this.player.applyEffect(obj);
        this.objectManager.objects.splice(i, 1);
        console.log("Array después: ", this.objectManager.objects.length);
      }
    }
    
    // Si no quedan objetos y no se acaba de subir de nivel, sube de nivel
    if (!this.levelJustUp && this.objectManager.objects.length === 0) {
      this.levelUp();
    }
  }

  // Detección de colisiones usando cajas de colisión (bounding boxes)
  isColliding(entityA, entityB) {
    // Para el jugador se usa la propiedad visualSize; para enemigos y objetos se usa size.
    const rectA = {
      x: entityA.x,
      y: entityA.y,
      width: entityA.visualSize || entityA.size || 20,
      height: entityA.visualSize || entityA.size || 20
    };

    const rectB = {
      x: entityB.x,
      y: entityB.y,
      width: entityB.size || entityB.visualSize || 20,
      height: entityB.size || entityB.visualSize || 20
    };
    console.log("Comparando colisión:", rectA, rectB);
    console.log(rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y)

    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  }
  gameOver() {
    this.state = "gameover";
    this.uiManager.showGameOverScreen();
  }

  // Alterna entre pausar y reanudar el juego
  pauseGame() {
    if (this.state === "playing") {
      this.state = "paused";
    } else if (this.state === "paused") {
      this.state = "playing";
      this.lastFrameTime = performance.now();
      this.gameLoop(this.lastFrameTime);
    }
  }

  // Reinicia el juego (por ejemplo, cuando el jugador muere)
  levelUp() {
    // Si ya se acaba de subir de nivel, salimos
    if(this.levelJustUp) return;
    this.levelJustUp = true;
  
    // Incrementa el nivel
    this.currentLevelNumber++;
  
    // Reubica al jugador en una posición segura (usa el método reset, que puedes modificar para que el jugador se posicione en un lugar libre)
    this.player.reset();
  
    // Reinicia el nivel (reconfigura el mapa de obstáculos)
    this.levelManager.resetLevel();
  
    // Vacía y regenera los objetos basados en los nuevos recintos del nivel
    this.objectManager.objects = [];
    this.objectManager.generateObjectsInRectangles(this.levelManager.currentLevel.rectangles);
  
    // Reinicia los enemigos y agrega nuevos (ajusta según el nivel si lo deseas)
    this.enemyManager.enemies = [];
    this.enemyManager.addEnemy(200, 150, "chaser");
    this.enemyManager.addEnemy(300, 250, "patroller");
  
    // Notifica al jugador que ha subido de nivel
    this.uiManager.showNotification("¡Subiste al Nivel " + this.currentLevelNumber + "!");
  
    // Establece un breve periodo de gracia (por ejemplo, 1 segundo) para evitar múltiples levelUps consecutivos
    setTimeout(() => {
      this.levelJustUp = false;
    }, 1000);
  }
}

window.GameManager = GameManager;







  

  
