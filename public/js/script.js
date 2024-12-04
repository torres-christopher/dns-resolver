document.getElementById('dnsForm').addEventListener('submit', async (e) => {
  e.preventDefault();

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
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Key', 'Value'];
    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.border = '1px solid #ddd';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f2f2f2';
      th.style.textAlign = 'left';
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Populate table with results
    Object.entries(result).forEach(([key, value]) => {
      console.log(key, typeof value);
      const row = document.createElement('tr');

      // Key column
      const keyCell = document.createElement('td');
      keyCell.textContent = key;
      keyCell.style.border = '1px solid #ddd';
      keyCell.style.padding = '8px';
      row.appendChild(keyCell);

      // Value column
      const valueCell = document.createElement('td');
      valueCell.textContent = Array.isArray(value)
        ? value.join(', ')
        : JSON.stringify(value);
      valueCell.style.border = '1px solid #ddd';
      valueCell.style.padding = '8px';
      row.appendChild(valueCell);

      table.appendChild(row);
    });

    // Append the table to the result div
    resultDiv.appendChild(table);
  }

  resultDiv.style.display = 'block';
});
