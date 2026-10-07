# Issue 05: Bluetooth Earbud Mic Routing Configuration (iOS Native EAS Dev Client)
Status: done

## What to build

Configure native iOS audio session properties to route speech input from connected Bluetooth earbuds (Bluetooth SCO / Hands-Free Profile) using Expo Config Plugins. Setup `eas.json` configuration for building an iOS Expo Development Client via Expo EAS Cloud Build without requiring a local macOS/Xcode environment. Provide testing instructions to verify Bluetooth earbud microphone input on physical iPhone hardware.

## Acceptance criteria

- [ ] iOS `AVAudioSession` configuration plugin includes `.allowBluetooth` and `.defaultToSpeaker` options for category `PlayAndRecord`.
- [ ] `eas.json` development build profile configured for iOS.
- [ ] EAS Cloud build generates an installable iOS Expo Dev Client `.ipa` / QR code.
- [ ] Physical Bluetooth earbuds (AirPods, Galaxy Buds, etc.) route microphone input into the app when connected.
- [ ] Speech spoken into the earbud microphone is successfully captured and transcribed by the hands-free loop.

## Blocked by

- `.scratch/realtime-multilingual-stt/issues/04-audio-visualizer-and-connection-state.md`
