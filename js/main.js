// Include all include tags.
// This is used to laod the header and footer dynamically.
// It fetches the content of the file specified in the src attribute
// and inserts it into the DOM.
// This function returns a promise that resolves when all includes are loaded
// and the DOM relative to the includes is loaded and ready.
function includeHTML() {
  const includes = document.getElementsByTagName('include');
  const promises = [];

  for (let i = 0; i < includes.length; i++) {
    const element = includes[i];
    const file = element.getAttribute('src');

    const promise = fetch(file)
      .then(response => response.text())
      .then(data => {
        element.insertAdjacentHTML('afterend', data);
        element.remove();
      });

    promises.push(promise);
  }

  // Return a promise that resolves when all includes are loaded
  return Promise.all(promises);
}

function navigationMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Set active navigation link based on current page
  const currentPage = window.location.pathname.split('/').pop();
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener('click', (event) => {
    if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// Load header and footer on page load
document.addEventListener('DOMContentLoaded', () => {
  includeHTML().then(() => {
    // Initialize navigation menu when the header is loaded
    navigationMenu();
  }
  );
});

// Temperature and Transmittance Data Simulation (for demo purposes)
function simulateData() {
  // Only run on data page
  if (!document.getElementById('temperature-chart')) return;

  // Simulate temperature data
  const internalTemp1 = 20 + Math.random() * 2;
  const internalTemp2 = 20 + Math.random() * 2;
  const externalTemp1 = 5 + Math.random() * 2;
  const externalTemp2 = 5 + Math.random() * 2;

  // Calculate transmittance (simplified formula for demo)
  // U = Q / (A * ΔT) where Q is heat flow, A is area, ΔT is temperature difference
  // For demonstration, we'll use a simplified calculation
  const temperatureDifference = ((internalTemp1 + internalTemp2) / 2) - ((externalTemp1 + externalTemp2) / 2);
  const transmittance = 2.5 / temperatureDifference; // Simplified formula for demo

  // Update displayed values
  document.getElementById('internal-temp-1').textContent = internalTemp1.toFixed(2) + ' °C';
  document.getElementById('internal-temp-2').textContent = internalTemp2.toFixed(2) + ' °C';
  document.getElementById('external-temp-1').textContent = externalTemp1.toFixed(2) + ' °C';
  document.getElementById('external-temp-2').textContent = externalTemp2.toFixed(2) + ' °C';
  document.getElementById('transmittance-value').textContent = transmittance.toFixed(3) + ' W/(m²·K)';

  // Update chart if using a charting library like Chart.js
  if (window.temperatureChart) {
    const timestamp = new Date().toLocaleTimeString();

    // Add new data points
    temperatureChart.data.labels.push(timestamp);
    temperatureChart.data.datasets[0].data.push(internalTemp1);
    temperatureChart.data.datasets[1].data.push(internalTemp2);
    temperatureChart.data.datasets[2].data.push(externalTemp1);
    temperatureChart.data.datasets[3].data.push(externalTemp2);

    // Remove old data points if there are too many
    if (temperatureChart.data.labels.length > 20) {
      temperatureChart.data.labels.shift();
      temperatureChart.data.datasets.forEach(dataset => {
        dataset.data.shift();
      });
    }

    temperatureChart.update();
  }
}

// Initialize temperature chart (if on data page)
function initTemperatureChart() {
  const chartElement = document.getElementById('temperature-chart');
  if (!chartElement) return;

  // Only create chart if the Chart.js library is available
  if (typeof Chart !== 'undefined') {
    const ctx = chartElement.getContext('2d');
    window.temperatureChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Internal Temp 1',
            data: [],
            borderColor: 'rgba(52, 152, 219, 1)',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            tension: 0.4
          },
          {
            label: 'Internal Temp 2',
            data: [],
            borderColor: 'rgba(46, 204, 113, 1)',
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            tension: 0.4
          },
          {
            label: 'External Temp 1',
            data: [],
            borderColor: 'rgba(231, 76, 60, 1)',
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            tension: 0.4
          },
          {
            label: 'External Temp 2',
            data: [],
            borderColor: 'rgba(155, 89, 182, 1)',
            backgroundColor: 'rgba(155, 89, 182, 0.2)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          }
        }
      }
    });

    // Update data every 2 seconds
    setInterval(simulateData, 2000);
    simulateData(); // Initial data
  }
}

// Initialize transmittance chart (if on data page)
function initTransmittanceChart() {
  const chartElement = document.getElementById('transmittance-chart');
  if (!chartElement) return;

  // Only create chart if the Chart.js library is available
  if (typeof Chart !== 'undefined') {
    const ctx = chartElement.getContext('2d');
    window.transmittanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Transmittance',
            data: [],
            borderColor: 'rgba(52, 73, 94, 1)',
            backgroundColor: 'rgba(52, 73, 94, 0.2)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Transmittance W/(m²·K)'
            },
            min: 0,
            max: 1
          }
        }
      }
    });

    // Update transmittance chart when temperature data is updated
    setInterval(() => {
      if (!window.temperatureChart) return;

      const timestamp = new Date().toLocaleTimeString();
      const transmittanceValue = parseFloat(document.getElementById('transmittance-value').textContent);

      transmittanceChart.data.labels.push(timestamp);
      transmittanceChart.data.datasets[0].data.push(transmittanceValue);

      if (transmittanceChart.data.labels.length > 20) {
        transmittanceChart.data.labels.shift();
        transmittanceChart.data.datasets[0].data.shift();
      }

      transmittanceChart.update();
    }, 2000);
  }
}

// Initialize all charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initTemperatureChart();
  initTransmittanceChart();
});
