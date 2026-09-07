import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Lock } from 'lucide-react'
import { hallTicketMock } from '../../mock/candidate/hallTicketData'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const HallTicketPage: React.FC = () => {
  const [released, setReleased] = useState(hallTicketMock.released)
  const [simulating, setSimulating] = useState(false)

  const simulateRelease = () => {
    setSimulating(true)
    // simulate an async release (mock)
    setTimeout(() => {
      setReleased(true)
      setSimulating(false)
    }, 1000)
  }

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const availableRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (released) {
      QRCode.toDataURL(hallTicketMock.qrPayload || '', { margin: 1, width: 200 })
        .then((url: string) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(null))
    }
  }, [released])

  // Prepare data URIs from embedded SVGs without mutating the mock object
  const candidateAny = hallTicketMock.candidate as any
  const photoDataUrl = candidateAny.photoUrl
    ? candidateAny.photoUrl as string
    : candidateAny.photoSvg
    ? 'data:image/svg+xml;utf8,' + encodeURIComponent(candidateAny.photoSvg)
    : undefined

  const signatureDataUrl = candidateAny.signatureUrl
    ? candidateAny.signatureUrl as string
    : candidateAny.signatureSvg
    ? 'data:image/svg+xml;utf8,' + encodeURIComponent(candidateAny.signatureSvg)
    : undefined

  const handleDownloadPdf = async () => {
    if (!availableRef.current) return
    const canvas = await html2canvas(availableRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgProps = pdf.getImageProperties(imgData)
    const imgWidthPx = imgProps.width
    const imgHeightPx = imgProps.height
    const pxToMm = 0.264583
    const imgWidthMm = imgWidthPx * pxToMm
    const imgHeightMm = imgHeightPx * pxToMm

    // Add small margins
    const marginMm = 10
    const availableWidth = pageWidth - marginMm * 2
    const availableHeight = pageHeight - marginMm * 2
    const scale = Math.min(availableWidth / imgWidthMm, availableHeight / imgHeightMm)
    const finalWidth = imgWidthMm * scale
    const finalHeight = imgHeightMm * scale

    const x = (pageWidth - finalWidth) / 2
    const y = marginMm

    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
    pdf.save(`${hallTicketMock.candidate.applicationNumber}-hallticket.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Hall Ticket</h1>
          <div className="text-sm text-slate-600">Application: {hallTicketMock.candidate.applicationNumber}</div>
        </header>

        {!released ? (
          <section className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Lock className="mx-auto text-sky-600" size={48} />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Hall Ticket Not Released</h2>
            <p className="mt-2 text-slate-600">Your hall ticket will be available here once it is officially released.</p>
            <p className="mt-2 text-sm text-slate-500">Expected Release Date: {hallTicketMock.releaseDate}</p>

            <div className="mt-6 flex justify-center gap-3">
              <Link to="/candidate/dashboard" className="px-4 py-2 bg-white border rounded text-slate-700">Go to Dashboard</Link>
              <button
                onClick={simulateRelease}
                disabled={simulating}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-60"
              >
                {simulating ? 'Simulating...' : 'Simulate Release'}
              </button>
            </div>
          </section>
        ) : (
          <section ref={availableRef} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-600" size={40} />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Hall Ticket Available</h2>
                <p className="mt-1 text-slate-600">Download or preview your hall ticket below.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded flex gap-4 items-center">
                <div className="w-20 h-20 bg-white rounded overflow-hidden border flex items-center justify-center">
                  <img src={photoDataUrl} alt="Candidate" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Candidate Name</div>
                  <div className="font-medium text-slate-900">{hallTicketMock.candidate.name}</div>

                  <div className="mt-2 text-sm text-slate-500">Application Number</div>
                  <div className="font-medium text-slate-900">{hallTicketMock.candidate.applicationNumber}</div>

                  <div className="mt-2 text-sm text-slate-500">Roll Number</div>
                  <div className="font-medium text-slate-900">{hallTicketMock.candidate.rollNumber}</div>
                </div>
              </div>

              <div className="p-4 border rounded">
                <div className="text-sm text-slate-500">Exam Date & Time</div>
                <div className="font-medium text-slate-900">{hallTicketMock.candidate.examDate} • {hallTicketMock.candidate.examTime}</div>

                <div className="mt-3 text-sm text-slate-500">Exam Centre</div>
                <div className="font-medium text-slate-900">{hallTicketMock.candidate.centre.name}, {hallTicketMock.candidate.centre.city}</div>

                <div className="mt-4">
                  <div className="text-sm text-slate-500">Centre Address</div>
                  <div className="font-medium text-slate-900 text-sm">{hallTicketMock.candidate.centre.address}</div>
                </div>
              </div>
            </div>

            {/* Signature + QR area */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <div className="text-sm text-slate-500">Signature</div>
                  <div className="mt-1 w-44 h-12 bg-white border rounded overflow-hidden flex items-center">
                    <img src={signatureDataUrl} alt="Signature" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Exam Controller</div>
                </div>

                <div className="text-sm text-slate-500">Issued On</div>
                <div className="font-medium text-slate-900">{new Date().toLocaleDateString()}</div>
              </div>

              <div aria-hidden className="w-24 h-24 bg-white rounded border p-1">
                {qrDataUrl ? (
                  <a href={hallTicketMock.qrPayload} target="_blank" rel="noreferrer" aria-label="Verify application">
                    <img src={qrDataUrl} alt="QR code" className="w-full h-full object-contain" />
                  </a>
                ) : (
                  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#ffffff" />
                    <g fill="#111827">
                      <rect x="5" y="5" width="20" height="20" />
                      <rect x="75" y="5" width="20" height="20" />
                      <rect x="5" y="75" width="20" height="20" />

                      <rect x="35" y="35" width="10" height="10" />
                      <rect x="50" y="35" width="10" height="10" />
                      <rect x="35" y="50" width="10" height="10" />
                      <rect x="60" y="50" width="6" height="6" />
                      <rect x="50" y="60" width="6" height="6" />
                    </g>
                  </svg>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                to="/candidate/hall-ticket/preview"
                className="px-4 py-2 bg-slate-50 border rounded text-slate-700 hover:bg-slate-100"
              >
                View Hall Ticket
              </Link>

              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
              >
                Download Hall Ticket
              </button>

              <Link to="/candidate/dashboard" className="ml-auto px-4 py-2 border rounded text-slate-700">Back to Dashboard</Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
