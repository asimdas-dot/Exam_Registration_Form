export const hallTicketMock = {
  released: false,
  releaseDate: '15 November 2026',
  candidate: {
    name: 'Asim Das',
    applicationNumber: 'EXAM20260001234',
    rollNumber: '2026005678',
    examDate: '15 November 2026',
    examTime: '10:00 AM',
    // Embedded SVG strings (will be converted to data-URIs at runtime)
    photoSvg: `
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>
        <rect width='100%' height='100%' fill='%23E6E7EB'/>
        <circle cx='150' cy='110' r='60' fill='%239CA3AF'/>
        <path d='M40 260c0-60 60-100 110-100s110 40 110 100' fill='%239CA3AF'/>
        <text x='150' y='280' font-size='20' text-anchor='middle' fill='%23888'>Photo</text>
      </svg>
    `,
    signatureSvg: `
      <svg xmlns='http://www.w3.org/2000/svg' width='400' height='120' viewBox='0 0 400 120'>
        <rect width='100%' height='100%' fill='transparent'/>
        <path d='M5 80 C60 10, 140 110, 200 60 C260 20, 340 90, 395 75' stroke='%23111' stroke-width='3' fill='none' stroke-linecap='round'/>
      </svg>
    `,
    centre: {
      name: 'ABC Examination Centre',
      city: 'Kolkata',
      address: '123 Exam Road, Kolkata, West Bengal'
    }
  },
  // QR payload: change to a validation URL so scanning can open a verification link
  qrPayload: `https://exam.example.org/verify?app=EXAM20260001234`
}
