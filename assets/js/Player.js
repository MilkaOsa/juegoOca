// --- Player.js ---
// Clase Player que representa al jugador del juego
class Player {
  constructor(x, y, tileSize, levelManager) {
    // Posición y atributos iniciales del jugador
    this.x = x;
    this.y = y;
    this.health = 3; // Salud inicial
    this.speed = 5; // Velocidad base del jugador
    this.defaultSpeed = 5; // Velocidad base para restablecer
    this.speedBoostDuration = 0; // Tiempo restante para el boost de velocidad
    this.tileSize = tileSize; // Tamaño de las celdas de la cuadrícula
    this.levelManager = levelManager; // Referencia a LevelManager para verificar colisiones
    this.hasShield = false; // Estado del escudo para reducir daño
  }

  // Actualiza la posición del jugador basado en la entrada del usuario
  update(input = {}, reset = false) {
    if (reset) {
      // Reinicia la posición del jugador al inicio
      this.x = 0;
      this.y = 0;
    } else {
      // Manejo del boost de velocidad temporal
      if (this.speedBoostDuration > 0) {
        this.speedBoostDuration -= 1;
      } else {
        this.speed = this.defaultSpeed; // Restablece la velocidad cuando el boost termina
      }
      
      // Movimiento basado en la entrada del usuario
      if (input.up) this.move({ x: 0, y: -1 });
      if (input.down) this.move({ x: 0, y: 1 });
      if (input.left) this.move({ x: -1, y: 0 });
      if (input.right) this.move({ x: 1, y: 0 });
    }
  }

  // Mueve al jugador en la dirección especificada, verificando colisiones
  move(direction) {
    const newX = this.x + direction.x * this.speed;
    const newY = this.y + direction.y * this.speed;

    // Verifica colisión antes de mover
    if (!this.isCollidingWithObstacle(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } else {
      console.log("Colisión con obstáculo, cambia de dirección.");
    }
  }

  // Verifica si la posición del jugador colisiona con algún obstáculo
  isCollidingWithObstacle(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    // Comprueba si la posición está dentro de los límites de la matriz de obstáculos
    if (tileY >= 0 && tileY < this.levelManager.obstacleMatrix.length &&
        tileX >= 0 && tileX < this.levelManager.obstacleMatrix[0].length) {
      return this.levelManager.obstacleMatrix[tileY][tileX] !== 0; // Retorna true si hay un obstáculo
    }
    return true; // Considera colisión si está fuera de los límites
  }

  // Aplica daño al jugador y verifica si debe morir
  takeDamage(amount) {
    const finalDamage = this.hasShield ? amount / 2 : amount; // Reduce el daño si tiene escudo
    this.health -= finalDamage;
    console.log(`El jugador recibió ${finalDamage} de daño. Salud actual: ${this.health}`);
    
    if (this.health <= 0) {
      this.die(); // Llama a la función de muerte si la salud es 0 o menos
    }
  }

  // Función de muerte del jugador
  die() {
    console.log("El jugador ha muerto.");
    this.gameManager.gameOver(); // Llama al método gameOver de GameManager
  }

  // Manejo de recolección de objetos especiales
  collectItem(itemType) {
    switch (itemType) {
      case 'health':
        this.health += 1;
        console.log(`¡Recogiste un objeto de salud! Salud actual: ${this.health}`);
        break;
      case 'shield':
        this.hasShield = true;
        console.log("¡Recogiste un escudo! Daño reducido.");
        break;
      case 'speed':
        this.speed = this.defaultSpeed * 1.5; // Incremento de velocidad temporal
        this.speedBoostDuration = 900; // Duración de 15 segundos (15s * 60FPS)
        console.log("¡Recogiste un objeto de velocidad! Velocidad aumentada temporalmente.");
        break;
      default:
        console.log("Objeto desconocido.");
    }
  }
}

// Exporta Player al contexto global
window.Player = Player;




