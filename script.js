document.addEventListener('DOMContentLoaded', () => {
    const rollBtn = document.getElementById('rollBtn');
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const totalScoreElement = document.getElementById('totalScore');

    let isRolling = false;

    // Map face values to rotation degrees (x, y)
    // Front: 1 (0,0)
    // Back: 6 (0, 180)
    // Right: 2 (0, -90) - Wait, standard dice are:
    // 1 opposite 6
    // 2 opposite 5
    // 3 opposite 4

    // Previous CSS:
    // Front (1) -> translateZ
    // Back (6) -> rotateY(180)
    // Right (2) -> rotateY(90)
    // Left (5) -> rotateY(-90)
    // Top (3) -> rotateX(90)
    // Bottom (4) -> rotateX(-90)

    // So to show face X, we need to rotate the DICE container opposite to the face transform
    // If face is Right (rotateY 90), we rotate dice Y -90.

    const faceRotations = {
        1: { x: 0, y: 0 },
        6: { x: 0, y: 180 },
        2: { x: 0, y: -90 },
        5: { x: 0, y: 90 },
        3: { x: -90, y: 0 },
        4: { x: 90, y: 0 }
    };

    function getRandomFace() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollDice() {
        if (isRolling) return;
        isRolling = true;

        // Play sound if we had one, for now just UI visual
        rollBtn.style.opacity = '0.7';
        rollBtn.style.cursor = 'default';

        const result1 = getRandomFace();
        const result2 = getRandomFace();

        // Add random full rotations to make it spin wildy
        const extraRotations = 5; // number of full spins

        const rot1 = faceRotations[result1];
        const rot2 = faceRotations[result2];

        // Randomize direction of extra spins slightly
        const xRand1 = (Math.floor(Math.random() * 4) + extraRotations) * 360;
        const yRand1 = (Math.floor(Math.random() * 4) + extraRotations) * 360;

        const xRand2 = (Math.floor(Math.random() * 4) + extraRotations) * 360;
        const yRand2 = (Math.floor(Math.random() * 4) + extraRotations) * 360;

        dice1.style.transform = `rotateX(${rot1.x + xRand1}deg) rotateY(${rot1.y + yRand1}deg)`;
        dice2.style.transform = `rotateX(${rot2.x + xRand2}deg) rotateY(${rot2.y + yRand2}deg)`;

        // Update score after animation
        setTimeout(() => {
            isRolling = false;
            rollBtn.style.opacity = '1';
            rollBtn.style.cursor = 'pointer';

            // Pop effect on score
            totalScoreElement.style.transform = 'scale(1.5)';
            totalScoreElement.textContent = result1 + result2;
            setTimeout(() => {
                totalScoreElement.style.transform = 'scale(1)';
            }, 200);

        }, 1000); // Wait for transition
    }

    rollBtn.addEventListener('click', rollDice);

    // Initial random roll without animation delay on load
    // dice1.style.transition = 'none';
    // dice2.style.transition = 'none';
    // rollDice();
    // setTimeout(() => {
    //     dice1.style.transition = '';
    //     dice2.style.transition = '';
    // }, 100);
});
