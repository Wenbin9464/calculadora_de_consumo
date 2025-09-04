const inicio = document.getElementById("inicio");
const loading = document.getElementById("loading");
const opcoes = document.getElementById("opcoes");
const formulario = document.getElementById("formulario");
const relatorio = document.getElementById("relatorio");

let etapa = 0;
let dados = {};
let tipoAtual = null;

// Clique inicial
document.getElementById("imagem").addEventListener("click", () => {
  inicio.classList.add("hidden");
  loading.classList.remove("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");
    opcoes.classList.remove("hidden");
  }, 2000);
});

// Iniciar formulário por etapas
function iniciarFormulario(tipo) {
  tipoAtual = tipo;
  etapa = 0;
  dados = {};
  opcoes.classList.add("hidden");
  formulario.classList.remove("hidden");
  mostrarEtapa();
}

// Mostrar cada input (um de cada vez)
function mostrarEtapa() {
  formulario.innerHTML = "";

  const perguntas1 = [
    { id: "distancia_inicial", label: "Distância Inicial (km)", tipo: "number" },
    { id: "distancia_final", label: "Distância Final (km)", tipo: "number" },
    { id: "litros_inicial", label: "Litro Inicial", tipo: "number" },
    { id: "litros_final", label: "Litro Final", tipo: "number" }
  ];

  const perguntas2 = [
    { id: "modelo", label: "Modelo do carro", tipo: "text" },
    { id: "kml", label: "Consumo do carro (km/l)", tipo: "number" },
    { id: "km", label: "Distância da viagem (km)", tipo: "number" },
    { id: "preco", label: "Preço por litro (R$)", tipo: "number" }
  ];

  const perguntas = tipoAtual === 1 ? perguntas1 : perguntas2;

  if (etapa < perguntas.length) {
    const campo = perguntas[etapa];
    formulario.innerHTML = `
      <h3>${campo.label}</h3>
      <input type="${campo.tipo}" id="inputEtapa" placeholder="${campo.label}">
      <div class="botoes">
        <button class="btn-normal" onclick="proximaEtapa('${campo.id}')">Confirmar</button>
        <button class="btn-red btn-small" onclick="voltarEtapa()">Voltar</button>
      </div>
    `;

    // 支持按 Enter 确认
    const input = document.getElementById("inputEtapa");
    input.focus();
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        proximaEtapa(campo.id);
      }
    });
  } else {
    processarDados();
  }
}

// Salvar resposta e ir para próxima etapa
function proximaEtapa(idCampo) {
  const valor = document.getElementById("inputEtapa").value;
  if (!valor) {
    alert("Preencha o campo antes de continuar!");
    return;
  }
  dados[idCampo] = valor;
  etapa++;
  mostrarEtapa();
}

// Voltar到上一步
function voltarEtapa() {
  if (etapa > 0) {
    etapa--;
    mostrarEtapa();
  } else {
    formulario.classList.add("hidden");
    opcoes.classList.remove("hidden");
  }
}

// Processar os dados e mostrar relatório
function processarDados() {
  formulario.classList.add("hidden");
  loading.classList.remove("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");
    relatorio.classList.remove("hidden");

    if (tipoAtual === 1) {
      const distancia_inicial = parseFloat(dados.distancia_inicial);
      const distancia_final = parseFloat(dados.distancia_final);
      const litros_inicial = parseFloat(dados.litros_inicial);
      const litros_final = parseFloat(dados.litros_final);
      const distancia = distancia_final-distancia_inicial;
      const litros = litros_inicial-litros_final;
      const consumo = distancia / litros;

      relatorio.innerHTML = `
        <h3>Relatório de Consumo</h3>
        <p>Distância percorrida: ${distancia} km</p>
        <p>Combustível consumido: ${litros} litros</p>
        <p>Consumo médio: ${consumo.toFixed(2)} km/l</p>
        <div class="botoes">
          <button class="btn-normal" onclick="confirmar()">Confirmar</button>
        </div>
      `;
    } else {
      const modelo = dados.modelo;
      const kml = parseFloat(dados.kml);
      const km = parseFloat(dados.km);
      const preco = parseFloat(dados.preco);
      const litrosGastos = km / kml;
      const custoTotal = litrosGastos * preco;

      relatorio.innerHTML = `
        <h3>Relatório de Viagem</h3>
        <p>Modelo: ${modelo}</p>
        <p>Distância: ${km} km</p>
        <p>Consumo: ${litrosGastos.toFixed(2)} litros</p>
        <p>Custo Total: R$ ${custoTotal.toFixed(2)}</p>
        <div class="botoes">
          <button class="btn-normal" onclick="confirmar()">Confirmar</button>
        </div>
      `;
    }
  }, 3000);
}

// Confirmar final → volta ao opções
function confirmar() {
  relatorio.classList.add("hidden");
  opcoes.classList.remove("hidden");
}