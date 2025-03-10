// --- ObjectManager.js ---
// Clase ObjectManager para gestionar los objetos recolectables del juego
class ObjectManager {
  constructor(canvas, gameManager) {
    this.canvas = canvas;
    this.gameManager = gameManager;
    this.ctx = this.canvas.getContext("2d");
    this.objects = []; // Array para almacenar instancias de GameObject
  }

  // Método para añadir un nuevo objeto recolectable
  addObject(x, y, type) {
    // Obtiene el efecto correspondiente según el tipo del objeto
    const effect = this.getEffectByType(type);
    // Crea una instancia de GameObject (definida en Object.js)
    const object = new GameObject(x, y, type, effect);
    this.objects.push(object);
  }

  //Método para generar objetos dentro de recintos, por ejemplo, usando las coordenadas de un nivel
  generateObjectsInRectangles(rectangles) {
    // Utiliza el tileSize y la matriz de obstáculos del nivel actual
    const tileSize = this.gameManager.levelManager.currentLevel.tileSize;
    const obstacleMatrix = this.gameManager.levelManager.currentLevel.obstacleMatrix;
    
    rectangles.forEach(rectangle => {
      const { startRow, startCol, height, width } = rectangle;
      
      // Define el área libre dentro del recinto (sin contar los bordes)
      const minRow = startRow + 1;
      const maxRow = startRow + height - 2;
      const minCol = startCol + 1;
      const maxCol = startCol + width - 2;

      if (maxRow > minRow && maxCol > minCol) {
        // Genera entre 1 y 3 objetos dentro del recinto
        const numObjects = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numObjects; i++) {
          let attempts = 0;
          let placed = false;
          
          // Intenta colocar el objeto en una posición libre (no obstáculo)
          while (attempts < 10 && !placed) {
            const row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
            const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;
            
            if (obstacleMatrix[row] && obstacleMatrix[row][col] === 0) {
              const x = col * tileSize;
              const y = row * tileSize;
              
              // Selecciona aleatoriamente un tipo de objeto
              const objectTypes = ['Health', 'Speed', 'Score'];
              const randomIndex = Math.floor(Math.random() * objectTypes.length);
              const type = objectTypes[randomIndex];
              
              this.addObject(x, y, type);
              placed = true;
            }
            attempts++;
          }
          
          if (!placed) {
            console.warn(`No se pudo colocar un objeto en el recinto (${startRow}, ${startCol}) tras 10 intentos.`);
          }
        }
      }
    });
  }
//
  replaceObject(collectedObject) {
    // Elimina el objeto recogido del array
    const index = this.objects.indexOf(collectedObject);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
    
    // Obtiene el nivel actual y sus recintos
    const level = this.gameManager.levelManager.currentLevel;
    if (level.rectangles.length === 0) return; // Si no hay recintos, no se puede generar
    
    // Selecciona aleatoriamente un rectángulo (recinto)
    const randomRect = level.rectangles[Math.floor(Math.random() * level.rectangles.length)];
    
    // Define el área libre dentro del recinto (sin incluir los bordes)
    const minRow = randomRect.startRow + 1;
    const maxRow = randomRect.startRow + randomRect.height - 2;
    const minCol = randomRect.startCol + 1;
    const maxCol = randomRect.startCol + randomRect.width - 2;
    
    if (maxRow < minRow || maxCol < minCol) return;
    
    // Elige una posición aleatoria dentro del área libre
    const row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
    const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;
    const tileSize = level.tileSize;
    const x = col * tileSize;
    const y = row * tileSize;
    
    // Selecciona aleatoriamente un tipo de objeto
    const objectTypes = ['Health', 'Speed', 'Score'];
    const randomIndex = Math.floor(Math.random() * objectTypes.length);
    const type = objectTypes[randomIndex];
    
  
  }

  // Renderiza los objetos en el canvas, llamando a render de cada GameObject
  renderObjects(ctx) {
    this.objects.forEach(object => {
      if (!object.isCollected()) {
        object.render(ctx);
      }
    });
  }

  // Método para definir el efecto de cada objeto según su tipo
  getEffectByType(type) {
    switch (type) {
      case 'Health':
        return { health: 20 };
      case 'Speed':
        return { speed: 3, duration: 5000 }; // Aumenta la velocidad durante 5 segundos
      case 'Score':
        return { score: 10 };
      default:
        return {};
    }
  }
}

// Exporta ObjectManager para su uso global o en otros módulos
window.ObjectManager = ObjectManager;