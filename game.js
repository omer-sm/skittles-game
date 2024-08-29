const gameState = {
    score: 0,
    moveButtons: {}
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: "6666ff",
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'phaser-example',
        width: 1280,
        height: 720
    },
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
          enableBody: true,
          debug: false
        }
      },
    scene: [LevelScene]
}

const game = new Phaser.Game(config)