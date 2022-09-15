import { closeModalButton, copyLink, customUrlButton, randomUrlButton } from "./elements";
import {
  closeModalHandler,
  copyLinkHandler,
  customUrlButtonEventHandler,
  randomUrlButtonEventHandlerv,
} from "./functions";

randomUrlButton.addEventListener("click", randomUrlButtonEventHandlerv);
closeModalButton.addEventListener("click", closeModalHandler);
copyLink.addEventListener("click", copyLinkHandler);
customUrlButton.addEventListener("click", customUrlButtonEventHandler)
