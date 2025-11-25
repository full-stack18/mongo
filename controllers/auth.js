const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");

// Función para registrar usuario
async function register(req, res) {
  try{
    const { firstname, lastname, email, password } = req.body;

  // Validar que el email no esté vacío
  if (!email) {
    return res.status(400).send({ msg: "El email es obligatorio" });
  }

  // Validar que la contraseña no esté vacía
  if (!password) {
    return res.status(400).send({ msg: "La contraseña es obligatoria" });
  }

  // Crear nuevo usuario
  const user = new User({
    firstname,
    lastname,
    email: email.toLowerCase(),
    role: "user",
    active: false,
  });

  // Encriptar la contraseña
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  user.password = hashedPassword;

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error.message);
    return res.status(500).send({ msg: "Error del servidor" });
  }
}

// Para login
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // ⚙ Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({ msg: "El email y la contraseña son obligatorios" });
        }

        const emailLowerCase = email.toLowerCase();

        // ⚙ Buscar usuario
        const userStore = await User.findOne({ email: emailLowerCase });

        if (!userStore) {
            return res.status(404).json({ msg: "El usuario no existe" });
        }

        // ⚙ Comparar contraseña
        const passwordMatch = await bcrypt.compare(password, userStore.password);
        if (!passwordMatch) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        // ⚙ Verificar si el usuario está activo
        if (!userStore.active) {
            return res.status(401).json({ msg: "Usuario no autorizado o inactivo" });
        }
        
        // ⚙ Generar tokens
        const accessToken = jwt.createAccessToken(userStore);
        const refreshToken = jwt.createRefreshToken(userStore);

        return res.status(200).json({
            msg: "Inicio de sesión exitoso",
            access: accessToken,
            refresh: refreshToken,
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
}

module.exports = { login };

module.exports = {
    register,
    login,
};
