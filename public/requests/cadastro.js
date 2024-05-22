const base_url = 'http://localhost:3000/';

function verificarEmailNaApi(email) {
    const dados = {
        email: email
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}usuarios/verificar_email`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            if(!response.status!='200'){
                return null
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro:', error);
            return null;
        });
}


document.getElementById('botao_cadastrar').addEventListener("click", function () {
    const senha1 = document.getElementById('senha1').value;
    const senha2 = document.getElementById('senha2').value;
    const email = document.getElementById('email').value;
    const nome = document.getElementById('nome').value;

    if (senha1 === senha2 && email && nome) {
        localStorage.setItem("nome", nome);
        localStorage.setItem("email", email);
        localStorage.setItem("senha", senha1);

       verificarEmailNaApi(email)
            .then(data => {
                    console.log(data)
                    window.location.href = "corfimarCodigo.html";
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao fazer Cadastro: ' + error.message);
            });
    } else {
        alert("Campos incorretos! Tente novamente");
    }
});





