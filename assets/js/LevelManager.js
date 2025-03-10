// --- LevelManager.js ---
// Clase LevelManager que se encarga de gestionar el nivel actual
class LevelManager {
  constructor(canvas, gameManager, tileSize = 20) {
    this.canvas = canvas;
    this.gameManager = gameManager;
    // Instanciamos el nivel utilizando la clase Level
    this.currentLevel = new Level(canvas, tileSize);
  }

  // Inicializa el nivel generando la matriz de obstáculos y los recintos
  initLevel() {
    this.currentLevel.setLevel();
    // Aquí podrías notificar a otros managers (por ejemplo, ObjectManager) para generar objetos en los recintos
    console.log("Nivel inicializado.");
  }

  // Reinicia el nivel (por ejemplo, al reiniciar el juego o al cambiar de nivel)
  resetLevel() {
    this.currentLevel.clearObstacles();
    this.currentLevel.setLevel();
    console.log("Nivel reiniciado.");
  }

  // Renderiza el nivel en el canvas
  render(ctx) {
    this.currentLevel.render(ctx);
  }
}

// Exportamos LevelManager para que esté disponible globalmente o en otros módulos
window.LevelManager = LevelManager;