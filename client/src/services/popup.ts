export const showPopup = () => {
  const popupRef = document.querySelector("#popup") as HTMLDivElement;
  popupRef.style.display = "block";
};

export const hidePopup = () => {
  const popupRef = document.querySelector("#popup") as HTMLDivElement;
  popupRef.style.display = "none";
};

const closeButtonRef = document.querySelector(
  "#popup-close"
) as HTMLButtonElement;

closeButtonRef.addEventListener("click", hidePopup);
