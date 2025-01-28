// --- ObjectManager.js ---

// Clase ObjectManager para gestionar los objetos recolectables en el juego
class ObjectManager {
  constructor(canvas, gameManager) {
    // Referencias al canvas y al gestor del juego
    this.canvas = canvas;
    this.gameManager = gameManager;
    this.ctx = this.canvas.getContext("2d");
    this.objects = []; // Lista de objetos recolectables

    // Cargar las imágenes de los objetos
    this.images = {
      Health: new Image(),
      Speed: new Image(),
      Score: new Image()
    };
    this.images.Health.src = "assets/images/health.png";
    this.images.Speed.src = "assets/images/speed.png";
    this.images.Score.src = "assets/images/star.png";

    // Asegurarse de que las imágenes estén cargadas antes de usarlas
    this.imagesLoaded = {
      Health: false,
      Speed: false,
      Score: false
    };

    // Configurar eventos para cuando las imágenes terminen de cargar
    for (let key in this.images) {
      this.images[key].onload = () => {
        this.imagesLoaded[key] = true;
        console.log(`Imagen de ${key} cargada correctamente.`);
      };
      this.images[key].onerror = () => {
        console.error(`Error al cargar la imagen de ${key}.`);
      };
    }
  }

  // Método para verificar si todos los objetos han sido recolectados
  allCollected() {
    return this.objects.every(object => object.isCollected());
  }

  // Renderiza los objetos no recolectados en el canvas
  renderObjects(ctx) {
    this.objects.forEach(object => {
      if (!object.collected) {
        const img = this.images[object.type];
        const imgLoaded = this.imagesLoaded[object.type];

        if (imgLoaded && img.complete && img.naturalWidth !== 0) {
          ctx.drawImage(img, object.x, object.y, 20, 20);
        } else {
          // Dibujar un color de reserva si la imagen no está lista
          ctx.fillStyle = "#FFD700"; // Color de reserva
          ctx.fillRect(object.x, object.y, 20, 20);
        }
      }
    });
  }

  // Método para añadir un nuevo objeto recolectable
  addObject(x, y, type) {
    const effect = this.getEffectByType(type); // Obtiene el efecto correspondiente al tipo de objeto
    const object = new GameObject(x, y, type, effect); // Crea una nueva instancia de GameObject
    this.objects.push(object); // Añade el objeto a la lista de objetos recolectables
  }

  // Método para generar objetos dentro de los rectángulos de obstáculos
  generateObjectsInObstacles(rectangles) {
    const obstacleMatrix = this.gameManager.levelManager.obstacleMatrix;
    const tileSize = this.gameManager.levelManager.tileSize;

    rectangles.forEach(rectangle => {
      const { startRow, startCol, height, width } = rectangle;

      // Definir el área hueca del rectángulo (evitar las paredes)
      const minRow = startRow + 1;
      const maxRow = startRow + height - 2;
      const minCol = startCol + 1;
      const maxCol = startCol + width - 2;

      if (maxRow > minRow && maxCol > minCol) {
        // Generar entre 1 y 3 objetos dentro del área hueca
        const numObjects = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numObjects; i++) {
          let attempts = 0;
          let placed = false;

          // Intentar colocar un objeto en un espacio libre
          while (attempts < 10 && !placed) {
            const row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
            const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

            // Verificar si la posición está libre (no es un obstáculo)
            if (obstacleMatrix[row] && obstacleMatrix[row][col] === 0) {
              const x = col * tileSize;
              const y = row * tileSize;

              // Generar un tipo aleatorio de objeto
              const objectTypes = ['Health', 'Speed', 'Score'];
              const randomIndex = Math.floor(Math.random() * objectTypes.length);
              const type = objectTypes[randomIndex];

              // Añadir el objeto a la lista
              this.addObject(x, y, type);
              placed = true; // Marcar como colocado
            }

            attempts++;
          }

          if (!placed) {
            console.warn(`No se pudo colocar un objeto en el recinto (${startRow}, ${startCol}) después de 10 intentos.`);
          }
        }
      }
    });
  }

  // Obtiene el efecto correspondiente al tipo de objeto
  getEffectByType(type) {
    switch (type) {
      case 'Health':
        return { health: 20 };
      case 'Speed':
        return { speed: 3, duration: 5000 }; // Velocidad aumentada por 5 segundos
      case 'Score':
        return { score: 10 };
      default:
        return {};
    }
  }
}

// Clase GameObject para definir las propiedades y métodos de los objetos recolectables
class GameObject {
  constructor(x, y, type, effect) {
    this.x = x; // Posición X del objeto
    this.y = y; // Posición Y del objeto
    this.type = type; // Tipo de objeto (p. ej., "Health", "Speed", "Score")
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
}

// Exporta ObjectManager al contexto global para ser utilizado en el juego
window.ObjectManager = ObjectManager;




