document.getElementById('dnsForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Check which button triggered the form submission
  const submitter = e.submitter;

  if (submitter && submitter.value === 'lookup') {
    const domain = document.getElementById('domain').value;

    // Redirect to the /result page with the domain as a query parameter
    window.location.href = `/result?domain=${encodeURIComponent(domain)}`;
  } else if (submitter && submitter.value === 'quick-search') {
    // Handle logic specific to "type" value
    const domain = document.getElementById('domain').value;
    const type = document.getElementById('type').value;

    // Make an internal request to the backend
    const result = await fetch(
      `/internal/dns?domain=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`,
    )
      .then((res) => res.json())
      .catch((err) => ({ error: err.message }));

    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    if (result.error) {
      resultDiv.textContent = `Error: ${result.error}`;
    } else {
      // Create a table
      const table = document.createElement('table');
      table.className = 'table'; // Assign the table class

      // Create table header
      const headerRow = document.createElement('tr');
      const headers = ['Key', 'Value'];
      headers.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Populate table with results
      Object.entries(result).forEach(([key, value]) => {
        const row = document.createElement('tr');

        // Key column
        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        row.appendChild(keyCell);

        // Value column
        const valueCell = document.createElement('td');
        valueCell.textContent = Array.isArray(value)
          ? value.map((v) => JSON.stringify(v)).join(', ')
          : JSON.stringify(value);
        row.appendChild(valueCell);

        table.appendChild(row);
      });

      // Append the table to the result div
      resultDiv.appendChild(table);
    }

    resultDiv.style.display = 'block';
  } else {
    return;
  }
});
