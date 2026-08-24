const aside = document.querySelector('aside')
const asideBtn = document.querySelector('.aside-btn button')

asideBtn.addEventListener('click', () => {
    aside.classList.toggle('hide')
})