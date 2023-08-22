document.getElementById('inputForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const apiKey = document.getElementById('apiKey').value;
    const baseId = document.getElementById('baseId').value;
    const tableName = document.getElementById('tableName').value;
    const columnName = document.getElementById('columnName').value;

    const endpoint = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };

    const brokenLinksList = document.getElementById('brokenLinksList');
    brokenLinksList.innerHTML = ''; // Clear previous results

    let offset;
    let totalRecords = [];
    while (true) {
        let response;
        try {
            response = await fetch(endpoint + (offset ? `?offset=${offset}` : ""), {
                headers: headers
            });

            if (response.status !== 200) {
                alert("Error accessing Airtable data. Please check your inputs.");
                return;
            }

            const data = await response.json();
            totalRecords = totalRecords.concat(data.records);
            offset = data.offset;

            if (!offset) break;

        } catch (error) {
            console.error("Error fetching data:", error);
            return;
        }
    }

    for(let index = 0; index < totalRecords.length; index++) {
        const link = totalRecords[index].fields[columnName];
        if (link) {
            const isBroken = await checkLink(link);
            if (isBroken) {
                const listItem = document.createElement('li');
                const anchorTag = document.createElement('a');
                anchorTag.href = link;
                anchorTag.textContent = `Row ${index + 1}: ${link}`;
                anchorTag.target = "_blank";  // Open link in a new tab
                listItem.appendChild(anchorTag);
                brokenLinksList.appendChild(listItem);
            }
        }
    }

    if (!brokenLinksList.hasChildNodes()) {
        alert("No broken links found!");
    }
});


// ... rest of your script ...

document.getElementById('inputForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show the loader
    document.getElementById('loader').style.display = "block";

    // ... rest of your function ...

    // Hide the loader after the check is complete
    document.getElementById('loader').style.display = "none";
});

// ... rest of your script ...



async function checkLink(link) {
    try {
        const response = await fetch(link, { 
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Check if the status is between 200-299, which represents success codes
        return !(response.status >= 200 && response.status <= 299);
    } catch (error) {
        return true;  // If we can't fetch the link, consider it broken
    }
}
