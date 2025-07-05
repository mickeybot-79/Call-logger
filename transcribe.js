const { AssemblyAI } = require('assemblyai')
const fs = require('fs')

const transcriberFunc = async () => {
    const client = new AssemblyAI({
        apiKey: process.env.ASSEMBLYAI,
    });

    let result

    setTimeout(async () => {
        const params = {
            audio: "C:/Users/user/Downloads/recording.weba",
            speech_model: "universal",
        };

        const transcript = await client.transcripts.transcribe(params);

        console.log(transcript.text);

        fs.unlink("C:/Users/user/Downloads/recording.weba",
            err => {
                if (err) console.log(err)
            }
        )

        result = transcript.text
    }, 100)

    return result
}

module.exports = transcriberFunc