// Variáveis globais
let selectedNumbers = [];
let totalValue = 0;
let paidNumbers = JSON.parse(localStorage.getItem('paidNumbers')) || [];

// Função para gerar os números (1 a 5000)
function generateNumbers() {
  const container = document.getElementById('numbersContainer');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i <= 5000; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.add('number-button');
    btn.setAttribute('data-number', i);
    // Se o número já foi pago, marca como escolhido e desabilita
    if (paidNumbers.includes(i)) {
      btn.classList.add('chosen');
      btn.disabled = true;
    } else {
      btn.onclick = function() { selectNumber(i, btn); };
    }
    container.appendChild(btn);
  }
}

// Seleciona ou desmarca um número
function selectNumber(number, btn) {
  // Impede seleção se já estiver pago
  if (btn.classList.contains('chosen')) return;
  
  if (btn.classList.contains('selected')) {
    selectedNumbers = selectedNumbers.filter(n => n !== number);
    btn.classList.remove('selected');
  } else {
    selectedNumbers.push(number);
    btn.classList.add('selected');
  }
  updateTotalValue();
  updateLoginTable();
}

// Atualiza o valor total a pagar
function updateTotalValue() {
  totalValue = selectedNumbers.length * 0.99;
  const totalEl = document.getElementById('totalValue');
  if (totalEl) {
    totalEl.textContent = `Total a pagar: R$ ${totalValue.toFixed(2)}`;
  }
}

// Atualiza a tabela de informações de login com os números escolhidos
function updateLoginTable() {
  const chosenCell = document.getElementById('chosenNumbersCell');
  if (chosenCell) {
    chosenCell.textContent = selectedNumbers.join(', ');
  }
}

// Ao confirmar, salva os dados e vai para a página de pagamento
function confirmAndGoToPayment() {
  if (selectedNumbers.length === 0) {
    alert("Escolha ao menos um número.");
    return;
  }
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  if (!name || !phone) {
    alert("Preencha seu nome e telefone.");
    return;
  }
  // Registra a compra
  const purchase = {
    name: name,
    phone: phone,
    numbers: selectedNumbers.slice() // clone do array
  };
  // Salva a compra em um array de compras no localStorage
  let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
  purchases.push(purchase);
  localStorage.setItem('purchases', JSON.stringify(purchases));
  
  // Salva os números selecionados e o total para a página de pagamento
  localStorage.setItem('selectedNumbers', JSON.stringify(selectedNumbers));
  localStorage.setItem('totalValue', totalValue);
  localStorage.setItem('userName', name);
  localStorage.setItem('userPhone', phone);
  
  // Redireciona para a página de pagamento
  window.location.href = 'payment.html';
}

// Reseta a rifa (limpa a seleção e inputs, sem apagar as compras já efetuadas)
function resetRaffle() {
  selectedNumbers = [];
  totalValue = 0;
  updateTotalValue();
  const buttons = document.querySelectorAll('.number-button');
  buttons.forEach(btn => {
    // Se o botão não está marcado como já pago, remova a seleção
    if (!btn.classList.contains('chosen')) {
      btn.classList.remove('selected');
    }
  });
  // Limpa os inputs de login e a célula da tabela
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  const chosenCell = document.getElementById('chosenNumbersCell');
  if (chosenCell) chosenCell.textContent = '';
  
  localStorage.removeItem('selectedNumbers');
  localStorage.removeItem('totalValue');
}

// Na página payment.html: carregar o valor e o código fixo de pagamento
function loadPaymentPage() {
  const paymentValueEl = document.getElementById('paymentValue');
  if (!paymentValueEl) return;
  const total = parseFloat(localStorage.getItem('totalValue')) || 0;
  paymentValueEl.textContent = total.toFixed(2);
  
  // Define o código de pagamento fixo
  document.getElementById('paymentCode').value = "ferrazadrian03@gmail.com";
}

// Copia o código de pagamento para a área de transferência
function copyPaymentCode() {
  const paymentCodeEl = document.getElementById('paymentCode');
  paymentCodeEl.select();
  paymentCodeEl.setSelectionRange(0, 99999);
  document.execCommand('copy');
  alert("Código copiado: " + paymentCodeEl.value);
}

// Confirma o pagamento: marca os números como pagos e redireciona para index.html
function confirmPayment() {
  alert("Pagamento confirmado!");
  const selNums = JSON.parse(localStorage.getItem('selectedNumbers')) || [];
  paidNumbers = paidNumbers.concat(selNums);
  localStorage.setItem('paidNumbers', JSON.stringify(paidNumbers));
  // Após o pagamento, limpa os dados temporários
  localStorage.removeItem('selectedNumbers');
  localStorage.removeItem('totalValue');
  window.location.href = 'index.html';
}

// Atualiza a tabela de compras na página index.html para exibir todas as compras
function updatePurchasesTable() {
  const tableBody = document.querySelector('#purchasesTable tbody');
  if (!tableBody) return;
  tableBody.innerHTML = ''; // Limpa o conteúdo atual
  const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
  purchases.forEach(purchase => {
    const row = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.textContent = purchase.name;
    const phoneTd = document.createElement('td');
    phoneTd.textContent = purchase.phone;
    const numbersTd = document.createElement('td');
    numbersTd.textContent = purchase.numbers.join(', ');
    row.appendChild(nameTd);
    row.appendChild(phoneTd);
    row.appendChild(numbersTd);
    tableBody.appendChild(row);
  });
}

// Verifica em qual página estamos e executa as funções apropriadas
window.onload = function() {
  if (document.getElementById('numbersContainer')) {
    generateNumbers();
    updateTotalValue();
    updatePurchasesTable();
  }
  if (document.getElementById('paymentValue')) {
    loadPaymentPage();
  }
};
function resetRaffle() {
    // Solicita a senha para resetar a rifa
    const senha = prompt("Digite a senha para resetar a rifa:");
    if (senha !== "sorteminha") {
      alert("Senha incorreta! A rifa não foi resetada.");
      return;
    }
    
    // Se a senha estiver correta, procede com o reset
  
    // Limpa a seleção de números
    selectedNumbers = [];
    totalValue = 0;
    updateTotalValue();
  
    // Remove a classe "selected" dos botões e habilita os que não foram pagos
    const buttons = document.querySelectorAll('.number-button');
    buttons.forEach(btn => {
      if (!btn.classList.contains('chosen')) {
        btn.classList.remove('selected');
        btn.disabled = false;
      }
    });
  
    // Limpa os campos de login e a célula da tabela de números escolhidos
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    
    const chosenCell = document.getElementById('chosenNumbersCell');
    if (chosenCell) chosenCell.textContent = '';
  
    // Remove os dados salvos do localStorage (incluindo compras e seleções)
    localStorage.removeItem('selectedNumbers');
    localStorage.removeItem('totalValue');
    localStorage.removeItem('purchases');
    localStorage.removeItem('paidNumbers');
  
    // Recarrega os números para permitir nova seleção
    generateNumbers();
    updatePurchasesTable(); // Atualiza a tabela de compras, se aplicável
  
    alert("Rifa resetada com sucesso!");
  }
  
