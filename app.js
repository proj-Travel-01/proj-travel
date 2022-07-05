const port = process.env.PORT || 3000

const mysql = require('./database.js')
const express = require('express')

const app = express();

var getIP = require('ipware')().get_ip;


mysql.connect((err) => {
    if(err) throw err;
});


//start trip summary  m
app.post('/', (req, res) => {
    res.send(req.socket.remoteAddress);
    res.end()
  })

app.get('/get/start_summary/:vehNum', (req, response) => {
    //res.writeHead(200, {'Content-Type':'text/json'});
    let vehNum = req.params.vehNum;
    let sql = 'SELECT * FROM bthbnab1ona1jdeoc3nn.start_trip WHERE VEHICLE_NUM = ? ORDER BY START_TIME DESC LIMIT 1';
    let data ;
    mysql.query(sql, [vehNum], (err, res) => {
        if(err) throw err;

        
        response.send(res)
        //response.end()
    });
    //end
    
});

//posting start trip
app.post('/post/starttrip', (req, response) => {
    //res.writeHead(200, {'Content-Type':'text/html'});
    let driverName = req.query.driverName;
    let vehicleNum = req.query.vehicleNum;
    let startLocation = req.query.startLocation;
    let startTemp = req.query.startTemp;
    let loadCapacity = req.query.loadCapacity;
    let currentKM = req.query.currentKM;


    let query = 'INSERT INTO bthbnab1ona1jdeoc3nn.start_trip (DRIVER_NAME, VEHICLE_NUM, START_LOCATION, START_TEMP, LOAD_CAPACITY, CURRENT_KM, START_TIME) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)';
    mysql.query(query,[driverName, vehicleNum, startLocation, startTemp, loadCapacity, currentKM],(err, res) => {
        if(err) throw err;
        
        console.log("inserted start trip details")
        response.send(res);
        //response.end();
    });

    
})

//post end trip details
app.post('/post/endtrip', (req, response) => {
    //res.writeHead(200, {'Content-Type':'text/html'});
    
    let tripID = req.query.tripID;
    let endLocation = req.query.endLocation;
    let endTemp = req.query.endTemp;
    let endKM = req.query.endKM;


    let query = 'INSERT INTO bthbnab1ona1jdeoc3nn.end_trip (TRIP_ID, END_LOCATION, END_TEMP, END_KM, END_TIME) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';

    mysql.query(query,[tripID, endLocation, endTemp, endKM],(err, res) => {
        if(err) throw err;
        
        console.log("inserted end trip details")
        response.send(res);
        //response.end();
    });

    
})

//end trip summary
app.get('/get/end_summary/:tripID', (req, result) => {
    //result.writeHead(200, {'Content-Type':'text/json'});

    let tripID = req.params.tripID;
    let sql="SELECT ST.TRIP_ID, ST.VEHICLE_NUM, ST.DRIVER_NAME,  ST.START_LOCATION, ET.END_LOCATION, ST.START_TEMP, ET.END_TEMP, ST.LOAD_CAPACITY, ST.CURRENT_KM, ET.END_KM, (ET.END_KM-ST.CURRENT_KM) AS TOTAL_DIST, ST.START_TIME, ET.END_TIME FROM bthbnab1ona1jdeoc3nn.end_trip AS ET JOIN bthbnab1ona1jdeoc3nn.start_trip AS ST ON ST.TRIP_ID=ET.TRIP_ID WHERE ST.TRIP_ID = ?"
    const data="";
    mysql.query(sql,[tripID],(err, res) => {
        if(err) 
            throw err;

        result.send(res);
        
        
    });
      
    
});


app.listen(port,() => {
    console.log(`Server running at port `+port);
  });

