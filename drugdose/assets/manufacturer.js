// manufacturer.js
const manufacturerData = {
    "paracetamol": "Manufactured by: ABC Pharma Ltd.",
    "ibuprofen": "Manufactured by: XYZ Healthcare.",
    "amoxicillin": "Manufactured by: MedLife Pharmaceuticals."
};

async function showManufacturer() {
    const drug = document.getElementById('drugName').value.trim().toLowerCase();
    const resultDiv = document.getElementById('manufacturerResult');
    resultDiv.innerHTML = '';
    showLoader(true);
    let found = false;
    let html = '';
    try {
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(drug)}&limit=1`);
        if (!response.ok) throw new Error('No data');
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const man = data.results[0].openfda && data.results[0].openfda.manufacturer_name ? data.results[0].openfda.manufacturer_name : 'No manufacturer info found.';
            let points = Array.isArray(man) ? man : [man];
            html = '<ul style="text-align:left;">';
            points.forEach(point => {
                point.split(/[.;\n]/).forEach(sub => {
                    let trimmed = sub.trim();
                    if (trimmed) {
                        html += `<li style='margin-bottom:12px;'><b>Manufacturer:</b> ${trimmed}</li>`;
                    }
                });
            });
            html += '</ul>';
            resultDiv.innerHTML = html;
            showLoader(false);
            found = true;
            return;
        }
        throw new Error('No data');
    } catch (e) {
        // fallback to local data
        if (manufacturerData[drug]) {
            html = '<ul style="text-align:left;">';
            manufacturerData[drug].split('.').forEach(point => {
                let trimmed = point.trim();
                if (trimmed) {
                    html += `<li style='margin-bottom:12px;'><b>Manufacturer:</b> ${trimmed}</li>`;
                }
            });
            html += '</ul>';
            resultDiv.innerHTML = html;
            showLoader(false);
            found = true;
            return;
        }
    }
    // If not found in API or local, fetch from Drugs.com if drug name is valid
    if (!found) {
        if (typeof drug === 'string' && drug.length > 1 && !drug.includes(' ')) {
            try {
                const drugsUrl = `https://www.drugs.com/${drug}.html`;
                const resp = await fetch(drugsUrl);
                if (resp.ok) {
                    const text = await resp.text();
                    // Try to extract the manufacturer section
                    const manufMatch = text.match(/<b>Manufacturer:<\/b>\s*([^<]+)/i);
                    html = '<div style="text-align:left;">';
                    if (manufMatch && manufMatch[1]) {
                        let manufText = manufMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
                        html += `<b>Manufacturer:</b> ${manufText}`;
                    } else {
                        html += 'No manufacturer info found on Drugs.com.';
                    }
                    html += '</div>';
                    resultDiv.innerHTML = html;
                    showLoader(false);
                    return;
                }
            } catch (err) {}
        }
        // If still not found, suggest correction
        const validDrugList = [
            "paracetamol", "ibuprofen", "amoxicillin", "azithromycin", "metformin", "atorvastatin", "omeprazole", "amitriptyline", "cetirizine", "ciprofloxacin", "doxycycline", "lisinopril", "losartan", "simvastatin", "levothyroxine", "amlodipine", "clopidogrel", "pantoprazole", "gabapentin", "tramadol"
        ];
        function getClosestDrugName(input) {
            let minDist = 999, closest = null;
            validDrugList.forEach(drug => {
                const dist = levenshtein(input, drug);
                if (dist < minDist) {
                    minDist = dist;
                    closest = drug;
                }
            });
            return (minDist <= 2) ? closest : null;
        }
        function levenshtein(a, b) {
            const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
            for (let i = 0; i <= a.length; i++) dp[i][0] = i;
            for (let j = 0; j <= b.length; j++) dp[0][j] = j;
            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                    else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                }
            }
            return dp[a.length][b.length];
        }
        const suggestion = getClosestDrugName(drug);
        if (suggestion) {
            resultDiv.innerHTML = `<span style='color:#eab308;'>Did you mean <b>${suggestion}</b>? <button onclick=\"document.getElementById('drugName').value='${suggestion}';showManufacturer();\">Yes</button></span>`;
        } else {
            resultDiv.innerHTML = '<span style="color:#e11d48;">No such medicine found. Please check the spelling.</span>';
        }
        showLoader(false);
    }
}