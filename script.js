// Persistência de dados com localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados ao iniciar
    if (localStorage.getItem('funcionarios')) {
        funcionarios = JSON.parse(localStorage.getItem('funcionarios'));
        atualizarListaDeFuncionarios();
    }
    if (localStorage.getItem('pedidos')) {
        pedidos = JSON.parse(localStorage.getItem('pedidos'));
        atualizarListaDePedidos();
    }
});

// Lista de funcionários e pedidos
let funcionarios = [];
let pedidos = [];

// Cadastro de funcionário com validação
document.getElementById('form-funcionario').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-funcionario').value.trim();
    const cpf = document.getElementById('cpf-funcionario').value.trim();

    if (nome === '' || cpf.length !== 11 || isNaN(cpf)) {
        alert('Por favor, insira um nome válido e um CPF com 11 dígitos numéricos.');
        return;
    }

    const funcionario = { nome, cpf };
    funcionarios.push(funcionario);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));  // salva no localStorage
    atualizarListaDeFuncionarios();
    alert('Funcionário cadastrado com sucesso!');
    document.getElementById('form-funcionario').reset();
});

// Atualizar lista de funcionários no formulário de pedidos
function atualizarListaDeFuncionarios() {
    const selectResponsavel = document.getElementById('responsavel-pedido');
    selectResponsavel.innerHTML = '<option value="">Selecione um Funcionário</option>';
    funcionarios.forEach((funcionario, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = funcionario.nome;
        selectResponsavel.appendChild(option);
    });
}

// Cadastro de pedido com validação e persistência
document.getElementById('form-pedido').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nomePedido = document.getElementById('nome-pedido').value.trim();
    const descricaoPedido = document.getElementById('descricao-pedido').value.trim();
    const responsavelIndex = document.getElementById('responsavel-pedido').value;
    const statusPedido = document.getElementById('status-pedido').value;

    if (nomePedido === '' || responsavelIndex === "") {
        alert('Por favor, preencha o nome do pedido e selecione um responsável.');
        return;
    }

    const pedido = {
        nome: nomePedido,
        descricao: descricaoPedido,
        responsavel: funcionarios[responsavelIndex].nome,
        status: statusPedido
    };
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));  // salva no localStorage
    atualizarListaDePedidos();
    alert('Pedido cadastrado com sucesso!');
    document.getElementById('form-pedido').reset();
});

// Atualizar lista de pedidos cadastrados com opções de alterar status
function atualizarListaDePedidos() {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';
    pedidos.forEach((pedido, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${pedido.nome}</strong> - ${pedido.responsavel} - 
            <select onchange="alterarStatus(${index}, this.value)">
                <option value="A Fazer" ${pedido.status === "A Fazer" ? 'selected' : ''}>A Fazer</option>
                <option value="Fazendo" ${pedido.status === "Fazendo" ? 'selected' : ''}>Fazendo</option>
                <option value="Pronto para entrega" ${pedido.status === "Pronto para entrega" ? 'selected' : ''}>Pronto para entrega</option>
            </select>
        `;
        listaPedidos.appendChild(li);
    });
}

// Função para alterar o status do pedido
function alterarStatus(index, novoStatus) {
    pedidos[index].status = novoStatus;
    localStorage.setItem('pedidos', JSON.stringify(pedidos));  // Atualiza no localStorage
    atualizarListaDePedidos();
}

// Filtro de pedidos por status
document.getElementById('filtro-status').addEventListener('change', function() {
    const statusFiltro = this.value;
    filtrarPedidosPorStatus(statusFiltro);
});

function filtrarPedidosPorStatus(status) {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';
    pedidos.filter(pedido => pedido.status === status || status === "Todos")
           .forEach((pedido, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${pedido.nome}</strong> - ${pedido.responsavel} - 
            <select onchange="alterarStatus(${index}, this.value)">
                <option value="A Fazer" ${pedido.status === "A Fazer" ? 'selected' : ''}>A Fazer</option>
                <option value="Fazendo" ${pedido.status === "Fazendo" ? 'selected' : ''}>Fazendo</option>
                <option value="Pronto para entrega" ${pedido.status === "Pronto para entrega" ? 'selected' : ''}>Pronto para entrega</option>
            </select>
        `;
        listaPedidos.appendChild(li);
    });
}
