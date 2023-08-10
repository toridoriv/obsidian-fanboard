export function setLanguageOnLocalStorage(language: string) {
  localStorage.setItem("language", language);
}

export function unsetLanguageFromLocalStorage() {
  localStorage.removeItem("language");
}
