var config = {};

config.plugs = [
  {
      "name": "Family Room Lamp",
      "host": "192.168.0.198",
      "id": "ECO-780171A6"
  },
  {
      "name": "Bedroom Lamp",
      "host": "192.168.0.199",
      "id": "ECO-7800D66A"
  },
  {
      "name": "Family Room Lamp 2",
      "host": "192.168.0.179",
      "id": "ECO-78055040"
  },
  {
      "name": "Dining Room Lamp",
      "host": "192.168.0.165",
      "id": "ECO-78032F08"
  },
  {
      "name": "Cabinet",
      "host": "192.168.0.166",
      "id": "ECO-78057FE9"
  },
  {
      "name": "Bedroom Lamp",
      "host": "192.168.0.176",
      "id": "ECO-7802CF9B"
  }
];

config.switches = [
  {
    "name": "Dining Room Table",
    "host": "192.168.0.180",
    "port": "49153"
  }
];

config.garageDoorUrl = "http://192.168.0.177:3000/api/garage/door/";
config.cameras = [
  {
    "name": "Living Room",
    "url": "http://192.168.0.187:8888/video"
  },
  {
    "name": "Driveway",
    "url": "http://192.168.0.193:8888/video"
  }
];

module.exports = config;
