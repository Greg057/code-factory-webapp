document.addEventListener('DOMContentLoaded', function () {
    const milestonesElement = document.getElementById('milestoneData');
    if (milestonesElement) {
        // Parse the JSON data from the data-milestones attribute
        const rawMilestones = JSON.parse(milestonesElement.getAttribute('data-milestones'));
        const milestones = transformData(rawMilestones);

        // Minimum width for rectangles
        const minWidth = 120;

        // Function to calculate the width of text
        function calculateTextWidth(text) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '12px Arial'; // Match the font size used in CSS
            return context.measureText(text).width;
        }

        // Set up the dimensions and margins for the SVG
        const width = 1000, height = 600;
        const svg = d3.select("#milestoneTree")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(50, 50)");  // Adds margin

        // Create a tree layout and set the size
        const treeLayout = d3.tree()
            .size([width - 100, height - 100]);  // Set width/height to avoid clipping

        // Hierarchical data format
        const root = d3.hierarchy(milestones);

        // Generate the tree structure
        treeLayout(root);

        // Create a diagonal path generator for the links (curvy arrows)
        const diagonal = d3.linkVertical()
            .x(d => d.x)  // x-position of the link
            .y(d => d.y); // y-position of the link

        // Add arrows at the end of the lines
        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .style("fill", "#ccc");  // Color of the arrow

        // Add links between nodes
        svg.selectAll(".link")
            .data(root.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", diagonal);  // Use the diagonal generator for curvy links

        // Add the nodes (rectangles)
        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`);  // Position nodes

        // Add rectangles to the nodes with rounded corners
        node.append("rect")
            .attr("width", d => Math.max(minWidth, calculateTextWidth(d.data.name) + 20)) // Ensure minimum width
            .attr("height", 40)   // Height of the rectangle
            .attr("rx", 10)       // Rounded corners for the rectangle
            .attr("ry", 10)       // Rounded corners for the rectangle
            .attr("x", d => -Math.max(minWidth, calculateTextWidth(d.data.name) + 20) / 2) // Center the rectangle around the node's position
            .attr("y", -20);      // Centering the rectangle

        // Add text to the rectangles
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", 0)
            .style("text-anchor", "middle")
            .text(d => d.data.name);


        // Remove temporary SVG element
        tempSvg.remove();
    } else {
        console.error('Element with id "milestoneData" not found');
    }
});

function transformData(milestones) {
    const root = { name: "Start", children: [] };
    const lookup = {};  // To keep track of nodes by their IDs

    // Initialize nodes and add them to lookup
    milestones.forEach(milestone => {
        lookup[milestone.id] = { 
            name: milestone.title, 
            children: [] 
        };
    });

    // Build the hierarchical structure
    milestones.forEach(milestone => {
        if (milestone.dependencies.length === 0) {
            root.children.push(lookup[milestone.id]);
        } else {
            milestone.dependencies.forEach(depId => {
                if (lookup[depId]) {
                    lookup[depId].children.push(lookup[milestone.id]);
                }
            });
        }
    });

    return root;
}
