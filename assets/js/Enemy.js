// Clase Enemy que representa a un enemigo individual
class Enemy {
    constructor(x, y, type) {
      this.x = x;                    // Posición X inicial
      this.y = y;                    // Posición Y inicial
      this.type = type;              // Tipo de enemigo (ej. 'chaser', 'patroller', 'stationary', etc.)
      this.health = 50;              // Salud inicial del enemigo
      this.speed = 2;                // Velocidad de movimiento
      this.baseSpeed = Math.random() * 2 + 1; // Velocidad base aleatoria entre 1 y 3
      this.currentSpeed = this.baseSpeed;
      this.patrolDirection = 1;      // Dirección para enemigos tipo "patroller"
      this.size = 20;                // Tamaño del enemigo para renderizado y colisiones
    }
  
    // Método para mover al enemigo de forma aleatoria, respetando los límites del canvas
    moveRandomly(canvasWidth, canvasHeight) {
      const randomDirection = {
        x: Math.floor(Math.random() * 3) - 1, // Genera -1, 0 o 1
        y: Math.floor(Math.random() * 3) - 1
      };
      const newX = this.x + randomDirection.x * this.speed;
      const newY = this.y + randomDirection.y * this.speed;
      
      // Verificar que el enemigo se mantenga dentro del canvas
      if (newX >= 0 && newX <= canvasWidth - this.size) {
        this.x = newX;
      }
      if (newY >= 0 && newY <= canvasHeight - this.size) {
        this.y = newY;
      }
    }
  
    // Método para que un enemigo tipo "chaser" se mueva hacia el jugador
    moveTowardPlayer(player, canvasWidth, canvasHeight) {
      const distance = Math.hypot(player.x - this.x, player.y - this.y);
      if (distance < 200) { // Solo persigue si el jugador está cerca
        const direction = {
          x: player.x > this.x ? 1 : player.x < this.x ? -1 : 0,
          y: player.y > this.y ? 1 : player.y < this.y ? -1 : 0
        };
        let newX = this.x + direction.x * this.speed;
        let newY = this.y + direction.y * this.speed;
        
        // Verificar límites del canvas
        if (newX >= 0 && newX <= canvasWidth - this.size) {
          this.x = newX;
        }
        if (newY >= 0 && newY <= canvasHeight - this.size) {
          this.y = newY;
        }
      } else {
        // Si el jugador está lejos, moverse aleatoriamente
        this.moveRandomly(canvasWidth, canvasHeight);
      }
    }
  
    // Método para que un enemigo tipo "patroller" realice un movimiento de patrulla
    patrol(canvasWidth) {
      let newX = this.x + this.patrolDirection * this.speed;
      // Cambia la dirección si llega al borde del canvas
      if (newX < 0 || newX > canvasWidth - this.size) {
        this.patrolDirection *= -1;
      } else {
        this.x = newX;
      }
    }
  
    // Método de actualización general, en el que se decide el comportamiento según el tipo
    update(options = {}) {
      // options puede incluir: player, canvasWidth, canvasHeight, etc.
      if (this.type === 'chaser' && options.player) {
        this.moveTowardPlayer(options.player, options.canvasWidth, options.canvasHeight);
      } else if (this.type === 'patroller' && options.canvasWidth) {
        this.patrol(options.canvasWidth);
      } else if (options.canvasWidth && options.canvasHeight) {
        this.moveRandomly(options.canvasWidth, options.canvasHeight);
      }
      // Aquí podrías agregar lógica adicional según necesidades
    }
  
    // Método para renderizar al enemigo en el canvas
    render(ctx) {
      ctx.fillStyle = "red"; // Color representativo del enemigo
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  
    // Método para aplicar daño al enemigo
    takeDamage(amount) {
      this.health -= amount;
      if (this.health <= 0) {
        console.log("Enemigo destruido");
      }
    }
  
    // Método para verificar si el enemigo ha sido destruido
    isDestroyed() {
      return this.health <= 0;
    }
  }
  
  // Exporta la clase Enemy para que pueda ser utilizada por el EnemyManager o directamente por el GameManager
  window.Enemy = Enemy;

  //holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa