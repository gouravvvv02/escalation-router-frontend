const BACKEND_URL = 'https://escalation-router-backend.vercel.app/api/classify';

const ticketInput = document.getElementById('ticketInput');
const submitBtn = document.getElementById('submitBtn');
const tableBody = document.getElementById('ticketTableBody');

async function submitTicket() {
  const text = ticketInput.value.trim();
  if (!text) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Classifying...';

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketText: text })
    });

    const data = await response.json();

    if (data.error) {
      alert('Error: ' + data.error);
    } else {
      addTicketToTable(text, data);
      ticketInput.value = '';
    }
  } catch (err) {
    alert('Error connecting to backend. Check console.');
    console.error(err);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit & Classify';
}

function addTicketToTable(text, classification) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${text}</td>
    <td>${classification.category}</td>
    <td><span class="badge ${classification.severity}">${classification.severity}</span></td>
    <td>${classification.routingTeam}</td>
  `;
  tableBody.prepend(row); // newest ticket on top
}

submitBtn.addEventListener('click', submitTicket);