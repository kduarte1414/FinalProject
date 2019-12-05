/*var svg = d3.select("#map") 
var width =+svg.attr("width");
var height = +svg.attr("height");*/

//Output-side real GDP per capita (2011 international-$)

//"Deaths - Air pollution - Sex: Both - Age: Age-standardized (Rate) (deaths per 100,000)"
var screen= {width:800, height:800}
var margins={top:10,right:50,bottom:50,left:50}


    svg= d3.select("#map")
    .attr("width",screen.width)
    .attr("height",screen.height)

var projection=d3.geoMercator().translate([400,370]).scale([130])


var path= d3.geoPath().projection(projection);
worldPromise= d3.json("world.json");
carbonPromise= d3.csv("newCo2.csv");
gdpPromise=d3.csv("GDP.csv");
airPromise=d3.csv("air.csv");
Promise.all([worldPromise,carbonPromise, gdpPromise, airPromise]).then(
    function(values){
        setup(values);
		drawLegend();
     
    }, function(err){
        console.log("broken",err);
    }
)

//draw next 




//Draw Legend
/*var drawLegend=function(){
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
*/


//Set Up function creates the Map in the background and displays the circles for year: by default

var setup= function(values){
	//Creating the background Map

var data=values[0]

//getting the topoJson;
	svg.selectAll("path")
	.data(data.features)
	.enter()
.append("path").attr("d",path).style("stroke","white").style("fill","#92b6d5");
var combined=merge(values);
    year=1990;



var values=["Emissions Tonnes per Capita/GDP","Emissions Tonnes per Capita/Deaths related to Air Pollution","GDP/Deaths related to Air Pollution"];
	d3.select("#options").append("p").text("Click an option below to display data")
d3.select("#options").append("p").text(values[0]).on("click",function(){
    drawCircles(combined,year)
	
	d3.select("#year").selectAll("button").remove();
	d3.select("#year").append("button").text("next").attr("id","n");
	d3.select("#n").on("click",function(d){d3.select("#year").selectAll("h2").remove();
			d3.select("#year").append("h2").text(year);
		if(year<= 2017){
		next=year++;
			
		drawCircles(combined,next)
}});
	
});

d3.select("#options").append("p").text(values[1]).attr("id","second");
d3.select("#options").append("p").text(values[2]).attr("id","third");
d3.select("#second").on("click",function(){
   optionED(combined,year)
		
	d3.select("#year").selectAll("button").remove();
	d3.select("#year").append("button").text("next").attr("id","n");
	d3.select("#n").on("click",function(d){d3.select("#year").selectAll("h2").remove();
			d3.select("#year").append("h2").text(year);
		if(year<= 2017){
		next=year++;
			
		optionED(combined,next)
}});


});

d3.select("#third").on("click",function(){
   optionGD(combined,year)
   	
	d3.select("#year").selectAll("button").remove();
	d3.select("#year").append("button").text("next").attr("id","n");
	d3.select("#n").on("click",function(d){d3.select("#year").selectAll("h2").remove();
			d3.select("#year").append("h2").text(year);
		if(year<= 2017){
		next=year++;
			
		optionGD(combined,next)
}});
})
console.log("works", combined);


};
	
	

var merge= function(values)
{
    console.log("values",values)
    var dataA= values[0].features;
    var dataB= values[1];
	var dataC= values[2];
    var dataD= values[3]
    var hash={}
    
dataA.forEach(function(element)
{  
    element.data={}
	element.datag={}
    element.datar={}
	hash[element.properties.name]=element
})
	
dataB.forEach(function(e2)
{
		if (hash[e2.Name]){
			hash[e2.Name].data[e2.Year]=e2;
		} 
})
dataC.forEach(function(e3)
{	
    if(hash[e3.Name])//and the year maybe??
{
	hash[e3.Name].datag[e3.Year]
		=e3;}
 
	}
)
    dataD.forEach(function(e4)
    {	
    if(hash[e4.Name])//and the year maybe??
{
	hash[e4.Name].datar[e4.Year]
		=e4;}
 
	})
       console.log("dataA",dataA)
    return dataA
                  }
 




//Parameters:Takes in data and Year as input
var drawCircles= function(data,year)
{
    var radius = d3.scaleSqrt()
    .domain([0,64])
    .range([0,20]);
    // Color Scale for GDP 
var color= d3.scaleOrdinal()
.range(["rgb(237,248,233)","rgb(116,196,118)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,90,50)"]);
color.domain([
	215,515000]);
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
    //Options changes this information 
	.attr("r",function(d)

	{ 	
		if (d.data){
            emission=getEmission(d.data,year)
		r=radius(emission);
		}
		else {
			r=0
		}
		return r;
	})
	.style("fill",function(d){
        var value=GDP(d.datag,year)
        if (value){
            return color(value);}
        else { return "#ccc"}
        }
    )
.on("mouseover",function(d){
    
		name=d.data[year].Name
		d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
		d3.select("#info").append("h1").text(name);
		d3.select("#info").append("p").text("Emission:"+ getEmission(d.data,year))
		d3.select("#info").append("p").text("GDP:"+GDP(d.datag,year))
	})
		//.text("Country: "+d.data[year].Name+ " Emission: "+ getEmission(d.data,year))
        //.classed("hidden",false);
		
}

// Function that draws circles for deaths Vs Emissions
var optionED= function(data,year){
svg.selectAll(".bubble").remove();
	//Death counts will be bubble color
var color= d3.scaleOrdinal()
.range(["rgb(254,229,217)","rgb(252,187,161)","rgb(252,174,145)","rgb(251,106,74)"])
color.domain([
	8,320
]);
    
	var radius = d3.scaleSqrt()
    .domain([0,64])
    .range([0,20]);
    
	svg.selectAll(".bubble").remove();
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
	.enter().append("circle")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
    //Options changes this information 
	.attr("r",function(d)

	{ 	
		if (d.data){
      emission=getEmission(d.data,year)
		r=radius(emission);
		}
		else {
			r=0
		}
		return r;
	})
	.style("fill",function(d){
        var value=Death(d.datar,year)
        if (value){
            return color(value);}
        else { return "#ccc"}
        }
    )
       .on("mouseover",function(d){
    
		name=d.data[year].Name
		d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
		d3.select("#info").append("h1").text(name);
		d3.select("#info").append("p").text("Emission:"+ getEmission(d.data,year))
		d3.select("#info").append("p").text("Deaths:"+GDP(d.datag,year))
	})
}



var optionGD=function(data,year){
    var radius = d3.scaleSqrt()
    .domain([0,515000])
    .range([0,25]);
    svg.selectAll(".bubble").remove();
var color= d3.scaleOrdinal()
.range(["rgb(254,229,217)","rgb(252,187,161)","rgb(252,174,145)","rgb(251,106,74)"])
color.domain([
	8,320
]);
	svg.selectAll(".bubble").remove();
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
	.enter().append("circle").attr("class","cb");
	svg.selectAll(".cb")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
	
	
	.attr("r",function(d)

	{ 	
		if (d.datag){
            money=GDP(d.datag,year)
		  r=radius(money);
		}
		else {
			r=0
		}
		return r;
	})
	.style("fill",function(d){
        var value=Death(d.datar,year)
        if (value){
            return color(value);}
        else { return "#ccc"}
        }
    );
svg.selectAll(".cb").on("mouseover",function(d){
    
		name=d.data[year].Name
		d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
		d3.select("#info").append("h1").text(name+" "+year);
		
		d3.select("#info").append("p").text("GDP: "+GDP(d.datag,year));
		d3.select("#info").append("p").text("Deaths by Air Pollution: "+ Death(d.datar,year))
	})

}



var Death= function(country,time){
    if(country[time]){
       return country[time].Deaths
       }
}
var GDP=function(country,time){
    if(country[time]){
       return country[time].Gdp
       }
}
var getEmission=function(country,time)
{    if (country[time]){
	return country[time].Emissions}
 else{ return 0}
}


