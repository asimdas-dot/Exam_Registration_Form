import React, { useEffect, useRef, useState } from 'react'
import { FileUp, UploadCloud, Eye, Trash2, Loader2 } from 'lucide-react'
import { Button } from './Button'

type Doc = {
  name: string
  required?: boolean
  status?: string
}

type UploadRecord = {
  fileName: string
  dataUrl?: string
  size?: number
  uploadedAt: string
  status: string
  applicationNumber?: string
}

type DocumentCardProps = {
  doc: Doc
  applicationNumber?: string
  onChange?: () => void
}

export function DocumentCard({ doc, applicationNumber, onChange }: DocumentCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [record, setRecord] = useState<UploadRecord | null>(null)

  const sanitized = doc.name.replace(/\s+/g, '_').toLowerCase()
  const storageKey = applicationNumber ? `doc_upload_${applicationNumber}_${sanitized}` : `doc_upload_${sanitized}`

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    if (raw) setRecord(JSON.parse(raw))
  }, [storageKey])

  useEffect(() => {
    if (onChange) onChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.fileName])

  function openFileDialog() {
    inputRef.current?.click()
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : undefined
      simulateUpload(file.name, dataUrl, file.size)
    }
    // For images/pdf preview, read as data URL
    reader.readAsDataURL(file)
  }

  function simulateUpload(fileName: string, dataUrl?: string, size?: number) {
    setUploading(true)
    setProgress(0)
    let p = 0
    const t = setInterval(() => {
      p += Math.floor(Math.random() * 20) + 10
      if (p >= 100) {
        p = 100
        clearInterval(t)
        const newRec: UploadRecord = { fileName, dataUrl, size, uploadedAt: new Date().toISOString(), status: 'pending', applicationNumber: applicationNumber }
        setRecord(newRec)
        localStorage.setItem(storageKey, JSON.stringify(newRec))
        setUploading(false)
        setProgress(0)
        return
      }
      setProgress(p)
    }, 300)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  function handleDelete() {
    localStorage.removeItem(storageKey)
    setRecord(null)
    if (onChange) onChange()
  }

  function handlePreview() {
    if (!record) return
    if (record.dataUrl && record.dataUrl.startsWith('data:image')) {
      const w = window.open('')
      if (w) w.document.write(`<img src="${record.dataUrl}" style="max-width:100%"/>`)
    } else if (record.dataUrl && record.dataUrl.startsWith('data:application/pdf')) {
      const w = window.open(record.dataUrl)
      if (!w) alert('Unable to open preview. Your browser may block popups.')
    } else {
      alert(`File: ${record.fileName}`)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{doc.name}</h3>
          <div className="mt-2 flex gap-2">
            <span className={['rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]', doc.required ? 'bg-warning-50 text-warning-700' : 'bg-slate-100 text-slate-600'].join(' ')}>
              {doc.required ? 'Required' : 'Optional'}
            </span>
          </div>
        </div>

        <div>
          <span className={['inline-flex rounded-full px-2 py-1 text-xs font-medium', doc.status === 'approved' ? 'bg-success-100 text-success-700' : doc.status === 'rejected' ? 'bg-danger-100 text-danger-700' : 'bg-slate-100 text-slate-600'].join(' ')}>
            {doc.status === 'approved' ? 'Approved' : doc.status === 'rejected' ? 'Rejected' : 'Pending'}
          </span>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        className={[
          'mt-4 rounded-2xl border border-dashed p-4',
          dragOver ? 'border-primary-300 bg-primary-50/40' : 'border-slate-300 bg-slate-50',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Upload PDF, JPG or PNG</p>
            <p className="mt-1 text-xs text-slate-500">Maximum size: 2 MB</p>
            {record ? (
              <p className="mt-2 text-sm text-slate-600">Uploaded: {record.fileName}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {uploading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary-700" />
                <span className="text-sm text-slate-700">Uploading {progress}%</span>
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-700 shadow-card">
                <UploadCloud className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} accept="image/*,.pdf,.png,.jpg,.jpeg" />
          <Button onClick={openFileDialog} icon={<FileUp className="h-4 w-4" />}>Upload Document</Button>

          {record ? (
            <>
              <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />} onClick={handlePreview}>Preview</Button>
              <Button variant="outline" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={handleDelete}>Delete</Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
