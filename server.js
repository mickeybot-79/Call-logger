require('dotenv').config()
const express = require('express')
const app = express()
const { AssemblyAI } = require('assemblyai')
const fs = require('fs')
const PORT = process.env.PORT || 3500

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile('/index.html', { root: __dirname })
})

app.use(express.json({ limit: "50mb", extended: true }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.get('/transcribe', async (req, res) => {
    const client = new AssemblyAI({
        apiKey: process.env.ASSEMBLYAI,
    })

    const params = {
        audio: "C:/Users/user/Downloads/recording.weba",
        speech_model: "universal",
    }

    console.log('requesting transcript')
    const transcript = await client.transcripts.transcribe(params)

    if (transcript?.text) {
        fs.unlink(params.audio,
            err => {
                if (err) console.log(err)
            }
        )
        console.log('sending response')
        res.send({ 'result': transcript.text })
    }
    //res.send({ 'result': 'test response' })

})

app.post('/submit', (req, res) => {
    const { start, end, name, number, callScript } = req.body
    fetch(process.env.FLOW_URL, {
        method: 'POST',
        body: `{"start": "${start}", "end": "${end}", "name": "${name}", "number": "${number}", "text": "${callScript}"}`
    })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))