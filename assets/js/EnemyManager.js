// --- EnemyManager.js ---
// Clase EnemyManager para gestionar la lista de enemigos
class EnemyManager {
  constructor(gameManager) {
    this.enemies = [];         // Array que almacenará instancias de Enemy
    this.gameManager = gameManager; // Referencia al GameManager para acceder al jugador y dimensiones del canvas
  }

  // Método para añadir un enemigo, utilizando la clase Enemy
  addEnemy(x, y, type) {
    const enemy = new Enemy(x, y, type);
    this.enemies.push(enemy);
  }

  // Actualiza todos los enemigos; se le pasa la información necesaria (jugador, dimensiones del canvas)
  updateEnemies() {
    const options = {
      player: this.gameManager.player,
      canvasWidth: this.gameManager.canvas.width,
      canvasHeight: this.gameManager.canvas.height
    };

    // Actualiza cada enemigo
    this.enemies.forEach(enemy => enemy.update(options));

    // Elimina enemigos destruidos (por ejemplo, por daño) que ya no sean necesarios
    this.enemies = this.enemies.filter(enemy => !enemy.isDestroyed());
  }

  // Renderiza cada enemigo en el canvas
  renderEnemies(ctx) {
    this.enemies.forEach(enemy => enemy.render(ctx));
  }

  // Método para chequear colisiones entre el jugador y los enemigos
  checkCollisionsWithPlayer() {
    const player = this.gameManager.player;
    // Usamos slice() para iterar sobre una copia y poder modificar el array sin problemas
    this.enemies.slice().forEach(enemy => {
      if (this.isColliding(enemy, player)) {
        player.takeDamage(1); // Aplica daño al jugador
        // Reemplaza el enemigo colisionado por uno nuevo
        this.replaceEnemy(enemy);
      }
    });
  }

  // Detección de colisión simple usando bounding boxes
  isColliding(enemy, player) {
    const enemyRect = {
      x: enemy.x,
      y: enemy.y,
      width: enemy.size,
      height: enemy.size
    };
    // Suponemos que el jugador usa 'visualSize' para su ancho/alto
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.visualSize,
      height: player.visualSize
    };

    return (
      enemyRect.x < playerRect.x + playerRect.width &&
      enemyRect.x + enemyRect.width > playerRect.x &&
      enemyRect.y < playerRect.y + playerRect.height &&
      enemyRect.y + enemyRect.height > playerRect.y
    );
  }

  // Reemplaza un enemigo colisionado por uno nuevo en una posición aleatoria dentro de un recinto del nivel
  replaceEnemy(oldEnemy) {
    // Elimina el enemigo colisionado del array
    const index = this.enemies.indexOf(oldEnemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }

    // Obtiene el nivel actual y sus recintos
    const level = this.gameManager.levelManager.currentLevel;
    if (!level.rectangles || level.rectangles.length === 0) return;

    // Selecciona aleatoriamente un recinto
    const randomRect = level.rectangles[Math.floor(Math.random() * level.rectangles.length)];

    // Define el área libre dentro del recinto (evitando los bordes)
    const minRow = randomRect.startRow + 1;
    const maxRow = randomRect.startRow + randomRect.height - 2;
    const minCol = randomRect.startCol + 1;
    const maxCol = randomRect.startCol + randomRect.width - 2;
    if (maxRow < minRow || maxCol < minCol) return;

    // Escoge una posición aleatoria dentro del área libre
    const row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
    const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;
    const tileSize = level.tileSize;
    const x = col * tileSize;
    const y = row * tileSize;

    // Selecciona aleatoriamente un tipo de enemigo (por ejemplo, "chaser" o "patroller")
    const enemyTypes = ["chaser", "patroller"];
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    // Agrega el nuevo enemigo a la lista
    this.addEnemy(x, y, randomType);
  }
}

window.EnemyManager = EnemyManager;
