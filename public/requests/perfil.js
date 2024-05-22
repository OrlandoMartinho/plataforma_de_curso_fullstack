document.getElementById("eliminar").addEventListener('click',()=>{


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
            accessToken: localStorage.getItem("token")
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
            alert("Agradecenos a sua decisão")
            location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
} else {
    // Se o usuário clicou em Cancelar
    alert("Ação cancelada!");
}




})

document.getElementById('alterar').addEventListener('click', () => {
    const senha = document.getElementById('senha').value;
    const senha1 = document.getElementById('senha1').value;

    if (senha === senha1) {
        const dados = {
            senha: senha,
            accessToken: localStorage.getItem("token")
        };

        fetch(`${base_url}usuarios/alterar_senha`, {
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
            console.log('Senha alterada com sucesso:', data);
            localStorage.setItem("token",data.accessToken)
            // location.reload()
        })
        .catch(error => {
            console.error('Erro ao alterar senha:', error);
        });
    } else {
        console.error('As senhas não correspondem');
    }
});
