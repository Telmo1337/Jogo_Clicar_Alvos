// Cena de Boot
class boot extends Phaser.Scene {
    constructor() {
      super({ key: 'boot' });
    }
  
    preload() {
      this.load.image('alvo', 'assets/target.png');
      this.load.image('fundo', 'assets/bg.jpg');
      this.load.image('mira', 'assets/mira.png');
    }
  
    create() {
      this.scene.start('menu');
    }
  }
  
  // Cena de Menu
  class menu extends Phaser.Scene {
    constructor() {
      super({ key: 'menu' });
    }
  
    create() {
      this.add.image(400, 300, 'fundo');
      this.add.text(250, 150, 'CLICK MASTER', { fontSize: '40px', fill: '#fff' });
      this.add.text(180, 250, 'Clica nos alvos antes que desapareçam!', { fontSize: '24px', fill: '#fff' });
      this.add.text(250, 300, 'Clica para começar', { fontSize: '24px', fill: '#fff' });
  
      this.input.once('pointerdown', () => {
        this.scene.start('jogo');
      });
    }
  }
  
  // Cena do Jogo
  class jogo extends Phaser.Scene {
    constructor() {
      super({ key: 'jogo' });
      this.pontuacao = 0;
      this.tempo = 30;
    }
  
    create() {
      this.pontuacao = 0;
      this.tempo = 30;
  
      this.add.image(400, 300, 'fundo');

      this.mira = this.add.image(400, 300, 'mira').setScale(0.1).setDepth(1);
  
      this.textoPontuacao = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '24px', fill: '#fff' });
      this.textoTempo = this.add.text(600, 16, 'Tempo: 30', { fontSize: '24px', fill: '#fff' });
  
      this.tempoEvento = this.time.addEvent({
        delay: 1000,
        callback: this.contarTempo,
        callbackScope: this,
        loop: true
      });
  
      this.gerarAlvo();

    
    }

    update() {
        // Atualiza a posição da mira para o cursor
        this.mira.setPosition(this.input.x, this.input.y);
      }
  
    contarTempo() {
      this.tempo--;
      this.textoTempo.setText('Tempo: ' + this.tempo);
  
      if (this.tempo <= 0) {
        this.scene.start('gameover', { pontuacao: this.pontuacao });
      }
    }
  
    gerarAlvo() {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 500);
  
      const alvo = this.add.image(x, y, 'alvo').setScale(0.1).setInteractive();
  
      alvo.once('pointerdown', () => {
        alvo.destroy();
        this.pontuacao += 10;
        this.textoPontuacao.setText('Pontuação: ' + this.pontuacao);
        this.gerarAlvo();
      });
  
     
    }
  }
  
  // Cena de Game Over
  class gameover extends Phaser.Scene {
    constructor() {
      super({ key: 'gameover' });
    }
  
    init(data) {
      this.pontuacaoFinal = data.pontuacao;
    }
  
    create() {
      this.add.image(400, 300, 'fundo');
      this.add.text(250, 200, 'Fim do Jogo!', { fontSize: '40px', fill: '#fff' });
      this.add.text(250, 270, 'Pontuação: ' + this.pontuacaoFinal, { fontSize: '30px', fill: '#fff' });
      this.add.text(250, 350, 'Clique para jogar novamente', { fontSize: '24px', fill: '#fff' });
  
      this.input.once('pointerdown', () => {
        this.scene.start('menu');
      });
    }
  }
  
  // Configuração do Phaser
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [boot, menu, jogo, gameover],
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    }
  };
  
  const game = new Phaser.Game(config);
  