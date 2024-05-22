

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
        
        // Remove cada linha da tabela

        if(item.id_usuario!=1){
        tr.innerHTML = `
            <td>${item.id_usuario-1}</td>
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>${item.genero}</td>
            <td>${item.numero_de_telefone}</td>
            <td>${item.numero_do_bi}</td>
        `;

        if (item.assinado === 0) {
            const revokeButton = document.createElement("button");
            revokeButton.textContent = "Revogar ";
            revokeButton.className = "button-revoke";
            revokeButton.addEventListener("click", () => {
                
    
    
                
            });
            buttonsCell.appendChild(revokeButton);
        } else if (item.assinado === 1) {
            const approveButton = document.createElement("button");
            approveButton.textContent = "Aprovar ";
            approveButton.className = "button-approve";
            approveButton.addEventListener("click", () => {

            const dados = {
                id_usuario: item.id_usuario,
                accessToken: localStorage.getItem("token")
            };

            fetch(`${base_url}usuarios/confirmar_assinatura`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar arquivo: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Aprovada com sucesso:', data);
             
                alert("Assinatura aprovada!");
                // location.reload()
            })
            .catch(error => {
                console.error('Erro ao alterar senha:', error);
            });
                
            });
            buttonsCell.appendChild(approveButton);

            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Comprovativo";
            downloadButton.className = "button-download";
            downloadButton.addEventListener("click", () => {
                fetch(`${base_url}usuarios/obter_comprovativo/${item.comprovativo}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ accessToken: localStorage.getItem("token") })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao retornar arquivo: ' + response.status);
                    }
                    
                    // Obtém o nome do arquivo da requisição
                    const contentDisposition = response.headers.get('Content-Disposition');
                    let fileName = 'download';
                    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
                        const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        const matches = fileNameRegex.exec(contentDisposition);
                        if (matches != null && matches[1]) {
                            fileName = matches[1].replace(/['"]/g, '');
                        }
                    }
                
                    return response.blob().then(blob => {
                        // Cria um link para fazer o download do arquivo
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName; // Nome do arquivo para download
                
                        // Adiciona o link ao corpo do documento, mas não o exibe
                        document.body.appendChild(a);
                
                        // Simula o clique no link para iniciar o download
                        a.click();
                
                        // Remove o link após o download
                        document.body.removeChild(a);
                
                        // Revoga o URL para liberar recursos
                        window.URL.revokeObjectURL(url);
                    });
                })
            
                .catch(error => {
                    console.error('Erro ao retornar arquivo:', error);
                });
                

                
              
            });

            buttonsCell.appendChild(downloadButton);
        }

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