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

function descrambleWords() {
    const input = document.getElementById('scrambledInput').value;
    const combinations = generatePermutations(input);
    const categorizedWords = categorizeByLength(combinations);
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
