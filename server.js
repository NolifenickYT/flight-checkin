<form id="checkinForm">
  <label for="name">Full Name:</label>
  <input type="text" id="name" required>
  <br>
  <label for="flightNumber">Flight Number:</label>
  <input type="text" id="flightNumber" required>
  <br>
  <button type="submit">Check-In</button>
</form>

<div class="result" id="result"></div>

<script>
  document.getElementById('checkinForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const flightNumber = document.getElementById('flightNumber').value;

    fetch(`http://localhost:3000/checkin?name=${name}&flightNumber=${flightNumber}`)
      .then(response => response.json())
      .then(data => {
        const resultElement = document.getElementById('result');
        if (data.status === 'success') {
          resultElement.textContent = data.message;
          resultElement.style.color = 'green';
        } else {
          resultElement.textContent = data.message;
          resultElement.style.color = 'red';
        }
      })
      .catch(error => {
        const resultElement = document.getElementById('result');
        resultElement.textContent = 'Error checking flight data';
        resultElement.style.color = 'red';
      });
  });
</script>
