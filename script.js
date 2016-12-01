var us_intl_airport_CODES;
var all_us_intl_airpoots;
var lat_long = [];
var unique_codes = [];
var valid_codes = [];

function drawMap (all_us_intl_airpoots) {
    var w = 1500;
    var h = 1500;
    var projection = d3.geoAlbersUsa()
        .translate([w / 2, h / (5)])
        .scale([1300]);

    var path = d3.geoPath()
        .projection(projection);


    //Define quantize scale to sort data values into buckets of color
    var color = d3.scaleQuantize()
        .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    //Load in agriculture data
    d3.csv("data/us-states.json", function (data) {
        //Set input domain for color scale
        color.domain([
            d3.min(data, function (d) {
                return d.value;
            }),
            d3.max(data, function (d) {
                return d.value;
            })
        ]);
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
                    //                        //Get data value
                    //                        var value = d.properties.value;
                    //
                    //                        if (value) {
                    //                            //If value exists…
                    //                            return color(value);
                    //                        } else {
                    //                            //If value is undefined…
                    //                            return "#ccc";
                    //                        }
                    return "#e5e5ff"
                });

            // points
            // aa = [-111.908333, 40.762778];
            bb = [-122.389809, 37.72728];
            l = []
            l.push(all_us_intl_airpoots[0])
            // add circles to svg
            // console.log("len of data is "+all_us_intl_airpoots.length)
            svg.selectAll("circle")
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
                .attr("r", "4px")
                .attr("fill", "red")
                .on("click", function () {
                    console.log("CLICKED")
                })
                .on("mouseover", function () {
                    console.log("HOVERING")
                })
        });
    });
}



// /**
//  * Returns the Latitude and Longitude of an airport based on it's IATA Code.
//  *
//  * @param IATA_Code
//  * @returns {[*,*]}
//  */
// var getCoordinates = function getCoordinates(IATA_Code) {
//     var airport = csv_airports.filter(function (d) {
//         return d.IATA_Code === IATA_Code;
//     });
//
//     if (airport.length === 0) {
//         throw "Unknown IATA Code: " + IATA_Code;
//     } else if (airport.length > 1) {
//         throw "Duplicate IATA Codes Found: " + IATA_Code;
//     }
//
//     return [airport[0].Lat, airport[0].Long];
// };
//
// var airportStatsChart = new AirportStatsChart();
//
// var brushChart = new BrushChart(on_time_performance);
//
//
// // Convert Object Array into an easily searchable string array:
// var us_intl_airport_CODES = us_international_airports.map(function (d) {
//     return d.code;
// });
// // Filter to just United States and only International Airports
// // NOTE: The "United States" check is most likely redundant because the csv file with
// // the list of international airports technically only has US airports.
// var US_intl_airports = csv_airports.filter(function (d) {
//     return (us_intl_airport_CODES.indexOf(d.IATA_Code) >= 0 && d.Country === "United States" );
// });

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