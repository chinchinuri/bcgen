window.onload = function() {
    // Отримуємо параметри з URL
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const position = params.get('position');
    const phone = params.get('phone');
    const email = params.get('email');

    // Вставляємо дані в HTML
    document.getElementById('name').innerText = name || 'Ім\'я Прізвище';
    document.getElementById('position').innerText = position || 'Посада';
    document.getElementById('phone').innerText = phone || '+380 00 000 0000';
    document.getElementById('email').innerText = email || 'example@email.com';

    // Налаштовуємо кнопку для завантаження PDF
    const downloadButton = document.getElementById('download-btn');
    downloadButton.addEventListener('click', () => {
        const cardElement = document.getElementById('business-card');
        const options = {
            margin:       0,
            filename:     `business_card_${name.replace(' ', '_')}.pdf`,
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { scale: 4 }, // Збільшуємо якість рендерингу
            jsPDF:        { unit: 'mm', format: [90, 50], orientation: 'landscape' }
        };
        // Генеруємо PDF з елемента #business-card
        html2pdf().from(cardElement).set(options).save();
    });
};