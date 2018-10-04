var express = require('express')
var router = express.Router()
var mysql = require('mysql')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hehe@123",
  database: "smart_parking",
  multipleStatements: true
});

con.connect(function (err) {
  if (err) throw err.stack
  console.log('connect success')
});

/* GET home page. */
router.get('/', function (req, res, next) {
});

router.get('/getAllUserRegister', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader('Access-Control-Allow-Headers', "X-Requested-With,content-type")
  res.setHeader('Access-Control-Allow-Crendentials', true)

  con.query("select t1.userId, t1.username,t1.createBy,t1.phone,t1.address, t2.numberPlate,t1.status, DATE_FORMAT(t1.createDate,'%d/%m/%Y') as createDate,t1.availableMonth " +
    "from (select * from userregister)t1 left join (select userId,count(userId) as numberplate from carplate) t2 on t1.userId = t2.userId ", function (err, results) {
      if (err) throw err
      result = []
      for (var i in results) {
        var userObj = {
          userId: results[i].userId,
          username: results[i].username,
          phone: results[i].phone,
          address: results[i].address,
          createBy: results[i].createBy,
          createDate: results[i].createDate,
          availableMonth: results[i].availableMonth,
          numOfPlate: results[i].numberPlate == null ? 0 : results[i].numberPlate,
          status: results[i].status
        }
        result.push(userObj)
      }
      res.json(result)
    })
})

router.get('/getDetailUser/:userId', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader('Access-Control-Allow-Headers', "X-Requested-With,content-type")
  res.setHeader('Access-Control-Allow-Crendentials', true)

  var userId = req.params['userId']
  con.query("select *, DATE_FORMAT(createDate,'%d/%m/%Y') as createDate  from userregister where userId='" + userId + "';" +
    "select carNumPlate,carImgAddress,UID,status from carplate where userId='" + userId + "';" +
    "select UID as value from card where status=1", function (err, results) {
      if (err) throw err
      obj = { userId: "", username: "", phone: "", address: "", createBy: "", createDate: "", status: 0, listOfPlate: [], listOfRfid: [] }
      obj.userId = results[0][0].userId
      obj.username = results[0][0].username
      obj.phone = results[0][0].phone
      obj.address = results[0][0].address
      obj.createBy = results[0][0].createBy
      obj.createDate = results[0][0].createDate
      obj.status = results[0][0].status
      for (var i in results[1]) {
        obj.listOfPlate.push(results[1][i])
      }
      for (var i in results[2]) {
        obj.listOfRfid.push(results[2][i])
      }
      res.json(obj)
    })
})

router.get('/getParkData', function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
  // res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  // res.setHeader('Access-Control-Allow-Headers', "X-Requested-With,content-type")
  // res.setHeader('Access-Control-Allow-Crendentials', true)

  con.query("select * from park", function (err, results) {
    if (err) throw err
    result = []
    for (var i in results) {
      var userObj = {
        parkId: results[i].parkId,
        parkname: results[i].parkName,
        address: results[i].address,
        lat: results[i].lat,
        lng: results[i].lng,
        numofslot: results[i].numOfSlot,
        numofavailableslot: results[i].numOfAvailableSlot,
        numofnotparkcar: results[i].numOfNotParkCar,
        status: results[i].status
      }
      result.push(userObj)
    }
    res.json(result)
  })
})

router.get('/getParkDataByPark/:parkId', function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
  // res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  // res.setHeader('Access-Control-Allow-Headers', "X-Requested-With,content-type")
  // res.setHeader('Access-Control-Allow-Crendentials', true)

  var parkId = req.params['parkId']
  con.query("select * from park where parkId='" + parkId + "'", function (err, results) {
    if (err) throw err
    var result = {
      parkId: results[0].parkId,
      parkname: results[0].parkName,
      address: results[0].address,
      lat: results[0].lat,
      lng: results[0].lng,
      numofslot: results[0].numOfSlot,
      numofavailableslot: results[0].numOfAvailableSlot,
      numofnotparkcar: results[0].numOfNotParkCar,
      status: results[0].status
    }
    res.json(result)
  })
})



module.exports = router;