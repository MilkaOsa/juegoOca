// --- EnemyManager.js ---
// Clase EnemyManager para gestionar todos los enemigos del juego
class EnemyManager {
  constructor(gameManager) {
    this.enemies = []; // Lista de enemigos activos en el juego
    this.gameManager = gameManager; // Referencia al GameManager para acceso global
  }

  // Método para añadir un nuevo enemigo
  addEnemy(x, y, type) {
    const enemy = new Enemy(x, y, type, this.gameManager);
    this.enemies.push(enemy);
  }

  // Método para actualizar todos los enemigos y su comportamiento
  updateEnemies() {
    this.enemies.forEach(enemy => {
      switch (enemy.type) {
        case 'chaser':
          enemy.moveTowardPlayer(this.gameManager.player);
          break;
        case 'patroller':
          enemy.patrol();
          break;
        case 'stationary':
          // Los enemigos "stationary" no se mueven
          break;
        default:
          enemy.moveRandomly();
      }
      enemy.update();
    });

    // Filtra y elimina enemigos que han sido destruidos
    this.enemies = this.enemies.filter(enemy => !enemy.isDestroyed());
  }

  // Verifica colisiones entre enemigos y el jugador
  checkCollisions(player) {
    this.enemies.forEach(enemy => {
      if (this.isCollidingWithPlayer(enemy, player)) {
        player.takeDamage(1);
      }
    });
  }

  // Comprueba si un enemigo está colisionando con el jugador
  isCollidingWithPlayer(enemy, player) {
    return Math.abs(enemy.x - player.x) < 10 && Math.abs(enemy.y - player.y) < 10;
  }

  // Reinicia la lista de enemigos
  resetEnemies() {
    this.enemies = [];
  }

  // Aumenta la dificultad del juego añadiendo más enemigos
  increaseDifficulty() {
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * this.gameManager.canvas.width);
      const y = Math.floor(Math.random() * this.gameManager.canvas.height);
      this.addEnemy(x, y, 'random');
    }
  }
}

// Clase Enemy que define el comportamiento de cada enemigo individual
class Enemy {
  constructor(x, y, type, gameManager) {
    this.x = x; // Posición X inicial del enemigo
    this.y = y; // Posición Y inicial del enemigo
    this.type = type; // Tipo de enemigo (chaser, patroller, stationary, random)
    this.health = 50; // Salud inicial del enemigo
    this.speed = 2; // Velocidad de movimiento del enemigo
    this.gameManager = gameManager; // Referencia a GameManager
    this.patrolDirection = 1; // Dirección de patrullaje para los enemigos tipo "patroller"
  }

  // Método para mover al enemigo de manera aleatoria
  moveRandomly() {
    const randomDirection = {
      x: Math.floor(Math.random() * 3) - 1, // Genera -1, 0 o 1 para X
      y: Math.floor(Math.random() * 3) - 1  // Genera -1, 0 o 1 para Y
    };
    const newX = this.x + randomDirection.x * this.speed;
    const newY = this.y + randomDirection.y * this.speed;

    // Asegura que el enemigo no se salga del área del canvas
    if (newX >= 0 && newX <= this.gameManager.canvas.width - 10) {
      this.x = newX;
    }
    if (newY >= 0 && newY <= this.gameManager.canvas.height - 10) {
      this.y = newY;
    }
  }

  // Método para que los enemigos de tipo "chaser" se muevan hacia el jugador
  moveTowardPlayer(player) {
    const direction = {
      x: player.x > this.x ? 1 : player.x < this.x ? -1 : 0,
      y: player.y > this.y ? 1 : player.y < this.y ? -1 : 0
    };
    const newX = this.x + direction.x * this.speed;
    const newY = this.y + direction.y * this.speed;

    // Asegura que el enemigo no se salga del área del canvas
    if (newX >= 0 && newX <= this.gameManager.canvas.width - 10) {
      this.x = newX;
    }
    if (newY >= 0 && newY <= this.gameManager.canvas.height - 10) {
      this.y = newY;
    }
  }

  // Método para el patrullaje de enemigos tipo "patroller"
  patrol() {
    const newX = this.x + this.patrolDirection * this.speed;
    
    // Cambia de dirección si llega al borde del canvas
    if (newX <= 0 || newX >= this.gameManager.canvas.width - 10) {
      this.patrolDirection *= -1; // Invertir la dirección
    } else {
      this.x = newX; // Actualiza la posición X
    }
  }

  // Método que verifica si el enemigo ha sido destruido (salud <= 0)
  isDestroyed() {
    return this.health <= 0;
  }

  // Método para reducir la salud del enemigo al recibir daño
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      console.log("Enemigo destruido"); // Mensaje de consola cuando el enemigo es destruido
    }
  }

  // Método para actualizar el estado del enemigo
  update() {
    // Aquí puedes agregar lógica adicional si es necesario
    console.log(`Actualizando enemigo en posición (${this.x}, ${this.y})`);
  }
}

// Exporta EnemyManager al contexto global para ser usado en el juego
window.EnemyManager = EnemyManager;
