const aside = document.querySelector('aside')

const asideBtn = document.querySelector('aside button')
const headerBtn = document.querySelector('header button')

asideBtn.addEventListener('click', () => {
    aside.classList.add('hide')
})

headerBtn.addEventListener('click', () => {
    aside.classList.toggle('hide')
})