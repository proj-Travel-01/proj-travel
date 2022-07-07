const port = process.env.PORT || 3000

const mysql = require('./database.js')
const express = require('express')
const request = require('request')

const app = express();



mysql.connect((err) => {
    if(err) throw err;
});


//start trip summary  m
app.get('/', async (req, result) => {
    
    request({
        url:"http://ip-api.com/json/",
        json:true
    },(err,res,body)=>{
        result.send(body);
    })

  })

app.get('/get/start_summary/:vehNum', async (req, response) => {
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
app.post('/post/starttrip', async (req, response) => {
    //res.writeHead(200, {'Content-Type':'text/html'});
    let driverName = req.query.driverName;
    let vehicleNum = req.query.vehicleNum;
    let startLocation = req.query.startLocation;
    let startTemp = req.query.startTemp;
    let loadCapacity = req.query.loadCapacity;
    let currentKM = req.query.currentKM;
    let loadingPic= req.query.loadingPic;


    let query = 'INSERT INTO bthbnab1ona1jdeoc3nn.start_trip (DRIVER_NAME, VEHICLE_NUM, START_LOCATION, START_TEMP, LOAD_CAPACITY, CURRENT_KM,LOADING_PHOTO, START_TIME) VALUES (?, ?, ?,?, ?, ?, ?, CURRENT_TIMESTAMP)';
    mysql.query(query,[driverName, vehicleNum, startLocation, startTemp, loadCapacity, currentKM,loadingPic],(err, res) => {
        if(err) throw err;
        
        console.log("inserted start trip details")
        response.send(res);
        //response.end();
    });

    
})

//post end trip details
app.post('/post/endtrip', async (req, response) => {
    //res.writeHead(200, {'Content-Type':'text/html'});
    
    let tripID = req.query.tripID;
    let endLocation = req.query.endLocation;
    let endTemp = req.query.endTemp;
    let endKM = req.query.endKM;
    let unloadingPic= req.query.unloadingPic;


    let query = 'INSERT INTO bthbnab1ona1jdeoc3nn.end_trip (TRIP_ID, END_LOCATION, END_TEMP, END_KM,UNLOADING_PHOTO, END_TIME) VALUES (?, ?, ?,?, ?, CURRENT_TIMESTAMP)';

    mysql.query(query,[tripID, endLocation, endTemp, endKM,unloadingPic],(err, res) => {
        if(err) throw err;
        
        console.log("inserted end trip details")
        response.send(res);
        //response.end();
    });

    
})

//end trip summary
app.get('/get/end_summary/:tripID', async (req, result) => {
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

