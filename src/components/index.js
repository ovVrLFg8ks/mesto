import { enableValidation, resetValidation } from "./validate.js";
import { openModal, closeModal, closeOnOverlayClick } from "./modal.js";
import { createCard } from "./card.js";
import {
  getUserInfo,
  getInitialCards,
  addCard,
  updateAvatar,
  updateUserInfo,
  deleteCard,
} from "./api.js";
import "../pages/index.css";

const cardList = document.querySelector(".places__list");
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const avatarPopup = document.querySelector(".popup_type_avatar");
const confirmPopup = document.querySelector(".popup_type_confirm");
const profileEditButton = document.querySelector(".profile__edit-button");
const cardAddButton = document.querySelector(".profile__add-button");
const avatarEditButton = document.querySelector(".profile__image-edit-button");
const closeButtons = document.querySelectorAll(".popup__close");
const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const profileFormElement = document.forms["edit-profile"];
const nameInput = profileFormElement.elements.name;
const jobInput = profileFormElement.elements.description;
const cardFormElement = document.forms["new-place"];
const avatarFormElement = document.forms["update-avatar"];
const confirmFormElement = document.forms["confirm-delete"];
const placeInput = cardFormElement.elements["place-name"];
const linkInput = cardFormElement.elements.link;
const avatarInput = avatarFormElement.elements.avatar;
let currentUserId;
let cardToDelete; 

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      const card = createCard(
        cardData,
        popupImage,
        popupCaption,
        imagePopup,
        currentUserId,
        handleCardDelete
      );
      cardList.append(card);
    });
  })
  .catch((err) => console.error(`Ошибка загрузки данных: ${err}`));

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  resetValidation(profileFormElement);
  openModal(profilePopup);
});

profileFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = profileFormElement.querySelector(".popup__button");
  const initialText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  updateUserInfo({ name: nameInput.value, about: jobInput.value })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => console.error(`Ошибка обновления профиля: ${err}`))
    .finally(() => {
      submitButton.textContent = initialText;
    });
});

cardAddButton.addEventListener("click", () => {
  cardFormElement.reset();
  resetValidation(cardFormElement);
  openModal(cardPopup);
});

cardFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = cardFormElement.querySelector(".popup__button");
  const initialText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  const cardData = {
    name: placeInput.value,
    link: linkInput.value,
  };

  addCard(cardData)
    .then((newCardData) => {
      const card = createCard(
        newCardData,
        popupImage,
        popupCaption,
        imagePopup,
        currentUserId,
        handleCardDelete
      );
      cardList.prepend(card);
      closeModal(cardPopup);
      cardFormElement.reset();
    })
    .catch((err) => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => {
      submitButton.textContent = initialText;
    });
});

avatarEditButton.addEventListener("click", () => {
  avatarFormElement.reset();
  resetValidation(avatarFormElement);
  openModal(avatarPopup);
});

avatarFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = avatarFormElement.querySelector(".popup__button");
  const initialText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  updateAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
    })
    .catch((err) => console.error(`Ошибка обновления аватара: ${err}`))
    .finally(() => {
      submitButton.textContent = initialText;
    });
});

function handleCardDelete(cardElement, cardId) {
  cardToDelete = { cardElement, cardId }; 
  openModal(confirmPopup);
}

confirmFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = confirmFormElement.querySelector(".popup__button");
  const initialText = submitButton.textContent;
  submitButton.textContent = "Удаление...";

  deleteCard(cardToDelete.cardId)
    .then(() => {
      cardToDelete.cardElement.remove();
      closeModal(confirmPopup);
    })
    .catch((err) => console.error(`Ошибка удаления карточки: ${err}`))
    .finally(() => {
      submitButton.textContent = initialText;
    });
});

closeButtons.forEach((button) => {
  const popup = button.closest(".popup");
  button.addEventListener("click", () => closeModal(popup));
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", closeOnOverlayClick);
});

enableValidation({
  formSelector: ".popup__form",
});
