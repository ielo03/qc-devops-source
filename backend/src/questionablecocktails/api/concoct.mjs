import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../../../environment.mjs";
import mysql from "mysql2/promise";

async function insertRecipe(title, recipe) {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: env.db.host,
            port: env.db.port,
            user: env.db.user,
            password: env.db.password,
            database: env.db.database,
        });
        console.log("Successfully connected to the DB");

        // Optional: Test retrieving data from the recipes table
        const result = await connection.execute('INSERT INTO recipes (title, recipe) VALUES (?, ?)',
            [title, recipe]);
        console.log(result);
        return true;
    } catch (error) {
        console.error("DB connection failed:", error);
        return false;
    } finally {
        if (connection) await connection.end();
    }
    return false;
}

// Configure the API key
const genAI = new GoogleGenerativeAI(env.genai.geminiAPIKey);

// Define the model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", temperature: 0.9, top_p: 0.85 });

const post = async (req, res) => {
    const data = req.body;
    const ingredients = data.ingredients || '';
    const drink = data.drink || '';

    const recipe = await generateCocktails(ingredients, drink);

    const match = recipe.match(/^<h3>(.*?)<\/h3>/);
    const title = match ? match[1] : null;

    if (!title) {
        console.log("No title found");
        return res.status(500).json({error: "Recipe generation failed."});
    }

    if (!await insertRecipe(title, recipe)) {
        console.log("Database insert failed.")
    }

    return res.status(200).json({title, recipe});
};

export default {
    post
}

const cocktailPrompts = [
    "Create a cocktail that tells a story through its flavors and presentation.",
    "Design a cocktail inspired by a specific season or weather condition.",
    "Invent a cocktail that combines unexpected flavor combinations.",
    "Create a cocktail that showcases a particular spirit in an innovative way.",
    "Design a cocktail inspired by a specific cuisine or culinary tradition.",
    "Create a cocktail that features herbs and spices in unique ways.",
    "Invent a cocktail that plays with temperature or texture contrasts.",
    "Design a cocktail that incorporates fresh fruit in an unexpected manner.",
    "Create a cocktail that puts a twist on a classic preparation method.",
    "Design a cocktail that features interesting garnish techniques.",
    "Create a cocktail inspired by a particular color palette.",
    "Invent a cocktail that combines sweet and savory elements.",
    "Design a cocktail that uses unusual mixing techniques.",
    "Create a cocktail that features layers of complementary flavors.",
    "Invent a cocktail that focuses on aromatic elements.",
    "Create a cocktail that tells a story through its origin or naming history.",
    "Design a cocktail perfect for brunch settings.",
    "Create a non-alcoholic cocktail inspired by tropical flavors.",
    "Invent a cocktail that incorporates floral or botanical notes.",
    "Design a cocktail with a smoky or charred flavor profile.",
    "Create a dessert-inspired cocktail using sweet ingredients.",
    "Invent a cocktail paying homage to a famous historical figure.",
    "Design a cocktail based on a festive or holiday theme.",
    "Create a cocktail paired with a specific type of appetizer or snack.",
    "Invent a cocktail showcasing regional or local spirits.",
    "Design a cocktail incorporating caffeinated elements like coffee or tea.",
    "Create a cocktail with a focus on visual aesthetics and presentation.",
    "Invent a cocktail suited for outdoor summer gatherings.",
    "Design a cocktail that reflects minimalist simplicity in ingredients.",
    "Create a cocktail using only fermented ingredients.",
    "Invent a cocktail that combines traditional and modern mixology techniques.",
    "Create a high-energy cocktail for late-night celebrations.",
    "Design a cocktail inspired by a specific place, such as a city or landmark.",
    "Invent a cocktail that uses homemade syrups or infusions.",
    "Create a cocktail focusing on natural and eco-friendly ingredients.",
    "Design a cocktail that incorporates edible flowers for both flavor and garnish.",
    "Invent a cocktail inspired by a song, album, or genre of music.",
    "Create a cocktail that pays tribute to a popular movie or TV show.",
    "Design a summer spritz using unconventional ingredients.",
    "Invent a cocktail that mirrors the flavors and emotions of a specific memory.",
    "Create a cocktail showcasing a single dominant flavor profile.",
    "Design a cocktail intended for a romantic evening."
];

// Function to generate cocktails
export async function generateCocktails(ingredients, drinkType) {
    let prompt;

    if (ingredients && ingredients.length) {
        prompt = `
Your task is to suggest a cocktail recipe using only the following ingredients: ${ingredients}. Even if it is not possible
to create a drink with the given ingredients or the drink will be disgusting, you are required to make some sort of cocktail. You do not need to use all the ingredients,
    and you cannot use ingredients that weren't listed.
${drinkType !== 'none' ? " Make it as similar as possible to or a variation of " + drinkType + "." : ""}

Format your response to be HTML-friendly, NOT the full html document, with the following structure:

    1. Wrap the cocktail name in an <h3> tag.
    2. Provide a brief description of the cocktail in a <p> tag.${drinkType !== 'none' ? " Include how it will taste compared to a " + drinkType + "." : ""}
    3. List the ingredients using an unordered list (<ul>), with each ingredient in a <li> tag.
    4. Use a <strong> tag for the "Ingredients" and "Instructions" headings.
    5. Anything requiring extra emphasis should be in a <strong> tag, NOT **
    6. Provide the instructions as an ordered list (<ol>), with each step in a <li> tag.
    7. Make sure you label the ingredients section and the instructions section in <h4> tags.
    8. Only use the provided ingredients.
`;
    } else {
        const randomPrompt = cocktailPrompts[Math.floor(Math.random() * cocktailPrompts.length)];

        prompt = `
${drinkType !== 'none'
            ? "I don't have any specific ingredients on hand, but I'd like to make a " + drinkType +
            ". Please suggest a standard recipe for a " + drinkType +
            " using common ingredients. Assume that all necessary ingredients are available."
            : randomPrompt}

Format your response to be HTML-friendly, NOT the full html document, with the following structure:

    1. Wrap the cocktail name in an <h3> tag.
    2. Provide a brief description of the cocktail in a <p> tag.
    3. List the ingredients using an unordered list (<ul>), with each ingredient in a <li> tag.
    5. Anything requiring extra emphasis should be in a <strong> tag, NOT **
    6. Provide the instructions as an ordered list (<ol>), with each step in a <li> tag.
    7. Make sure you label the ingredients section and the instructions section in <h4> tags.
`;
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        const startIndex = text.indexOf('<h3>');
        if (startIndex !== -1) {
            text = text.substring(startIndex);
        }

        const endIndex = text.lastIndexOf('>');
        if (endIndex !== -1) {
            text = text.substring(0, endIndex + 1);
        }

        return text.trim();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}