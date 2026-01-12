const animateHover = (dets) =>{
    if(window.innerWidth < 720) return
    let gif = document.querySelector('.overlayGif')
    // console.log(dets)
    gif.style.opacity = 1
    gif.style.scale = 0.75
    gif.style.top = (dets.clientY - 300) + 'px'
    gif.style.left = (dets.clientX - 240) + 'px'
}

const removeHover =() =>{
    if(window.innerWidth < 720) return
    let gif = document.querySelector('.overlayGif')
    // console.log(dets)
    gif.style.opacity = 0
    gif.style.scale = 0
}

const getInitials = (name) => {
    let initials = name.split(' ').map((n) => n[0]).join('');
    return initials.toUpperCase();
}

const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

const hasImageChanged = (profilePhoto, userPhoto) => {
    if (profilePhoto && profilePhoto.url !== userPhoto) {
        return true;
    }
    return false;
}

export { animateHover, removeHover, getInitials, formatDate, hasImageChanged }