// --- Object.js ---
// Clase GameObject que representa un objeto recolectable en el juego
class GameObject {
    constructor(x, y, type, effect) {
      this.x = x;                     // Posición X en el canvas
      this.y = y;                     // Posición Y en el canvas
      this.type = type;               // Tipo del objeto (ej. "Health", "Speed", "Score")
      this.effect = effect;           // Objeto con el efecto a aplicar al jugador
      this.collected = false;         // Estado de recolección; por defecto, no recolectado
      this.size = 20;                 // Tamaño visual (ancho y alto) para renderizado y colisiones
  
      // Cargar la imagen correspondiente al tipo de objeto
      this.image = new Image();
      switch (this.type) {
        case "Health":
          this.image.src = "assets/images/health.png";
          break;
        case "Speed":
          this.image.src = "assets/images/speed.png";
          break;
        case "Score":
          this.image.src = "assets/images/star.png";
          break;
        default:
          // Imagen de respaldo en caso de tipo desconocido
          this.image.src = "assets/images/default.png";
          break;
      }
    }
  
    // Método para marcar el objeto como recolectado
    collect() {
      this.collected = true;
    }
  
    // Retorna true si el objeto ya fue recolectado
    isCollected() {
      return this.collected;
    }
  
    // Renderiza el objeto en el canvas, si aún no ha sido recolectado
    render(ctx) {
      if (this.collected) return; // No dibujar si ya se recogió
      // Si la imagen está cargada, se utiliza para dibujar el objeto
      if (this.image.complete && this.image.naturalWidth > 0) {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
      } else {
        // Si la imagen no está lista, se dibuja un rectángulo de color como respaldo
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }
  }
  
  // Se exporta la clase al contexto global para poder ser utilizada por el ObjectsManager o el GameManager
  window.GameObject = GameObject;