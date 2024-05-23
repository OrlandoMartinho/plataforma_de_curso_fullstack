// Selecionar o elemento onde o perfil será adicionado
const profileContainer = document.querySelector('.profile-Icon');

// Criar elementos HTML para o perfil
const profileInfo = document.createElement('div');
profileInfo.innerHTML = `
    <p class="title">${localStorage.getItem("nome")}</p>
    <p class="text">${localStorage.getItem("email")}</p>
`;

// Adicionar elementos ao container do perfil
profileContainer.appendChild(profileInfo);


const requestOptions2 = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        accessToken: localStorage.getItem("token")
    })
};

fetch(`${base_url}cursos/listar`, requestOptions2)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        var cursosMain = document.getElementById("cursos-main");
        console.log(data)
        data.cursos.forEach(function(curso) {
            cursosMain.appendChild(criarCurso(curso));
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });

    document.getElementById('pesquisar').addEventListener('input', (event) => {
        valor = event.target.value;
        var cursosMain = document.getElementById("cursos-main");
        cursosMain.style.display = 'none';
        
        // Verifica se o elemento "cursos_pesquisa" existe
        var pesquisacurso = document.getElementById("cursos_pesquisa");
            pesquisacurso.innerHTML = ''; // Limpa o conteúdo anterior
    
            const requestOptions2 = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: localStorage.getItem("token"),
                    pesquisa: valor
                })
            };
    
            fetch(`${base_url}cursos/pesquisar`, requestOptions2)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao fazer a requisição: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    data.cursos.forEach(function (curso) {
                        pesquisacurso.appendChild(criarCurso(curso));
                    });
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        
    });
    
    document.getElementById('ver_tudo').addEventListener('click', (event) => {
       location.reload()
    });
    
    
    function criarCurso(curso) {
        var card = document.createElement("div");
        card.classList.add("cursos");
    
        card.innerHTML = `
            <div class="cards">
                <div class="card">
                    <h6>${curso.titulo}</h6>
                    <p>${curso.descricao}</p>
                </div>
            </div>
        `;
        card.dataset.modo = curso.modo; // Adiciona o atributo data-modo
        card.dataset.modulo = curso.modulo; // Adiciona o atributo data-modulo
    
        

        card.addEventListener("click", function () {
            // Armazena o id_curso no localStorage quando o card é clicado
            localStorage.setItem("id_curso", curso.id_curso);
            console.log(curso)
            if(curso.modo==='gratuito'){
                window.location.href = "cursoView.html";
            }else{
                window.location.href = "pagamento.html";
            }
            
        });
    
        return card;
    }
    
  
    


