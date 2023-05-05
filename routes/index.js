import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import imageRoutes from "./images.js";

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render("home", { title: "Home", user : req.user});
    });
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/images", imageRoutes);

    // catch-all route for invalid routes
    app.all("*", (req, res) => {
        res.render("error", { title: "404 Page Not Found!", statusCode: 404, errorMessage: "The page you are looking for does not exist." });
    });

    // error middleware
    app.use((err, req, res, next) => {
        res.status(500).render("error", { title: "500 Internal Server Error", statusCode: 500, errorMessage: err.message });
    });
};

export default constructorMethod;