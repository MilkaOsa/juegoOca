// --- Player.js ---
class Player {
  constructor(x, y, tileSize, gameManager) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.speed = 2.5;
    this.score = 0;
    this.defaultSpeed = 2.5;
    this.tileSize = tileSize;
    this.gameManager = gameManager;
    
    // Ajustamos el tamaño visual para que la oca sea más pequeña en proporción
    this.visualSize = 2 * tileSize;  // antes era tileSize * 7
    this.collisionBoxSize = this.visualSize;
    
    // Cargar imágenes del jugador
    this.imageRight = new Image();
    this.imageRight.src = "assets/images/player_right.png";
    this.imageLeft = new Image();
    this.imageLeft.src = "assets/images/player_left.png";
    this.image = this.imageRight;
    
    this.imageLoadedRight = false;
    this.imageLoadedLeft = false;
    
    this.imageRight.onload = () => {
      this.imageLoadedRight = true;
      console.log("Imagen del jugador (derecha) cargada correctamente.");
    };
    this.imageLeft.onload = () => {
      this.imageLoadedLeft = true;
      console.log("Imagen del jugador (izquierda) cargada correctamente.");
    };
  }
  
  render(ctx) {
    if ((this.image === this.imageRight && this.imageLoadedRight) ||
        (this.image === this.imageLeft && this.imageLoadedLeft)) {
      ctx.drawImage(this.image, this.x, this.y, this.visualSize, this.visualSize);
    } else {
      ctx.fillStyle = "#0000FF";
      ctx.fillRect(this.x, this.y, this.visualSize, this.visualSize);
    }
  }
  
  update(input) {
    let newX = this.x;
    let newY = this.y;
    
    // Usamos las teclas de flecha para mover al jugador
    if (input["ArrowUp"]) {
      newY -= this.speed;
      console.log("Movimiento hacia arriba detectado");
    }
    if (input["ArrowDown"]) {
      newY += this.speed;
      console.log("Movimiento hacia abajo detectado");
    }
    if (input["ArrowLeft"]) {
      newX -= this.speed;
      console.log("Movimiento hacia la izquierda detectado");
      if (this.image !== this.imageLeft) {
        this.image = this.imageLeft;
      }
    }
    if (input["ArrowRight"]) {
      newX += this.speed;
      console.log("Movimiento hacia la derecha detectado");
      if (this.image !== this.imageRight) {
        this.image = this.imageRight;
      }
    }
    
    // Limitar el movimiento a los bordes del canvas
    newX = Math.max(0, Math.min(newX, this.gameManager.canvas.width - this.visualSize));
    newY = Math.max(0, Math.min(newY, this.gameManager.canvas.height - this.visualSize));
    
    // Verificar colisiones con obstáculos
    if (!this.isCollidingWithObstacles(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }
  
  isCollidingWithObstacles(newX, newY) {
    // Accedemos a la matriz de obstáculos a través del currentLevel
    const obstacleMatrix = this.gameManager.levelManager.currentLevel.obstacleMatrix;
    
    // Si la matriz está vacía o la primera fila no existe, no hay colisión
    if (!obstacleMatrix || obstacleMatrix.length === 0 || !obstacleMatrix[0]) {
      return false;
    }
    
  
    
    const startRow = Math.max(0, Math.floor(newY / this.tileSize));
    const endRow = Math.min(obstacleMatrix.length - 1, Math.floor((newY + this.collisionBoxSize) / this.tileSize));
    const startCol = Math.max(0, Math.floor(newX / this.tileSize));
    const endCol = Math.min(obstacleMatrix[0].length - 1, Math.floor((newX + this.collisionBoxSize) / this.tileSize));
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (obstacleMatrix[row] && obstacleMatrix[row][col] === 1) {
          return true;
        }
      }
    }
    return false;
  }

    // Detección simple de colisión por cajas
  isCollidingWithObject(object) {
      return !(
        this.x + this.visualSize < object.x ||
        this.x > object.x + object.size ||
        this.y + this.visualSize < object.y ||
        this.y > object.y + object.size
      );
  }
  
  
  applyEffect(object) {
    switch(object.type) {
      case 'Health':
        this.health = Math.min(this.health + object.effect.health, 100);
        break;
      case 'Speed':
        this.speed += object.effect.speed;
        setTimeout(() => {
          this.speed = this.defaultSpeed;
        }, object.effect.duration);
        break;
      case 'Score':
        // Incrementa el score en el GameManager
        this.gameManager.score += object.effect.score;
        break;
      default:
        console.log("Tipo de objeto desconocido");
    }
  
    this.gameManager.uiManager.showNotification("Efecto aplicado: " + object.type);
  }
  
  reset() {
    this.x = 100;
    this.y = 100;
    this.health = 100;
    this.speed = this.defaultSpeed;
    // Otras propiedades se pueden restablecer según se necesite
  }
  takeDamage(amount) {
    this.health -= amount;
    console.log(`El jugador recibió ${amount} de daño. Salud actual: ${this.health}`);
    if (this.health <= 0) {
      this.die();
    }
  }
 
  die() {
    console.log("El jugador ha muerto.");
    this.gameManager.gameOver();
  }
}


window.Player = Player;