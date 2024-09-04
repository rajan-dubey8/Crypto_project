// import express from "express";
// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import path from "path";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";

// // Define __dirname for ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// const app = express();
// const saltRounds = 10;

// // Middleware
// app.use(express.json());
// app.use(express.static("public"));

// // MongoDB Connection
// const mongoURI = process.env.CONN_STR;

// mongoose
//   .connect(mongoURI, {
//     dbName: "crypto",
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // Routes
// app.post("/register", async (req, res) => {
//   const { name, mobile, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const newUser = new User({ name, mobile, email, password: hashedPassword });
//     await newUser.save();
//     res.json({ success: true, message: "User registered successfully" });
//   } catch (error) {
//     res.json({ success: false, message: "Error registering user" });
//   }
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       res.json({ success: true, message: "Login successful" });
//     } else {
//       res.json({ success: false, message: "Incorrect password" });
//     }
//   } catch (error) {
//     res.json({ success: false, message: "Error logging in" });
//   }
// });

// app.get("/home", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "home.html"));
// });

// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import session from "express-session"; // Import express-session

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Configure session middleware
app.use(
  session({
    secret: "8t9ksdfKJH98hjsdf8shdfh8f23sd98fh32hfsdJHKH8",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);



// Custom hash function
function customHash(password, salt) {
  let hash = 0;
  const combined = password + salt;

  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }

  return hash.toString(16);
}

function generateSalt(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let salt = "";
  for (let i = 0; i < length; i++) {
    salt += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return salt;
}





app.use(express.json());
app.use(express.static("public"));

const mongoURI = process.env.CONN_STR;

mongoose
  .connect(mongoURI, {
    dbName: "crypto",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Route to serve index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// User registration route
app.post("/register", async (req, res) => {
  const { name, mobile, email, password } = req.body;
  const salt = generateSalt();
  const hashedPassword = customHash(password, salt);
  try {
    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      salt,
    });
    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error registering user" });
  }
});

// User login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const hashedPassword = customHash(password, user.salt);
    if (hashedPassword === user.password) {
      req.session.userId = user._id; // Store user ID in session
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error logging in" });
  }
});

// Change password route
app.post("/change-password", async (req, res) => {
  if (!req.session.userId) {
    return res.json({ success: false, message: "User not logged in" });
  }

  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const hashedOldPassword = customHash(oldPassword, user.salt);
    if (hashedOldPassword !== user.password) {
      return res.json({ success: false, message: "Old password is incorrect" });
    }

    const newSalt = generateSalt();
    const hashedNewPassword = customHash(newPassword, newSalt);
    user.password = hashedNewPassword;
    user.salt = newSalt;

    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error changing password" });
  }
});

// Get user details route
app.get("/get-user-details", async (req, res) => {
  if (!req.session.userId) {
    return res.json({ success: false, message: "User not logged in" });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error fetching user details" });
  }
});

// Serve home page
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
