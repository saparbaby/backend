document.querySelectorAll('.carousel').forEach(carousel => {
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    // Добавляем кнопки управления
    const prevButton = document.createElement('button');
    prevButton.innerText = '❮';
    prevButton.classList.add('carousel-control', 'prev');
    carousel.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.innerText = '❯';
    nextButton.classList.add('carousel-control', 'next');
    carousel.appendChild(nextButton);

    // Функция для обновления видимых элементов
    const updateCarousel = () => {
        items.forEach((item, index) => {
            item.style.display = index === currentIndex ? 'block' : 'none';
        });
    };

    // Начальная отрисовка
    updateCarousel();

    // События для кнопок
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });
});
