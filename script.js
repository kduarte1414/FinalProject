var svg= d3.select("#map") 
var width=+svg.attr("width");
var height= +svg.attr("height");
var projection=d3.geoMercator();

var path= d3.geoPath().projection(projection);


worldPromise= d3.json("world.json");
carbonPromise= d3.csv("newCo2.csv");
Promise.all([worldPromise,carbonPromise]).then(
    function(values){
        setup(values[0]);
       binded= merge(values);
        console.log("works", binded);

		drawCircles(binded);
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
    var dataA= values[0].features;
    var dataB= values[1];
    var hash={}
    
dataA.forEach(function(element)
{  
    element.data={}
	hash[element.properties.name]=element
    console.log(dataA);
})
	
dataB.forEach(function(e2)
{
		if (hash[e2.Name]){
			hash[e2.Name].data[e2.Year]=e2;
		} else console.log("e2.name", e2.Name, e2)
}) 
    console.log("dataA",dataA)
    return dataA
} 

//Must redraw circles based on year
var drawCircles= function(data)
{
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
	.enter().append("circle")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
	.attr("r",function(d){
        console.log(d.data)
        return 2})
    .on("click",function(d){
console.log("okay")//
	// function(d){return radius(d.data.emmisions );})Here scale to Co2 emissions per capita 
})
}
//Get emissions for specified year 
var getEmissions=function(country){
    return country.Emissions
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
	    .style('stroke-dasharray',('2,2'))

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

