
function mostrarVelocidade() {
    const resultado = document.getElementById("resultado");
  
    resultado.innerHTML = "Calculando... Aguarde.";
  
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const tipo = connection.effectiveType;
      const velocidade = connection.downlink;
      
      resultado.innerHTML = `
        <strong>Tipo de conexão:</strong> ${tipo.toUpperCase()} <br>
        <strong>Velocidade estimada:</strong> ${velocidade} Mbps
      `;
  
      connection.addEventListener('change', mostrarVelocidade);
    } else {
      resultado.textContent = "API de conexão não suportada neste navegador.";
    }
  }
  