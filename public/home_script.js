
function displayUserInfo(user) {
  document.getElementById(
    "user-info"
  ).textContent = `Name: ${user.name}, Email: ${user.email}`;
  const passwordStrength = evaluatePasswordStrength(user.password);
  document.getElementById(
    "password-strength"
  ).textContent = `Password Strength: ${passwordStrength.message}`;
  document.getElementById("password-strength").style.color =
    passwordStrength.color;
  if (passwordStrength.suggestions.length > 0) {
    document.getElementById(
      "suggestions"
    ).textContent = `Suggestions: ${passwordStrength.suggestions.join(", ")}`;
  }
}

function evaluatePasswordStrength(password) {
  let strength = 0;
  let suggestions = [];

  if (password.length >= 8) strength++;
  else suggestions.push("at least 8 characters");

  if (/[A-Z]/.test(password)) strength++;
  else suggestions.push("an uppercase letter");

  if (/[a-z]/.test(password)) strength++;
  else suggestions.push("a lowercase letter");

  if (/[0-9]/.test(password)) strength++;
  else suggestions.push("a number");

  if (/[\W]/.test(password)) strength++;
  else suggestions.push("a special character");

  let strengthMessage = "Very Weak";
  let color = "red";

  if (strength === 5) {
    strengthMessage = "Very Strong";
    color = "green";
  } else if (strength >= 4) {
    strengthMessage = "Strong";
    color = "green";
  } else if (strength >= 3) {
    strengthMessage = "Moderate";
    color = "orange";
  } else if (strength >= 2) {
    strengthMessage = "Weak";
    color = "red";
  }

  return { message: strengthMessage, color, suggestions };
}
