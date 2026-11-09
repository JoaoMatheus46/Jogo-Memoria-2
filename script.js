
// ELEMENTOS DO HTML

const tabuleiro = document.getElementById("tabuleiro");

const elementoJogadas = document.getElementById("jogadas");
const elementoTempo = document.getElementById("tempo");
const elementoPares = document.getElementById("pares");

const overlay = document.getElementById("overlay");

const botaoReiniciar = document.getElementById("reiniciar");
const botaoJogarNovamente = document.getElementById("jogarNovamente");

// PERSONAGENS

const personagens = [
    { nome: "KRATOS", simbolo: "🪓" },
    { nome: "ATREUS", simbolo: "🏹" },
    { nome: "THOR", simbolo: "⚡" },
    { nome: "ODIN", simbolo: "👁️" },
    { nome: "LOKI", simbolo: "🐺" },
    { nome: "ARES", simbolo: "🔥" }
];

// VARIÁVEIS DO JOGO

let cartas = [];

let primeiraCarta = null;
let segundaCarta = null;

let bloqueado = false;

let jogadas = 0;
let paresEncontrados = 0;

let segundos = 0;
let cronometro = null;

let jogoIniciado = false;
let jogoFinalizado = false;

// EMBARALHAR CARTAS

function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}

// FORMATAR TEMPO

function formatarTempo(valor) {

    const minutos = Math.floor(valor / 60);

    const segundosRestantes = valor % 60;

    return String(minutos).padStart(2, "0") + ":" +
           String(segundosRestantes).padStart(2, "0");
}

// INICIAR CRONÔMETRO

function iniciarCronometro() {

    if (jogoIniciado) return;

    jogoIniciado = true;

    cronometro = setInterval(function() {

        segundos++;

        elementoTempo.textContent = formatarTempo(segundos);

    }, 1000);
}

// CRIAR TABULEIRO

function criarTabuleiro() {

    tabuleiro.innerHTML = "";

    cartas = [];

    // DUPLICAR PERSONAGENS

    personagens.forEach(function(personagem, indice) {

        cartas.push({
            id: indice,
            nome: personagem.nome,
            simbolo: personagem.simbolo
        });

        cartas.push({
            id: indice,
            nome: personagem.nome,
            simbolo: personagem.simbolo
        });

    });

    // EMBARALHAR CARTAS

    embaralhar(cartas);

    // MOSTRAR CARTAS

    cartas.forEach(function(carta) {

        const elemento = document.createElement("button");

        elemento.classList.add("carta");

        elemento.type = "button";

        elemento.setAttribute("aria-label", "Carta fechada");

        elemento.innerHTML = `
            <div class="carta-interna">

                <div class="verso"></div>

                <div class="frente">

                    <div class="simbolo">${carta.simbolo}</div>

                    <div class="nome">${carta.nome}</div>

                </div>

            </div>
        `;

        elemento.addEventListener("click", function() {

            revelarCarta(elemento, carta);

        });

        tabuleiro.appendChild(elemento);

    });

}

// REVELAR CARTA

function revelarCarta(elemento, carta) {

    if (bloqueado) return;

    if (jogoFinalizado) return;

    if (elemento.classList.contains("virada")) return;

    if (elemento.classList.contains("encontrada")) return;

    // INICIAR CRONÔMETRO

    iniciarCronometro();

    // VIRAR CARTA

    elemento.classList.add("virada");

    elemento.setAttribute("aria-label", carta.nome);

    // PRIMEIRA CARTA

    if (primeiraCarta === null) {

        primeiraCarta = {
            elemento: elemento,
            carta: carta
        };

        return;
    }

    // SEGUNDA CARTA

    segundaCarta = {
        elemento: elemento,
        carta: carta
    };

    // CONTAR JOGADA

    jogadas++;

    elementoJogadas.textContent = jogadas;

    // BLOQUEAR CLIQUES

    bloqueado = true;

    compararCartas();
}

// COMPARAR CARTAS

function compararCartas() {

    const primeira = primeiraCarta.carta;

    const segunda = segundaCarta.carta;

    // SE FOREM IGUAIS

    if (primeira.id === segunda.id) {

        primeiraCarta.elemento.classList.add("encontrada");

        segundaCarta.elemento.classList.add("encontrada");

        primeiraCarta.elemento.disabled = true;

        segundaCarta.elemento.disabled = true;

        paresEncontrados++;

        elementoPares.textContent = paresEncontrados + " / 6";

        limparSelecao();

        // VERIFICAR VITÓRIA

        if (paresEncontrados === 6) {

            finalizarJogo();

        }

    } else {

        // SE FOREM DIFERENTES

        setTimeout(function() {

            primeiraCarta.elemento.classList.remove("virada");

            segundaCarta.elemento.classList.remove("virada");

            primeiraCarta.elemento.setAttribute("aria-label", "Carta fechada");

            segundaCarta.elemento.setAttribute("aria-label", "Carta fechada");

            limparSelecao();

        }, 1000);

    }
}

// LIMPAR SELEÇÃO

function limparSelecao() {

    primeiraCarta = null;

    segundaCarta = null;

    bloqueado = false;

}

// FINALIZAR JOGO

function finalizarJogo() {

    jogoFinalizado = true;

    clearInterval(cronometro);

    document.getElementById("resultadoJogadas").textContent = jogadas;

    document.getElementById("resultadoTempo").textContent =
        formatarTempo(segundos);

    overlay.classList.add("ativo");

}

// REINICIAR JOGO

function reiniciarJogo() {

    // PARAR CRONÔMETRO

    clearInterval(cronometro);

    // REINICIAR VARIÁVEIS

    primeiraCarta = null;

    segundaCarta = null;

    bloqueado = false;

    jogadas = 0;

    paresEncontrados = 0;

    segundos = 0;

    jogoIniciado = false;

    jogoFinalizado = false;

    // ATUALIZAR INFORMAÇÕES

    elementoJogadas.textContent = "0";

    elementoTempo.textContent = "00:00";

    elementoPares.textContent = "0 / 6";

    // FECHAR TELA DE VITÓRIA

    overlay.classList.remove("ativo");

    // EMBARALHAR NOVAMENTE

    criarTabuleiro();

}

// EVENTOS DOS BOTÕES

botaoReiniciar.addEventListener("click", reiniciarJogo);

botaoJogarNovamente.addEventListener("click", reiniciarJogo);

// INICIAR JOGO

criarTabuleiro();
