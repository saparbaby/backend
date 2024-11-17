fetch('/api/currency')
    .then(response => {
        console.log('API Response Status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Currency Data:', data); // Логируем данные для проверки

        const rates = Object.entries(data.conversion_rates); // Получаем данные
        const filteredRates = rates.slice(0, 10); // Ограничиваем до первых 10

        const labels = filteredRates.map(([currency]) => currency); // Названия валют
        const values = filteredRates.map(([, rate]) => rate); // Их значения

        const ctx = document.getElementById('currencyChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Exchange Rate (to USD)',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                },
                scales: {
                    x: { title: { display: true, text: 'Currency' } },
                    y: { title: { display: true, text: 'Exchange Rate' } },
                },
            },
        });
    })
    .catch(error => {
        console.error('Error fetching currency data:', error);
        alert(`Error: ${error.message}`); // Отобразить ошибку пользователю
    });
