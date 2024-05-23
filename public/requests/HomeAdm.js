

async function listarCursos(token) {
    const dados = {
        accessToken: token
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };


    try {
        const response = await fetch(`${base_url}cursos/listar`, requestOptions);
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}
async function listarFinalistas(token) {
    const dados = {
        accessToken: token
    };

    const requestOptions = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };


    try {
        const response = await fetch(`${base_url}finalistas/listar`, requestOptions);
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}
function preencherTabela(dados) {
    const tbody = document.getElementById("table-body");
    listarCursos(localStorage.getItem("token"))
    .then(data => {
        if (data) {
            document.getElementById("cursos_enviados").innerText = data.cursos.length;// Aqui você pode fazer o que quiser com os dados, como preencher a tabela
        } else {
            console.log('Não foi possível obter os dados dos cursos.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });

    listarFinalistas(localStorage.getItem("token"))
    .then(data => {
        if (data) {
            let numeros_unicos=new Set()
            console.log(data.finalistas)
            data.finalistas.forEach(item => {
                numeros_unicos.add(item.id_curso);
            })
             
        document.getElementById("cursos_concluidos").innerText = numeros_unicos.size;
        } else {
            console.log('Não foi possível obter os dados dos cursos.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
    document.getElementById("alunos_cadastrados").innerText = dados.length-1;
    document.getElementById("assinaturas_feitas").innerText = dados.filter(item => item.assinado === 2).length;
    console.log(dados)
    dados.forEach(item => {
        const tr = document.createElement("tr");
        const buttonsCell = document.createElement("td");
        const tbody = document.getElementById("table-body");
        const linhas = tbody.querySelectorAll("tr"); // Seleciona todas as linhas da tabela
        
        let nome=item.nome;
        if(nome){
            nome=item.email
        }
        // Remove cada linha da tabela

        if(item.id_usuario!=1){
        tr.innerHTML = `
            <td>${item.id_usuario-1}</td>
            <td>${nome}</td>
            <td>${item.email}</td>
          
        `;

        const revokeButton = document.createElement("button");
        revokeButton.textContent = "Eliminar";
        revokeButton.className = "button-revoke";
        revokeButton.addEventListener("click", () => {
          


// Exibe um alerta confirm
let confirmacao = window.confirm("Você tem certeza que deseja fazer isso?");

// Verifica se o usuário clicou em OK ou Cancelar
if (confirmacao) {
    const requestOptions2 = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token"),
            id_usuario:item.id_usuario
        })
    };
    
    fetch(`${base_url}usuarios/`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            alert("Eliminado com sucesso")
            location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
} else {
    // Se o usuário clicou em Cancelar
    alert("Ação cancelada!");
}


            
        });
        buttonsCell.appendChild(revokeButton);
        tr.appendChild(buttonsCell);
        tbody.appendChild(tr);

    }

    });
}

function preencherTabela2(dados) {
    const tbody = document.getElementById("table-body");
    const linhas = tbody.querySelectorAll("tr"); // Seleciona todas as linhas da tabela
    
    // Remove cada linha da tabela
    linhas.forEach((linha) => {
        linha.remove();
    });
    dados.forEach(item => {
        const tr = document.createElement("tr");
        const buttonsCell = document.createElement("td");
       
        if(item.id_usuario!=1){
        tr.innerHTML = `
            <td>${item.id_usuario-1}</td>
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>${item.genero}</td>
            <td>${item.numero_de_telefone}</td>
            <td>${item.numero_do_bi}</td>
        `;
        tbody.appendChild(tr);

    }

    });
}
// Função para fazer a requisição à API e preencher a tabela
async function fazerobterUsuario(token) {
    const dados = {
        accessToken: token
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    try {
        const response = await fetch(`${base_url}usuarios/todos_usuarios`, requestOptions);
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }
        const data = await response.json();
        preencherTabela(data.Usuarios);
    } catch (error) {
        console.error('Erro:', error);
    }
}


async function pesquisarUsuario(token,pesquisa) {
    const dados = {
        accessToken: token,
        valor:pesquisa
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    try {
        const response = await fetch(`${base_url}usuarios/pesquisar`, requestOptions);
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Erro:', error);
    }
}
// Chamar a função para buscar e preencher os dados da tabela
fazerobterUsuario(localStorage.getItem("token"));
document.getElementById('pesquisar').addEventListener('input', (event) => {
   let  valor = event.target.value;
   if(!valor){
       location.reload()
   }
    pesquisarUsuario(localStorage.getItem("token"), valor)
    .then(data => {
        console.log(data);
        preencherTabela(data.usuarios);
    })
    .catch(error => {
        console.error('Erro:', error);
    });

})