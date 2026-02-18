document.addEventListener('DOMContentLoaded', () => {
    const rollBtn = document.getElementById('rollBtn');
    const diceContainer = document.getElementById('diceContainer');
    const totalScoreElement = document.getElementById('totalScore');
    const diceCountInput = document.getElementById('diceCount');

    let isRolling = false;

    // Standard dice rotations (unchanged)
    const faceRotations = {
        1: { x: 0, y: 0 },
        6: { x: 0, y: 180 },
        2: { x: 0, y: -90 },
        5: { x: 0, y: 90 },
        3: { x: -90, y: 0 },
        4: { x: 90, y: 0 }
    };

    function createDice() {
        const dice = document.createElement('div');
        dice.className = 'dice';
        // Add faces
        ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(face => {
            const faceDiv = document.createElement('div');
            faceDiv.className = `face ${face}`;
            dice.appendChild(faceDiv);
        });
        return dice;
    }

    function updateDiceCount() {
        let count = parseInt(diceCountInput.value);
        if (count < 1) count = 1;
        if (count > 10) count = 10;
        diceCountInput.value = count;

        diceContainer.innerHTML = '';
        totalScoreElement.textContent = '0';

        for (let i = 0; i < count; i++) {
            const dice = createDice();
            diceContainer.appendChild(dice);
            // Default position (1)
            dice.style.transform = `rotateX(0deg) rotateY(0deg)`;
        }
    }

    // Initialize dice
    updateDiceCount();

    // Listener for dice count change
    diceCountInput.addEventListener('change', updateDiceCount);

    function getRandomFace() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollDice() {
        if (isRolling) return;
        isRolling = true;

        rollBtn.style.opacity = '0.7';
        rollBtn.style.cursor = 'default';

        const diceElements = document.querySelectorAll('.dice');
        let currentTotal = 0;
        let animationCompleteCount = 0;

        diceElements.forEach((dice, index) => {
            // Slight delay for each dice to feel more organic
            setTimeout(() => {
                const result = getRandomFace();
                currentTotal += result;

                const extraRotations = 5;
                const rot = faceRotations[result];

                // Random variation
                const xRand = (Math.floor(Math.random() * 4) + extraRotations) * 360;
                const yRand = (Math.floor(Math.random() * 4) + extraRotations) * 360;

                dice.style.transform = `rotateX(${rot.x + xRand}deg) rotateY(${rot.y + yRand}deg)`;
            }, index * 50); // cascading start
        });

        // Calculate time until all are done
        // Base transition is 1s, plus the last dice's delay
        const totalTime = 1000 + (diceElements.length * 50);

        setTimeout(() => {
            isRolling = false;
            rollBtn.style.opacity = '1';
            rollBtn.style.cursor = 'pointer';

            totalScoreElement.textContent = currentTotal;
            totalScoreElement.style.transform = 'scale(1.5)';
            setTimeout(() => {
                totalScoreElement.style.transform = 'scale(1)';
            }, 200);

        }, totalTime);
    }

    rollBtn.addEventListener('click', rollDice);
});
