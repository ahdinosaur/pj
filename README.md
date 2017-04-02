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

### "pixel controllers" (follower, server)

small independent microcontrollers that receive pixel messages over WiFi and send them to RGB LEDs.

- [Adafruit Feather M0 WiFi](https://www.adafruit.com/products/3010)
- [ESP32](http://esp32.net/)

_status: will wait on announced Adafruit Feather ESP32 board_.

### "pixel jockey" (leader, client)

- your laptop,
- OR you phone!

## scope

- when i want to get started, i can buy some pixels and pixel controllers.
- when i buy some pixel gear, i know how to assemble and control them from my computer.
- when the pixels are plugged in but not controlled, they should be pleasing.
- when i want to control the pixels like a lamp, i can use a few physical controls.
- when i want to control the pixels like a show, i can use my laptop or phone to set patterns.

## license 

AGPL-3.0
