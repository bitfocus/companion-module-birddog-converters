## BirdDog Studio NDI / Mini

This module allows you to control the BirdDog Studio NDI / Mini.

### Configuration

- Device IP: the IP address of the BirdDog device

### Available actions

- Change Decode Source: allows you to change the decode source from a dropdown list of sources available to the BirdDog device
- Change Decode Source by IP: allows you to change to a custom NDI source using the Source Name (must include full name, for example `PTZ-1 (CAM)`, not `PTZ-1`), Source IP and Source Port.
- Refresh NDI Source List: refreshes the dropdown list of sources available to the BirdDog device. _Note: this does not search for new sources on the BirdDog itself, that must be done in the BirdDog web UI. It only refreshes any new sources once the BirdDog has found_

### Available variables

- decode_source *displays the source currently being decoded*
- current_mode *displays the current mode (encode or decode) of the device*
- video_format *displays the resolution selected when for encoding (only applies when device is in encode mode)*
