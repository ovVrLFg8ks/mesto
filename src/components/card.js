import { likeCard, dislikeCard, deleteCard as deleteCardFromServer } from "./api.js";
import { openModal } from "./modal.js";

export function createCard(
  data,
  popupImage,
  popupCaption,
  imagePopup,
  currentUserId,
  handleCardDelete
) {
  const template = document.querySelector("#card-template").content;
  const cardElement = template.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCount.textContent = data.likes.length;

  if (data.likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_is-active");
    const likeApiCall = isLiked ? dislikeCard(data._id) : likeCard(data._id);

    likeApiCall
      .then((updatedCard) => {
        likeButton.classList.toggle("card__like-button_is-active");
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => console.error(`Ошибка обновления лайка: ${err}`));
  });

  if (data.owner && data.owner._id !== currentUserId) {
    deleteButton.style.display = "none";
  } else {
    deleteButton.addEventListener("click", () => {
      handleCardDelete(cardElement, data._id); 
    });
  }

  cardImage.addEventListener("click", () => {
    popupImage.src = data.link;
    popupImage.alt = data.name;
    popupCaption.textContent = data.name;
    openModal(imagePopup);
  });

  return cardElement;
}
