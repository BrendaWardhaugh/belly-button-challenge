// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });
  
// Initialize the dashboard at start up 
function init() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        }); 
        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

// Function that populates metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

function buildGaugeChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
 // Retrieve all metadata
 let metadata = data.metadata;

 // Filter based on the value of the sample
 let value = metadata.filter(result => result.id == sample);

 // Log the array of metadata objects after the have been filtered
 console.log(value)

 // Get the first index from the array
 let valueData = value[0];
 let frequency = valueData.wfreq
 var level = 10;

 // Trig to calc meter point
 function gaugePointer(value){
     
    // var degrees = 180 - value,
    var degrees = 180 -(20* value)
      radius = .5;
 var radians = degrees * Math.PI / 180;
 var x = radius * Math.cos(radians);
 var y = radius * Math.sin(radians);
 
 // Path: may have to change to create a better triangle
 var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
 var path = mainPath.concat(pathX,space,pathY,pathEnd);
     
     return path;
 
 }
 
 var data = [{ type: 'scatter',
    x: [0], y:[0],
     marker: {size: 18, color:'850000'},
     showlegend: false,
     name: 'speed',
     text:  (20* frequency),
     hoverinfo: 'text+name'},
   { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
   rotation: 90,
   text: ['8-9', '7-8-', '6-7', '5-6',
             '4-5', '3-4', '2-3', '1-2', '0-1', ''],
   textinfo: 'text',
   textposition:'inside',	  
   marker: {colors:["#84B589", "#89BC8D", "#8BC086", "#B7CD8F", "#D5E599", "#E5E8B0", "#E9E7C9", "#F4F1E4", "#F8F3EC"
]},
   labels: ['8-9', '7-8-', '6-7', '5-6',
   '4-5', '3-4', '2-3', '1-2', '0-1', ''],
   hoverinfo: 'label',
   hole: .5,
   type: 'pie',
   showlegend: false
 }];
 
 var layout = {
   shapes:[{
       type: 'path',
       path: gaugePointer(frequency),
       fillcolor: '850000',
       line: {
         color: '850000'
       }
     }],
   //title: '<b>Gauge</b> <br> Speed 0-100',
     autosize:true,
   //height: 1000,
   //width: 1000,
   xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
   yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
 };
 

// var data = [
//     {
//       domain: { x: [0, 1], y: [0, 1] },
//       value: frequency,
//       title: { text: "Speed" },
//       type: "indicator",
//       mode: "gauge+number",
//       gauge: {
//         axis: { range: [null, 9] },
//         steps: [
//           { range: [0, 1], color: "#F8F3EC" },
//           { range: [1, 2], color: "#F4F1E4" },
//           { range: [2, 3], color: "#E9E7C9" },
//           { range: [3, 4], color: "#E5E8B0" },
//           { range: [4, 5], color: "#D5E599" },
//           { range: [5, 6], color: "#B7CD8F" },
//           { range: [6, 7], color: "#8BC086" },
//           { range: [7, 8], color: "#89BC8D" },
//           { range: [8, 9], color: "#84B589" }
//         ],
//       }
//     }
//   ];

//   var layout = {shapes:[{
//     type: 'path',
//     path: gaugePointer(frequency),
//     fillcolor: '850000',
//     line: {
//       color: '850000'
//     }
//   }],
// //title: '<b>Gauge</b> <br> Speed 0-100',
//   autosize:true,
// //height: 1000,
// //width: 1000,
// xaxis: {zeroline:false, showticklabels:false,
//            showgrid: false, range: [-1, 1]},
// yaxis: {zeroline:false, showticklabels:false,
//            showgrid: false, range: [-1, 1]}
//   };
  Plotly.newPlot('gauge', data, layout);
});
};

  // Call the initialize function
init();