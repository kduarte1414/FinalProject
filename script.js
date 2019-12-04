var svg = d3.select("#map") 
var width =+svg.attr("width");
var height = +svg.attr("height");
var projection=d3.geoMercator();

var path= d3.geoPath().projection(projection);
worldPromise= d3.json("world.json");
carbonPromise= d3.csv("newCo2.csv");
Promise.all([worldPromise,carbonPromise]).then(
    function(values){
        setup(values);
		drawLegend();
		options();
     
    }, function(err){
        console.log("broken",err);
    }
)


//Set Up function creates the Map in the background and displays the circles for year: by default

var setup= function(values){
	//Creating the background Map
var data=values[0]//getting the topoJson;
	svg.selectAll("path")
	.data(data.features)
	.enter()
.append("path").attr("d",path).style("stroke","white").style("fill","rgb(116,196,118)");
var combined=merge(values);
console.log("works", combined);
drawCircles(combined,2011)


}

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
})
	
dataB.forEach(function(e2)
{
		if (hash[e2.Name]){
			hash[e2.Name].data[e2.Year]=e2;
		} 
}) 
    console.log("dataA",dataA)
    return dataA
} 


	var radius = d3.scaleSqrt()
    .domain([0,64])
    .range([0,15]);

//Parameters:Takes in data and Year as input
var drawCircles= function(data,year)
{

	
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
		/*.sort(function(a,b){return b.data[1990].Emissions-a.data[1990].Emissions;})*/
	.enter().append("circle")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
	.attr("r",function(d)

	{ 	 						  emission=getEmission(d.data,year)//d.data[1990].Emissions
		if (emission>=0){
		console.log("emissions for",year, emission)
		r=radius(emission);
		}
		else {
			r=0
		}
		return r;
	})
.on("mouseover",function(d){
        d3.select("#tooltip")
        .style("left",(d3.event.pageX+20+"px"))
        .style("top",(d3.event.pageY-15+"px"))
        .classed("hidden",false)
        }) 
.on("mouseout",function(){
  d3.select("#tooltip").classed("hidden",true)
    })
}	

 
//parameters: takes in country (d.data)and returns that country for the specified year Emission
var getEmission=function(country,time)
{
	return country[time].Emissions
}

//Draw Legend
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
	    .style('stroke-dasharray',('2,2'));
//labels
	d3.select("#legend").selectAll("legend").data(show).enter()
	.append("text").attr("x",xLabel)
	.attr("y",function(d){return yCircle-size(d)})
	.text(function(d){return d})
	.style("font-size",10)
}

//Drop Down Menu
var options=function(){
var allGroup=["Emissions-GDP","Emissions-Risk","GDP-Risk"]
var dropDown= d3.select("#options").append("select").selectAll("myOptions").data(allGroup).enter().append("option").text(function(d){return d;}).attr("value",function(d){return d;})
}

//slider 
var slider= document.getElemenById("Range");
var output=document.geElemenById("demo");
output.innerHTML=slider.value;

slider.oninput = function() {
 output.innerHTML = this.value;
}
