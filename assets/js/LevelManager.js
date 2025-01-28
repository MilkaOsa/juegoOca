// --- LevelManager.js ---

class LevelManager {
  constructor(canvas, gameManager) {
    this.canvas = canvas;
    this.gameManager = gameManager;
    this.tileSize = 10; // Tamaño ajustado para mejor visibilidad
    this.backgroundImage = new Image(); // Imagen de fondo del nivel
    this.backgroundImage.src = "assets/images/Level1.png"; // Ruta de la imagen de fondo
    this.obstacleMatrix = []; // Matriz para almacenar la ubicación de los obstáculos
    this.rectangles = []; // Almacena los rectángulos generados
  }

  setLevel() {
    const rows = Math.ceil(this.canvas.height / this.tileSize);
    const cols = Math.ceil(this.canvas.width / this.tileSize);
    
    // Generar la matriz de nivel y obtener los rectángulos
    const { matrix, rectangles } = this.generateLevelMatrix(rows, cols);
    this.obstacleMatrix = matrix;
    this.rectangles = rectangles;

    // Generar objetos en los recintos
    this.gameManager.objectManager.generateObjectsInObstacles(rectangles);

    // Establecer el nivel actual
    this.currentLevel = 1;

    // Verificar la matriz generada
    console.log("Matriz de obstáculos generada:", this.obstacleMatrix);
  }

  // Método para limpiar la matriz de obstáculos
  clearObstacles() {
    this.obstacleMatrix = this.obstacleMatrix.map(row => row.map(() => 0));
    console.log("Matriz de obstáculos limpiada.");
  }

  // Genera una matriz con recintos huecos y aberturas consistentes
  generateLevelMatrix(rows, cols) {
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    const numRectangles = Math.floor(Math.random() * 8) + 5; // Entre 5 y 11 recintos

    const rectangles = [];

    for (let i = 0; i < numRectangles; i++) {
      let attempts = 0;
      let rectangle = null;

      // Reintentar hasta encontrar un rectángulo que no colisione con los existentes y tenga suficiente espacio
      while (attempts < 10) {
        let startRow = Math.floor(Math.random() * (rows - 12)); // Dejar un margen para evitar colisiones
        let startCol = Math.floor(Math.random() * (cols - 12)); // Dejar un margen para evitar colisiones
        let height = Math.floor(Math.random() * 7) + 10; // Altura entre 10 y 14 bloques
        let width = Math.floor(Math.random() * 7) + 10;  // Ancho entre 10 y 14 bloques

        rectangle = { startRow, startCol, height, width };

        // Verificar si el rectángulo colisiona con los existentes
        if (!this.isColliding(rectangle, rectangles)) {
          rectangles.push(rectangle);
          break;
        }

        attempts++;
      }

      // Si no se encontró un lugar adecuado, omitimos este rectángulo
      if (attempts >= 10) {
        console.warn("No se pudo colocar un rectángulo sin colisiones después de 10 intentos.");
        continue;
      }

      // Rellena los bordes del recinto con obstáculos
      this.fillRectangleBorders(matrix, rectangle);

      // Generar aberturas grandes y consistentes en los bordes del recinto (2-3 celdas)
      this.createOpenings(matrix, rectangle);
    }

    return { matrix, rectangles };
  }

  // Método para rellenar los bordes del rectángulo con obstáculos
  fillRectangleBorders(matrix, rectangle) {
    const { startRow, startCol, height, width } = rectangle;

    for (let r = startRow; r < startRow + height; r++) {
      for (let c = startCol; c < startCol + width; c++) {
        if (r === startRow || r === startRow + height - 1 || c === startCol || c === startCol + width - 1) {
          matrix[r][c] = 1; // Marca las celdas correspondientes a las paredes del recinto.
        }
      }
    }
  }

  // Método para crear aberturas en los bordes del rectángulo
  createOpenings(matrix, rectangle) {
    const { startRow, startCol, height, width } = rectangle;

    const numOpenings = Math.floor(Math.random() * 3) + 1; // Entre 1 y 3 aberturas

    for (let j = 0; j < numOpenings; j++) {
      const openingSide = Math.floor(Math.random() * 4); // 0: arriba, 1: derecha, 2: abajo, 3: izquierda
      const openingSize = Math.floor(Math.random() * 3) + 2; // Tamaño de la abertura entre 2 y 3 celdas

      switch (openingSide) {
        case 0: // Abertura en la parte superior
          {
            let startOpening = Math.floor(Math.random() * (width - openingSize - 1)) + startCol + 1;
            for (let k = 0; k < openingSize; k++) {
              if (startOpening + k < startCol + width - 1) {
                matrix[startRow][startOpening + k] = 0; // Crear abertura
              }
            }
          }
          break;

        case 1: // Abertura en la parte derecha
          {
            let startOpening = Math.floor(Math.random() * (height - openingSize - 1)) + startRow + 1;
            for (let k = 0; k < openingSize; k++) {
              if (startOpening + k < startRow + height - 1) {
                matrix[startOpening + k][startCol + width - 1] = 0; // Crear abertura
              }
            }
          }
          break;

        case 2: // Abertura en la parte inferior
          {
            let startOpening = Math.floor(Math.random() * (width - openingSize - 1)) + startCol + 1;
            for (let k = 0; k < openingSize; k++) {
              if (startOpening + k < startCol + width - 1) {
                matrix[startRow + height - 1][startOpening + k] = 0; // Crear abertura
              }
            }
          }
          break;

        case 3: // Abertura en la parte izquierda
          {
            let startOpening = Math.floor(Math.random() * (height - openingSize - 1)) + startRow + 1;
            for (let k = 0; k < openingSize; k++) {
              if (startOpening + k < startRow + height - 1) {
                matrix[startOpening + k][startCol] = 0; // Crear abertura
              }
            }
          }
          break;
      }
    }
  }

  // Verifica si un rectángulo colisiona con los rectángulos existentes
  isColliding(newRect, rectangles) {
    for (let rect of rectangles) {
      if (
        newRect.startRow < rect.startRow + rect.height &&
        newRect.startRow + newRect.height > rect.startRow &&
        newRect.startCol < rect.startCol + rect.width &&
        newRect.startCol + newRect.width > rect.startCol
      ) {
        return true; // Colisión detectada
      }
    }
    return false; // No hay colisión
  }
}

window.LevelManager = LevelManager;







