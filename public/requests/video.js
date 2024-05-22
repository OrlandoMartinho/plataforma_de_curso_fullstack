document.addEventListener('DOMContentLoaded', function() {
    
    const requestOptions2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token"),
            id_curso:localStorage.getItem("id_curso")
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
    
            const videoData = [
                {
                    title: "Primeiros Passos",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    videoUrl: "../assets/video/video.mp4",
                    author: {
                        name: "Diego Paulo",
                        role: "Formador",
                        avatar: "public/assets/img/user1.jpg"
                    }
                },
                {
                    title: "Aprendizado Básico",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    videoUrl: "../assets/videos/video.mp4",
                    author: {
                        name: "Diego Paulo",
                        role: "Formador",
                        avatar: "../assets/img/user1.jpg"
                    }
                },
                {
                    title: "Intermediário",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    videoUrl: "../assets/videos/video.mp4",
                    author: {
                        name: "Diego Paulo",
                        role: "Formador",
                        avatar: "../assets/img/user1.jpg"
                    }
                }
            ];
        
            const playListContainer = document.getElementById('play-list');
            const mainVideo = document.getElementById('main-video');
            const authorAvatar = document.getElementById('author-avatar');
            const authorName = document.getElementById('author-name');
            const authorRole = document.getElementById('author-role');
            const videoDescription = document.getElementById('video-description');
            
            
            // Obtém os valores dinâmicos que você deseja adicionar
            var avatarSrc = "caminho/para/avatar.jpg";
            console.log(data)
            var name = data.curso.nome_do_formador;
         //   var role = "Papel do Autor";
            var description = data.curso.descricao;
            
            // Atribui os valores dinâmicos aos elementos HTML
            authorAvatar.src = avatarSrc;
            authorName.textContent = name;
            videoDescription.textContent = description;
            function loadVideo(video) {
                console.log(data.curso)
               // mainVideo.src = video.videoUrl;
                //authorAvatar.src = video.author.avatar;
                //authorName.textContent = data.nome_do_formador;
                //authorRole.textContent = video.author.role;
                //videoDescription.textContent = video.descricao;
            }
          
            data.videos.forEach(video => {
                const playListItem = document.createElement('div');
                playListItem.className = 'play-list-item';
                playListItem.textContent = video.titulo.split(".")[0];
                playListItem.addEventListener('click', () => loadVideo(video));
                playListContainer.appendChild(playListItem);
            });










        })
        .catch(error => {
            console.error('Erro:', error);
        });
    
    
   
   })
    // Carrega o primeiro vídeo