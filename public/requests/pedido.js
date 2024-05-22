

function preencherTabela(dados) {
    const tbody = document.getElementById("table-body");
    console.log(dados);
    dados.forEach(item => {
        const tr = document.createElement("tr");
        const buttonsCell = document.createElement("td");
        const buttonsCell2= document.createElement("td");
        const buttonsCell3= document.createElement("td");
        if (item.id_usuario !== 1) {
            tr.innerHTML = `
                <td>${item.id_usuario - 1}</td>
                <td>${item.nome}</td>
                <td>${item.email}</td>
                <td>${item.numero_de_telefone}</td>
            `;

            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Comprovativo";
            downloadButton.className = "button-download";
            downloadButton.addEventListener("click", () => {
                fetch(`${base_url}usuarios/obter_comprovativo`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      accessToken: localStorage.getItem("token"),
                      nomeDoArquivo:item.comprovativo
                    })
                  })
                    .then(function(response) {
                      if (!response.ok) {
                        throw new Error('Erro ao solicitar o vídeo: ' + response.statusText);
                      }
                      return response.blob();
                    })
                    .then(function(videoBlob) {
                      // Cria uma URL temporária para o blob do vídeo
                      var videoUrl = URL.createObjectURL(videoBlob);
                      var downloadLink = document.createElement('a');
                      downloadLink.href = videoUrl;
                      downloadLink.download = item.comprovativo; // Nome do arquivo de download
                      
                      // Aciona o evento de clique no link
                      downloadLink.click();
                      
                      // Libera o URL criado
                      URL.revokeObjectURL(videoUrl);
                        alert("Aguarde até o download terminar")
            
                    })
                    .catch(function(error) {
                      console.error('Erro ao solicitar o vídeo:', error);
                    });
            });

            const aprovarButton = document.createElement("button");
            aprovarButton.textContent = "Aprovar";
            aprovarButton.className = "button-approve";
            aprovarButton.addEventListener("click", () => {
                // Lógica para o botão de aprovar
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
                    

                    const dados = {
                        id_curso:item.id_curso,
                        id_usuario: item.id_usuario,
                        accessToken: localStorage.getItem("token")
                    };
        
                    fetch(`${base_url}cursos/adicionar_curso_assinado`, {
                        method: 'POST',
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
                        console.log(data)
                        alert("Assinatura aaceitada!");
                        location.reload()
                    })
                    .catch(error => {
                        console.error('Erro ao alterar senha:', error);
                    });

                })
                .catch(error => {
                    console.error('Erro ao alterar senha:', error);
                });

            });


            const revokeButton = document.createElement("button");
            revokeButton.textContent = "revogar";
            revokeButton.className = "button-revoke";
            revokeButton.addEventListener("click", () => {
                
                const dados = {
                    id_usuario: item.id_usuario,
                    accessToken: localStorage.getItem("token")
                };
    
                fetch(`${base_url}usuarios/revogar_assinatura`, {
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
                    alert("Revogada com sucesso")
                    console.log('revogada com sucesso:', data);
                    location.reload()
                })
                .catch(error => {
                    console.error('Erro ao alterar senha:', error);
                });
    
            });

            buttonsCell.appendChild(aprovarButton);
            buttonsCell2.appendChild(downloadButton);
            buttonsCell3.appendChild(revokeButton)
            tr.appendChild(buttonsCell);
            tr.appendChild(buttonsCell2);
            tr.appendChild(buttonsCell3);
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
        const response = await fetch(`${base_url}usuarios/todos_usuarios_assinados`, requestOptions);
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