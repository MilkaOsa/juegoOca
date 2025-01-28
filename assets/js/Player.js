// --- Player.js ---

// Clase Player que representa al jugador del juego
class Player {
  constructor(x, y, tileSize, gameManager) {
    // Inicializa la posición y los atributos del jugador
    this.x = x; // Posición X inicial
    this.y = y; // Posición Y inicial
    this.health = 100; // Salud inicial del jugador
    this.speed = 2.5; // Velocidad base del jugador
    this.score = 0; // Puntuación inicial
    this.defaultSpeed = 2.5; // Velocidad base que se puede restablecer
    this.tileSize = tileSize; // Tamaño de las celdas de la cuadrícula
    this.gameManager = gameManager; // Referencia al gestor del juego
    this.visualSize = tileSize * 7; // Tamaño visual del jugador
    this.collisionBoxSize = this.visualSize; // Tamaño de la caja de colisión

    // Cargar las imágenes del jugador
    this.imageRight = new Image();
    this.imageRight.src = "assets/images/player_right.png"; // Imagen para movimiento hacia la derecha
    this.imageLeft = new Image();
    this.imageLeft.src = "assets/images/player_left.png"; // Imagen para movimiento hacia la izquierda
    this.image = this.imageRight; // Imagen inicial

    // Estado de carga de las imágenes
    this.imageLoadedRight = false;
    this.imageLoadedLeft = false;

    this.imageRight.onload = () => {
      this.imageLoadedRight = true;
      console.log("Imagen del jugador (derecha) cargada correctamente.");
    };
    this.imageRight.onerror = () => {
      console.error("Error al cargar la imagen del jugador (derecha).");
    };

    this.imageLeft.onload = () => {
      this.imageLoadedLeft = true;
      console.log("Imagen del jugador (izquierda) cargada correctamente.");
    };
    this.imageLeft.onerror = () => {
      console.error("Error al cargar la imagen del jugador (izquierda).");
    };
  }

  // Método para renderizar al jugador en el canvas
  render(ctx) {
    if ((this.image === this.imageRight && this.imageLoadedRight) || (this.image === this.imageLeft && this.imageLoadedLeft)) {
      ctx.drawImage(this.image, this.x, this.y, this.visualSize, this.visualSize);
    } else {
      // En caso de que la imagen aún no esté cargada, dibujar un marcador temporal
      ctx.fillStyle = "#0000FF"; // Color de reserva (azul)
      ctx.fillRect(this.x, this.y, this.visualSize, this.visualSize);
    }
  }

  // Método para actualizar la posición del jugador basado en la entrada del usuario
  update(input) {
    let newX = this.x;
    let newY = this.y;

    if (input.up) {
      newY -= this.speed;
      console.log('Movimiento hacia arriba detectado');
    }
    if (input.down) {
      newY += this.speed;
      console.log('Movimiento hacia abajo detectado');
    }
    if (input.left) {
      newX -= this.speed;
      console.log('Movimiento hacia la izquierda detectado');
      if (this.image !== this.imageLeft) {
        this.image = this.imageLeft; // Cambia la imagen al moverse a la izquierda
      }
    }
    if (input.right) {
      newX += this.speed;
      console.log('Movimiento hacia la derecha detectado');
      if (this.image !== this.imageRight) {
        this.image = this.imageRight; // Cambia la imagen al moverse a la derecha
      }
    }

    // Verificar colisiones con los límites del canvas usando el tamaño visual correcto
    newX = Math.max(0, Math.min(newX, this.gameManager.canvas.width - this.visualSize));
    newY = Math.max(0, Math.min(newY, this.gameManager.canvas.height - this.visualSize));

    // Verificar colisiones con los obstáculos usando la caja de colisión
    console.log(`Posiciones nuevas: X=${newX}, Y=${newY}`);
    if (!this.isCollidingWithObstacles(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    // Verificar colisiones con objetos recolectables
    this.checkObjectCollisions();
  }

  // Método para verificar si el jugador está colisionando con obstáculos
  isCollidingWithObstacles(newX, newY) {
    const obstacleMatrix = this.gameManager.levelManager.obstacleMatrix;
    const tileSize = this.tileSize;

    // Usar los límites del área de colisión del jugador
    const startRow = Math.max(0, Math.floor(newY / tileSize));
    const endRow = Math.min(obstacleMatrix.length - 1, Math.floor((newY + this.collisionBoxSize) / tileSize));
    const startCol = Math.max(0, Math.floor(newX / tileSize));
    const endCol = Math.min(obstacleMatrix[0].length - 1, Math.floor((newX + this.collisionBoxSize) / tileSize));

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (obstacleMatrix[row] && obstacleMatrix[row][col] === 1) {
          return true; // Hay colisión con un obstáculo
        }
      }
    }
    return false; // No hay colisión
  }
  
  // Método para detectar y manejar la recogida de objetos
  checkObjectCollisions() {
    this.gameManager.objectManager.objects.forEach(object => {
      if (!object.isCollected()) {
        const distanceX = Math.abs((this.x + this.visualSize / 2) - (object.x + this.tileSize / 2));
        const distanceY = Math.abs((this.y + this.visualSize / 2) - (object.y + this.tileSize / 2));
        const collisionThreshold = this.collisionBoxSize / 2; // Ajuste de umbral de colisión

        if (distanceX < collisionThreshold && distanceY < collisionThreshold) {
          object.collect(); // Marcar el objeto como recolectado
          this.applyEffect(object); // Aplicar el efecto del objeto al jugador
        }
      }
    });
  }

  // Método para aplicar un efecto basado en el tipo de objeto recogido
  applyEffect(object) {
    switch (object.type) {
      case 'Health':
        this.increaseHealth(object.effect.health);
        break;
      case 'Speed':
        this.increaseSpeed(object.effect.speed, object.effect.duration);
        break;
      case 'Score':
        this.increaseScore(object.effect.score);
        break;
      default:
        console.log('Tipo de objeto desconocido.');
    }
  }

  // Métodos auxiliares para manejar los efectos
  increaseHealth(amount) {
    this.health = Math.min(this.health + amount, 100); // Incrementa la vida, pero no más de 100
    this.gameManager.uiManager.showNotification("¡Vida incrementada!");
  }

  increaseSpeed(amount, duration) {
    this.speed += amount; // Incrementa la velocidad temporalmente

    // Restaura la velocidad base después de un tiempo
    setTimeout(() => {
      this.speed = this.defaultSpeed;
      console.log('Velocidad restaurada a su valor original.');
      this.gameManager.uiManager.showNotification("La velocidad volvió a la normalidad");
    }, duration);
  }

  increaseScore(amount) {
    this.score += amount; // Incrementa la puntuación
    this.gameManager.uiManager.showNotification("¡Puntuación incrementada!");
  }

  // Método para aplicar daño al jugador y gestionar el estado de salud
  takeDamage(amount) {
    // Reduce el daño a la mitad si el escudo está activo
    const finalDamage = this.hasShield ? amount / 2 : amount;
    this.health -= finalDamage; // Reduce la salud del jugador
    console.log(`El jugador recibió ${finalDamage} de daño. Salud actual: ${this.health}`);

    // Comprueba si la salud es 0 o menor, y ejecuta el método de muerte
    if (this.health <= 0) {
      this.die(); // El jugador muere si la salud es 0 o menor
    }
  }

  // Método que se llama cuando el jugador muere
  die() {
    console.log("El jugador ha muerto.");
    this.gameManager.resetGame(); // Reinicia el juego cuando el jugador muere
  }
  
}

// Exporta Player al contexto global para que pueda ser usado en el juego
window.Player = Player;





