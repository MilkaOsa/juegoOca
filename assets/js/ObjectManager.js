// --- ObjectManager.js ---

// Clase ObjectManager para gestionar los objetos recolectables en el juego
class ObjectManager {
  constructor(canvas, gameManager) {
    // Referencias al canvas y al gestor del juego
    this.canvas = canvas;
    this.gameManager = gameManager;
    this.ctx = this.canvas.getContext("2d");
    this.objects = []; // Lista de objetos recolectables

    // Mejora visual del canvas
    this.canvas.width *= 2; // Duplicar el ancho del canvas para una mejor calidad gráfica
    this.canvas.height *= 2; // Duplicar el alto del canvas
    this.ctx.imageSmoothingEnabled = false; // Desactiva el suavizado de imágenes para un estilo más nítido
  }

  // Método para verificar si todos los objetos han sido recolectados
  allCollected() {
    // Devuelve true si todos los objetos han sido recolectados
    return this.objects.every(object => object.isCollected());
  }

  // Método para renderizar los objetos no recolectados en el canvas
  renderObjects(ctx) {
    this.objects.forEach(object => {
      if (!object.isCollected()) {
        ctx.fillStyle = '#FFD700'; // Color dorado para los objetos recolectables
        ctx.fillRect(object.x, object.y, 10, 10); // Dibuja un rectángulo para representar el objeto
      }
    });
  }

  // Método para añadir un nuevo objeto recolectable
  addObject(x, y, type) {
    const effect = this.getEffectByType(type); // Obtiene el efecto correspondiente al tipo de objeto
    const object = new GameObject(x, y, type, effect); // Crea una nueva instancia de GameObject
    this.objects.push(object); // Añade el objeto a la lista de objetos recolectables
  }

  // Método para generar objetos específicos para el nivel (implementación pendiente)
  generateObjectsForLevel() {
    /* Implementación necesaria */
  }

  // Método para aplicar el efecto del objeto al jugador (implementación pendiente)
  applyEffect(object) {
    /* Implementación necesaria */
  }
}

// Clase GameObject para definir las propiedades y métodos de los objetos recolectables
class GameObject {
  constructor(x, y, type, effect) {
    this.x = x; // Posición X del objeto
    this.y = y; // Posición Y del objeto
    this.type = type; // Tipo de objeto (p. ej., "poder", "puntuación")
    this.effect = effect; // Efecto que el objeto tiene en el jugador
    this.collected = false; // Estado de recolección del objeto (no recolectado por defecto)
  }

  // Método para marcar el objeto como recolectado
  collect() {
    this.collected = true; // Marca el objeto como recolectado
  }

  // Método para verificar si el objeto ha sido recolectado
  isCollected() {
    return this.collected; // Devuelve true si el objeto ha sido recolectado
  }

  // Método para obtener la imagen del objeto según su tipo (implementación pendiente)
  getImageSrc() {
    /* Implementación necesaria */
  }
}

// Exporta ObjectManager al contexto global para ser utilizado en el juego
window.ObjectManager = ObjectManager;



