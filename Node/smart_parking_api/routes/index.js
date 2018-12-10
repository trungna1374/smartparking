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

router.post('/removeStaffData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var accountId = req.body.accountid

    let processQuery = async () => {
      try {
        await promiseRemoveStaffData(accountId)
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

let promiseRemoveStaffData = (accountId) => {
  return new Promise((resolve, reject) => {
    con.query("update staff set status=0 where accountId='" + accountId + "';",
      function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
  })
}

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
        await promiseInsertStaff(accountId, req.body.username.trim().replace(/  +/g, ' '), phone, address, email, status)
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
  con.query("select t1.accountId, t1.username,t1.createBy,t1.phone,t1.address, t2.numberPlate,t1.status, DATE_FORMAT(t1.createDate,'%Y-%m-%d') as createDate " +
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
  con.query("select *, DATE_FORMAT(createDate,'%Y-%m-%d') as createDate from userregister where accountId='" + accountId + "';" +
    "select id,carNumPlate,UID,status,DATE_FORMAT(availableDate,'%Y-%m-%d') as availableDate from carplate where accountId='" + accountId + "';" +
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
    var username = req.body.username.trim().replace(/  +/g, ' ')
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
          "set username='" + username + "', phone='" + phone + "', address='" + address + "',email='" + email + "', status=" + status + " where accountId='" + accountId + "'",
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
        for (var i = 0; i < listOfNewPlate.length; i++) await promiseAddNewCarPlate(listOfNewPlate[i].carNumPlate, accountId, listOfNewPlate[i].UID, listOfNewPlate[i].availableDate, listOfNewPlate[i].status)
        for (var i = 0; i < listOfPlate.length; i++) await promiseUpdateCarPlate(listOfPlate[i].carNumPlate, listOfPlate[i].UID, listOfPlate[i].availableDate, listOfPlate[i].status, listOfPlate[i].id)
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

router.post('/updateUserOwnData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var accountId = req.body.accountId
    var phone = req.body.phone
    var address = req.body.address
    var email = req.body.email
    let promiseUpdateUser = () => {
      return new Promise((resolve, reject) => {
        con.query("update userregister " +
          "set phone='" + phone + "', address='" + address + "',email='" + email + "' where accountId='" + accountId + "'",
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
        await promiseInsertUser(accountId, username, 'admin', phone, address, email, status)
        for (var i = 0; i < listOfNewPlate.length; i++) await promiseAddNewCarPlate(listOfNewPlate[i].carNumPlate, accountId, listOfNewPlate[i].UID, listOfNewPlate[i].availableDate, listOfNewPlate[i].status)
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

let promiseAddNewCarPlate = (carNumPlate, accountId, UID, availableDate, status) => {
  return new Promise((resolve, reject) => {
    con.query("insert into carplate (carNumPlate,accountId,UID,availableDate,status) values " +
      "('" + carNumPlate + "','" + accountId + "','" + UID + "','" + availableDate + "'," + status + ")",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    promiseUpdateCardStatus(UID, status)
  })
}
let promiseUpdateCarPlate = (carNumPlate, UID, availableDate, status, id) => {
  return new Promise((resolve, reject) => {
    con.query("update carplate set " +
      "carNumPlate='" + carNumPlate + "', UID='" + UID + "', availableDate='" + availableDate + "', status=" + status + " where id=" + id,
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

let promiseInsertUser = (accountId, username, createBy, phone, address, email, status) => {
  return new Promise((resolve, reject) => {
    con.query("insert into userregister value ('" + accountId + "','" + username + "','" + createBy + "',now(),'" + phone + "','" + address + "','" +
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

router.post('/removeUserData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var accountId = req.body.accountid

    let processQuery = async () => {
      try {
        await promiseRemoveUserData(accountId)
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

let promiseRemoveUserData = (accountId) => {
  return new Promise((resolve, reject) => {
    con.query("update userregister set status=0 where accountId='" + accountId + "';",
      function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
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
  con.query("select * from park where status=1", function (err, results) {
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
        numofcar: results[i].numOfCar,
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
      numofcar: results[0].numOfCar,
      status: results[0].status
    }
    res.json(result)
  })
})

router.post('/addParkData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var parkname = req.body.parkname
    var address = req.body.address
    var lat = req.body.lat
    var lng = req.body.lng
    var numOfSlot = req.body.numofslot
    var numOfAvailableSlot = req.body.numofavailableslot

    let processQuery = async () => {
      try {
        let parkId = await promiseCreateParkId()
        await promiseInsertPark(parkId, parkname, address, lat, lng, numOfSlot, numOfAvailableSlot)
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

let promiseCreateParkId = () => {
  return new Promise((resolve, reject) => {
    con.query("select parkId from Park order by createDate DESC limit 1;",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        if (result.length == 0) {
          resolve('p1')
        } else {
          resolve("p" + (parseInt(result[0].parkId.substring(1)) + 1))
        }
      })
  })
}

let promiseInsertPark = (parkId, parkName, address, lat, lng, numOfSlot, numOfAvailableSlot) => {
  return new Promise((resolve, reject) => {
    con.query("insert into park value ('" + parkId + "','" + parkName + "','" + address + "'," + lat + "," + lng + "," + numOfSlot + "," + numOfAvailableSlot + ",0,1,now())",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
  })
}

router.post('/removeParkData', async (req, res, next) => {
  con.beginTransaction(function (err) {
    if (err) {
      return res.send(err)
    }
    var parkId = req.body.parkid

    let processQuery = async () => {
      try {
        await promiseRemovePark(parkId)
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

let promiseRemovePark = (parkId) => {
  return new Promise((resolve, reject) => {
    con.query("update park set status=0 where parkId='" + parkId + "'",
      function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
  })
}

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  con.query("select s.accountId,s.fullname,s.phone,s.address,s.email,s.status,a.role from staff s join account a on s.accountId=a.accountId where a.accountId='" + username + "' and a.password='" + password + "' and s.status=1", function (err, results) {
    if (err) throw err
    if (results.length == 0) {
      con.query("select s.accountId,s.username,s.phone,s.address,s.email,s.status,a.role from userregister s join account a on s.accountId=a.accountId where a.accountId='" + username + "' and a.password='" + password + "' and s.status=1", function (err, results) {
        if (err) throw err
        if (results.length == 0) res.status(404).send({ success: 0, message: "account Not found" })
        if (results.length > 0) {
          req.session.user = { username: results[0].accountId, role: results[0].role, fullname: results[0].username };
          res.send({ success: 1, message: "Logged in!", results })
        }
      })
    }
    if (results.length > 0) {
      req.session.user = { username: results[0].accountId, role: results[0].role, fullname: results[0].fullname };
      res.send({ success: 1, message: "Logged in!", results })
    }
  })
})

router.post('/changepassword', async (req, res, next) => {
  const { newpassword, repeat } = req.body;
  if (newpassword != repeat) {
    res.status(422).send({ success: 0, message: "Not true" })
  }
  con.query("UPDATE account SET password = '" + newpassword + "' WHERE accountId='" + req.session.user.username + "'", function (err, results) {
    console.log(results.message);
    if (err) throw err
    if (results.changedRows == 0) res.status(404).send({ success: 0, message: "failed" })
    if (results.changedRows > 0) {
      res.send({ success: 1, message: "Change Success!" })
    }
  })
})

router.post('/checkoldpass', async (req, res, next) => {
  const { oldpassword } = req.body;
  con.query("select * from account s where s.accountId='" + req.session.user.username + "'", function (err, results) {
    if (err) throw err
    if (results[0].password === oldpassword) {
      res.send({ success: 1, message: " Success!" })
    }
    else {
      res.status(422).send({ success: 0, message: "Not true" })
    }
  })
})



router.get('/login/check', (req, res) => {
  if (req.session.user) res.send({ success: 1, message: "success", user: req.session.user });
  else res.send({ success: 0, message: "failed" })
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).send({ success: 0, err })
    else res.send({ success: 1, message: "logged out!" })
  })
})

router.get('/fullname/:accountId', function (req, res, next) {
  var accountId = req.params['accountId']
  con.query("select s.accountId,s.fullname,s.phone,s.address,s.email,s.status,a.role from staff s join account a on s.accountId=a.accountId where s.accountId='" + accountId + "';", function (err, results) {
    if (err) res.send(err)
    else res.send({ success: 1, message: "logged out!", results })
  })
})

router.get('/getHistoryByMonth', function (req, res, next) {
  var month = req.query.month
  var year = req.query.year
  con.query("select Day(createDate) as day, Count(Day(createDate)) as countNumber,status from parkHistory where Month(createDate) = " + month +
    " and Year(createDate) = " + year + " Group by Day(createDate), status", function (err, results) {
      if (err) throw err
      result = []
      for (var i in results) {
        obj = {
          day: results[i].day,
          countnumber: results[i].countNumber,
          status:results[i].status
        }
        result.push(obj)
      }
      res.json(result)
    })
})

router.get('/getHistoryByYear', function (req, res, next) {
  var year = req.query.year
  con.query("select Month(createDate) as month, Count(Month(createDate)) as countNumber ,status  from parkHistory where Year(createDate) = " + year +
    " Group by Month(createDate), status", function (err, results) {
      if (err) throw err
      result = []
      for (var i in results) {
        obj = {
          month: results[i].month,
          countnumber: results[i].countNumber,
          status:results[i].status
        }
        result.push(obj)
      }
      res.json(result)
    })
})

module.exports = router;