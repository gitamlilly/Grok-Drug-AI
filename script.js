// script.js
// Thought process: This script handles the logic for simulating drug creation and testing.
// We use JavaScript for client-side execution, keeping it simple and local.
// No real AI/ML is used; instead, we simulate with random generation for educational demo.
// Functions are modular: one for generating a fictional compound, one for simulating tests.
// Comments explain each part's reasoning.

// Function to generate a fictional drug compound based on inputs.
// Reasoning: We create a simple string representation of a "drug" using base + modifiers.
// This mimics drug design but is entirely fictional to avoid any real-world implications.
function generateDrugCompound(base, disease) {
    // Base compounds are predefined for simplicity.
    const bases = {
        'aspirin-like': 'Acetylsalicylic acid derivative',
        'penicillin-like': 'Beta-lactam antibiotic derivative',
        'custom': 'Novel synthetic compound'
    };
    
    // Add random modifiers to simulate variation.
    // Reasoning: Randomness adds "AI" feel without complexity; use Math.random for demo.
    const modifiers = [' with anti-inflammatory properties', ' enhanced for bioavailability', ' targeted at ' + disease];
    const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    
    return bases[base] + randomModifier;
}

// Function to simulate drug testing.
// Reasoning: Generate random scores for efficacy, safety, etc., to mimic clinical trials.
// Thresholds determine pass/fail; this is purely simulated data.
function testDrug(compound, disease) {
    // Simulate test metrics with random values between 0-100.
    // Reasoning: Randomness represents variability in testing; no real computation needed.
    const efficacy = Math.floor(Math.random() * 101);
    const safety = Math.floor(Math.random() * 101);
    const sideEffects = Math.floor(Math.random() * 51); // Lower range for realism.
    
    // Determine overall result based on thresholds.
    // Reasoning: Simple if-else for decision-making; educates on basic testing criteria.
    let result = 'Failed';
    if (efficacy > 70 && safety > 80 && sideEffects < 20) {
        result = 'Passed';
    }
    
    return {
        compound: compound,
        efficacy: efficacy,
        safety: safety,
        sideEffects: sideEffects,
        result: result
    };
}

// Main function triggered by button.
// Reasoning: Ties everything together; gets user input, processes, displays output.
// Uses DOM manipulation for dynamic update without page reload.
function createAndTestDrug() {
    const disease = document.getElementById('disease').value || 'unspecified condition';
    const base = document.getElementById('compound-base').value;
    
    // Generate and test.
    const compound = generateDrugCompound(base, disease);
    const testResults = testDrug(compound, disease);
    
    // Build output HTML.
    // Reasoning: Use template literals for readable HTML insertion.
    const output = `
        <h2>Generated Drug:</h2>
        <p>${testResults.compound}</p>
        <h2>Test Results for ${disease}:</h2>
        <ul>
            <li>Efficacy: ${testResults.efficacy}%</li>
            <li>Safety: ${testResults.safety}%</li>
            <li>Side Effects Severity: ${testResults.sideEffects}%</li>
            <li>Overall: ${testResults.result}</li>
        </ul>
    `;
    
    document.getElementById('output').innerHTML = output;
}