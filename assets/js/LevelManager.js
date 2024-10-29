// --- LevelManager.js ---
// Clase LevelManager que maneja la configuración y renderizado de niveles en el juego
class LevelManager {
  constructor(canvas, gameManager) {
    // Tamaño de cada celda en la cuadrícula
    this.tileSize = 6;

    // Mapas de imágenes de fondo por nivel
    this.backgroundImages = {
      1: "assets/images/Level1.png",
      2: "assets/images/Level2.png",
      3: "assets/images/Level3.png"
    };

    // Lista de imágenes de obstáculos disponibles
    this.obstacleImages = [
      "assets/images/obstacle1.png",
      //"assets/images/obstacle2.png"
    ];

    this.setRandomObstacleImage(); // Configura una imagen de obstáculo aleatoria

    // Inicialización del canvas y del gestor principal del juego
    this.canvas = canvas;
    this.gameManager = gameManager;
    this.currentLevel = 1; // Nivel inicial
    this.backgroundImage = new Image(); // Imagen de fondo del nivel
    this.obstacleMatrix = []; // Matriz de obstáculos del nivel
    this.objects = []; // Lista de objetos del nivel actual
  }

  // Establece el nivel actual y carga los elementos asociados a este nivel
  setLevel(level) {
    if (this.backgroundImages.hasOwnProperty(level)) {
      this.currentLevel = level;
      this.loadBackgroundImage(); // Carga la imagen de fondo del nivel

      // Calcula las filas y columnas según el tamaño del canvas y las celdas
      const rows = Math.ceil(this.canvas.height / this.tileSize);
      const cols = Math.ceil(this.canvas.width / this.tileSize);

      // Genera una matriz de obstáculos
      this.obstacleMatrix = this.generateLevelMatrix(rows, cols);

      // Genera objetos del nivel actual usando ObjectManager
      if (this.gameManager && this.gameManager.objectManager) {
        this.gameManager.objectManager.generateObjectsForLevel(level, ['star', 'shield', 'health']);
      } else {
        console.error("ObjectManager no está disponible en LevelManager");
      }
    } else {
      console.warn(`El nivel ${level} no tiene una imagen de fondo definida.`);
      this.obstacleMatrix = []; // Si no hay fondo, limpia la matriz de obstáculos
    }
  }

  // Establece aleatoriamente una imagen de obstáculo
  setRandomObstacleImage() {
    const randomIndex = Math.floor(Math.random() * this.obstacleImages.length);
    this.obstacleImage = new Image();
    this.obstacleImage.src = this.obstacleImages[randomIndex];

    // Carga la imagen y maneja posibles errores
    this.obstacleImage.onload = () => {
      console.log("Imagen del obstáculo cargada correctamente:", this.obstacleImage.src);
    };
    this.obstacleImage.onerror = () => {
      console.error("Error al cargar la imagen del obstáculo:", this.obstacleImage.src);
      this.obstacleImage.src = "assets/images/defaultObstacle.png"; // Imagen alternativa en caso de error
    };
  }

  // Actualiza el contador de nivel en la interfaz
  updateLevelCounter() {
    const levelCounter = document.getElementById('levelCounter');
    if (levelCounter) {
      levelCounter.textContent = `Nivel: ${this.currentLevel}`;
    }
  }

  // Genera la matriz de obstáculos del nivel
  generateLevelMatrix(rows, cols) {
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Genera recintos rectangulares como obstáculos
    const numRectangles = Math.floor(Math.random() * 5) + 3 + (this.currentLevel || 0);

    for (let i = 0; i < numRectangles; i++) {
      let attempts = 0;
      let valid = false;
      let startRow, startCol, height, width;

      // Intenta generar un recinto sin superposición
      while (!valid && attempts < 10) {
        height = Math.floor(Math.random() * 4) + 6;
        width = Math.floor(Math.random() * 8) + 7;

        startRow = Math.floor(Math.random() * (rows - height));
        startCol = Math.floor(Math.random() * (cols - width));

        valid = true;
        for (let r = startRow; r < startRow + height && valid; r++) {
          for (let c = startCol; c < startCol + width && valid; c++) {
            if (matrix[r][c] === 1) valid = false;
          }
        }
        attempts++;
      }

      // Si se encontró una posición válida, dibujar el recinto
      if (valid) {
        for (let r = startRow; r < startRow + height && r < rows; r++) {
          for (let c = startCol; c < startCol + width && c < cols; c++) {
            if (r === startRow || r === startRow + height - 1 || c === startCol || c === startCol + width - 1) {
              matrix[r][c] = 1;
            }
          }
        }

        // Crear aberturas en las paredes del recinto
        const numOpenings = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < numOpenings; j++) {
          const openingSide = Math.floor(Math.random() * 4);
          const openingSize = 3;

          switch (openingSide) {
            case 0: // Superior
              for (let k = 0; k < openingSize && startCol + k < startCol + width; k++) {
                matrix[startRow][startCol + k] = 0;
              }
              break;
            case 1: // Derecha
              for (let k = 0; k < openingSize && startRow + k < startRow + height; k++) {
                matrix[startRow + k][startCol + width - 1] = 0;
              }
              break;
            case 2: // Inferior
              for (let k = 0; k < openingSize && startCol + k < startCol + width; k++) {
                matrix[startRow + height - 1][startCol + k] = 0;
              }
              break;
            case 3: // Izquierda
              for (let k = 0; k < openingSize && startRow + k < startRow + height; k++) {
                matrix[startRow + k][startCol] = 0;
              }
              break;
          }
        }
      }
    }

    return matrix; // Devuelve la matriz generada
  }

  // Renderiza los obstáculos en el nivel actual usando la matriz
  renderLevel(ctx) {
    for (let row = 0; row < this.obstacleMatrix.length; row++) {
      for (let col = 0; col < this.obstacleMatrix[row].length; col++) {
        if (this.obstacleMatrix[row][col] === 1 && this.obstacleImage.complete) {
          ctx.drawImage(
            this.obstacleImage,
            col * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
          );
        }
      }
    }
  }

  // Carga la imagen de fondo para el nivel actual
  loadBackgroundImage() {
    const imageSrc = this.backgroundImages[this.currentLevel];
    this.backgroundImage.src = imageSrc;

    this.backgroundImage.onload = () => {
        console.log("Imagen de fondo cargada correctamente:", imageSrc);
        if (this.gameManager) {
            this.gameManager.drawGame(); // Llama a drawGame cuando la imagen esté cargada
        }
    };

    this.backgroundImage.onerror = () => {
        console.error(`Error al cargar la imagen de fondo desde ${imageSrc}`);
        this.backgroundImage.src = "assets/images/defaultBackground.png"; // Imagen alternativa
    };
  }


  // Renderiza objetos en el nivel actual
  renderObjects(ctx) {
    this.objects.forEach((obj) => {
      const img = new Image();
      img.src = 'assets/images/star.png'; // Imagen de objeto

      if (img.complete) {
        ctx.drawImage(img, obj.x, obj.y, 20, 20);
      } else {
        img.onload = () => {
          ctx.drawImage(img, obj.x, obj.y, 20, 20);
        };
      }
    });
  }
}

// Exporta LevelManager al contexto global
window.LevelManager = LevelManager;






