document.querySelector('.logout').addEventListener('click',()=>{

    localStorage.setItem("token","")
    location.reload();

})