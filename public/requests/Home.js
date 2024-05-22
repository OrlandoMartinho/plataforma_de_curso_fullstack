


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

fetch(`${base_url}cursos/mais_assistidos`, requestOptions2)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        var cursosMain = document.getElementById("cursos-main");
        data.cursos.forEach(function(curso) {
            cursosMain.appendChild(criarCurso(curso));
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });

function criarCurso(curso) {
    const cursoDiv = document.createElement('div');
    cursoDiv.classList.add('curso');
console.log(curso)
    // Conteúdo HTML do curso
    cursoDiv.innerHTML = `
        <div class="cursosImg">
            <div>
                <h2>${curso.titulo}</h2>
                <p>Total de vizualizações: ${curso.total_assistidos}</p>
            </div>
        </div>
        
    `;

    return cursoDiv;
}
