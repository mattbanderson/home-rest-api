var config = {};

config.plugs = [
  {
      "name": "Family Room Lamp",
      "host": "192.168.0.110",
      "mac": "38:2b:78:01:71:a6",
      "id": "ECO-780171A6"
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
      "name": "Christmas Tree",
      "host": "192.168.0.113",
      "mac": "38:2b:78:03:2f:08",
      "id": "ECO-78032F08"
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
  }
];
config.plugsMap = {};
config.plugs.forEach(p => config.plugsMap[p.name.toLowerCase().split(" ").join("")] = p);

config.switches = [
  {
    "name": "Dining Room Table",
    "host": "192.168.0.116",
    "port": "49153"
  }
];
config.switchesMap = {};
config.switches.forEach(s => config.switchesMap[s.name.toLowerCase().split(" ").join("")] = s);

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
config.camerasMap = {};
config.cameras.forEach(c => config.camerasMap[c.name.toLowerCase().split(" ").join("")] = c);

module.exports = config;
