// main.js
import WORD_API_KEY from "./apiKey.js";

function generatePermutations(inputString) {
    const uniquePermutations = [];

    function generateUniquePermutations(arr, currentIndex, length) {
        if (currentIndex === arr.length - 1) {
            const newPermutation = arr.slice(0, length).join("");
            if (!uniquePermutations.includes(newPermutation)) {
                uniquePermutations.push(newPermutation);
            }
        } else {
            for (let i = currentIndex; i < arr.length; i++) {
                [arr[currentIndex], arr[i]] = [arr[i], arr[currentIndex]];
                generateUniquePermutations([...arr], currentIndex + 1, length);
            }
        }
    }

    for (let length = 3; length <= inputString.length; length++) {
        generateUniquePermutations(inputString.split(""), 0, length);
    }

    return uniquePermutations;
}

async function isValidWord(word) {
    const apiKey = WORD_API_KEY;  // Using the imported API key here
    const url = `https://api.wordnik.com/v4/word.json/${word}/scrabbleScore?api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        
        if (response.status === 200) {
            return true;
        } else if (response.status === 404) {
            return false;
        } else if (response.status === 429) {
            console.warn(`Rate limit exceeded for word "${word}". Pausing before retrying...`);
            await new Promise(resolve => setTimeout(resolve, 4000));
            return await isValidWord(word);
        } else {
            console.error(`Error: Received status ${response.status} for word "${word}"`);
            return false;
        }

    } catch (error) {
        console.error('Error checking word validity:', error);
        return false;
    }
}

// Main function to descramble words and filter valid ones
async function descrambleWords() {
    const input = document.getElementById('scrambledInput').value;
    const combinations = generatePermutations(input); 
    const validWords = [];

    for (const word of combinations) {
        const isValid = await isValidWord(word);
        if (isValid) {
            validWords.push(word);
        }
    }

    const categorizedWords = categorizeByLength(validWords);
    displayResults(categorizedWords);
}

function categorizeByLength(combinations) {
    const categorized = {};
    combinations.forEach(word => {
        const length = word.length;
        if (!categorized[length]) {
            categorized[length] = [];
        }
        categorized[length].push(word);
    });
    return categorized;
}

function displayResults(categorizedWords) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    for (const [length, words] of Object.entries(categorizedWords)) {
        const section = document.createElement('div');
        section.className = 'result-section';

        const header = document.createElement('h2');
        header.textContent = `${length}-Letter Words`; 
        section.appendChild(header);

        const wordList = document.createElement('ul');
        words.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordList.appendChild(listItem);
        });
        section.appendChild(wordList);
        resultsContainer.appendChild(section);
    }
}

document.getElementById('unscrambleButton').addEventListener('click', descrambleWords);
