var us_intl_airport_CODES;
var all_us_intl_airpoots;
var lat_long = [];
var unique_codes = [];
var valid_codes = [];
var SLC_average = [];

function drawMap (all_us_intl_airpoots) {
    var w = 1500;
    var h = 1500;
    var projection = d3.geoAlbersUsa()
        .translate([w / 2, h / (5)])
        .scale([1300]);

    var path = d3.geoPath()
        .projection(projection);


    var path = d3.geoPath()
        .projection(projection);

    var places = {
        SLC: ["-111.977772", "40.788389"],
        COL: ["-104.673178", "39.861656"]
    };

    var route = {
        type: "LineString",
        coordinates: [
            places.SLC,
            places.COL
        ]
    };

    //Define quantize scale to sort data values into buckets of color
    var color = d3.scaleQuantize()
        .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // svg.append("path")
    //     .datum(graticule)
    //     .attr("class", "graticule")
    //     .attr("d", path);


    //Load in agriculture data
    d3.csv("data/us-states.json", function (data) {
        //Load in GeoJSON data
        d3.json("data/us-states.json", function (json) {
            //Merge the ag. data and GeoJSON
            //Loop through once for each ag. data value
            for (var i = 0; i < data.length; i++) {
                //Grab state name
                var dataState = data[i].state;
                //Grab data value, and convert from string to float
                var dataValue = parseFloat(data[i].value);
                //Find the corresponding state inside the GeoJSON
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;
                    if (dataState == jsonState) {
                        //Copy the data value into the JSON
                        json.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }


            //Bind data and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class", "feature")
                .attr("d", path)
                .style("fill", function (d) {
                    return "#e5e5ff"
                });

            // for (var i=0; i<2; i++){
            //     if(i==0){
            //         svg.append("path")
            //             .datum({type: "LineString", coordinates: [[-111.977772, 40.788389], [-104.673178, 39.861656]]})
            //             .attr("class", "arc")
            //             .attr("d", path);
            //     }
            //     if(i==1){
            //         svg.append("path")
            //             .datum({type: "LineString", coordinates: [[-111.977772, 40.788389], [-115.15225, 36.080056]]})
            //             .attr("class", "arc")
            //             .attr("d", path);
            //     }
            // }


            // points
            // aa = [-111.908333, 40.762778];
            bb = [-122.389809, 37.72728];
            l = []
            l.push(all_us_intl_airpoots[0])
            // add circles to svg
            // console.log("len of data is "+all_us_intl_airpoots.length)
            var circles= svg.selectAll("circle")
                .data(all_us_intl_airpoots).enter()
                .append("circle")
                .attr("cx", function (d) {
                    // console.log("d before if is "+d)
                    if(d!==null && projection(d)!=null) {
                        // console.log("d is "+ d)
                        if(d[0]<0) {
                            if (projection(d)[0] != null) {
                                // console.log("projection of d is " + projection(d));
                                return projection(d)[0];

                            }
                        }
                    }
                })
                .attr("cy", function (d) {
                    // console.log("d before if is "+d)
                    if(d!==null && projection(d)!=null) {
                        // console.log("d is "+ d)
                        if (projection(d)[1] != null) {
                            // console.log("projection of d is " + projection(d));
                            return projection(d)[1];
                        }
                    }
                })
                .attr("r", "6px")
                .attr("fill", "red");
                // .on("click", function (d) {
                //     console.log("CLICKED")
                // })
                // .on("mouseover", function (d) {
                //     console.log(d)
                // })
            circles
                .on("mouseover", function (d) {

                    for (var i=0; i<2; i++){
                        if(i==0){
                            svg.append("path")
                                .datum({type: "LineString", coordinates: [[-111.977772, 40.788389], [-104.673178, 39.861656]]})
                                .attr("class", "arc")
                                .attr("d", path);
                        }
                        if(i==1){
                            svg.append("path")
                                .datum({type: "LineString", coordinates: [[-111.977772, 40.788389], [-115.15225, 36.080056]]})
                                .attr("class", "arc")
                                .attr("d", path);
                        }
                    }
                 })
                .on("mouseleave", function (d) {
                    d3.selectAll(".arc").remove();
                });
        });

    });
}


function generateLineChart(SLC_average) {
    console.log("inside generate lines")
    var margin = {top:20, right:20, bottom:40, left:20},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#l1")
        .append("svg")
        .attr("width",width + margin.left + margin.right)
        .attr("height",height + margin.top + margin.bottom)
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d){
            // console.log(d.FlightDate)
            return x(d.FlightDate);
        })
        .y(function(d){
            console.log(d.DepDelay)
            return y(d.DepDelay);
        });

    x.domain(d3.extent(SLC_average, function(d) { return d.FlightDate; }));
    y.domain(d3.extent(SLC_average, function(d) { return d.DepDelay; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Delay (minutes)");

    g.append("path")
        .datum(SLC_average)
        .attr("class", "line")
        .attr("d", line);

}



// Load CSV files
d3.csv("data/us_international_airports.csv", function (error, csv) {
    csv.forEach(function (d) {
        // console.log("code is "+d.code)
        // Convert numeric values to 'numbers'
        d.code = d.code;
        valid_codes.push(d.code);
    });

    // var us_intl_airport_CODES = us_international_airports.map(function (d) {
    //     return d.code;
    // });

    // Store csv data in a global variable
    us_intl_airport_CODES = csv;
    // console.log("codes are")
    // console.log("size of intl. airport codes is "+us_intl_airport_CODES.length) //should be 68
});

// Load CSV files
d3.csv("data/airports.csv", function (error, csv) {
    csv.forEach(function (d) {
        // console.log("-")
        temp_check = []
        //Check if airport is already included in our list (-1 ==> not in list 0 ==>in list
        if(valid_codes.indexOf(d.IATA_Code) >= 0 && d.Country === "United States") {
            // console.log(d.IATA_Code)

            // console.log("index of C91 is "+us_intl_airport_CODES.indexOf("C91"))
            if(temp_check.indexOf(d.IATA_Code) < 0) {
                d.IATA_Code = d.IATA_Code;
                d.Country = d.Country;
                State = {"IATA": d.IATA_Code, "Lat": d.Lat, "Long": d.Long};
                l = [d.Long, d.Lat]
                lat_long.push(l)
                // console.log("d of 0 is "+l[0])
                unique_codes.push(l)
                temp_check.push(d.IATA_Code)
                // console.log(d.Country)
            }
        }
    });

    all_us_intl_airpoots = unique_codes;
    // console.log("size of intl. airports is "+all_us_intl_airpoots.length)
    drawMap(all_us_intl_airpoots)
});


d3.csv("data/SLC_average.csv", function (error, csv) {

    var format_time = d3.timeParse("%Y-%m-%d");

    csv.forEach(function (d) {
        d.FlightDate = format_time(d.FlightDate);
        // d.Origin = d.Origin;
        // d.DepDelay = d.DepDelay;
        // d.ArrDelay = d.ArrDelay;
        // d.CRSElapsedTime = d. CRSElapsedTime;
        // d.ActualElapsedTime = d.ActualElapsedTime;
    });

    SLC_average = csv.filter(function (d) {
        return new Date(d.FlightDate).getFullYear() === 1993;
    });

    console.log("length of slc_avg is "+SLC_average.length)
    // generateLineChart(SLC_average)
})