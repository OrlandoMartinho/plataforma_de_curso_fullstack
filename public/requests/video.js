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
            var avatarSrc = "../assets/img/user-circle.png";
            console.log(data)
            var name = data.curso.nome_do_formador;
         //   var role = "Papel do Autor";
            var description = data.curso.descricao;
            
          const curso=data.curso




            
            authorAvatar.src = avatarSrc;
            authorName.textContent = name;
            videoDescription.textContent = description;
            function loadVideo(video) {
                console.log(data.curso)

                fetch(`${base_url}videos/obter_um`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      accessToken: localStorage.getItem("token"),
                      id_curso:curso.id_curso ,
                      nomeDoArquivo:video.titulo
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
                  
                      // Obtém uma referência ao elemento de vídeo no seu HTML
                      var videoElement = document.getElementById('videoPlayer');
                  
                      // Define a URL do vídeo como a origem do elemento de vídeo
                      mainVideo.src =videoUrl;
            
                    })
                    .catch(function(error) {
                      console.error('Erro ao solicitar o vídeo:', error);
                    });
             
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