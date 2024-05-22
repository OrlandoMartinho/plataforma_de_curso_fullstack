document.getElementById('registrar').addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const numero_do_bi = document.getElementById('numero_do_bi').value;
    const localizacao = document.getElementById('localizacao').value;
    const numero_de_telefone = document.getElementById('numero_de_telefone').value;
    const arquivoInput = document.getElementById('file');

    // Verificar se algum arquivo foi selecionado
    if (arquivoInput.files.length === 0) {
        console.error('Nenhum arquivo selecionado.');
        return;
    }

    const arquivo = arquivoInput.files[0]; // Obter o primeiro arquivo selecionado

    var formData = new FormData();
    formData.append('nome', nome);
    formData.append('id_curso', localStorage.getItem("id_curso"));
    formData.append('numero_do_bi', numero_do_bi);
    formData.append('localizacao', localizacao);
    formData.append('numero_de_telefone', numero_de_telefone);
    formData.append('file', arquivo);
    formData.append('accessToken', localStorage.getItem("token"));

    fetch(`${base_url}usuarios/pedir_assinatura`, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            alert("Usuario já ssinado ou tente novamente")
            throw new Error('Erro ao enviar arquivo: ' + response.status);
            
        }
        return response.json();
    })
    .then(data => {
        console.log('Arquivo enviado com sucesso:', data);
        localStorage.setItem("token",data.accessToken)
        alert("Em breve recebera uma notifiação de confirmação")
        window.location.href = "cursos.html";
    })
    .catch(error => {
        console.error('Erro ao enviar arquivo:', error);
    });
});
