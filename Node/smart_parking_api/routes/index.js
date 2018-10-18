var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const socketIO = require('socket.io')

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

router.get('/getAllStaff', function (req, res, next) {
  con.query("select s.accountId,s.fullname,s.phone,s.address,s.email,s.status,a.role from staff s join account a on s.accountId=a.accountId", function (err, results) {
    if (err) throw err
    result = []
    for (var i in results) {
      var userObj = {
        accountId: results[i].accountId,
        fullname: results[i].fullname,
        phone: results[i].phone,
        address: results[i].address,
        email: results[i].email,
        role: results[i].role,
        status: results[i].status
      }
      result.push(userObj)
    }
    res.json(result)
  })
})

router.get('/getDetailStaff/:accountId', function (req, res, next) {
  var accountId = req.params['accountId']
  con.query("select s.accountId,s.fullname,s.phone,s.address,s.email,s.status,a.role from staff s join account a on s.accountId=a.accountId where s.accountId='" + accountId + "';", function (err, results) {
    if (err) res.send(err)
    obj = { fullname: "", accountId: "", phone: "", address: "", email: "", role: "", status: 0 }
    obj.accountId = results[0].accountId
    obj.fullname = results[0].fullname
    obj.phone = results[0].phone
    obj.address = results[0].address
    obj.email = results[0].email
    obj.role = results[0].role
    obj.status = results[0].status
    res.json(obj)
  })
})

router.post('/updateStaffData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    var accountId = req.body.accountId
    var fullname = req.body.fullname
    var phone = req.body.phone
    var address = req.body.address
    var email = req.body.email
    var role = req.body.role
    var status = req.body.status

    let promiseUpdateStaffData = () => {
      return new Promise((resolve, reject) => {
        con.query("update staff " +
          "set fullname='" + fullname + "', phone='" + phone + "', address='" + address + "',email='" + email + "', status=" + status + " where accountId='" + accountId + "'",
          function (err, result) {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
      })
    }

    let promiseUpdateRole = () => {
      return new Promise((resolve, reject) => {
        con.query("update account set role='" + role + "' where accountId='" + accountId + "';",
          function (err, result) {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
      })
    }

    let processQuery = async () => {
      try {
        await promiseUpdateStaffData()
        await promiseUpdateRole()
        await promiseCommit(res)
      } catch (e) {
        console.log(e)
        con.rollback()
        res.send(e)
      }

    }
    processQuery()
  })
})

router.post('/addStaffData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var username = req.body.username.toLowerCase().trim().replace(/  +/g, ' ')
    var phone = req.body.phone
    var address = req.body.address
    var email = req.body.email
    var role = req.body.role
    var status = req.body.status

    let processQuery = async () => {
      try {
        let accountId = await promiseCreateAccountId(username)
        await promiseInsertAccount(accountId, '123456', role)
        await promiseInsertStaff(accountId, username, phone, address, email, status)
        await promiseCommit(res)
      } catch (e) {
        console.log(e)
        con.rollback()
        res.send(e)
      }

    }
    processQuery()
  })
})

let promiseInsertStaff = (accountId, username, phone, address, email, status) => {
  return new Promise((resolve, reject) => {
    con.query("insert into staff value ('" + accountId + "','" + username + "','" + phone + "','" + address + "','" +
      email + "'," + status + ")",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
  })
}

router.get('/getAllUserRegister', function (req, res, next) {
  con.query("select t1.accountId, t1.username,t1.createBy,t1.phone,t1.address, t2.numberPlate,t1.status, DATE_FORMAT(t1.createDate,'%Y-%m-%d') as createDate, DATE_FORMAT(t1.availableDate,'%Y-%m-%d') as availableDate " +
    "from (select * from userregister)t1 left join (select accountId,count(accountId) as numberplate from carplate GROUP BY accountId) t2 on t1.accountId = t2.accountId ", function (err, results) {
      if (err) throw err
      result = []
      for (var i in results) {
        var userObj = {
          accountId: results[i].accountId,
          accountId: results[i].accountId,
          username: results[i].username,
          phone: results[i].phone,
          address: results[i].address,
          createBy: results[i].createBy,
          createDate: results[i].createDate,
          availableDate: results[i].availableDate,
          numOfPlate: results[i].numberPlate == null ? 0 : results[i].numberPlate,
          status: results[i].status
        }
        result.push(userObj)
      }
      res.json(result)
    })
})

router.get('/getDetailUser/:accountId', function (req, res, next) {
  var accountId = req.params['accountId']
  con.query("select *, DATE_FORMAT(createDate,'%d-%m-%Y') as createDate,DATE_FORMAT(availableDate,'%Y-%m-%d') as availableDate from userregister where accountId='" + accountId + "';" +
    "select id,carNumPlate,UID,status from carplate where accountId='" + accountId + "';" +
    "select UID as value from card where status=1", function (err, results) {
      if (err) res.send(err)
      obj = { accountId: "", username: "", phone: "", address: "", email: "", createBy: "", createDate: "", status: 0, listOfPlate: [], listOfRfid: [] }
      obj.accountId = results[0][0].accountId
      obj.username = results[0][0].username
      obj.phone = results[0][0].phone
      obj.address = results[0][0].address
      obj.email = results[0][0].email
      obj.createBy = results[0][0].createBy
      obj.createDate = results[0][0].createDate
      obj.availableDate = results[0][0].availableDate
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

router.post('/updateUserData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var accountId = req.body.accountId
    var username = req.body.username.toLowerCase().trim().replace(/  +/g, ' ')
    var availableDate = req.body.availabledate
    var phone = req.body.phone
    var address = req.body.address
    var email = req.body.email
    var status = req.body.status
    var listOfNewPlate = req.body.listofnewplate
    var listOfPlate = req.body.listofplate
    var listOfReleaseId = req.body.listofreleaserfid
    let promiseUpdateUser = () => {
      return new Promise((resolve, reject) => {
        con.query("update userregister " +
          "set username='" + username + "', availableDate='" + availableDate + "', phone='" + phone + "', address='" + address + "',email='" + email + "', status=" + status + " where accountId='" + accountId + "'",
          function (err, result) {
            if (err) {
              return reject(err)
            }
            resolve(result)
          })
      })
    }

    let processQuery = async () => {
      try {
        for (var i = 0; i < listOfReleaseId.length; i++) await promiseUpdateCardStatus(listOfReleaseId[i].UID, 1)
        for (var i = 0; i < listOfNewPlate.length; i++) await promiseAddNewCarPlate(listOfNewPlate[i].carNumPlate, accountId, listOfNewPlate[i].UID, listOfNewPlate[i].status)
        for (var i = 0; i < listOfPlate.length; i++) await promiseUpdateCarPlate(listOfPlate[i].carNumPlate, listOfPlate[i].UID, listOfPlate[i].status, listOfPlate[i].id)
        await promiseUpdateUser()
        await promiseCommit(res)
      } catch (e) {
        console.log(e)
        con.rollback()
        res.send(e)
      }

    }
    processQuery()
  })
})

router.post('/addUserData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var username = req.body.username.toLowerCase().trim().replace(/  +/g, ' ')
    var availableDate = req.body.availabledate
    var phone = req.body.phone
    var address = req.body.address
    var email = req.body.email
    var status = req.body.status
    var listOfNewPlate = req.body.listofnewplate

    let processQuery = async () => {
      try {
        let accountId = await promiseCreateAccountId(username)
        await promiseInsertAccount(accountId, '123456', 'user')
        await promiseInsertUser(accountId, username, availableDate, phone, address, email, status)
        for (var i = 0; i < listOfNewPlate.length; i++) await promiseAddNewCarPlate(listOfNewPlate[i].carNumPlate, accountId, listOfNewPlate[i].UID, listOfNewPlate[i].status)
        await promiseCommit(res)
      } catch (e) {
        console.log(e)
        con.rollback()
        res.send(e)
      }

    }
    processQuery()
  })
})

let promiseAddNewCarPlate = (carNumPlate, accountId, UID, status) => {
  return new Promise((resolve, reject) => {
    con.query("insert into carplate (carNumPlate,accountId,UID,status) values " +
      "('" + carNumPlate + "','" + accountId + "','" + UID + "'," + status + ")",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    promiseUpdateCardStatus(UID, status)
  })
}
let promiseUpdateCarPlate = (carNumPlate, UID, status, id) => {
  return new Promise((resolve, reject) => {
    con.query("update carplate set " +
      "carNumPlate='" + carNumPlate + "', UID='" + UID + "', status=" + status + " where id=" + id,
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    promiseUpdateCardStatus(UID, status)
  })
}

let promiseUpdateCardStatus = (UID, status) => {
  return new Promise((resolve, reject) => {
    con.query("update card set " +
      "status=" + (!status) + " where UID='" + UID + "';",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
  })
}

let promiseInsertUser = (accountId, username, availableDate, phone, address, email, status) => {
  return new Promise((resolve, reject) => {
    con.query("insert into userregister value ('" + accountId + "','" + username + "','administrator',now(),'" + availableDate + "','" + phone + "','" + address + "','" +
      email + "'," + status + ")",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
  })
}

let promiseInsertAccount = (accountId, password, role) => {
  return new Promise((resolve, reject) => {
    con.query("insert into account value ('" + accountId + "','" + password + "','" + role + "',now())",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
  })
}

let promiseCreateAccountId = (username) => {
  return new Promise((resolve, reject) => {
    var nameSplit = username.split(" ")
    var accountId = nameSplit[nameSplit.length - 1]
    for (var i = 0; i < nameSplit.length - 1; i++) {
      accountId += nameSplit[i][0]
    }
    con.query("select accountId from account where accountId like '" + accountId + "%' order by createDate DESC limit 1;",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        if (result.length == 0) {
          resolve(accountId)
        } else {
          if (result[0].accountId == accountId) {
            resolve(accountId + "1")
          } else {
            resolve(accountId + (parseInt(result[0].accountId.substring(accountId.length)) + 1))
          }
        }
      })
  })
}

let promiseCommit = (res) => {
  return new Promise((resolve, reject) => {
    con.commit(function (err) {
      if (err) {
        con.rollback()
        return reject(err)
      }
      return res.send("success")
    })
  })
}

router.get('/getAvailableRFID', function (req, res, next) {
  con.query("select * from card where status=1", function (err, results) {
    if (err) throw err
    var listOfRfid = []
    for (var i in results) {
      listOfRfid.push(results[i])
    }
    res.json(listOfRfid)
  })
})

router.get('/getParkData', function (req, res, next) {
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