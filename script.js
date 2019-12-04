/*var svg = d3.select("#map") 
var width =+svg.attr("width");
var height = +svg.attr("height");*/

//Output-side real GDP per capita (2011 international-$)

//"Deaths - Air pollution - Sex: Both - Age: Age-standardized (Rate) (deaths per 100,000)"
var screen= {width:800, height:800}
var margins={top:10,right:50,bottom:50,left:50}

//Setup functions binds data to penguins 

    svg= d3.select("#map")
    .attr("width",screen.width)
    .attr("height",screen.height)

var projection=d3.geoMercator().translate([500,500]).scale([150])


var path= d3.geoPath().projection(projection);
worldPromise= d3.json("world.json");
carbonPromise= d3.csv("newCo2.csv");
gdpPromise=d3.csv("GDP.csv");
Promise.all([worldPromise,carbonPromise, gdpPromise]).then(
    function(values){
        setup(values);
		drawLegend();
		options();
     
    }, function(err){
        console.log("broken",err);
    }
)

//Draw Legend
var drawLegend=function(){
var size=d3.scaleSqrt()
.domain([1,30])
.range([1,15])
var show=[10,30,60]
var xCircle=110
var xLabel=150
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
var allGroup=["Emissions-GDP","Emissions-Air","GDP-Air"]
var dropDown= d3.select("#options").append("select").selectAll("myOptions").data(allGroup).enter().append("option").text(function(d){return d;}).attr("value",function(d){return d;})
}

//Set Up function creates the Map in the background and displays the circles for year: by default

var setup= function(values){
	//Creating the background Map

var data=values[0]

//getting the topoJson;
	svg.selectAll("path")
	.data(data.features)
	.enter()
.append("path").attr("d",path).style("stroke","white").style("fill","lightgray");
var combined=merge(values);
console.log("works", combined);
	year=1990;
drawCircles(combined,year)
	
//Creating a time slider
	d3.select("#slide").append("button").text("next").attr("id","n");
	d3.select("#n").on("click",function(d){
		if(year<= 2017){
		next=year++;
			console.log("year",year);
		drawCircles(combined,next)
}});
	
	
	

// Color Scale for GDP 
var colorscale= function(data){
var color= d3.scaleQuantize()
.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)", "rgb(0,109,44)"])
color.domain([
	d3.min(data,function(d){return d.value;}),
	d3.max(data,function(d){return d.value;})
]);
}}

var merge= function(values)
{
    console.log("values",values)
    var dataA= values[0].features;
    var dataB= values[1];
	var dataC= values[2];
    var hash={}
    
dataA.forEach(function(element)
{  
    element.data={}
	element.datag={}
	hash[element.properties.name]=element
})
	
dataB.forEach(function(e2)
{
		if (hash[e2.Name]){
			hash[e2.Name].data[e2.Year]=e2;
		} 
})
dataC.forEach(function(e3)
{	if(hash[e3.Name])//and the year maybe??
{
	hash[e3.Name].datag[e3.Year]
		=e3;}
 
	}
)
    console.log("dataA",dataA)
    return dataA
} 


	var radius = d3.scaleSqrt()
    .domain([0,64])
    .range([0,20]);

//Parameters:Takes in data and Year as input
var drawCircles= function(data,year)
{

	svg.selectAll(".bubble").remove();
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
		/*.sort(function(a,b){ console.log(b.getEmission(d.data,year)-a.getEmission(d.data,year));})*/
	.enter().append("circle")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
	.attr("r",function(d)

	{ 	 //d.data[1990].Emissions
		if (d.data){
            emission=getEmission(d.data,year)
		r=radius(emission);
		}
		else {
			r=0
		}
		return r;
	})
	//.style("fill",function(d){})
.on("mouseover",function(d){
        d3.select("#tooltip")
        .style("left",(d3.event.pageX+20+"px"))
        .style("top",(d3.event.pageY-15+"px"))
		.text("Country: "+d.data[year].Name+ " Emission: "+ getEmission(d.data,year))
        .classed("hidden",false);
		
        }) 
.on("mouseout",function(){
  d3.select("#tooltip").classed("hidden",true)
    })
}

//Creating a time slider


	//Create buttons for each time

//parameters: takes in country (d.data)and returns that country for the specified year Emission

var getEmission=function(country,time)
{    if (country[time]){
	return country[time].Emissions}
}


