// --- EnemyManager.js ---
// Clase EnemyManager para gestionar todos los enemigos del juego
class EnemyManager {
  constructor(gameManager) {
    this.enemies = []; // Lista de enemigos activos en el juego
    this.gameManager = gameManager; // Referencia a GameManager para acceso global
  }

  // Añade un nuevo enemigo al juego en una posición específica
  addEnemy(x, y, type) {
    const enemy = new Enemy(x, y, type, this.gameManager);
    this.enemies.push(enemy); // Añade el enemigo a la lista de enemigos activos
  }

  // Actualiza el estado y comportamiento de todos los enemigos
  updateEnemies() {
    this.enemies.forEach(enemy => {
      // Comportamiento específico según el tipo de enemigo
      if (enemy.type === 'chaser') {
        enemy.moveTowardPlayer(this.gameManager.player); // Tipo "chaser" se mueve hacia el jugador
      } else {
        enemy.moveRandomly(); // Tipo "random" se mueve aleatoriamente
      }
      enemy.update(); // Actualiza aspectos del enemigo como salud
    });

    // Elimina los enemigos que hayan sido destruidos
    this.enemies = this.enemies.filter(enemy => !enemy.isDestroyed());
  }

  // Verifica colisiones entre enemigos y el jugador
  checkCollisions(player) {
    this.enemies.forEach(enemy => {
      if (this.isCollidingWithPlayer(enemy, player)) {
        player.takeDamage(1); // Aplica daño al jugador si colisiona con un enemigo
      }
    });
  }

  // Determina si un enemigo está colisionando con el jugador
  isCollidingWithPlayer(enemy, player) {
    return Math.abs(enemy.x - player.x) < this.gameManager.levelManager.tileSize &&
           Math.abs(enemy.y - player.y) < this.gameManager.levelManager.tileSize;
  }

  // Reinicia la lista de enemigos al cambiar de nivel o al reiniciar el juego
  resetEnemies() {
    this.enemies = [];
  }

  // Aumenta la dificultad del juego añadiendo más enemigos con cada nivel
  increaseDifficulty(level) {
    for (let i = 0; i < level; i++) {
      const x = Math.floor(Math.random() * this.gameManager.canvas.width);
      const y = Math.floor(Math.random() * this.gameManager.canvas.height);
      const type = level > 3 ? 'chaser' : 'random'; // A partir del nivel 3, añade enemigos "chaser"
      this.addEnemy(x, y, type);
    }
  }
}

// Clase Enemy que define el comportamiento individual de cada enemigo
class Enemy {
  constructor(x, y, type, gameManager) {
    this.x = x; // Posición X del enemigo
    this.y = y; // Posición Y del enemigo
    this.type = type; // Tipo de enemigo ("random" o "chaser")
    this.health = 50; // Salud inicial del enemigo
    this.speed = 2; // Velocidad de movimiento
    this.gameManager = gameManager; // Referencia a GameManager
  }

  // Movimiento aleatorio del enemigo
  moveRandomly() {
    const randomDirection = {
      x: Math.floor(Math.random() * 3) - 1, // Movimiento en X: -1, 0, o 1
      y: Math.floor(Math.random() * 3) - 1  // Movimiento en Y: -1, 0, o 1
    };
    const newX = this.x + randomDirection.x * this.speed;
    const newY = this.y + randomDirection.y * this.speed;
    if (!this.isCollidingWithObstacle(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  // Movimiento hacia el jugador para enemigos de tipo "chaser"
  moveTowardPlayer(player) {
    const direction = {
      x: player.x > this.x ? 1 : player.x < this.x ? -1 : 0,
      y: player.y > this.y ? 1 : player.y < this.y ? -1 : 0
    };
    const newX = this.x + direction.x * this.speed;
    const newY = this.y + direction.y * this.speed;
    if (!this.isCollidingWithObstacle(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  // Verifica si el enemigo colisiona con un obstáculo en la matriz de `levelManager`
  isCollidingWithObstacle(x, y) {
    const tileX = Math.floor(x / this.gameManager.levelManager.tileSize);
    const tileY = Math.floor(y / this.gameManager.levelManager.tileSize);
    if (tileY >= 0 && tileY < this.gameManager.levelManager.obstacleMatrix.length &&
        tileX >= 0 && tileX < this.gameManager.levelManager.obstacleMatrix[0].length) {
      return this.gameManager.levelManager.obstacleMatrix[tileY][tileX] !== 0;
    }
    return true; // Considera colisión si está fuera de los límites
  }

  // Determina si el enemigo ha sido destruido (salud <= 0)
  isDestroyed() {
    return this.health <= 0;
  }

  // Reduce la salud del enemigo cuando recibe daño
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      console.log("Enemigo destruido");
    }
  }

  // Método de actualización para el enemigo
  update() {
    // Aquí puedes agregar lógica para actualizar el estado del enemigo si es necesario
    console.log(`Actualizando enemigo en posición (${this.x}, ${this.y})`);
}

}

// Exporta EnemyManager al contexto global
window.EnemyManager = EnemyManager;






