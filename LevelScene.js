class LevelScene extends Phaser.Scene {
    constructor() {
        super({key: 'LevelScene'})
    }

    preload() {
        this.load.image('player', 'assets/player.png')
        this.load.image('coin', 'assets/coin.png')
        this.load.image('skittle', 'assets/skittle.png')
        this.load.image('arrow', 'assets/arrow.png')
        for(let i = 1; i <= 4; i++) {
            this.load.audio(`ohno${i}`, `assets/audio/ohno${i}.mp3`)
        }
        for(let i = 1; i <= 3; i++) {
            this.load.audio(`yummy${i}`, `assets/audio/yummy${i}.mp3`)
        }
    }

    create() {
        // scene setup
        gameState.player = this.physics.add.image(640, 600, 'player')
        gameState.player.setScale(0.75)
        gameState.player.body.setSize(150, 256)
        gameState.floor = this.physics.add.staticGroup()
        gameState.floor.create(640, 710, 'floor').setScale(40, 0.1).setVisible(false).refreshBody()
        this.add.rectangle(640, 715, 1280, 25, 0x964b00)
        this.physics.add.collider(gameState.player, gameState.floor)
        gameState.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '35px', fill: '#000000', fontStyle: 'bold', fontFamily: "Comic Sans MS"})
    
        // movement setup
        gameState.cursors = this.input.keyboard.addKeys('A,D')
        gameState.moveButtons.R = this.add.image(1200, 640, 'arrow').setScale(0.6, 0.6).setAlpha(0.7)
        gameState.moveButtons.L = this.add.image(80, 640, 'arrow').setScale(0.6, 0.6).setAlpha(0.7).setFlipX(true)
        gameState.moveButtons.R.setInteractive();
        gameState.moveButtons.L.setInteractive();
        
        const handleButtonUp = isR => {
            const button = isR ? gameState.moveButtons.R : gameState.moveButtons.L
            button.isDown = false
            button.setAlpha(0.7)
        }
        gameState.moveButtons.R.on('pointerdown', function () {
            gameState.moveButtons.R.isDown = true;
            gameState.moveButtons.R.setAlpha(0.9)
        })
        gameState.moveButtons.R.on('pointerup', () => handleButtonUp(true))
        gameState.moveButtons.R.on('pointerout', () => handleButtonUp(true))
        gameState.moveButtons.L.on('pointerdown', function () {
            gameState.moveButtons.L.isDown = true;
            gameState.moveButtons.L.setAlpha(0.9)
        })
        gameState.moveButtons.L.on('pointerup', () => handleButtonUp(false))
        gameState.moveButtons.L.on('pointerout', () => handleButtonUp(false))
        gameState.player.setCollideWorldBounds(true);

        // skittles setup
        gameState.skittles = this.physics.add.group()
        const makeSkittles = () => {
            const xCoord = Math.random() * 1160 + 80
            const skittle = gameState.skittles.create(xCoord, -50, 'skittle')
            skittle.setScale(0.2)
            skittle.angle = Math.random() * 360
        }
        gameState.makeSkittlesLoop = this.time.addEvent({
            delay: 1500,
            callback: makeSkittles,
            callbackScope: this,
            loop: true
        })
        this.physics.add.collider(gameState.skittles, gameState.floor, skittle => {
            skittle.destroy()
        })
        this.physics.add.overlap(gameState.player, gameState.skittles, (player, skittle) => {
            skittle.destroy()
            gameState.score++
            gameState.scoreText.setText(`Score: ${gameState.score}`)
            this.sound.play(`yummy${Math.round(1 + Math.random() * 2)}`)
        }, (player, skittle) => {
            return skittle.y < 530
        })

        // coins setup
        gameState.coins = this.physics.add.group()
        const makeCoins = () => {
            if (Math.random() < 0.25) return
            const xCoord = Math.random() * 1160 + 80
            const coin = gameState.coins.create(xCoord, -50, 'coin')
            coin.setScale(0.2)
            coin.angle = Math.random() * 360
        }
        gameState.makeCoinsLoop = this.time.addEvent({
            delay: 2750,
            callback: makeCoins,
            callbackScope: this,
            loop: true
        })
        this.physics.add.collider(gameState.coins, gameState.floor, coin => {
            coin.destroy()
        })
        this.physics.add.overlap(gameState.player, gameState.coins, (player, coin) => {
            this.sound.play(`ohno${Math.round(1 + Math.random() * 3)}`)
            this.physics.pause()
            this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.5)
            const text = this.add.text(0, 0, 'Game Over!\nPress anywhere to restart', {fontSize: '20px', fill: '#000000', align: 'center', fontStyle: 'bold'})
            text.setX(this.cameras.main.width / 2 - text.width / 2);
            text.setY(this.cameras.main.height / 2 - text.height / 2);
            setTimeout(() => {
                this.input.on('pointerdown', () => {
                    this.input.on('pointerup', () => {
                        gameState.score = 0
                        this.scene.restart()
                    })
                })
            }, 500)

        }, (player, coin) => {
            return coin.y < 530
        })
    }

    update() {
        // movement
        let hasMoved = false
        const playerSpeed = 400
        if (gameState.cursors.A.isDown || gameState.moveButtons.L.isDown) {
            gameState.player.setVelocityX(-playerSpeed)
            gameState.player.flipX = false
            hasMoved = true
        }
        if (gameState.cursors.D.isDown || gameState.moveButtons.R.isDown) {
            gameState.player.setVelocityX(playerSpeed)
            gameState.player.flipX = true
            hasMoved = true
        }
        if (!hasMoved) {
            gameState.player.setVelocityX(0)
        }
    }
}