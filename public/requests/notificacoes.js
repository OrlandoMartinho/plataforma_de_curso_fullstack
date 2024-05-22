// Função para adicionar uma notificação dinamicamente
function adicionarNotificacao(titulo, descricao) {
    var notificacaoBox = document.createElement("div");
    notificacaoBox.classList.add("box", "box-information");

    var conteudo = `
        <div>
            <h1>${titulo}</h1>
            <p>${descricao}</p>
        </div>
    `;
    
    notificacaoBox.innerHTML = conteudo;

    // Adiciona a notificação ao elemento pai desejado
    var elementoPai = document.getElementById("container-notificacoes");
    elementoPai.appendChild(notificacaoBox);
}

// Requisição para obter e exibir notificações da API
function obterEExibirNotificacoes() {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token")
        })
    };

    fetch(`${base_url}notificacoes/`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const notificacoes = data.Notificacoes.reverse(); // Reverte o array de notificações
            console.log(notificacoes); // Exibe o array de notificações revertido

            notificacoes.forEach(function(notificacao) {
                adicionarNotificacao(notificacao.titulo, notificacao.descricao);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Chamada inicial para obter e exibir notificações
obterEExibirNotificacoes();

// Event listener para apagar notificações
document.getElementById("apagar").addEventListener("click", () => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token")
        })
    };

    fetch(`${base_url}notificacoes/`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => { 
            console.log(data); // Exibe os dados da API
            // Após apagar, limpar as notificações na interface
            document.getElementById("container-notificacoes").innerHTML = "";
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
