document.addEventListener('DOMContentLoaded', () => {
    const minInput = document.getElementById('minInput');
    const maxInput = document.getElementById('maxInput');
    const drawBtn = document.getElementById('drawBtn');
    const resultDisplay = document.getElementById('randomNumber');
    const historyList = document.getElementById('historyList');

    let isAnimating = false;

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addToHistory(number) {
        const item = document.createElement('span');
        item.className = 'history-item';
        item.textContent = number;

        // Add to beginning
        if (historyList.firstChild) {
            historyList.insertBefore(item, historyList.firstChild);
        } else {
            historyList.appendChild(item);
        }

        // Limit history to 5 items
        if (historyList.children.length > 8) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    function drawNumber() {
        if (isAnimating) return;

        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);

        if (isNaN(min) || isNaN(max)) {
            alert('Por favor, insira números válidos.');
            return;
        }

        if (min >= max) {
            alert('O valor mínimo deve ser menor que o máximo.');
            return;
        }

        isAnimating = true;
        drawBtn.disabled = true;
        drawBtn.style.opacity = '0.7';

        // Animation effect: cycle through numbers quickly
        let counter = 0;
        const duration = 1500; // ms
        const intervalTime = 50;
        const iterations = duration / intervalTime;

        const interval = setInterval(() => {
            // Show random number during animation
            resultDisplay.textContent = getRandomInt(min, max);
            resultDisplay.style.transform = `scale(${1 + Math.random() * 0.1})`;

            counter++;
            if (counter >= iterations) {
                clearInterval(interval);
                finalizeDraw(min, max);
            }
        }, intervalTime);
    }

    function finalizeDraw(min, max) {
        const finalNumber = getRandomInt(min, max);
        resultDisplay.textContent = finalNumber;
        resultDisplay.style.transform = 'scale(1.5)';
        resultDisplay.style.color = '#fff';
        resultDisplay.style.textShadow = '0 0 20px var(--primary)';

        addToHistory(finalNumber);

        setTimeout(() => {
            resultDisplay.style.transform = 'scale(1)';
            resultDisplay.style.color = '';
            resultDisplay.style.textShadow = '';
            isAnimating = false;
            drawBtn.disabled = false;
            drawBtn.style.opacity = '1';
        }, 300);
    }

    drawBtn.addEventListener('click', drawNumber);
});
