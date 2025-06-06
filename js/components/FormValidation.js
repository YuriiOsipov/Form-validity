export default class FormValidation {
  selectors = {
    form: "[data-js-form]",
    fieldErrors: "[data-js-form-field-errors]",
  };

  errorMessages = {
    valueMissing: ({ type, name }) =>
      type === "checkbox"
        ? "Please accept the privacy policy."
        : {
            username: "Please enter your name.",
            useremail: "Please enter your email.",
            userpassword: "Please enter your password.",
            userconfirmpassword: "Please confirm your password.",
          }[name] || "This field is required.",

    patternMismatch: ({ name, title }) =>
      title.trim() ||
      {
        userpassword:
          "Password must contain at least one number, one lowercase and one uppercase letter.",
      }[name] ||
      "The input format is incorrect.",

    typeMismatch: ({ type }) =>
      type === "email"
        ? "Please enter a valid email address."
        : "Invalid input type.",

    tooShort: ({ minLength }) =>
      `Too short. Minimum number of characters is ${minLength}.`,

    tooLong: ({ maxLength }) =>
      `Too long. Maximum number of characters is ${maxLength}.`,
  };

  constructor() {
    this.bindEvents();
  }

  manageErrors(fieldControlElement, errorMessages) {
    const fieldErrorsElement = fieldControlElement
      .closest(".form-field-container")
      ?.querySelector("[data-js-form-field-errors]");

    if (fieldErrorsElement) {
      fieldErrorsElement.innerHTML = errorMessages
        .map((msg) => `<span class="field__error">${msg}</span>`)
        .join("");
    }

    const fieldElement = fieldControlElement.parentElement;
    const isValid = errorMessages.length === 0;
    fieldElement.classList.toggle("field-error", !isValid);
  }

  validateField(fieldControlElement) {
    const errors = fieldControlElement.validity;
    const errorMessages = [];

    // Custom password confirmation logic comes first
    if (fieldControlElement.id === "userconfirmpassword") {
      const password = document.getElementById("userpassword")?.value;
      const confirm = fieldControlElement.value;
      if (password !== confirm) {
        errorMessages.push("Passwords do not match.");
        this.manageErrors(fieldControlElement, errorMessages);
        fieldControlElement.setAttribute("aria-invalid", "true");
        return false;
      }
    }

    // Default HTML5 validation errors
    Object.entries(this.errorMessages).forEach(([errorType, getMessage]) => {
      if (errors[errorType]) {
        errorMessages.push(getMessage(fieldControlElement));
      }
    });

    this.manageErrors(fieldControlElement, errorMessages);
    const isValid = errorMessages.length === 0;
    fieldControlElement.setAttribute("aria-invalid", String(!isValid));
    return isValid;
  }

  onBlur(event) {
    const { target } = event;
    const isFormField = target.closest(this.selectors.form);
    const isRequired = target.required;

    if (isFormField && isRequired) {
      this.validateField(target);
    }
  }

  onChange(event) {
    const { target } = event;
    const isRequired = target.required;
    const isCheckboxOrRadio = ["checkbox", "radio"].includes(target.type);

    if (isCheckboxOrRadio && isRequired) {
      this.validateField(target);
    }
  }

  onSubmit(event) {
    const isFormElement = event.target.matches(this.selectors.form);
    if (!isFormElement) return;

    const requiredFields = [
      ...event.target.querySelectorAll("input, select, textarea"),
    ].filter((el) => el.required);

    let isFormValid = true;
    let firstInvalidField = null;

    requiredFields.forEach((field) => {
      const valid = this.validateField(field);
      if (!valid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (!isFormValid) {
      event.preventDefault();
      firstInvalidField.focus();
    }
  }

  bindEvents() {
    document.addEventListener("blur", (e) => this.onBlur(e), { capture: true });
    document.addEventListener("change", (e) => this.onChange(e));
    document.addEventListener("submit", (e) => this.onSubmit(e));
  }
}
