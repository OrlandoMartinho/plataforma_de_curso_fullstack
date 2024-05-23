const profileContainer = document.querySelector('.profile-Icon');

// Criar elementos HTML para o perfil
const profileInfo = document.createElement('div');
profileInfo.innerHTML = `
    <p class="title">${localStorage.getItem("nome")}</p>
    <p class="text">${localStorage.getItem("email")}</p>
`;

// Adicionar elementos ao container do perfil
profileContainer.appendChild(profileInfo);



fetch(base_url + 'finalistas/obter_todos_certificados', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        accessToken: localStorage.getItem("token")
    })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao obter certificados: ' + response.status);
    }
    return response.json();
})
.then(data => {
    const certificadosContainer = document.querySelector('.certificados');
    // Limpa o conteúdo anterior, caso exista
    certificadosContainer.innerHTML = '';
    console.log(data)
    // Adiciona cada certificado ao container
    data.certificados.forEach(certificado => {
        const certificadoContent = document.createElement('div');
        certificadoContent.classList.add('certificadoContent');

        const img = document.createElement('img');
        img.src = '../assets/img/certificate.png'; // Use o URL fornecido no objeto certificado
        img.alt = 'Certificado';
        const btnDownload = document.createElement('button');
        btnDownload.classList.add('btn-download');
        btnDownload.textContent = 'Descarregar';

        // Adiciona o evento de clique ao botão de download
        btnDownload.addEventListener('click', () => {
        
            fetch(`${base_url}finalistas/obter_certificado`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: localStorage.getItem("token"),
                    nomeDoArquivo:certificado.nome_arquivo
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
                  downloadLink.download =certificado.nome_arquivo; 
                  
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

        certificadoContent.appendChild(img);
        certificadoContent.appendChild(btnDownload);
        certificadosContainer.appendChild(certificadoContent);
    });
})
.catch(error => {
    console.error('Erro ao obter certificados:', error);
});
