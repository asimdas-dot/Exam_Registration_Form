import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hallTicketMock } from '../../mock/candidate/hallTicketData'
import { Printer, Download } from 'lucide-react'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const HallTicketPreviewPage: React.FC = () => {
  const navigate = useNavigate()
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    // Generate QR data URL from payload
    QRCode.toDataURL(hallTicketMock.qrPayload || '', { margin: 1, width: 200 })
      .then((url: string) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(null))
  }, [])

  // Prepare data-URIs from embedded SVGs (do not mutate mock object to avoid TS type mismatch)
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


  const handleDownload = async () => {
    if (!previewRef.current) return
    const element = previewRef.current
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Fit image to page width while keeping aspect ratio
    const imgProps = pdf.getImageProperties(imgData)
    const imgWidthPx = imgProps.width
    const imgHeightPx = imgProps.height
    const pxToMm = 0.264583
    const imgWidthMm = imgWidthPx * pxToMm
    const imgHeightMm = imgHeightPx * pxToMm
    const scale = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm)
    const finalWidth = imgWidthMm * scale
    const finalHeight = imgHeightMm * scale

    const margin = 0
    pdf.addImage(imgData, 'PNG', margin, margin, finalWidth, finalHeight)
    pdf.save(`${hallTicketMock.candidate.applicationNumber}-hallticket.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-none">
              {/* Embedded logo component */}
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="48" height="48" rx="8" fill="#0F172A" />
                <g transform="translate(8,8)" fill="#60A5FA">
                  <rect x="0" y="0" width="8" height="8" rx="1" />
                  <rect x="12" y="0" width="8" height="8" rx="1" />
                  <rect x="0" y="12" width="8" height="8" rx="1" />
                </g>
                <text x="28" y="30" fontFamily="sans-serif" fontSize="10" fill="#FFFFFF">ERS</text>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Hall Ticket Preview</h1>
              <div className="text-sm text-slate-500">{hallTicketMock.candidate.applicationNumber}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-50 border rounded text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Printer size={16} /> Print
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 flex items-center gap-2"
            >
              <Download size={16} /> Download
            </button>
          </div>
        </header>

        <main ref={previewRef} className="mt-6 border rounded p-6 bg-white">
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              <h2 className="text-lg font-semibold">EXAM REGISTRATION SYSTEM</h2>
              <div className="text-sm text-slate-500">Official Hall Ticket</div>
            </div>

            <div className="flex items-start gap-4">
              {/* QR code */}
              <div aria-hidden className="w-20 h-20 bg-white rounded border p-1">
                {qrDataUrl ? (
                  // render generated QR and make clickable to open verification URL
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
                    </g>
                  </svg>
                )}
              </div>

              {/* Photo */}
              <div className="w-24 h-24 bg-white rounded overflow-hidden border flex items-center justify-center">
                <img src={photoDataUrl} alt="Candidate" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Candidate Name</div>
              <div className="font-medium text-slate-900">{hallTicketMock.candidate.name}</div>

              <div className="mt-3 text-sm text-slate-500">Application Number</div>
              <div className="font-medium text-slate-900">{hallTicketMock.candidate.applicationNumber}</div>

              <div className="mt-3 text-sm text-slate-500">Roll Number</div>
              <div className="font-medium text-slate-900">{hallTicketMock.candidate.rollNumber}</div>
            </div>

            <div>
              <div className="text-sm text-slate-500">Exam Date & Time</div>
              <div className="font-medium text-slate-900">{hallTicketMock.candidate.examDate} • {hallTicketMock.candidate.examTime}</div>

              <div className="mt-3 text-sm text-slate-500">Exam Centre</div>
              <div className="font-medium text-slate-900">{hallTicketMock.candidate.centre.name}</div>

              <div className="mt-3 text-sm text-slate-500">Address</div>
              <div className="font-medium text-slate-900">{hallTicketMock.candidate.centre.address}</div>
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-600">
            <p>Please carry a valid government-issued photo ID along with this hall ticket to the examination centre.</p>
            <p className="mt-2">Do not bring any electronic devices into the examination hall.</p>
          </div>

          {/* Signature and small QR */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="text-sm text-slate-500">Signature</div>
                <div className="mt-1 w-48 h-12 bg-white border rounded overflow-hidden flex items-center">
                  <img src={signatureDataUrl} alt="Signature" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs text-slate-500 mt-1">Exam Controller</div>
              </div>

              <div className="text-sm text-slate-500">Issued On</div>
              <div className="font-medium text-slate-900">{new Date().toLocaleDateString()}</div>
            </div>

            <div aria-hidden className="w-24 h-24 bg-white rounded border p-1">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR code" className="w-full h-full object-contain" />
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
        </main>

        <div className="mt-6 flex justify-between">
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded text-slate-700">Back</button>
          <div />
        </div>
      </div>
    </div>
  )
}
