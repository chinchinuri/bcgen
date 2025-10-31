document.getElementById('cardForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  // Завантажуємо шаблон
  const template = await fetch('template.html').then(r => r.text());

  // Підставляємо дані
  const filled = template
    .replace('{{name}}', data.name)
    .replace('{{position}}', data.position)
    .replace('{{department}}', data.department)
    .replace('{{email}}', data.email)
    .replace('{{phone}}', data.phone)
    .replace('{{qr}}', data.qr || '');

  // Попередній перегляд
  const iframe = document.getElementById('preview');
  iframe.srcdoc = filled;

  // Створення PDF
  const opt = {
    margin:       0,
    filename:     `${data.name}_business_card.pdf`,
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: [90, 50], orientation: 'landscape' }
  };

  await html2pdf().from(filled).set(opt).save();
});
