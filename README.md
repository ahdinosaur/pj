# pj (pixel jockey)

**do not look**

![diy ndpixels](http://i.imgur.com/a4HIes1.gif)

## what?

easy to use modular LED pixels that can be controlled with your laptop or phone, with modes for parties that beat to music.

## target audience

DJs, party hosts, or wannabe VJs.

## hardware

### "pixels"

individually addressable RGB LEDs

- [APA102C LED](https://www.pololu.com/product/2554)
  - strips (but if longer than 4 meters, needs special way to inject more power at each 4 meter mark),
  - OR grids

### "pixel follower" (server)

small independent microcontrollers that receive pixel messages over WiFi and send them to RGB LEDs.

- [Adafruit Feather M0 WiFi](https://www.adafruit.com/products/3010)
- [ESP32](http://esp32.net/)

_status: will wait on announced Adafruit Feather ESP32 board_.

### "pixel leader" (client)

- your laptop,
- OR you phone!

## TODO

- [x] scaffold a follower simulator using electron
- [x] scaffold a leader that sends rainbow pixels
- [x] follower broadcasts up over mdns
- [ ] follower broadcasts length over mdns
- [ ] leader is an electron app
- [ ] leader sees available followers
- [ ] leader picks the current mode (rainbow)
- [ ] leader connects to followers
- [ ] leader arranges pixels for overall scene
- [ ] leader arranges pixels for each follower

## license 

AGPL-3.0
