// script.js
// Thought process: Significantly expanded the logic for a more immersive simulation.
// Added: Molecule visualization using SmilesDrawer, bar chart visualizations with Chart.js,
// test history with localStorage, more base compounds, modifier integration, enhanced testing metrics,
// loading simulation for UX, and export functionality.
// All remains fictional; SMILES are hardcoded or simply modified as strings for demo (not chemically accurate).
// Modular functions for clarity and maintainability.

// Predefined base SMILES for realism (hardcoded from known sources).
// Reasoning: Using real SMILES for bases allows visualization; derivatives are simplistic string mods to avoid complexity.
const baseCompounds = {
    'aspirin-like': {
        name: 'Acetylsalicylic acid derivative',
        smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O'
    },
    'penicillin-like': {
        name: 'Beta-lactam antibiotic derivative',
        smiles: 'CC1(C)SC2C(NC(=O)CC3=CC=CC=C3)C(=O)N2C1C(=O)O'
    },
    'ibuprofen-like': {
        name: 'Ibuprofen derivative',
        smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O'
    },
    'custom': {
        name: 'Novel synthetic compound',
        smiles: 'C1CCCCC1'  // Simple cyclohexane as base
    }
};

// Modifier effects on metrics (fictional multipliers).
// Reasoning: Allows user-input modifiers to influence test results realistically.
const modifiersEffects = {
    'anti-inflammatory': { efficacy: 1.2, safety: 0.9, sideEffects: 1.1 },
    'bioavailability': { efficacy: 1.1, safety: 1.2, sideEffects: 0.8 },
    'targeted': { efficacy: 1.3, safety: 1.0, sideEffects: 1.0 }
    // Add more as needed
};

// Function to generate a fictional drug compound.
// Reasoning: Select base, apply user modifiers to name and SMILES (simple append for SMILES, not accurate but for demo).
function generateDrugCompound(baseKey, disease, modifiers) {
    const base = baseCompounds[baseKey];
    let compoundName = base.name;
    let smiles = base.smiles;
    
    // Apply modifiers
    const modList = modifiers.split(',').map(m => m.trim()).filter(m => m);
    modList.forEach(mod => {
        compoundName += ` with ${mod} properties`;
        // Fictional SMILES modification: append a group (e.g., methyl)
        if (mod === 'anti-inflammatory') smiles += 'C';  // Add methyl
        // More could be added, but keep simple to avoid invalid SMILES
    });
    
    if (disease) compoundName += ` targeted at ${disease}`;
    
    return { name: compoundName, smiles: smiles };
}

// Function to simulate drug testing with enhanced metrics.
// Reasoning: Expanded metrics, influenced by modifiers and disease. Random base with adjustments.
// Disease affects efficacy boost for "matching" (fictional logic).
function testDrug(compound, disease, modifiers) {
    let efficacy = Math.floor(Math.random() * 101);
    let safety = Math.floor(Math.random() * 101);
    let sideEffects = Math.floor(Math.random() * 51);
    let potency = Math.floor(Math.random() * 101);
    let toxicity = Math.floor(Math.random() * 51);
    
    // Apply modifier effects
    const modList = modifiers.split(',').map(m => m.trim()).filter(m => m);
    modList.forEach(mod => {
        const effect = modifiersEffects[mod] || { efficacy: 1, safety: 1, sideEffects: 1 };
        efficacy *= effect.efficacy || 1;
        safety *= effect.safety || 1;
        sideEffects *= effect.sideEffects || 1;
    });
    
    // Cap values
    efficacy = Math.min(100, Math.max(0, efficacy));
    safety = Math.min(100, Math.max(0, safety));
    sideEffects = Math.min(50, Math.max(0, sideEffects));
    potency = Math.min(100, Math.max(0, potency));
    toxicity = Math.min(50, Math.max(0, toxicity));
    
    // Disease-specific boost (fictional)
    if (disease.toLowerCase().includes('pain') && baseCompounds['aspirin-like']) efficacy += 10;
    
    // Determine result
    let result = 'Failed';
    if (efficacy > 70 && safety > 80 && sideEffects < 20 && potency > 60 && toxicity < 25) {
        result = 'Passed';
    }
    
    return {
        compound: compound.name,
        smiles: compound.smiles,
        efficacy: efficacy.toFixed(1),
        safety: safety.toFixed(1),
        sideEffects: sideEffects.toFixed(1),
        potency: potency.toFixed(1),
        toxicity: toxicity.toFixed(1),
        result: result
    };
}

// Function to draw molecule using SmilesDrawer.
// Reasoning: Visualizes the SMILES on a canvas for user engagement.
function drawMolecule(smiles, canvasId) {
    let drawer = new SmilesDrawer.Drawer({ width: 400, height: 300 });
    SmilesDrawer.parse(smiles, function(tree) {
        drawer.draw(tree, canvasId, 'light', false);
    }, function(err) {
        console.error('Invalid SMILES:', err);
    });
}

// Function to create chart using Chart.js.
// Reasoning: Bar chart for metrics visualization; enhances data presentation.
function createChart(metrics, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Efficacy', 'Safety', 'Potency'],
            datasets: [{
                label: 'Positive Metrics (%)',
                data: [metrics.efficacy, metrics.safety, metrics.potency],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Negative Metrics (%)',
                data: [metrics.sideEffects, metrics.toxicity, 0],  // Placeholder for alignment
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Function to add to history and save to localStorage.
// Reasoning: Persists data across sessions; table for easy viewing.
function addToHistory(disease, compound, result) {
    let history = JSON.parse(localStorage.getItem('drugHistory')) || [];
    history.push({ disease, compound, result });
    localStorage.setItem('drugHistory', JSON.stringify(history));
    renderHistory();
}

// Function to render history table.
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('drugHistory')) || [];
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';
    history.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.disease}</td><td>${item.compound}</td><td>${item.result}</td>`;
        tbody.appendChild(tr);
    });
}

// Function to clear history.
function clearHistory() {
    localStorage.removeItem('drugHistory');
    renderHistory();
}

// Main function.
// Reasoning: Orchestrates input, generation, testing, output rendering with visuals, and history.
function createAndTestDrug() {
    const disease = document.getElementById('disease').value || 'unspecified condition';
    const base = document.getElementById('compound-base').value;
    const modifiers = document.getElementById('modifiers').value;
    
    // Simulate loading
    document.getElementById('output').innerHTML = '<p>Loading simulation...</p>';
    setTimeout(() => {
        const compound = generateDrugCompound(base, disease, modifiers);
        const testResults = testDrug(compound, disease, modifiers);
        
        // Build output
        const uniqueId = Date.now();
        const canvasId = `molecule-canvas-${uniqueId}`;
        const chartId = `metrics-chart-${uniqueId}`;
        const output = `
            <h2>Generated Drug:</h2>
            <p>${testResults.compound}</p>
            <h3>Molecule Structure:</h3>
            <div class="canvas-container"><canvas id="${canvasId}"></canvas></div>
            <h2>Test Results for ${disease}:</h2>
            <ul>
                <li>Efficacy: ${testResults.efficacy}%</li>
                <li>Safety: ${testResults.safety}%</li>
                <li>Side Effects Severity: ${testResults.sideEffects}%</li>
                <li>Potency: ${testResults.potency}%</li>
                <li>Toxicity: ${testResults.toxicity}%</li>
                <li>Overall: ${testResults.result}</li>
            </ul>
            <h3>Metrics Visualization:</h3>
            <div id="chart-container"><canvas id="${chartId}"></canvas></div>
            <button onclick="exportResults(${JSON.stringify(testResults)})">Export Results</button>
        `;
        
        document.getElementById('output').innerHTML = output;
        
        // Draw molecule and chart
        drawMolecule(testResults.smiles, canvasId);
        createChart(testResults, chartId);
        
        // Add to history
        addToHistory(disease, testResults.compound, testResults.result);
    }, 1500);  // Fake delay for "AI processing"
}

// Function to export results as JSON.
// Reasoning: Allows user to download data for further use.
function exportResults(results) {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drug_test_results.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Load history on start
window.onload = renderHistory;