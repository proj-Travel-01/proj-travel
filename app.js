const mysql = require('../travel/database.js')
const express = require('express')

app = express();

mysql.connect((err) => {
    if(err) throw err;
});

//start trip summary
app.get('/get/start_summary/:vehNum', (req, res) => {
    res.writeHead(200, {'Content-Type':'text/json'});
    let vehNum = req.params.vehNum;

    mysql.query('SELECT * FROM TRAVEL.START_TRIP WHERE VEHICLE_NUM = ? ORDER BY START_TIME DESC LIMIT 1',[vehNum],(err, res) => {
        if(err) throw err;

        console.log(JSON.stringify(res));
        //res.write("queried")
        
    
    });
    
    res.end();
});

//posting start trip
app.post('/post/starttrip', (req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    let driverName = req.query.driverName;
    let vehicleNum = req.query.vehicleNum;
    let startLocation = req.query.startLocation;
    let startTemp = req.query.startTemp;
    let loadCapacity = req.query.loadCapacity;
    let currentKM = req.query.currentKM;


    let query = 'INSERT INTO TRAVEL.START_TRIP (DRIVER_NAME, VEHICLE_NUM, START_LOCATION, START_TEMP, LOAD_CAPACITY, CURRENT_KM, START_TIME) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)';
    mysql.query(query,[driverName, vehicleNum, startLocation, startTemp, loadCapacity, currentKM],(err, res) => {
        if(err) throw err;

        console.log("inserted start trip details")
    });

    res.end();
})

//post end trip details
app.post('/post/endtrip', (req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    
    let tripID = req.query.tripID;
    let endLocation = req.query.endLocation;
    let endTemp = req.query.endTemp;
    let endKM = req.query.endKM;


    let query = 'INSERT INTO TRAVEL.END_TRIP (TRIP_ID, END_LOCATION, END_TEMP, END_KM, END_TIME) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';

    mysql.query(query,[tripID, endLocation, endTemp, endKM],(err, res) => {
        if(err) throw err;

        console.log("inserted end trip details")
    });

    res.end();
})

//end trip summary
app.get('/get/end_summary/:tripID', (req, res) => {
    res.writeHead(200, {'Content-Type':'text/json'});

    let tripID = req.params.tripID;
    let sql="SELECT ST.TRIP_ID, ST.VEHICLE_NUM, ST.DRIVER_NAME,  ST.START_LOCATION, ET.END_LOCATION, ST.START_TEMP, ET.END_TEMP, ST.LOAD_CAPACITY, ST.CURRENT_KM, ET.END_KM, (ET.END_KM-ST.CURRENT_KM) AS TOTAL_DIST, ST.START_TIME, ET.END_TIME FROM TRAVEL.END_TRIP AS ET JOIN TRAVEL.START_TRIP AS ST ON ST.TRIP_ID=ET.TRIP_ID WHERE ST.TRIP_ID = ?"

    mysql.query(sql,[tripID],(err, res) => {
        if(err) 
            throw err;

        console.log(JSON.stringify(res));     
    });
    
    res.end();
});

app.listen(3000);

