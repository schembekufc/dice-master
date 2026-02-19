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
        diceInfo.className = 'dice-wrapper'; // Just a placeholder for strict structure if needed

        const dice = document.createElement('div');
        dice.className = 'dice';

        // Random premium colors
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        dice.style.setProperty('--dice-color', randomColor);
        dice.style.setProperty('--dot-color', '#ffffff'); // White dots look better on colored dice
        dice.style.setProperty('--face-border', 'rgba(0,0,0,0.1)'); // Softer border

        // Face classes order must match our rotation logic expectations
        // Front (1), Back (6), Right (2), Left (5), Top (3), Bottom (4)
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

        faces.forEach(function (face) {
            const faceDiv = document.createElement('div');
            faceDiv.className = 'face ' + face;
            dice.appendChild(faceDiv);
        });

        return dice;
    }

    function updateDiceCount() {
        let count = parseInt(diceCountInput.value);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 10) {
            count = 10;
            diceCountInput.value = 10;
        }

        // Clear existing
        diceContainer.innerHTML = '';
        totalScoreElement.textContent = '0';

        for (let i = 0; i < count; i++) {
            const dice = createDice();
            diceContainer.appendChild(dice);
            // Set initial state
            dice.style.transform = `rotateX(0deg) rotateY(0deg)`;
        }
    }

    // Initialize
    updateDiceCount();

    // Listen for changes
    diceCountInput.addEventListener('change', updateDiceCount);
    diceCountInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') updateDiceCount();
    });

    function getRandomFace() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollDice() {
        if (isRolling) return;

        const diceElements = document.querySelectorAll('.dice');
        if (diceElements.length === 0) return;

        isRolling = true;
        rollBtn.disabled = true;
        rollBtn.style.opacity = '0.7';
        rollBtn.style.cursor = 'default';

        let finalTotal = 0;

        // Minimum animation time 2s, plus stagger
        const baseDuration = 2000;

        diceElements.forEach((dice, index) => {
            // Get current rotation or default to 0
            // We store these as integers in the dataset to avoid parsing complex transform strings
            let currentX = parseFloat(dice.dataset.rotateX || 0);
            let currentY = parseFloat(dice.dataset.rotateY || 0);

            // Determine result
            const result = getRandomFace();
            finalTotal += result;

            // Target face base rotation (0-360 range approximately)
            // 1 (Front): 0,0
            // 6 (Back): 180,0
            // 2 (Right): 0,-90
            // 5 (Left): 0,90
            // 3 (Top): -90,0
            // 4 (Bottom): 90,0
            let targetX = 0;
            let targetY = 0;
            switch (result) {
                case 1: targetX = 0; targetY = 0; break;
                case 6: targetX = 180; targetY = 0; break;
                case 2: targetX = 0; targetY = -90; break;
                case 5: targetX = 0; targetY = 90; break;
                case 3: targetX = -90; targetY = 0; break;
                case 4: targetX = 90; targetY = 0; break;
            }

            // Calculate 'gap' to get from current modulus position to target
            // We want to move forward (positive) generally
            const modX = currentX % 360;
            const modY = currentY % 360;

            let diffX = targetX - modX;
            let diffY = targetY - modY;

            // Normalize diff to be standard shortest path or just path forward?
            // To ensure "spin", we add huge multiples of 360.
            // But we need to make sure the end result % 360 === target.

            // Add minimum 5 full spins (5 * 360 = 1800 degrees)
            // Add random extra spins (0-3)
            const minSpins = 5;
            const extraSpins = Math.floor(Math.random() * 3);
            const totalAdd = (minSpins + extraSpins) * 360;

            const newX = currentX + totalAdd + diffX;
            const newY = currentY + totalAdd + diffY;

            // Store for next time
            dice.dataset.rotateX = newX;
            dice.dataset.rotateY = newY;

            // Apply transform with random staggering for start
            setTimeout(() => {
                // Ensure duration is always > 2s
                dice.style.transition = `transform ${baseDuration / 1000}s cubic-bezier(0.2, 0.8, 0.2, 1.1)`;
                dice.style.transform = `rotateX(${newX}deg) rotateY(${newY}deg)`;
            }, index * 50);
        });

        // Finish up after all animations are done + buffer
        const totalWait = baseDuration + (diceElements.length * 50) + 100;

        setTimeout(() => {
            isRolling = false;
            rollBtn.disabled = false;
            rollBtn.style.opacity = '1';
            rollBtn.style.cursor = 'pointer';

            // Display score with pop effect
            totalScoreElement.textContent = finalTotal;
            totalScoreElement.style.transform = 'scale(1.5)';
            totalScoreElement.style.color = '#fff';
            totalScoreElement.style.textShadow = '0 0 20px var(--primary)';

            setTimeout(() => {
                totalScoreElement.style.transform = 'scale(1)';
                totalScoreElement.style.color = '';
                totalScoreElement.style.textShadow = '';
            }, 300);

        }, totalWait);
    }

    rollBtn.addEventListener('click', rollDice);
});
