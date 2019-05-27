var mongoose = require('mongoose');
var Ingredient = mongoose.model('ingredient');

/**
 * Convert an ingredient quantity for a target serving size
 * 
 * @param {{text: String, quantity: String}} ingredient 
 * @param {*} originalSize 
 * @param {*} targetSize 
 */
function convertQuantity(ingredient, originalSize, targetSize) {
    let oldQuantity = parseFloat(ingredient.quantity);
    let newQuantity = oldQuantity * (targetSize / originalSize);
    let decimalDigits = Math.log10(newQuantity) > 1 ? 0 : 2;

    let quantityText = parseFloat(newQuantity).toFixed(decimalDigits);
    // Format decimals as fractions
    for (let f1 = 1; f1 < 32; ++f1) {
        for (let f2 = 1; f2 < f1; ++f2) {
            let search = parseFloat(f2 / f1).toFixed(decimalDigits);
            if (search.startsWith("0.")) {
                search = search.substring(1);
                let rep = " " + f2 + "/" + f1;
                quantityText = quantityText.replace(search, rep);
            }
        }
    }

    // Remove trailing zeros
    if (quantityText.includes(".")) {
        while (quantityText.endsWith("0") || quantityText.endsWith(".")) {
            quantityText = quantityText.substring(0, quantityText.length - 1);
        }
    }

    // Remove leading zeros
    while (quantityText.startsWith("0") || quantityText.startsWith(" ")) {
        quantityText = quantityText.substring(1, quantityText.length);
    }

    // Add leading zero for decimal
    if (quantityText.startsWith(".")) {
        quantityText = "0" + quantityText;
    }

    // Format modified quantities
    quantityText = "<span class=\"ingredient-quantity-serving\">" + quantityText + "</span>";

    // Split by word and format
    let removeIndices = [];
    let words = ingredient.text.split(" ");
    for (let wordIndex = 0; wordIndex < words.length; ++wordIndex) {
        let wordNumber = parseFloat(words[wordIndex]);
        let originalText = wordNumber;
        // Handle fractions
        let fractions = words[wordIndex].split("/");
        let fractionIsMixed = false;
        if (fractions.length === 2) {
            let num1 = parseFloat(fractions[0]);
            let num2 = parseFloat(fractions[1]);
            if (num1 && num2) {
                // Set original text
                originalText = num1 + "/" + num2;
                // Handle mixed fractions
                if (wordIndex > 0) {
                    let lastWord = words[wordIndex - 1];
                    let lastWordNumber = parseFloat(lastWord);
                    if (lastWordNumber) {
                        num1 += lastWordNumber * num2;
                        fractionIsMixed = true;
                    }
                }

                wordNumber = parseFloat(num1 / num2);
            }
        }

        if (wordNumber) {
            if (Math.abs(wordNumber - oldQuantity) <= (1 / decimalDigits)) {
                // Replace old quantity with new one
                words[wordIndex] = words[wordIndex].replace(originalText, quantityText);
                // Remove previous word if mixed fraction
                if (fractionIsMixed) {
                    removeIndices.push(wordIndex - 1);
                }
            }
        }
    }

    // Remove marked indices
    removeIndices.forEach((i) => {
        words.splice(i, 1);
    });

    return words.join(" ");
}

function getIngredients(req, res) {
    Ingredient.find({}).sort({ name: 1 }).exec((err, ingredients) => {
        if (!err) {
            res.json(ingredients.map((i) => { return i.name }))
        } else {
            res.sendStatus(500);
            console.log(err);
        }
    });
};

function getIngredientInfo(req, res) {
    Ingredient.findOne({ "name": req.params.name }, (err, ingredient) => {
        if (!err) {
            if (ingredient) {
                res.json(ingredient);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(500);
        }
    });
}

module.exports = {
    getIngredients: getIngredients,
    getIngredientInfo: getIngredientInfo,
    convertQuantity: convertQuantity
}
