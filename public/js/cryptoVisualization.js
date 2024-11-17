document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/crypto')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(crypto => crypto.name); // Имена криптовалют
            const prices = data.map(crypto => crypto.current_price); // Цены криптовалют

            const ctx = document.getElementById('cryptoChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Current Price (USD)',
                        data: prices,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        })
        .catch(error => console.error('Error fetching crypto data:', error));
});
