function formatarDataHora(dataHora) {
    const data = new Date(dataHora);
  
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
  
    const hora = data.getHours();
    const minutos = data.getMinutes();
  
    const dataFormatada = `${ano}-${mes}-${dia}`;
    const horaFormatada = `${hora}:${minutos}`;
  
    return `${dataFormatada},${horaFormatada}`;
  }

const requestOptions2 = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        accessToken: localStorage.getItem("token")
    })
};

fetch(`${base_url}finalistas/listar`, requestOptions2)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        dadoss = data.finalistas;
       popularTabela(dadoss); 
    })
    .catch(error => {
        console.error('Erro:', error);
    });

// Função para popular a tabela com os dados
function popularTabela(dadoss) {
    var tableBody = document.querySelector("#tabela");
    tableBody.innerHTML = ""; // Limpar o conteúdo da tabela

    // Iterar sobre os dados e adicionar as linhas à tabela
    dadoss.forEach(function (item) {
        var row = "<tr>";
        row += "<td>" + item.id_finalista + "</td>";
        row += "<td>" + item.nome + "</td>";
        row += "<td>" +formatarDataHora(item.data_de_finalizacao) + "</td>";
        row += "<td><button class='userView' onclick='selecionarArquivo(" + item.id_usuario + ","+item.id_finalista+")'>Adicionar</button></td>";
        row += "</tr>";

        tableBody.innerHTML += row;
    });
}
function enviarArquivo(id_usuario,id_finalista, arquivo) {
    var formData = new FormData();
    formData.append('id_usuario', id_usuario);
    formData.append('id_finalista', id_finalista);
    formData.append('file', arquivo);
    formData.append('accessToken',localStorage.getItem("token"))
    

    fetch(`${base_url}finalistas/cadastrar_certificado`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar arquivo: ' + response.status);
        }
        return response.json();
    })
    .then(data => {

        console.log('Arquivo enviado com sucesso:', data);
        alert("Certificado cadastrado com sucesso")
    })
    .catch(error => {
        console.error('Erro ao enviar arquivo:', error);
    });
}
// Função chamada ao clicar no botão Adicionar
function selecionarArquivo(id_usuario,id_finalista) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = function(e) {
        var file = e.target.files[0];
        console.log('Arquivo selecionado:', file);
        enviarArquivo(id_usuario,id_finalista, file);
    }

    input.click();
}
