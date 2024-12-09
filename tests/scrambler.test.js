beforeAll(() => {
  document.body.innerHTML = `
    <input type="text" id="scrambledInput" />
    <button id="unscrambleButton">Unscramble</button>
    <div class="inline-error"></div>
    <div id="totalWords"></div>
    <div id="resultsContainer"></div>
  `;

  require('../js/script');
});


describe('Input Event', () => {
  test('should clear the error message when input is updated', () => {
    const input = document.getElementById('scrambledInput');
    const errorMessage = document.querySelector('.inline-error');
    
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    
    expect(errorMessage.textContent).toBe('');
  });
});

describe('Button Click', () => {
  test('should trigger descrambleWords function on button click', () => {
    const button = document.getElementById('unscrambleButton');
    const mockFunction = jest.fn();
    button.addEventListener('click', mockFunction);

    button.click();

    expect(mockFunction).toHaveBeenCalled();
  });
});
