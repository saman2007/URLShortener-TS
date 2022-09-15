import { validate } from "class-validator";
import {
  modalElement,
  loadingIcon,
  modal,
  modalLink,
  msgModalContainer,
  randomUrlButton,
  customUrlButton,
  urlInputsContainer,
  customUrlInputElement,
} from "./elements";
import { ModalDescriptor, ModalType } from "./interfacesAndTypes";
import { supabase } from "./supabase";
import { URLShortener } from "./URLShortener";
import { urlInput } from "./elements";

enum ErrorTypes {
  isNotUnique,
  ReqHasError,
}

const defaultMsgModalState: ModalDescriptor = { type: "none", msg: "" };
const msgModalState = new Proxy(defaultMsgModalState, {
  set: (target: ModalDescriptor, property: string, newValue: string) => {
    if (property === "msg") {
      target.msg = newValue;
    } else if (property === "type") {
      target.type = newValue as ModalType;
      displayMsgModal(target.msg, target.type);
    } else return false;

    return true;
  },
});

const checkUrl = async (urlShortener: object) => {
  const errors = await validate(urlShortener);
  
  const urlHasError = errors.find((data) => data.property === "url");
  const shortUrlHasError = errors.find((data) => data.property === "shortUrl");

  if (!urlHasError && !shortUrlHasError) {
    return true;
  } else if (urlHasError && shortUrlHasError) {
    msgModalState.msg =
      "please enter a correct and valid URL and enter a short url!";
  } else if (urlHasError) {
    msgModalState.msg = "please enter a correct and valid URL!";
  } else if (shortUrlHasError) {
    msgModalState.msg = "please enter a short url!";
  }

  msgModalState.type = "error";

  setTimeout(() => {
    msgModalState.type = "none";
  }, 3000);

  return false;
};

const displayMsgModal = (msg: string, type: ModalType) => {
  if (type === "none") {
    modalElement.classList.remove("!opacity-100");
    setTimeout(() => {
      if (msgModalContainer.contains(modalElement))
        msgModalContainer.removeChild(modalElement);
    }, 301);
    return;
  }
  if (msgModalContainer.contains(modalElement)) {
    msgModalContainer.removeChild(modalElement);
  }
  modalElement.classList.remove("!text-green-600");
  modalElement.innerHTML = `${
    type === "loading" ? loadingIcon : ""
  }<p>${msg}</p>`;

  modalElement.classList.add(
    "opacity-0",
    `${type === "success" ? "!text-green-600" : "not-success"}`
  );
  msgModalContainer.appendChild(modalElement);
  setTimeout(() => modalElement.classList.add("!opacity-100"), 0);
};

const closeModalHandler = () => {
  modal.classList.remove("!opacity-100", "!pointer-events-auto");
};

const openModalHandler = (generatedUrl: string) => {
  modal.classList.add("!opacity-100", "!pointer-events-auto");
  modalLink.textContent = window.location.origin + `/${generatedUrl}`;
  modalLink.href = window.location.origin + `/${generatedUrl}`;
};

const storeNewUrl = async (urlShortener: URLShortener, isCustom = false) => {
  try {
    randomUrlButton.disabled = true;
    customUrlButton.disabled = true;
    msgModalState.msg = "working... please wait";
    msgModalState.type = "loading";

    await (async () => {
      let stop = false;
      while (!stop) {
        const { data: short_url, error: gettingError } = await supabase
          .from("short-links")
          .select("short_url")
          .eq("short_url", urlShortener.shortUrl);

        if (gettingError) throw ErrorTypes[1];

        if (
          short_url !== null &&
          short_url.length > 0 &&
          short_url[0].short_url === urlShortener.shortUrl
        ) {
          if (isCustom) {
            throw ErrorTypes[0];
          } else urlShortener.generateRandomUrl();
        } else stop = true;
      }
    })();

    const { error: sendingError } = await supabase
      .from("short-links")
      .insert([
        { short_url: urlShortener.shortUrl, original_url: urlShortener.url },
      ]);

    if (sendingError) throw new Error();
    else msgModalState.type = "none";

    openModalHandler(urlShortener.shortUrl);
    urlInput.value = "";
    if (isCustom) customUrlInputElement.value = "";
  } catch (error) {
    if (ErrorTypes[error as keyof typeof ErrorTypes] === 0) {
      msgModalState.msg =
        "a url with your entered short url is already exist! please enter an other short url.";
    } else if (ErrorTypes[error as keyof typeof ErrorTypes] === 1) {
      msgModalState.msg =
        "failed to generate your shorter url. please try again.";
    }

    msgModalState.type = "error";
    setTimeout(() => {
      msgModalState.type = "none";
    }, 3000);
    return true;
  } finally {
    randomUrlButton.disabled = false;
    customUrlButton.disabled = false;
  }
  return false;
};

const randomUrlButtonEventHandlerv = async (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  const urlShortener = new URLShortener(urlInput.value);

  const isUrlOk = await checkUrl(urlShortener);
  if (isUrlOk) {
    storeNewUrl(urlShortener);
  }
};

const copyLinkHandler = (e: MouseEvent) => {
  e.preventDefault();

  window.navigator.clipboard
    .writeText(modalLink.href)
    .then((_) => {
      msgModalState.msg = "Copied!";
      msgModalState.type = "success";
    })
    .catch((_) => {
      msgModalState.msg = "something went wrong!";
      msgModalState.type = "error";
    })
    .finally(() => {
      setTimeout(() => {
        msgModalState.type = "none";
      }, 1000);
    });
};

const navigateUser = async () => {
  const paths = window.location.pathname.slice(1);
  if (paths.length > 0) {
    randomUrlButton.disabled = true;
    customUrlButton.disabled = true;
    msgModalState.msg = "navigating...";
    msgModalState.type = "loading";
    const splitedPath = paths.split("/");
    const { data: enteredUrl } = await supabase
      .from("short-links")
      .select("original_url")
      .eq("short_url", splitedPath[0]);

    if (enteredUrl?.length === 0) {
      msgModalState.msg = "you entered a wrong short link!";
      msgModalState.type = "error";
      setTimeout(() => {
        msgModalState.type = "none";
      }, 3000);
    } else {
      if (enteredUrl !== null) {
        window.location.href = enteredUrl[0].original_url;
      }
    }

    randomUrlButton.disabled = false;
    customUrlButton.disabled = false;
  }
};

const customUrlButtonEventHandler = async (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  if (!urlInputsContainer.contains(customUrlInputElement)) {
    urlInputsContainer.appendChild(customUrlInputElement);
  } else {
    const urlShortener = new URLShortener(
      urlInput.value,
      customUrlInputElement.value
    );
    const isInstanceOk = await checkUrl(urlShortener);
    if (isInstanceOk) {
      storeNewUrl(urlShortener, true);
    }
  }
};

const convertToHtmlElement = (elementStr: string): ChildNode => {
  const div = document.createElement("div");
  div.innerHTML = elementStr.trim();

  return div.firstChild!;
};

export {
  convertToHtmlElement,
  customUrlButtonEventHandler,
  randomUrlButtonEventHandlerv,
  closeModalHandler,
  openModalHandler,
  copyLinkHandler,
  navigateUser,
};
