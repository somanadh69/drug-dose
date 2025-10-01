// uses.js
const usesData = {
    "paracetamol": "Uses: Fever, mild pain. Side effects: Rare, may include rash or liver issues.",
    "ibuprofen": "Uses: Pain, inflammation, fever. Side effects: Stomach upset, ulcers, kidney issues.",
    "amoxicillin": "Uses: Bacterial infections. Side effects: Allergic reactions, diarrhea."
};

async function showUses() {
    const drug = document.getElementById('drugName').value.trim().toLowerCase();
    const resultDiv = document.getElementById('usesResult');
    resultDiv.innerHTML = '';
    showLoader(true);
    let found = false;
    let html = '';
    try {
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(drug)}&limit=1`);
        if (!response.ok) throw new Error('No data');
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            let uses = data.results[0].indications_and_usage;
            let sideEffects = data.results[0].adverse_reactions || data.results[0].warnings;
            uses = (typeof uses === 'string') ? uses : (Array.isArray(uses) ? uses.join('. ') : '');
            sideEffects = (typeof sideEffects === 'string') ? sideEffects : (Array.isArray(sideEffects) ? sideEffects.join('. ') : '');
            html = '<ul style="text-align:left;">';
            if (uses) {
                uses.split(/[.;\n]/).forEach(sub => {
                    let trimmed = (typeof sub === 'string') ? sub.trim() : '';
                    if (trimmed && trimmed.length > 2 && trimmed.length < 120) {
                        html += `<li style='margin-bottom:16px;'><b>Use:</b> ${trimmed}</li>`;
                    }
                });
            }
            if (sideEffects) {
                sideEffects.split(/[.;\n]/).forEach(sub => {
                    let trimmed = (typeof sub === 'string') ? sub.trim() : '';
                    if (trimmed && trimmed.length > 2 && trimmed.length < 120) {
                        html += `<li style='margin-bottom:16px;'><b>Side Effect:</b> ${trimmed}</li>`;
                    }
                });
            }
            if (html === '<ul style="text-align:left;">') {
                html += "<li>No uses or side effects info found.</li>";
            }
            html += '</ul>';
            resultDiv.innerHTML = html;
            showLoader(false);
            found = true;
            return;
        }
        throw new Error('No data');
    } catch (e) {
        // fallback to local data
        let local = usesData[drug];
        local = (typeof local === 'string') ? local : (Array.isArray(local) ? local.join('. ') : '');
        if (local) {
            html = '<ul style="text-align:left;">';
            local.split('.').forEach(point => {
                let trimmed = (typeof point === 'string') ? point.trim() : '';
                if (trimmed && trimmed.length > 2 && trimmed.length < 120) {
                    if (/side effect/i.test(trimmed)) {
                        html += `<li style='margin-bottom:16px;'><b>Side Effect:</b> ${trimmed.replace(/side effects?:/i, '').trim()}</li>`;
                    } else if (/use/i.test(trimmed)) {
                        html += `<li style='margin-bottom:16px;'><b>Use:</b> ${trimmed.replace(/uses?:/i, '').trim()}</li>`;
                    } else {
                        html += `<li style='margin-bottom:16px;'>${trimmed}</li>`;
                    }
                }
            });
            html += '</ul>';
            resultDiv.innerHTML = html;
            showLoader(false);
            found = true;
            return;
        }
    }
    // If not found in API or local, fetch from MedlinePlus if drug name is valid
    if (!found) {
        if (typeof drug === 'string' && drug.length > 1 && !drug.includes(' ')) {
            try {
                const medlineUrl = `https://medlineplus.gov/druginfo/meds/${drug[0]}${drug.slice(1)}.html`;
                const resp = await fetch(medlineUrl);
                if (resp.ok) {
                    const text = await resp.text();
                    // Try to extract the uses section
                    const usesMatch = text.match(/<h2[^>]*>What is this medicine\?[^<]*<\/h2>([\s\S]*?)<h2/);
                    html = '<div style="text-align:left;">';
                    if (usesMatch && usesMatch[1]) {
                        let usesText = usesMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
                        html += `<b>Uses:</b> ${usesText}`;
                    } else {
                        html += 'No uses found on MedlinePlus.';
                    }
                    html += '</div>';
                    resultDiv.innerHTML = html;
                    showLoader(false);
                    return;
                }
            } catch (err) {}
        }
        resultDiv.innerHTML = '<span style="color:#e11d48;">No such medicine found. Please check the spelling or try another drug.</span>';
        showLoader(false);
    }
}