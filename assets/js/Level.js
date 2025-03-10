// Clase Level que encapsula la generación y renderizado del nivel
class Level {
    constructor(canvas, tileSize = 20) {
      this.canvas = canvas;
      this.tileSize = tileSize;             // Tamaño de cada celda en la matriz
      this.obstacleMatrix = [];       // Matriz que representará obstáculos (1 = pared, 0 = libre)
      this.rectangles = [];           // Almacena los recintos generados
      this.backgroundImage = new Image();
      this.backgroundImage.src = "assets/images/Level1.png";
    }
  
    // Método para generar el nivel
    setLevel() {
      const rows = Math.ceil(this.canvas.height / this.tileSize);
      const cols = Math.ceil(this.canvas.width / this.tileSize);
      
      // Genera la matriz de obstáculos y los recintos (rooms)
      const { matrix, rectangles } = this.generateLevelMatrix(rows, cols);
      this.obstacleMatrix = matrix;
      this.rectangles = rectangles;
      
      // Aquí podrías, por ejemplo, notificar a otros managers (como el ObjectManager)
      // que se generaron nuevos obstáculos para colocar objetos en los recintos.
      console.log("Nivel generado:", this.obstacleMatrix);
    }
  
    // Limpia la matriz de obstáculos (por ejemplo, al reiniciar el nivel)
    clearObstacles() {
      this.obstacleMatrix = this.obstacleMatrix.map(row => row.map(() => 0));
      console.log("Obstáculos limpiados.");
    }
  
 
  
    // Rellena los bordes de un rectángulo con obstáculos
    fillRectangleBorders(matrix, rectangle) {
      const { startRow, startCol, height, width } = rectangle;
      for (let r = startRow; r < startRow + height; r++) {
        for (let c = startCol; c < startCol + width; c++) {
          if (r === startRow || r === startRow + height - 1 || c === startCol || c === startCol + width - 1) {
            matrix[r][c] = 1;
          }
        }
      }
    }
    generateLevelMatrix(rows, cols) {
        const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
        const numRectangles = Math.floor(Math.random() * 8) + 5; // Entre 5 y 12 recintos
        const rectangles = [];
      
        for (let i = 0; i < numRectangles; i++) {
          let attempts = 0;
          let rectangle = null;
          while (attempts < 10) {
            const startRow = Math.floor(Math.random() * (rows - 12));
            const startCol = Math.floor(Math.random() * (cols - 12));
            
            // Limitar la altura y el ancho para que no se salgan de la matriz
            const maxPossibleHeight = rows - startRow;
            const maxPossibleWidth = cols - startCol;
            const height = Math.min(Math.floor(Math.random() * 7) + 20, maxPossibleHeight);
            const width = Math.min(Math.floor(Math.random() * 7) + 20, maxPossibleWidth);
            
            rectangle = { startRow, startCol, height, width };
            if (!this.isColliding(rectangle, rectangles)) {
              rectangles.push(rectangle);
              break;
            }
            attempts++;
          }
          if (attempts >= 10) {
            console.warn("No se pudo colocar un rectángulo sin colisiones tras 10 intentos.");
            continue;
          }
          // Rellena los bordes del rectángulo con obstáculos
          this.fillRectangleBorders(matrix, rectangle);
          // Crea aberturas en los recintos para conectar las salas
          this.createOpenings(matrix, rectangle);
        }
        return { matrix, rectangles };
      }
  
    // Crea aberturas (puertas) en los bordes del rectángulo
    createOpenings(matrix, rectangle) {
      const { startRow, startCol, height, width } = rectangle;
      const numOpenings = Math.floor(Math.random() * 3) + 1; // Entre 1 y 3 aberturas
      for (let j = 0; j < numOpenings; j++) {
        const openingSide = Math.floor(Math.random() * 4); // 0: arriba, 1: derecha, 2: abajo, 3: izquierda
        const openingSize = Math.floor(Math.random() * 3) + 2; // Tamaño de 2 a 4 celdas
        switch (openingSide) {
          case 0: // Abertura en la parte superior
            {
              const startOpening = Math.floor(Math.random() * (width - openingSize - 1)) + startCol + 1;
              for (let k = 0; k < openingSize; k++) {
                if (startOpening + k < startCol + width - 1) {
                  matrix[startRow][startOpening + k] = 0;
                }
              }
            }
            break;
          case 1: // Abertura en la parte derecha
            {
              const startOpening = Math.floor(Math.random() * (height - openingSize - 1)) + startRow + 1;
              for (let k = 0; k < openingSize; k++) {
                if (startOpening + k < startRow + height - 1) {
                  matrix[startOpening + k][startCol + width - 1] = 0;
                }
              }
            }
            break;
          case 2: // Abertura en la parte inferior
            {
              const startOpening = Math.floor(Math.random() * (width - openingSize - 1)) + startCol + 1;
              for (let k = 0; k < openingSize; k++) {
                if (startOpening + k < startCol + width - 1) {
                  matrix[startRow + height - 1][startOpening + k] = 0;
                }
              }
            }
            break;
          case 3: // Abertura en la parte izquierda
            {
              const startOpening = Math.floor(Math.random() * (height - openingSize - 1)) + startRow + 1;
              for (let k = 0; k < openingSize; k++) {
                if (startOpening + k < startRow + height - 1) {
                  matrix[startOpening + k][startCol] = 0;
                }
              }
            }
            break;
        }
      }
    }
  
    // Verifica si el nuevo rectángulo colisiona con alguno ya existente
    isColliding(newRect, rectangles) {
      for (let rect of rectangles) {
        if (
          newRect.startRow < rect.startRow + rect.height &&
          newRect.startRow + newRect.height > rect.startRow &&
          newRect.startCol < rect.startCol + rect.width &&
          newRect.startCol + newRect.width > rect.startCol
        ) {
          return true;
        }
      }
      return false;
    }
  
    // Renderiza el nivel: dibuja el fondo y los obstáculos según la matriz generada
    render(ctx) {
      // Dibuja la imagen de fondo (si ya se ha cargado)
      if (this.backgroundImage.complete && this.backgroundImage.naturalWidth !== 0) {
        ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
      }
  
      // Dibuja los obstáculos (por ejemplo, en gris)
      ctx.fillStyle = "gray";
      for (let r = 0; r < this.obstacleMatrix.length; r++) {
        for (let c = 0; c < this.obstacleMatrix[r].length; c++) {
          if (this.obstacleMatrix[r][c] === 1) {
            ctx.fillRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);
          }
        }
      }
    }
  }
  
  // Exportamos la clase Level para su uso global o en otros módulos
  window.Level = Level;