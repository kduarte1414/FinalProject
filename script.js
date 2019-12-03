var svg= d3.select("#map") 
var width=+svg.attr("width");
var height= +svg.attr("height");
var projection=d3.geoMercator();

var path= d3.geoPath().projection(projection);


worldPromise= d3.json("world.json");
carbonPromise= d3.csv("newCo2.csv");
Promise.all([worldPromise,carbonPromise]).then(
    function(values){
        console.log("works",values);
		setup(values[0]);
		drawCircles(values);
		drawLegend();
		options();
    }, function(err){
        console.log("broken",err);
    }
)
var setup= function(data){
	//Creating the background Map
	svg.selectAll("path")
	.data(data.features)
	.enter()
.append("path").attr("d",path).style("stroke","white").style("fill","lightgray");}

// Color Scale for GDP 
var colorscale= function(data){
var color= d3.scaleQuantize()
.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)", "rgb(0,109,44)"])
color.domain([
	d3.min(data,function(d){return d.value;}),
	d3.max(data,function(d){return d.value;})
]);
}

var merge= function(values)
{
	console.log("values",values)
var dataA= values[0];
var dataB= values[1];
var hash={}
dataA.forEach(function(element)
{
	hash[element.features]=element
})
	
dataB.forEach(function(e2)
{
		if (hash[e2.emissions]){
			hash[e2.emissions].data=e2;
		} else console.log("e2.emissions", e2.entity, e2)
}) 
	console.log(dataA)
} 

/*var combine=function(world){
for (var i=0; i<data.length; i++){
	//grab country name 
	var dataCountry=data[i].emissions;
	//grab data value and convert from string to float 
	var dataValue=parseFloat(data[i].value);
	//find corresponding state inside the geoJson
	for (var j=0; j<world.features.length;j++){
		var jsonCountry= world.feautures[j].properties.name;
		if (dataState== jsonState){
			world.features[j].properties.value=dataValue;
			break;
		}
	}
}
} */


//Must redraw circles based on year
var drawCircles= function(data)
{
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data[0].features)
	.enter().append("circle")
	.attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
	.attr("r",2)//
	// function(d){return radius(d.properties.emmisions );})Here scale to Co2 emissions per capita 
}

var drawLegend=function(){
var size=d3.scaleSqrt()
.domain([1,30])
.range([1,30])
var show=[10,30,60]
var xCircle=110
var xLabel=200
var yCircle=400
d3.select("#legend").append("h1").text("Legend");
d3.select("#legend").selectAll("legend").data(show)
	.enter()
	.append("circle")
	.attr("cx",xCircle)
	.attr("cy",function(d){return yCircle-size(d)})
	.attr("r",function(d){return size(d)})
	.style("fill","none")
	.attr("stroke","black")
	    .style('stroke-dasharray', ('2,2'))

;
	
	//labels
	d3.select("#legend").selectAll("legend").data(show).enter()
	.append("text").attr("x",xLabel)
	.attr("y",function(d){return yCircle-size(d)})
	.text(function(d){return d})
	.style("font-size",10)
}

var options=function(){
//Create slider for Time 
 var allGroup=["Emissions-GDP","Emissions-Risk","GDP-Risk"]
//Create Drop Down
var dropDown= d3.select("#options").append("select").selectAll("myOptions").data(allGroup).enter().append("option").text(function(d){return d;}).attr("value",function(d){return d;})
}

