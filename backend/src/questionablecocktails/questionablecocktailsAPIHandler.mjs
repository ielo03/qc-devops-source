import concoct from "./api/concoct.mjs";
import recipes from "./api/recipes.mjs";

const questionablecocktailsAPIHandler = (req, res) => {
    const route = decodeURIComponent(req.params.path);

    switch (`${req.method.toUpperCase()}/${route}`) {
        case 'POST/concoct': {
            return concoct.post(req, res);
        }

        case 'GET/recipes': {
            return recipes.get(req, res);
        }

        default: {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not Found' }));
        }
    }
};

export default questionablecocktailsAPIHandler;