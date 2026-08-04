import fs from 'node:fs';
import { SarvamAIClient } from 'sarvamai';

const client = new SarvamAIClient({
  apiSubscriptionKey: 'YOUR_API_KEY',
});

const response = await client.textToSpeech.convertStream({
    target_language_code: "hi-IN",
    speaker: "shubh",
    model: "bulbul:v3",
    pace: 1,
    speech_sample_rate: 22050,
});

response.pipe(fs.createWriteStream('speech.mp3'));