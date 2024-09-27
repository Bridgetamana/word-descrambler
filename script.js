function generatePermutations(inputString) {
    const uniquePermutations = [];

    function generateUniquePermutations(arr, currentIndex) {
        if (currentIndex === arr.length - 1) {
            uniquePermutations.push(arr.join(""));
        } else {
            for (let i = currentIndex; i < arr.length; i++) {
                [arr[currentIndex], arr[i]] = [arr[i], arr[currentIndex]];
                generateUniquePermutations([...arr], currentIndex + 1);
            }
        }
    }

    generateUniquePermutations(inputString.split(""), 0);
    return uniquePermutations;
}



function descrambleWords() {
    const input = document.getElementById('scrambledInput').value;
    const combinations = generatePermutations(input);
    displayResults(combinations);
}

function displayResults(combinations) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    const wordList = document.createElement('ul');
    combinations.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        wordList.appendChild(listItem);
    });
    resultsContainer.appendChild(wordList);
}

document.getElementById('unscrambleButton').addEventListener('click', descrambleWords);
