// function evaluatePasswordStrength(password) {
//   let strength = 0;
//   if (password.length >= 8) strength++;
//   if (/[A-Z]/.test(password)) strength++;
//   if (/[a-z]/.test(password)) strength++;
//   if (/[0-9]/.test(password)) strength++;
//   if (/[\W]/.test(password)) strength++; // Special character check

//   return strength;
// }

// document.getElementById("password").addEventListener("input", function () {
//   const password = this.value;
//   const strength = evaluatePasswordStrength(password);
//   const strengthElement = document.getElementById("password-strength");

//   let strengthMessage = "Weak";
//   if (strength >= 4) {
//     strengthMessage = "Strong";
//   } else if (strength >= 2) {
//     strengthMessage = "Moderate";
//   }

//   strengthElement.textContent = `Password Strength: ${strengthMessage}`;
//   strengthElement.style.color =
//     strength >= 4 ? "green" : strength >= 2 ? "orange" : "red";
// });


// function customHash(password, salt) {
//   let hash = 0;
//   const combined = password + salt;

//   for (let i = 0; i < combined.length; i++) {
//     hash = (hash << 5) - hash + combined.charCodeAt(i);
//     hash |= 0; // Convert to a 32-bit integer
//   }

//   return hash.toString(16); // Return hash in hexadecimal format
// }

// function generateSalt(length = 8) {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let salt = "";
//   for (let i = 0; i < length; i++) {
//     salt += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return salt;
// }

// function signup() {
//   const password = document.getElementById("password").value;
//   const salt = generateSalt();
//   const hashedPassword = customHash(password, salt);

//   console.log(`Salt: ${salt}`);
//   console.log(`Hashed Password: ${hashedPassword}`);

//   alert("Sign up successful!");
// }

function myMenuFunction() {
  var i = document.getElementById("navMenu");

  if (i.className === "nav-menu") {
    i.className += " responsive";
  } else {
    i.className = "nav-menu";
  }
}

var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function login() {
  x.style.left = "4px";
  y.style.right = "-520px";
  a.className += " white-btn";
  b.className = "btn";
  x.style.opacity = 1;
  y.style.opacity = 0;
}

function register() {
  x.style.left = "-510px";
  y.style.right = "5px";
  a.className = "btn";
  b.className += " white-btn";
  x.style.opacity = 0;
  y.style.opacity = 1;
}

function handleRegister() {
  const name = document.getElementById("registerName").value;
  const mobile = document.getElementById("registerMobile").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mobile, email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.success) window.location.href = "/home";
    });
}

function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.success) window.location.href = "/home";
    });
}
