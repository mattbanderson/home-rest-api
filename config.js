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
  }
]

config.garageDoorUrl = "http://192.168.0.177:3000/api/garage/door/";

module.exports = config;
