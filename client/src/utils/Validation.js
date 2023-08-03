import validator from "validator";

const validateRegister = ({ username, email, password }) => {
  let errors = {};

  if (!username) {
    errors.username = "Username required";
  }

  if (!email) {
    errors.email = "Email required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password required";
  } else if (!validator.isStrongPassword(password)) {
    errors.password =
      "Password must be strong enough.\n Include numbers,symbols,upper and lower case characters at least once. Min length must be 8";
  }
  return [errors, Object.keys(errors).length];
};

const validateLogin = ({ email, password }) => {
  let errors = {};

  if (!email) {
    errors.email = "Email required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password required";
  } else if (!validator.isStrongPassword(password)) {
    errors.password = "Enter a valid password";
  }
  return [errors, Object.keys(errors).length];
};

const validateForgot = ({ code, password }) => {
  let errors = {};

  if (!code) {
    errors.code = "Verification code required";
  } 
  if (!password) {
    errors.password = "Password required";
  } else if (!validator.isStrongPassword(password)) {
    errors.password = "Enter a valid password";
  }

  return [errors, Object.keys(errors).length];
};

export { validateRegister, validateLogin, validateForgot };
