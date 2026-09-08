// =========================================================================
// 1. INITIALIZE ENGINE CANVAS
// =========================================================================
kaplay({
    background: "#201a30", // Bright neon purple educational background
    width: 800,
    height: 600,
})

let score = 0;
let currentTargetCount = 0;

// Setup interface metric labels
const scoreLabel = add([
    text(`Score: ${score}`, { size: 24 }),
    pos(24, 24),
])

const promptLabel = add([
    text("How many dots can you count?", { size: 28 }),
    pos(400, 80),
    anchor("center"),
    color(255, 255, 100) // Bright yellow prompt text
])

// =========================================================================
// 2. FLASHCARD GENERATOR ENGINE (Draws visual counting objects)
// =========================================================================
function generateCountingFlashcard() {
    // Wipe out the old round's dots and button tiles
    destroyAll("flashcard-dot");
    destroyAll("selector-button");

    // 1. Pick a random number of items for the child to count (1 to 6)
    currentTargetCount = randi(1, 7);

    // 2. Render a large, clean white flashcard plate background using a vector block
    add([
        rect(460, 220, { radius: 16 }),
        pos(400, 240),
        color(255, 255, 255),
        outline(6, "#ffaa00"), // Thick playful orange border outline
        anchor("center"),
        "flashcard-dot"
    ]);

    // 3. Arrange the counting dots in a neat grid pattern inside the card frame
    for (let i = 0; i < currentTargetCount; i++) {
        // Grid spacing math to handle columns and rows cleanly
        const col = i % 3; 
        const row = Math.floor(i / 3);
        
        const dotX = 310 + col * 90;
        const dotY = 195 + row * 90;

        // Render a bright, friendly counting circle object inside the frame window
        add([
            circle(28),
            pos(dotX, dotY),
            color(255, 60, 100), // Vibrant neon coral/red dots
            outline(4, "#ffffff"),
            anchor("center"),
            "flashcard-dot"
        ]);
    }

    // 4. Generate the clickable answer options button layout panel at the bottom
    generateAnswerOptions(currentTargetCount);
}

// =========================================================================
// 3. ANSWER OPTIONS SELECTION LAYOUT
// =========================================================================
function generateAnswerOptions(correctAnswer) {
    // Generate an absolute pool of choices including the answer and random numbers
    let optionsSet = new Set([correctAnswer]);
    while (optionsSet.size < 4) {
        optionsSet.add(randi(1, 7)); // Fill up to 4 unique button options
    }

    const shuffledChoices = shuffle(Array.from(optionsSet));

    shuffledChoices.forEach((numValue, index) => {
        const btnX = 145 + index * 170;
        const btnY = 480;

        // Interactive button container plate
        const btn = add([
            rect(120, 70, { radius: 12 }),
            pos(btnX, btnY),
            color(0, 180, 255), // Bright celestial blue button panels
            outline(4, "#ffffff"),
            area(),
            anchor("center"),
            "selector-button"
        ]);

        // Centered button typography number overlay string
        add([
            text(numValue.toString(), { size: 32 }),
            pos(btnX, btnY),
            anchor("center"),
            color(255, 255, 255),
            "selector-button"
        ]);

        // Evaluate click event callback correctness triggers
        btn.onClick(() => {
            if (numValue === correctAnswer) {
                burp(); // Fun built-in celebratory win sound trigger
                score += 10;
                scoreLabel.text = `Score: ${score}`;
                
                // Instantly update the card canvas layout grid with a brand new challenge
                generateCountingFlashcard();
            } else {
                shake(10); // Shake game field layout if wrong option is tapped
            }
        });
    });
}

// =========================================================================
// 4. START THE APPLICATION LOGIC LOOP
// =========================================================================
generateCountingFlashcard();
