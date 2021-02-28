## BirdDog Studio NDI / Mini
This module allows you to control the BirdDog Studio NDI / Mini.

### Configuration
* Target IP: the IP address of the BirdDog device

### Available actions
* Change Decode Source: allows you to change the decode source from a dropdown list of sources available to the BirdDog device
* Change Decode Source by IP: allows you to change to a custom NDI source using the Source Name, Source IP and Source Port
* Resfresh NDI Source List: refreshes the dropdown list of sources available to the BirdDog device. *Note: this does not search for new sources on the BirdDog itself, that must be done in the BirdDog web UI. It only refreshes any new sources once the BirdDog has found*

### Available variables
* Decode Source: displays the source currently being decoded
* Current Mode: displays the current mode (encode or decode) of the device
* Video Format: displays the resolution selected when for encoding (only applies when decive is in encode mode)