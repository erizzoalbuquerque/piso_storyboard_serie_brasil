'use strict';

const salarioOriginal = 700.00;

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

async function obterIPCAAcumulado() {
  const dataInicial = '01/01/2020';
  const dataFinal = formatarData(new Date());
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`;

  const response = await fetch(url);
  const dados = await response.json();

  const inflacaoAcumulada = dados.reduce((total, item) => {
    const valor = parseFloat(item.valor.replace(',', '.'));
    return total + valor;
  }, 0);

  return inflacaoAcumulada;
}

function aplicarInflacao(valor, percentual) {
  return valor * (1 + percentual / 100);
}

async function atualizarSalario() {
  try {
    const inflacao = await obterIPCAAcumulado();
    const corrigido = aplicarInflacao(salarioOriginal, inflacao);

    document.getElementById('salario-atualizado').textContent =
      corrigido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch (error) {
    document.getElementById('salario-atualizado').textContent = 'Erro ao buscar dados';
    console.error('Erro ao obter inflação:', error);
  }
}

atualizarSalario();
console.log('done.');