document.getElementById('cardForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  // Завантажуємо шаблони
  const frontTemplate = await fetch('template_front.html').then(r => r.text());
  const backTemplate  = await fetch('template_back.html').then(r => r.text());

  // Автоматично замінюємо чорний колір у QR на білий
  const qrWhite = (data.qr || '').replace(/#000000|#000|rgb\(0,0,0\)/gi, '#FFFFFF');

  // Формуємо лицьову сторону
  const front = frontTemplate
    .replace('{{name}}', data.name)
    .replace('{{position}}', data.position)
    .replace('{{department}}', data.department)
    .replace('{{email}}', data.email)
    .replace('{{phone}}', data.phone);

  // Формуємо зворотну сторону
  const back = backTemplate.replace('{{qr}}', qrWhite);

  // Попередній перегляд обох сторін
  document.getElementById('previewFront').srcdoc = front;
  document.getElementById('previewBack').srcdoc = back;

  // Генерація двостороннього PDF
  const opt = {
    margin: 0,
    filename: `${data.name.replace(/\s+/g, '_')}_business_card.pdf`,
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'mm', format: [90, 50], orientation: 'landscape' }
  };

  const pdf = new window.jspdf.jsPDF(opt.jsPDF);

  // Сторона 1
  await pdf.html(front, {
    callback: async function (pdf) {
      // Сторона 2
      pdf.addPage([90, 50], 'landscape');
      const backCanvas = await html2canvas(createTemp(back), { scale: 3 });
      pdf.addImage(backCanvas, 'PNG', 0, 0, 90, 50);
      pdf.save(opt.filename);
    },
    html2canvas: opt.html2canvas
  });

  // утиліта для створення тимчасового DOM
  function createTemp(html) {
    const el = document.createElement('div');
    el.innerHTML = html;
    document.body.appendChild(el);
    return el;
  }
});
