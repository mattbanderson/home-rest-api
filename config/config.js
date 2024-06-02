var config = {};

config.plugs = [
  // {
  //     "name": "<Broken>",
  //     "host": "192.168.0.110",
  //     "mac": "38:2b:78:01:71:a6",
  //     "id": "ECO-780171A6"
  // },
  {
    "name": "Family Room Lamp",
    "host": "192.168.0.113",
    "mac": "38:2b:78:03:2f:08",
    "id": "ECO-78032F08"
  },
  {
      "name": "Living Room Lamp",
      "host": "192.168.0.111",
      "mac": "38:2b:78:00:d6:6a",
      "id": "ECO-7800D66A"
  },
  {
      "name": "Family Room Lamp 2",
      "host": "192.168.0.112",
      "mac": "38:2b:78:05:50:40",
      "id": "ECO-78055040"
  },
  {
      "name": "Cabinet",
      "host": "192.168.0.114",
      "mac": "38:2b:78:05:7f:e9",
      "id": "ECO-78057FE9"
  },
  {
      "name": "Bedroom Lamp",
      "host": "192.168.0.115",
      "mac": "38:2b:78:02:cf:9b",
      "id": "ECO-7802CF9B"
  },
  {
      "name": "Outdoor Lights",
      "host": "192.168.0.116",
      "mac": "38:2b:78:04:d7:c8",
      "id": "ECO-7804D7C8"
  },
  {
    "name": "Christmas Tree",
    "host": "192.168.0.117",
    "mac": "38:2b:78:04:d2:be",
    "id": "ECO-7804D2BE"
  }
];

config.switches = [
  {
    "name": "Dining Room Table",
    "host": "192.168.0.120",
    "port": "49153",
    "mac": "14:91:82:4f:03:45"
  },
  {
    "name": "Kitchen Light",
    "host": "192.168.0.121",
    "port": "49153",
    "mac": "24:f5:a2:63:18:55"
  },
  {
    "name": "Christmas Tree",
    "host": "192.168.0.122",
    "port": "49153",
    "mac": "24:f5:a2:f5:84:e3"
  }
];

config.garageDoorUrl = "http://192.168.0.177:3000/api/garage/door/";

config.cameras = [
  {
    "name": "Duck Cam",
    "url": "http://192.168.0.195:8080/video"
  },
  {
    "name": "Driveway",
    "url": "http://192.168.0.187:8888/video"
  }
];

module.exports = config;
