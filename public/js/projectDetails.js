const WIDTH = 1600;

document.addEventListener('DOMContentLoaded', function () {
    const milestonesElement = document.getElementById('milestoneData');

    document.getElementById('closeSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove("open")
    });

    if (milestonesElement) {
        const rawMilestones = JSON.parse(milestonesElement.getAttribute('data-milestones'));
        const milestones = transformData(rawMilestones);

        const minWidth = 120;

        function calculateTextWidth(text) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '12px Arial'; // Adjust font to match the actual font
            return context.measureText(text).width;
        }

        // Create the tree layout
        const root = d3.hierarchy(milestones);

        // Determine the number of levels (depth) in the tree
        const numLevels = root.height + 1; // `root.height` gives the number of edges from root to deepest leaf, so add 1 for the root level
        const treeHeight = numLevels * 100;

        // Clear any existing SVG elements
        const svgContainer = d3.select("#milestoneTree");
        svgContainer.selectAll("*").remove();

        // Create an SVG group to hold the entire tree structure
        const svg = svgContainer
            .attr("width", WIDTH + 100)
            .attr("height", treeHeight + 100);

        const svgGroup = svg.append("g");

        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.2, 4]) // Allow zoom between 20% and 400%
            .on("zoom", (event) => {
                svgGroup.attr("transform", event.transform);
            });

        // Apply the zoom behavior to the SVG container
        svgContainer.call(zoom);

        const treeLayout = d3.tree()
            .size([WIDTH, treeHeight])
            .nodeSize([275, 120]);

        treeLayout(root);

        const containerWidth = document.querySelector('.milestone-container').clientWidth;

        // Function to calculate the tree width based on the node positions
        function calculateTreeWidth() {
            const nodes = root.descendants();
            const minX = d3.min(nodes, d => d.x);
            const maxX = d3.max(nodes, d => d.x);
            return { minX, maxX, width: maxX - minX };
        }

        // Calculate tree width and adjust the initial zoom to fit the container
        const { minX, width: treeWidth } = calculateTreeWidth();
        let zoomScale = 1;

        if (treeWidth + 400 > containerWidth) {
            zoomScale = containerWidth / (treeWidth + 400);
        }

        // Set the initial translate to center the tree horizontally within the container
        const initialTranslateX = (containerWidth - treeWidth * zoomScale) / 2 - minX * zoomScale;

        // Set the initial zoom transformation to center the entire tree with scaling
        const initialTransform = d3.zoomIdentity
            .translate(initialTranslateX, 50)
            .scale(zoomScale);

        // Apply the default zoom transformation to center and fit the tree
        svgContainer.call(zoom.transform, initialTransform);

        

        // Create a diagonal path generator for the links
        const diagonal = d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y);

        // Add links between nodes
        svgGroup.selectAll(".link")
            .data(root.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", diagonal) // Use the diagonal generator for curvy links

        // Add the nodes (rectangles)
        const node = svgGroup.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .on("click", async (event, d) => {
                const currentPath = window.location.pathname;

                try {
                    const response = await fetch(`${currentPath}/${d.data.name}`);
                    const data = await response.json();
    
                    if (data.success) {
                        const sidebarContent = document.getElementById('sidebarContent');
                        sidebarContent.innerHTML = `
                            <h2 class="milestone-detail-title">
                                ${data.milestoneDetails.title}
                            </h2>
                            <p class="milestone-detail-description">${data.milestoneDetails.description}</p>

                            <div class="milestone-detail-section">
                                <p class="milestone-detail-heading"><strong>📜 Explanation:</strong></p>
                                <p>${data.milestoneDetails.explanation}</p>
                            </div>

                            <div class="milestone-detail-section">
                                <p class="milestone-detail-heading"><strong>🎯 Objectives:</strong></p>
                                <p>${data.milestoneDetails.objectives}</p>
                            </div>

                            <div class="milestone-detail-section">
                                <p class="milestone-detail-heading"><strong>📚 Resources:</strong></p>
                                <p>${data.milestoneDetails.resources}</p>
                            </div>

                            <div class="milestone-detail-section">
                                <p class="milestone-detail-heading"><strong>🛠 Skills Involved:</strong></p>
                                <p>${data.milestoneDetails.skills_involved}</p>
                            </div>

                            <div class="milestone-detail-section">
                                <p class="milestone-detail-heading"><strong>💡 Tips for Success:</strong></p>
                                <p>${data.milestoneDetails.tips_for_success}</p>
                            </div>

                            <div class="milestone-detail-section">
                                <p class="milestone-detail-heading"><strong>❗ Challenges & Risks:</strong></p>
                                <p>${data.milestoneDetails.challenges_and_risks}</p>
                            </div>
                        `;
                        document.getElementById('sidebar').classList.add("open")
                    } else {
                        alert(data.message);
                    }
                } catch (err) {
                    console.error('Error fetching milestone details:', err);
                }
            });

        // Add rectangles to the nodes with dynamic width and padding
        node.append("rect")
            .attr("width", d => Math.max(minWidth, calculateTextWidth(d.data.name) + 60))
            .attr("height", 40)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", d => -Math.max(minWidth, calculateTextWidth(d.data.name) + 60) / 2)
            .attr("y", -20);

        // Add text to the rectangles
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", 0)
            .text(d => d.data.name);
    }
});

function transformData(milestones) {
    // Create a lookup for all milestones based on their ID
    const lookup = {};
    milestones.forEach(milestone => {
        lookup[milestone.id] = { 
            name: milestone.title, 
            children: [] // Initialize with an empty array to store linked children
        };
    });

    // Initialize the root milestone (first milestone in the array)
    const root = { name: milestones[0].title, children: [] };

    // Build the tree structure
    milestones.forEach(milestone => {
        // Link each child milestone to its parent based on the children array
        milestone.children.forEach(childId => {
            if (lookup[childId]) {
                lookup[milestone.id].children.push(lookup[childId]);
            }
        });
    });

    // Only add the children of the root milestone to the root node's children
    const rootChildrenIds = milestones[0].children; // Get the children of the root milestone
    rootChildrenIds.forEach(childId => {
        if (lookup[childId]) {
            root.children.push(lookup[childId]);
        }
    });

    return root;
}






