const get = (req, res) => {
    return res.render("questionablecocktailsHome", {
        style: "/styles/questionablecocktails.css",
        script: "/scripts/questionablecocktailsHome.js",
        title: "Questionable Cocktails",
    });
};

export default {
    get
};