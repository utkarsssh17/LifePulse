import authRoutes from "./auth.js";
import userRoutes from "./users.js";

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render("home", { title: "Home" });
    });
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Route not found" });
    });
};

export default constructorMethod;