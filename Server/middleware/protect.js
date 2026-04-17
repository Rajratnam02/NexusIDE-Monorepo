export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await userModel.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await userModel.create({
        firebaseUid: decoded.uid,
        name: decoded.name || "",
        email: decoded.email || "",
        photo: decoded.picture || "",
      });
    }

    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};