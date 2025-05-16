'use strict';

const salarioOriginal = 2500.00;
const dataInicial = '2020-01';

async function obterInflacaoAcumulada() {
  const response = await fetch('https://brasilapi.com.br/api/inflation/v1/ipca');
  const dados = await response.json();

  const acumulado = dados
    .filter(item => item.startingAt >= dataInicial)
    .reduce((total, item) => total + item.value, 0);

  return acumulado;
}

function aplicarInflacao(valor, percentual) {
  return valor * (1 + percentual / 100);
}

async function atualizarSalario() {
  try {
    const inflacao = await obterInflacaoAcumulada();
    const valorCorrigido = aplicarInflacao(salarioOriginal, inflacao);

    document.getElementById('salario-atualizado').textContent = 
      valorCorrigido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch (erro) {
    document.getElementById('salario-atualizado').textContent = 'Erro ao carregar dados';
  }
}

atualizarSalario();
console.log('done.');