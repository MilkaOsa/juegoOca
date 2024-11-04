// --- Player.js ---

// Clase Player que representa al jugador del juego
class Player {
  constructor(x, y, tileSize) {
    // Inicializa la posición y atributos del jugador
    this.x = x; // Posición X inicial
    this.y = y; // Posición Y inicial
    this.health = 3; // Salud inicial del jugador
    this.speed = 5; // Velocidad base del jugador
    this.defaultSpeed = 5; // Velocidad base que se puede restablecer
    this.speedBoostDuration = 0; // Duración del boost de velocidad restante
    this.tileSize = tileSize; // Tamaño de las celdas de la cuadrícula
    this.hasShield = false; // Estado del escudo (reduce el daño si es true)
  }

  // Método para actualizar la posición y estado del jugador
  update(input = {}, reset = false) {
    if (reset) {
      // Reinicia la posición del jugador al inicio
      this.x = 0;
      this.y = 0;
    } else {
      // Control del boost de velocidad: si hay duración restante, la reduce
      if (this.speedBoostDuration > 0) {
        this.speedBoostDuration -= 1; // Disminuye la duración del boost
      } else {
        this.speed = this.defaultSpeed; // Restablece la velocidad base cuando el boost termina
      }

      // Maneja el movimiento del jugador basado en la entrada del usuario
      if (input.up) this.move({ x: 0, y: -1 }); // Mover hacia arriba
      if (input.down) this.move({ x: 0, y: 1 }); // Mover hacia abajo
      if (input.left) this.move({ x: -1, y: 0 }); // Mover hacia la izquierda
      if (input.right) this.move({ x: 1, y: 0 }); // Mover hacia la derecha
    }
  }

  // Método para mover al jugador en la dirección especificada
  move(direction) {
    this.x += direction.x * this.speed; // Actualiza la posición X según la velocidad
    this.y += direction.y * this.speed; // Actualiza la posición Y según la velocidad
  }

  // Método para aplicar daño al jugador y gestionar el estado de salud
  takeDamage(amount) {
    // Reduce el daño a la mitad si el jugador tiene escudo
    const finalDamage = this.hasShield ? amount / 2 : amount;
    this.health -= finalDamage; // Reduce la salud del jugador
    console.log(`El jugador recibió ${finalDamage} de daño. Salud actual: ${this.health}`);
    
    // Verifica si la salud es 0 o menor, y llama a la función de muerte
    if (this.health <= 0) {
      this.die(); // El jugador muere si la salud es 0 o menor
    }
  }

  // Método que se llama cuando el jugador muere
  die() {
    console.log("El jugador ha muerto.");
    this.gameManager.gameOver(); // Llama al método gameOver de GameManager
  }
}

// Exporta Player al contexto global para que pueda ser usado en el juego
window.Player = Player;





