// --- ObjectManager.js ---
// Gestión de los objetos recolectables dentro del juego

// Clase GameObject que representa un objeto recolectable en el juego
class GameObject {
  constructor(x, y, type, effect) {
    this.x = x;
    this.y = y;
    this.type = type; // Tipo de objeto (ej. 'star', 'shield', 'health')
    this.effect = effect; // Efecto que aplica el objeto al jugador
    this.collected = false; // Estado de recolección
  }

  // Marca el objeto como recolectado
  collect() {
    this.collected = true;
  }

  // Verifica si el objeto ya fue recolectado
  isCollected() {
    return this.collected;
  }

  // Obtiene la ruta de imagen según el tipo de objeto
  getImageSrc() {
    switch (this.type) {
      case 'star':
        return 'assets/images/star.png';
      case 'shield':
        return 'assets/images/shield.png';
      case 'health':
        return 'assets/images/health.png';
      default:
        return 'assets/images/default.png';
    }
  }
}

// Clase ObjectManager para gestionar los objetos del juego
class ObjectManager {
  constructor(canvas, gameManager) {
    this.gameManager = gameManager; // Referencia a GameManager
    this.canvas = canvas;
    this.canvas.width *= 2; // Mejora visual del canvas duplicando tamaño
    this.canvas.height *= 2;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false; // Evita pixelación
    this.objects = []; // Lista de objetos en el mapa
  }

  // Verifica si todos los objetos han sido recolectados
  allCollected() {
    return this.objects.every(object => object.isCollected());
  }

  // Renderiza los objetos en el canvas si no han sido recolectados
  renderObjects(ctx) {
    this.objects.forEach(object => {
      if (!object.isCollected()) {
        const img = new Image();
        img.src = object.getImageSrc();
        img.onload = () => {
          ctx.drawImage(img, object.x, object.y, 15, 15);
        };
      }
    });
  }

  // Añade un objeto en una posición específica
  addObject(x, y, type) {
    let effect;
    switch (type) {
      case 'star':
        effect = { scoreBonus: 100 };
        break;
      case 'shield':
        effect = { defenseBonus: 1 };
        break;
      case 'health':
        effect = { healthBonus: 1 };
        break;
      default:
        effect = {};
    }
    const object = new GameObject(x, y, type, effect);
    this.objects.push(object);
  }

  // Genera objetos según el nivel y categorías dadas
  generateObjectsForLevel(level, categories) {
    this.objects = []; // Vacía los objetos actuales
    const levelManager = this.gameManager ? this.gameManager.levelManager : null;
    if (!levelManager) {
      console.error("LevelManager no está disponible en ObjectManager");
      return;
    }

    const obstacleMatrix = levelManager.obstacleMatrix;
    const insideRectPositions = [];

    // Encuentra celdas dentro de recintos donde colocar objetos
    for (let row = 1; row < obstacleMatrix.length - 1; row++) {
      for (let col = 1; col < obstacleMatrix[row].length - 1; col++) {
        if (
          obstacleMatrix[row][col] === 0 &&
          obstacleMatrix[row - 1][col] === 1 &&
          obstacleMatrix[row + 1][col] === 1 &&
          obstacleMatrix[row][col - 1] === 1 &&
          obstacleMatrix[row][col + 1] === 1
        ) {
          insideRectPositions.push({ row, col });
        }
      }
    }

    // Define cuántos objetos crear
    const numObjects = Math.min(Math.floor(Math.random() * 10) + level * 2, insideRectPositions.length);

    // Selecciona posiciones aleatorias dentro de los recintos
    const positionsToUse = [];
    for (let i = 0; i < numObjects && insideRectPositions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * insideRectPositions.length);
      positionsToUse.push(insideRectPositions.splice(randomIndex, 1)[0]);
    }

    // Crea los objetos en las posiciones seleccionadas
    positionsToUse.forEach(position => {
      const x = position.col * levelManager.tileSize + (levelManager.tileSize / 2);
      const y = position.row * levelManager.tileSize + (levelManager.tileSize / 2);
      const type = categories[Math.floor(Math.random() * categories.length)];
      this.addObject(x, y, type);
    });
  }

  // Actualiza el estado de los objetos y verifica colisiones con el jugador
  updateObjects() {
    this.objects.forEach(object => {
      if (!object.isCollected() && this.isPlayerColliding(this.gameManager.player, object)) {
        this.applyEffect(object); // Aplica el efecto al jugador
        object.collect(); // Marca el objeto como recogido
      }
    });
  }

  // Verifica si el jugador colisiona con un objeto
  isPlayerColliding(player, object) {
    return Math.abs(player.x - object.x) < player.tileSize && Math.abs(player.y - object.y) < player.tileSize;
  }

  // Aplica el efecto del objeto al jugador (puntaje, defensa, vida)
  applyEffect(object) {
    const player = this.gameManager.player;
    if (object.effect.scoreBonus) {
      this.gameManager.score += object.effect.scoreBonus;
    }
    if (object.effect.defenseBonus) {
      player.defense = (player.defense || 0) + object.effect.defenseBonus;
    }
    if (object.effect.healthBonus) {
      player.health += object.effect.healthBonus;
    }
  }
}

// Exporta ObjectManager al contexto global
window.ObjectManager = ObjectManager;


