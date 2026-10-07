# 0001. Use Bluetooth Earbud Microphone as Primary Input

The system requires hands-free speech recognition while the user wears Bluetooth earbuds. We decided to capture audio directly from the Bluetooth earbud microphone (Bluetooth SCO) instead of the iPhone's built-in microphone, accepting lower sample rate bandwidth (8/16kHz HFP) and requiring native audio session configuration in order to ensure true mobile hands-free operation.
