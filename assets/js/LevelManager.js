// --- LevelManager.js ---

// Clase LevelManager para gestionar y configurar los niveles del juego
class LevelManager {
  constructor(canvas, gameManager) {
    // Referencia al canvas y al gestor del juego
    this.canvas = canvas;
    this.gameManager = gameManager;
    this.tileSize = 6; // Tamaño de cada bloque (tile) en el nivel
    this.backgroundImage = new Image(); // Imagen de fondo del nivel
    this.backgroundImage.src = "assets/images/Level1.png"; // Ruta de la imagen de fondo
    this.obstacleMatrix = []; // Matriz para almacenar la ubicación de los obstáculos
  }

  // Configura el nivel inicial y genera la matriz de obstáculos
  setLevel() {
    // Calcula el número de filas y columnas según el tamaño del canvas y de los bloques
    const rows = Math.ceil(this.canvas.height / this.tileSize);
    const cols = Math.ceil(this.canvas.width / this.tileSize);
    // Genera la matriz del nivel con obstáculos
    this.obstacleMatrix = this.generateLevelMatrix(rows, cols);
  }

  // Método para generar una matriz de nivel con obstáculos aleatorios
  generateLevelMatrix(rows, cols) {
    // Crea una matriz vacía (sin obstáculos), llena de ceros
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    // Determina un número aleatorio de rectángulos a generar como obstáculos
    const numRectangles = Math.floor(Math.random() * 5) + 3; // Entre 3 y 7 rectángulos

    // Genera cada rectángulo de obstáculos
    for (let i = 0; i < numRectangles; i++) {
      // Determina las posiciones y dimensiones aleatorias del rectángulo
      let startRow = Math.floor(Math.random() * rows);
      let startCol = Math.floor(Math.random() * cols);
      let height = Math.floor(Math.random() * 4) + 3; // Altura entre 3 y 6 bloques
      let width = Math.floor(Math.random() * 4) + 3;  // Ancho entre 3 y 6 bloques

      // Rellena la matriz con el rectángulo de obstáculos, asegurando que no salga de los límites
      for (let r = startRow; r < startRow + height && r < rows; r++) {
        for (let c = startCol; c < startCol + width && c < cols; c++) {
          matrix[r][c] = 1; // Marca la celda como un obstáculo
        }
      }
    }
    return matrix; // Devuelve la matriz generada con obstáculos
  }
}

// Exporta LevelManager al contexto global para que pueda ser usado en el juego
window.LevelManager = LevelManager;







