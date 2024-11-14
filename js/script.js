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

    for (let length = 2; length <= inputString.length; length++) {
        generateUniquePermutations(inputString.split(""), 0, length);
    }

    return uniquePermutations;
}

async function isValidWord(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
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

function updateStats(categorizedWords) {
    let totalWords = 0;
    
    Object.entries(categorizedWords).forEach(([length, words]) => {
        totalWords += words.length;
    });
    
    document.getElementById('totalWords').textContent = totalWords;
}

function toggleLoadingState(isLoading) {
    const buttonText = document.querySelector('.button-text');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const unscrambleButton = document.getElementById('unscrambleButton');
    
    if (isLoading) {
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        unscrambleButton.disabled = true;
    } else {
        buttonText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
        unscrambleButton.disabled = false;
    }
}

async function descrambleWords() {
    const input = document.getElementById('scrambledInput').value.trim().toLowerCase();
    
    toggleLoadingState(true);
    const combinations = generatePermutations(input);
    const validWords = [];
    
    try {
        const batchSize = 5;
        for (let i = 0; i < combinations.length; i += batchSize) {
            const batch = combinations.slice(i, i + batchSize);
            const results = await Promise.all(
                batch.map(word => isValidWord(word))
            );
            
            batch.forEach((word, index) => {
                if (results[index]) {
                    validWords.push(word);
                }
            });
        }

        const categorizedWords = categorizeByLength(validWords);
        displayResults(categorizedWords);
        updateStats(categorizedWords);
    } catch (error) {
        console.error('Error during unscrambling:', error);
        alert('An error occurred while unscrambling. Please try again.');
    } finally {
        toggleLoadingState(false);
    }
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
    
    for (const length in categorized) {
        categorized[length].sort();
    }
    
    return categorized;
}

function displayResults(categorizedWords) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    const lengths = Object.keys(categorizedWords).sort((a, b) => a - b);

    if (lengths.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No valid words found. Try different letters!';
        resultsContainer.appendChild(noResults);
        return;
    }

    lengths.forEach(length => {
        const words = categorizedWords[length];
        const section = document.createElement('div');
        section.className = 'result-section';

        const header = document.createElement('h2');
        header.textContent = `${length}-Letter Words (${words.length})`; 
        section.appendChild(header);

        const wordList = document.createElement('ul');
        words.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordList.appendChild(listItem);
        });
        section.appendChild(wordList);
        resultsContainer.appendChild(section);
    });
}

document.getElementById('scrambledInput').addEventListener('input', (e) => {
    const errorMessage = document.querySelector('.inline-error');
    if (errorMessage) {
        errorMessage.textContent = "";
    }
    
    if (/\d/.test(e.target.value)) {
        const inlineError = document.querySelector('.inline-error');
        inlineError.textContent = "It's called a word unscrambler for a reason";
    }
});

document.getElementById('unscrambleButton').addEventListener('click', descrambleWords);

document.getElementById('scrambledInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        descrambleWords();
    }
});