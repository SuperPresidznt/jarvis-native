# Sound Assets

This folder contains sound effects for easter eggs and other audio features.

## Required Files

### retro-startup.mp3
A short (1-2 second) retro-style startup jingle reminiscent of 90s gaming consoles.

**Specifications:**
- Format: MP3 (preferred) or WAV
- Duration: 1-2 seconds
- Sample rate: 44100 Hz
- Bit rate: 128+ kbps for MP3

**Suggested sound characteristics:**
- Short melodic chime or jingle
- 8-bit or synthesizer style tones
- Rising pitch sequence
- Clean finish (no abrupt cutoff)

**Free sound resources:**
- https://freesound.org (search for "retro jingle" or "8-bit chime")
- https://pixabay.com/sound-effects/
- https://soundbible.com

**Important:** Do NOT use copyrighted sounds (like actual Nintendo sounds).
Create or find royalty-free alternatives.

## How to add sounds

1. Download or create your sound file
2. Name it exactly as specified above
3. Place it in this folder
4. Test in the app

## Usage

Sounds are played via expo-av. See `src/utils/easterEggs.ts` for implementation.
