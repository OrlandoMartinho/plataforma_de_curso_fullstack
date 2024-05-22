const base_url='http://localhost:3000/'
function cadastrarNaApi() {
    const nome = localStorage.getItem("nome");
    const email = localStorage.getItem("email");
    const senha = localStorage.getItem("senha");
    const n1 = document.getElementById('n1').value;
    const n2 = document.getElementById('n2').value;
    const n3 = document.getElementById('n3').value;
    const n4 = document.getElementById('n4').value;

    const dados = {
        email: email,
        senha: senha,
        nome: nome,
        codigo: n1+n2+n3+n4+''
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}usuarios/cadastrar`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            if(response.status!='200'){
                return null
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro:', error);
            return null;
        });
}



document.getElementById('confirmar').addEventListener("click", function () {

    cadastrarNaApi()
    .then(data => {
          
            if(data==null){
                alert("Verifique o codigo ou usuário já cadastrado")
                window.location.href = "cadastro.html";
            }else{
                alert("Está tudo pronto agora podes efectuar o login")
                window.location.href = "../index.html";
            }
           
           // window.location.href = "../index.html";
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao fazer Cadastro: ' + error.message);
    });


})