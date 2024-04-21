export function displayDialogue(text, onDisplayEnd) {
  const dialogue = document.getElementById('textbox-container')
  const dialogueUI = document.getElementById('dialogue')

  dialogueUI.style.display = 'block'

  let index = 0
  let currentText = ''
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index]
      dialogue.innerHTML = currentText
      index++
      return
    }
    clearInterval(intervalRef)
  }, 5)

  const closeBtn = document.getElementById('close')

  function onCloseBtnClick() {
    onDisplayEnd()
    dialogueUI.style.display = 'none'
    dialogue.innerHTML = ""
    closeBtn.removeEventListener('click', onCloseBtnClick)
  }
  
  closeBtn.addEventListener("click", onCloseBtnClick)
}
