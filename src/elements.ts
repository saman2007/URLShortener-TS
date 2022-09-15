import { convertToHtmlElement } from "./functions";

const urlInput = document.querySelector(".url-input")! as HTMLInputElement;
const randomUrlButton = document.querySelector(".random-url")! as HTMLButtonElement;
const customUrlButton = document.querySelector(".custom-url")! as HTMLButtonElement;
const modalElement = document.createElement("div");
modalElement.classList.add("text-center", "transition-all", "pointer-events-auto", "duration-300", "z-30", "min-h-[50px]", "flex", "flex-col", "justify-center", "items-center", "mx-auto", "rounded-[10px]","min-w-[100px]" ,"max-w-[95%]" ,"bg-black" ,"h-fit" ,"p-[5px]" ,"text-red-600" ,"font-secondary" ,"text-[20px]")
const loadingIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto; animation-play-state: running; animation-delay: 0s;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<circle cx="50" cy="50" fill="none" stroke="#011747" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" style="animation-play-state: running; animation-delay: 0s;">
  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" style="animation-play-state: running; animation-delay: 0s;"></animateTransform>
</circle>
</svg>`
const modal = document.querySelector(".modal")! as HTMLDivElement;
const closeModalButton = document.querySelector(".modal-close-button")! as HTMLButtonElement;
const modalLink = document.querySelector(".generated-url")! as HTMLAnchorElement;
const copyLink = document.querySelector(".copy-link")! as HTMLButtonElement;
const msgModalContainer = document.querySelector(".msg-modal-container")! as HTMLDivElement;
const customUrlInputElement = convertToHtmlElement(`<input type="text" placeholder="enter your custom url here..." class="url-input mt-[15px] px-[10px] py-[15px] w-full outline-none font-secondary text-[18px] rounded-[15px]"/>`)! as HTMLInputElement;
const urlInputsContainer = document.querySelector(".url-inputs")! as HTMLDivElement;

export {modalElement, urlInputsContainer, customUrlInputElement, msgModalContainer, copyLink, modalLink , urlInput , randomUrlButton , customUrlButton, loadingIcon, modal, closeModalButton};