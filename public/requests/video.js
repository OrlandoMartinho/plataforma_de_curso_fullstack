function createVideoElement(titulo, video, curso) {
    // Criar os elementos
    const videoDiv = document.createElement('div');
    videoDiv.className = 'video';

    const circleDiv = document.createElement('div');
    circleDiv.className = 'circle';

    const videoCenterDiv = document.createElement('div');
    videoCenterDiv.className = 'video-center';

    const imgElement = document.createElement('img');
    imgElement.src = '../assets/icon/video.png';
    imgElement.alt = 'imagem';

    const videoTitle = document.createElement('p');
    videoTitle.textContent = titulo;

    const duration = document.createElement('p');
    //duration.textContent = '08:20';

    // Montar a estrutura
    videoCenterDiv.appendChild(imgElement);
    videoCenterDiv.appendChild(videoTitle);

    videoDiv.appendChild(circleDiv);
    videoDiv.appendChild(videoCenterDiv);
    videoDiv.appendChild(duration);

    // Adicionar evento de clique
    videoDiv.addEventListener('click', () => loadVideo(video, curso));

    // Adicionar ao contêiner
    const videosContainer = document.getElementById('videos-container');
    videosContainer.appendChild(videoDiv);
}

function loadVideo(video, curso) {
    fetch(`${base_url}videos/obter_um`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token"),
            id_curso: curso.id_curso,
            nomeDoArquivo: video.titulo
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

        // Define a URL do vídeo como a origem do elemento de vídeo
        var mainVideo = document.getElementById('main-video');
        mainVideo.src = videoUrl;
        localStorage.setItem("id_video", video.id_video);
    })
    .catch(function(error) {
        console.error('Erro ao solicitar o vídeo:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const requestOptions2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token"),
            id_curso: localStorage.getItem("id_curso")
        })
    };

    fetch(`${base_url}cursos/obter_um`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const mainVideo = document.getElementById('main-video');
            const authorAvatar = document.getElementById('author-avatar');
            const authorName = document.getElementById('author-name');
            const authorRole = document.getElementById('author-role');
            const videoDescription = document.getElementById('video-description');

            // Obtém os valores dinâmicos que você deseja adicionar
            var avatarSrc = "../assets/img/user-circle.png";
            var name = data.curso.nome_do_formador;
            var description = data.curso.descricao;
            const curso = data.curso;

            authorAvatar.src = avatarSrc;
            authorName.textContent = name;
            videoDescription.textContent = description;

            data.videos.forEach(video => {
                createVideoElement(video.titulo.split(".")[0], video, curso);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
