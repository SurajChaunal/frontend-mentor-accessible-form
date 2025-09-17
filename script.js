const validators = {
  fname: (ctx) => {
    const v = ctx.fname?.value?.trim() || "";
    return { ok: v.length > 0, message: "First name is required." };
  },
  lname: (ctx) => {
    const v = ctx.lname?.value?.trim() || "";
    return { ok: v.length > 0, message: "Last name is required." };
  },
  email: (ctx) => {
    const v = ctx.email?.value?.trim() || "";
    if (!v.length) return { ok: false, message: "This field is required" };
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    return { ok, message: "Please enter a valid email address." };
  },
  query: (_) => {
    const ok = !!document.querySelector('input[name="query"]:checked');
    return { ok, message: "Please choose a query type." };
  },
  message: (ctx) => {
    const v = ctx.message?.value?.trim() || "";
    console.log(v);
    return {
      ok: v.length >= 10,
      message: "Message must be at least 10 characters.",
    };
  },
  consent: (_) => {
    const el = document.getElementById("consent");
    const ok = el && el.checked;
    return { ok, message: "You must consent to proceed." };
  },
};
const formEl = document.querySelector(".form__main");
const submitBtnEl = document.querySelector(".btn--submit");
const toastEl = document.querySelector(".section__toast");
const getInputErrorEls = () => formEl.querySelectorAll(".input--error");
const getAllErrorEls = () => formEl.querySelectorAll(".error");
const getSinglErrorEl = (name) => formEl.querySelector(`.error--${name}`);
let hasError = false;

// console.log(getAllErrorEls());
function validateKey(key) {
  const result = validators[key](formEl.elements);
  if (!result.ok) {
    hasError = true;
    // if (key === "query") {
    //   formEl[key].forEach((radio) => {
    //     // radio.nextElementSibling.classList.add("input--error");
    //     // radio.classList.add("input--error");
    //   });
    // }
    if (key != `query`) {
      formEl[key].classList.add("input--error");
    }
    showErrorMessage(key, result.message);
  }
}
function showErrorMessage(key, message) {
  const errorEl = getSinglErrorEl(key);
  // console.log(errorEl, `error--${key}`);
  errorEl.classList.add("active");
  errorEl.textContent = message;
}

function clearAllErrors() {
  getInputErrorEls().forEach((el) => {
    el.classList.remove("input--error");
  });
  getAllErrorEls().forEach((el) => el.classList.remove("active"));
}

function handleSuccess() {
  toastEl.classList.add("active");
  formEl.reset();
  setTimeout(() => toastEl.classList.remove("active"), 2000);
}
function handleSubmit(e) {
  hasError = false;
  e.preventDefault();
  const validationKeys = Object.keys(validators);
  //reset error before revalidation

  clearAllErrors();
  validationKeys.forEach((key) => validateKey(key));

  // do not process even it has a single error
  if (hasError) return;
  handleSuccess();
}

formEl.addEventListener("submit", handleSubmit);
