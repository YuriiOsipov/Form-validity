export default class CheckboxAgree {
  selectors = {
    formSelector: "[data-js-form]",
    checkboxSelector: "[data-js-checkbox]",
    inputSelector: "[data-js-checkbox-input]",
  };

  classAgree = "agree";

  constructor() {
    this.formElement = document.querySelector(this.selectors.formSelector);
    this.checkboxElement = this.formElement.querySelector(
      this.selectors.checkboxSelector
    );
    this.checkboxInputElement = this.formElement.querySelector(
      this.selectors.inputSelector
    );
    this.bindEvents();
  }

  bindEvents() {
    this.checkboxInputElement.addEventListener("change", () => {
      const isChecked = this.checkboxInputElement.checked;
      const method = isChecked ? "add" : "remove";

      this.checkboxElement.classList[method](this.classAgree);
      this.checkboxInputElement.classList[method](this.classAgree);
    });
  }
}
