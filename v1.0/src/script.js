window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    // Dimensões do canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Posicoes iniciais dos jogadores e bolinha
    let gameStarted = false;
    let player1Y = 200;
    let player2Y = 200;
    let ballX = 500;
    let ballY = 250;
    let ballSpeedX = 7;
    let ballSpeedY = 7;

    // Inicializacao das teclas
    let keysPressed = {};

    // Variável para controlar a exibição da mensagem de fim de jogo
    let gameOver = false;
    let gameOverTimer = null;

    // Limites verticais para os jogadores
    const playerTopLimit = 0;
    const playerBottomLimit = canvasHeight - 90; // 90 é a altura dos jogadores

    function updateGame() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        if (!gameStarted) {
            // Desenha mensagem inicial apenas se o jogo não estiver iniciado
            context.fillStyle = 'white';
            context.font = '36px Arial';
            context.textAlign = 'center';
            context.fillText('Press Enter to start', canvasWidth / 2, canvasHeight / 2);
        } else {
            // Jogo iniciado, desenha o restante do jogo

            // Desenho dos jogadores
            context.fillStyle = 'white';
            context.fillRect(50, player1Y, 25, 90); // Esquerdo
            context.fillRect(canvasWidth - 75, player2Y, 25, 90); // Direito

            // Desenho bolinha
            context.beginPath();
            context.arc(ballX, ballY, 15, 0, Math.PI * 2, true);
            context.fillStyle = 'white';
            context.fill();

            // Atualizar posicao bolinha
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Movimento do jogador esquerdo (1)
            if (keysPressed.KeyW && player1Y > playerTopLimit) {
                player1Y -= 5;
            }
            if (keysPressed.KeyS && player1Y < playerBottomLimit) {
                player1Y += 5;
            }

            // Movimento do jogador direito (2)
            if (keysPressed.ArrowUp && player2Y > playerTopLimit) {
                player2Y -= 5;
            }
            if (keysPressed.ArrowDown && player2Y < playerBottomLimit) {
                player2Y += 5;
            }

            // Verificar colisão com jogador esquerdo (1)
            if (ballX - 15 <= 75 && ballY >= player1Y && ballY <= player1Y + 90) {
                ballSpeedX = -ballSpeedX; // Inverte direção X
            }

            // Verificar colisão com jogador direito (2)
            if (ballX + 15 >= canvasWidth - 75 && ballY >= player2Y && ballY <= player2Y + 90) {
                ballSpeedX = -ballSpeedX; // Inverte direção X
            }

            // Colisão com as bordas horizontais
            if (ballX + 15 >= canvasWidth || ballX - 15 <= 0) {
                ballSpeedX = -ballSpeedX; // Inverte direção X
            }

            // Colisao com as bordas verticais
            if (ballY + 15 >= canvasHeight || ballY - 15 <= 0) {
                ballSpeedY = -ballSpeedY;
            }

            // Verificar se a bolinha saiu do campo
            if (ballX + 15 >= canvasWidth || ballX - 15 <= 0) {
                gameOver = true;
                // Resetar a bola fora da tela para evitar loop imediato
                ballX = -100; // Fora da tela
                ballY = -100; // Fora da tela

                // Mostrar a mensagem por apenas 3 segundos
                gameOverTimer = setTimeout(function () {
                    resetGame();
                }, 3000);
            }
        }

        // Desenha a mensagem de Game Over
        if (gameOver) {
            context.fillStyle = 'white';
            context.font = '36px Arial';
            context.textAlign = 'center';
            context.fillText('Game Over', canvasWidth / 2, canvasHeight / 2);
        } else {
            // Solicitar a próxima atualização do jogo
            requestAnimationFrame(updateGame);
        }
    }

    // Funcao para resetar
    function resetGame() {
        clearTimeout(gameOverTimer); // Limpa o temporizador do Game Over
        player1Y = 200;
        player2Y = 200;
        ballX = 500;
        ballY = 250;
        ballSpeedX = 7;
        ballSpeedY = 7;
        gameStarted = false;
        gameOver = false;
        updateGame();
    }

    // Iniciar o jogo com a tecla enter 
    window.addEventListener('keydown', function (event) {
        if (event.code === 'Enter') {
            gameStarted = true;
        }

        // Registra a tecla pressionada
        keysPressed[event.code] = true;
    });

    // Parar o movimento quando soltar a tecla
    window.addEventListener('keyup', function (event) {
        keysPressed[event.code] = false;
    });

    // Inicia o loop do jogo
    updateGame();
}