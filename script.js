const faixas = [
  {
    limite: 2,
    nome: "Conexão bem básica",
    cor: "red",
    descricao: "Ideal para tarefas leves e mensagens.",
    bons: ["Mensagens e e-mails", "Navegação em sites leves", "Música em qualidade normal"],
    ruins: ["Vídeos em alta definição", "Chamadas de vídeo em grupo", "Jogos online com vários jogadores"]
  },
  {
    limite: 10,
    nome: "Conexão para o dia a dia",
    cor: "orange",
    descricao: "Boa para navegar, estudar e assistir vídeos em HD.",
    bons: ["Vídeos em HD", "Chamadas de vídeo", "Música e podcasts", "Trabalho e estudos online"],
    ruins: ["Streaming em 4K", "Muitos dispositivos ao mesmo tempo", "Jogos com downloads pesados"]
  },
  {
    limite: 50,
    nome: "Conexão rápida",
    cor: "green",
    descricao: "Uma boa velocidade para praticamente toda a rotina.",
    bons: ["Streaming em Full HD", "Chamadas de vídeo em grupo", "Jogos online", "Downloads rápidos"],
    ruins: ["Streaming em 4K em vários aparelhos", "Nuvem com arquivos muito grandes"]
  },
  {
    limite: Infinity,
    nome: "Conexão muito rápida",
    cor: "blue",
    descricao: "Desempenho confortável até para usos mais exigentes.",
    bons: ["Streaming em 4K", "Jogos online e na nuvem", "Downloads e uploads pesados", "Vários dispositivos conectados"],
    ruins: ["Nenhuma limitação comum identificada"]
  }
];

let connection;

function faixaPara(velocidade) {
  return faixas.find((faixa) => velocidade < faixa.limite) || faixas[faixas.length - 1];
}

function listaItens(itens, tipo) {
  return itens.map((item) => `<li><span class="item-icon ${tipo}" aria-hidden="true">${tipo === "good" ? "✓" : "–"}</span>${item}</li>`).join("");
}

function mostrarResultado(velocidade, tipo = "estimada") {
  const resultado = document.getElementById("resultado");
  const faixa = faixaPara(velocidade);
  const valor = Number(velocidade).toFixed(1).replace(".", ",");

  resultado.hidden = false;
  resultado.innerHTML = `
    <div class="speed-card">
      <div class="speed-heading">
        <span class="status-dot ${faixa.cor}" aria-hidden="true"></span>
        <span>Velocidade ${tipo}</span>
        <span class="connection-type">${connection?.effectiveType ? connection.effectiveType.toUpperCase() : "CONEXÃO"}</span>
      </div>
      <div class="speed-value"><strong>${valor}</strong><span>Mbps</span></div>
      <div class="speed-meter" role="img" aria-label="Faixa: ${faixa.nome}"><span class="meter-fill ${faixa.cor}" style="width: ${Math.min(100, Math.max(8, velocidade / 1.5))}%"></span></div>
      <div class="speed-status"><strong>${faixa.nome}</strong><span>${faixa.descricao}</span></div>
    </div>
    <div class="recommendation-card">
      <div class="recommendation-title"><span class="sparkle" aria-hidden="true">✦</span><div><h2>O que roda bem nessa velocidade?</h2><p>Uma referência rápida para sua conexão.</p></div></div>
      <div class="recommendation-columns">
        <div class="recommendation-list good-list"><h3><span>✓</span> Roda bem</h3><ul>${listaItens(faixa.bons, "good")}</ul></div>
        <div class="recommendation-list caution-list"><h3><span>!</span> Pode ter dificuldade</h3><ul>${listaItens(faixa.ruins, "caution")}</ul></div>
      </div>
    </div>`;
}

function mostrarVelocidade() {
  const button = document.getElementById("testButton");
  const label = document.getElementById("buttonLabel");
  const resultado = document.getElementById("resultado");
  button.disabled = true;
  button.classList.add("loading");
  label.textContent = "Analisando conexão...";
  resultado.hidden = true;

  window.setTimeout(() => {
    connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const velocidade = Number(connection?.downlink);
    button.disabled = false;
    button.classList.remove("loading");
    label.textContent = "Testar novamente";

    if (Number.isFinite(velocidade) && velocidade > 0) {
      mostrarResultado(velocidade);
      if (connection && !connection.__checknetListening) {
        connection.addEventListener("change", () => mostrarResultado(Number(connection.downlink) || 1));
        connection.__checknetListening = true;
      }
    } else {
      mostrarResultado(12, "não disponível — referência de 12 Mbps");
    }
  }, 650);
}
