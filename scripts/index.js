const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');


function createCard(cardData) {
    const cardElement = cardTemplate.cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardImage.alt = cardData.name;
    cardImage.src = cardData.link;
    cardTitle.textContent = cardData.name;

    cardImage.addEventListener('click', () => {
        popupImage.src = cardData.link;
        popupImage.alt = cardData.name;
        popupCaption.textContent = cardData.name;
        openSmooth(imagePopup);
    });
    likeButton.addEventListener('click', () => {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    deleteCard(cardElement);

    return cardElement;
}

function renderCards(cards) {
    cards.forEach(card => {
        const cardElement = createCard(card);
        placesList.append(cardElement);
    });
}

function deleteCard(cardElement) {
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        const cardToDelete = deleteButton.closest('.places__item'); 
        if (cardToDelete) {
            cardToDelete.remove();
        }
    });
}

const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');

function openSmooth(popup) {
    popup.classList.add('popup_is-animated');
    popup.style.visibility = 'visible';
	popup.style.transitionDuration='.3s';
    popup.style.opacity = '0';

    setTimeout(() => {
        popup.style.opacity = '1';
    });
    popup.classList.add('popup_is-opened');
    
}

function closeSmooth(popup) {
    popup.classList.remove('popup_is-opened');
    popup.style.opacity = '0';

    setTimeout(() => {
        popup.style.visibility = 'hidden';
        popup.classList.remove('popup_is-animated');
    }, 300);
}

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');

function handleProfileFormSubmit(ev) {
    ev.preventDefault();

    const newName = nameInput.value;
    const newJob = jobInput.value;

    profileTitle.textContent = newName;
    profileDescription.textContent = newJob;

    closeSmooth(profilePopup);
}

const cardNameInput = document.querySelector('.popup__input_type_card-name');
const cardLinkInput = document.querySelector('.popup__input_type_url');
const cardFormElement = document.querySelector('.popup__form[name="new-place"]');

function handleCardFormSubmit(ev) {
    ev.preventDefault();

    const newCardName = cardNameInput.value;
    const newCardLink = cardLinkInput.value;

    const newCard = {
        name: newCardName,
        link: newCardLink
    };

    const newCardElement = createCard(newCard);
    placesList.prepend(newCardElement); 

    closeSmooth(cardPopup);

    cardFormElement.reset();
}


cardFormElement.addEventListener('submit', handleCardFormSubmit);

document.addEventListener('DOMContentLoaded', () => {
    renderCards(initialCards);
});

const popupClose = imagePopup.querySelector('.popup__close');

popupClose.addEventListener('click', () => {
    closeSmooth(imagePopup);
});

function closeByEsc(evt) {
	if (evt.key === "Escape") {
		const openedPopup = document.querySelector('.popup_is-opened');
		if (openedPopup)
			closeSmooth(openedPopup);
	}
}

document.addEventListener('keydown', function(evt) {
	closeByEsc(evt);
});

const profileEditButton = document.querySelector('.profile__edit-button');
profileEditButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openSmooth(profilePopup);
});

const closeButton = document.querySelectorAll('.popup__close');
closeButton.forEach(button => {
    button.addEventListener('click', (event) => {
        const popup = event.target.closest('.popup');
        closeSmooth(popup);
    });
	button.addEventListener('keypress', (ev) => {
		if(ev.key === "Escape") {
			const popup = event.target.closest('.popup');
			closeSmooth(popup);
		}
	});
});

const profileAddButton = document.querySelector('.profile__add-button');
profileAddButton.addEventListener('click', () => {
    openSmooth(cardPopup);
});

const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
profileFormElement.addEventListener('submit', handleProfileFormSubmit);

