document.addEventListener('DOMContentLoaded', () => {
    const rollBtn = document.getElementById('rollBtn');
    const diceContainer = document.getElementById('diceContainer');
    const totalScoreElement = document.getElementById('totalScore');
    const diceCountInput = document.getElementById('diceCount');

    let isRolling = false;

    // Standard dice rotations
    const faceRotations = {
        1: { x: 0, y: 0 },
        6: { x: 0, y: 180 },
        2: { x: 0, y: -90 },
        5: { x: 0, y: 90 },
        3: { x: -90, y: 0 },
        4: { x: 90, y: 0 }
    };

    function createDice() {
        // Create dice wrapper
        const diceInfo = document.createElement('div');
        diceInfo.className = 'dice-wrapper';

        const dice = document.createElement('div');
        dice.className = 'dice';

        ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach((face, index) => {
            const faceDiv = document.createElement('div');

            // Map face names to classes correctly
            // Order doesn't strictly matter for visuals as long as CSS matches
            // logic above relies on these class names
            faceDiv.className = `face ${face}`;
            dice.appendChild(faceDiv);
        });

        return dice;
    }

    function updateDiceDisplay() {
        let count = parseInt(diceCountInput.value);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 10) count = 10;

        // Only update if number changed to avoid resetting positions unnecessarily
        // But for simplicity/robustness, we rebuild on change
        diceContainer.innerHTML = '';
        totalScoreElement.textContent = '0';

        for (let i = 0; i < count; i++) {
            const dice = createDice();
            diceContainer.appendChild(dice);
        }
    }

    // Initialize
    updateDiceDisplay();

    diceCountInput.addEventListener('change', updateDiceDisplay);
    diceCountInput.addEventListener('input', updateDiceDisplay); // for slider feel if type=range

    function getRandomFace() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollDice() {
        if (isRolling) return;
        isRolling = true;

        rollBtn.disabled = true;
        rollBtn.style.opacity = '0.7';
        rollBtn.style.cursor = 'default';

        const diceElements = document.querySelectorAll('.dice');
        let finalTotal = 0;
        let completedDice = 0;

        diceElements.forEach((dice, index) => {
            // Determine result first
            const result = getRandomFace();
            finalTotal += result;

            // Randomize rotations
            const xRot = faceRotations[result].x;
            const yRot = faceRotations[result].y;

            // Add extra spins (min 3, max 6 full rotations)
            const extraSpins = 3 + Math.floor(Math.random() * 3);

            // Randomize spin direction
            const xDir = Math.random() > 0.5 ? 1 : -1;
            const yDir = Math.random() > 0.5 ? 1 : -1;

            const totalX = xRot + (extraSpins * 360 * xDir);
            const totalY = yRot + (extraSpins * 360 * yDir);

            // Add slight random offset to prevent perfect alignment during spin
            const randomOffset = Math.random() * 30 - 15;

            // Apply transform
            // We use a timeout to stagger the start slightly
            setTimeout(() => {
                dice.style.transition = 'transform 1.5s cubic-bezier(0.1, 0.9, 0.2, 1.0)';
                dice.style.transform = `rotateX(${totalX}deg) rotateY(${totalY}deg)`;
            }, index * 50);
        });

        // Wait for all animations
        setTimeout(() => {
            isRolling = false;
            rollBtn.disabled = false;
            rollBtn.style.opacity = '1';
            rollBtn.style.cursor = 'pointer';

            // Show score
            totalScoreElement.textContent = finalTotal;
            totalScoreElement.style.transform = 'scale(1.5)';
            totalScoreElement.style.color = '#fff';
            totalScoreElement.style.textShadow = '0 0 20px var(--primary)';

            setTimeout(() => {
                totalScoreElement.style.transform = 'scale(1)';
                totalScoreElement.style.color = '';
                totalScoreElement.style.textShadow = '';
            }, 300);

        }, 1500 + (diceElements.length * 50));
    }

    rollBtn.addEventListener('click', rollDice);
});
