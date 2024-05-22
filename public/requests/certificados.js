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
        img.src = certificado.url; // Use o URL fornecido no objeto certificado
        img.alt = 'Certificado';
        const btnDownload = document.createElement('button');
        btnDownload.classList.add('btn-download');
        btnDownload.textContent = 'Descarregar';

        // Adiciona o evento de clique ao botão de download
        btnDownload.addEventListener('click', () => {
            fetch(certificado.url) // Use diretamente o URL do certificado
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter certificado: ' + response.status);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'certificado.pdf'; // Nome do arquivo para download (altere conforme necessário)
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Erro ao obter certificado:', error);
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
