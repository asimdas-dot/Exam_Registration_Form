// Simple Express server (CommonJS) to manage candidates in MongoDB
const express = require('express')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
app.use(bodyParser.json())
// enable CORS for local dev (adjust origin in production)
const cors = require('cors')
app.use(cors())

const DEFAULT_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017'
const DB_NAME = process.env.MONGO_DB || 'exam_registration_db'
const COLLECTION = 'candidates'

let client
let db

async function connect() {
  if (client && client.isConnected && client.isConnected()) return
  client = new MongoClient(DEFAULT_URI)
  await client.connect()
  db = client.db(DB_NAME)
  console.log('Connected to MongoDB at', DEFAULT_URI, 'DB:', DB_NAME)
}

app.get('/api/health', async (req, res) => {
  try {
    await connect()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// Get all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    await connect()
    const list = await db.collection(COLLECTION).find({}).toArray()
    res.json(list)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
})

// Import candidates (expects an array in body)
app.post('/api/candidates/import', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body.items
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Expected an array of candidate objects in request body' })
    await connect()
    if (items.length === 0) return res.json({ inserted: 0 })
    // sanitize / add timestamps
    const docs = items.map((it) => ({ ...it, migratedAt: new Date().toISOString() }))
    const r = await db.collection(COLLECTION).insertMany(docs)
    res.json({ inserted: r.insertedCount })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
})

// Create single candidate (registration endpoint)
app.post('/api/candidates', async (req, res) => {
  try {
    const item = req.body
    if (!item || typeof item !== 'object') return res.status(400).json({ error: 'Expected candidate object in request body' })
    await connect()
    const doc = { ...item, createdAt: new Date().toISOString() }
    const r = await db.collection(COLLECTION).insertOne(doc)
    res.json({ insertedId: r.insertedId })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
})

// Clear candidates collection
app.delete('/api/candidates', async (req, res) => {
  try {
    await connect()
    const r = await db.collection(COLLECTION).deleteMany({})
    res.json({ deleted: r.deletedCount })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
})

const port = process.env.SERVER_PORT || 4000
app.listen(port, () => {
  console.log('Server listening on port', port)
  console.log('Use MONGO_URI and MONGO_DB env vars to change Mongo connection')
})
