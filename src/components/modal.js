export { openModal, closeModal, closeOnOverlayClick }

function openModal(popup) {
  popup.classList.add('popup_is-animated');
  popup.style.visibility = 'visible';
  popup.style.transitionDuration='.3s';
  popup.style.opacity = '0';

  setTimeout(() => {
	popup.style.opacity = '1';
  });
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEsc);
}
  
function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  popup.style.opacity = '0';
  
  setTimeout(() => {
    popup.style.visibility = 'hidden';
    popup.classList.remove('popup_is-animated');
  }, 300);
  document.addEventListener('keydown', closeByEsc);
}

function closeOnOverlayClick(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.target);
  }
}

function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

