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
        const dice = document.createElement('div');
        dice.className = 'dice';

        // Face classes order must match our rotation logic expectations
        // Front (1), Back (6), Right (2), Left (5), Top (3), Bottom (4)
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

        faces.forEach(face => {
            const faceDiv = document.createElement('div');
            faceDiv.className = `face ${face}`;
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
        let completedAnimations = 0;

        diceElements.forEach((dice, index) => {
            // Determine result
            const result = getRandomFace();
            finalTotal += result;

            // Target rotation for this face
            // To show Face X, we need to rotate to its inverse
            // Logic:
            // 1 (Front) -> 0,0
            // 6 (Back) -> 180, 0 (or 0, 180)
            // 2 (Right) -> 0, -90
            // 5 (Left) -> 0, 90
            // 3 (Top) -> -90, 0
            // 4 (Bottom) -> 90, 0

            // Standard map
            const target = { x: 0, y: 0 };
            switch (result) {
                case 1: target.x = 0; target.y = 0; break;
                case 6: target.x = 180; target.y = 0; break;
                case 2: target.x = 0; target.y = -90; break;
                case 5: target.x = 0; target.y = 90; break;
                case 3: target.x = -90; target.y = 0; break;
                case 4: target.x = 90; target.y = 0; break;
            }

            // Add extra spins for animation
            // Multiples of 360 ensure we land on the same orientation relative to target
            const extraX = (3 + Math.floor(Math.random() * 3)) * 360;
            const extraY = (3 + Math.floor(Math.random() * 3)) * 360;

            // Apply unique rotation to each dice
            const finalX = target.x + extraX;
            const finalY = target.y + extraY;

            // Stagger animations
            setTimeout(() => {
                dice.style.transition = 'transform 1.5s cubic-bezier(0.15, 0.9, 0.3, 1.2)';
                dice.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;
            }, index * 100);
        });

        // Finish up after all animations are done
        const totalDuration = 1500 + (diceElements.length * 100);

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

        }, totalDuration);
    }

    rollBtn.addEventListener('click', rollDice);
});
