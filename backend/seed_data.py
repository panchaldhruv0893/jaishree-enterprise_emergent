IMG = {
    "hero": "https://images.pexels.com/photos/31970889/pexels-photo-31970889.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "components": "https://images.pexels.com/photos/185545/pexels-photo-185545.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "cnc": "https://images.unsplash.com/photo-1713371398484-cc4e4f6a262a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    "blueprint": "https://images.pexels.com/photos/13083354/pexels-photo-13083354.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "facility": "https://images.pexels.com/photos/6034676/pexels-photo-6034676.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "drill": "https://images.pexels.com/photos/47091/drill-milling-milling-machine-drilling-47091.jpeg?auto=compress&cs=tinysrgb&w=1600",
}

CUSTOM_VALUE = "Custom / manufactured to requirement"

PRODUCTS = [
    {
        "slug": "vacuum-calibration-sleeves",
        "name": "Vacuum Calibration Sleeves",
        "tagline": "Engineered for accurate pipe sizing, controlled cooling and a reliable surface finish in pipe extrusion lines.",
        "image": "/images/sleeve-family.jpg",
        "order": 1,
        "published": True,
        "overview": [
            "Vacuum calibration sleeves are precision-engineered components that support accurate pipe sizing, controlled cooling, dependable surface finish and stable movement of the pipe through the calibration process.",
            "Jaishree Enterprise manufactures calibration sleeves to customer drawings and application requirements, supporting pipe extrusion lines across PVC and HDPE applications with components built for consistent, repeatable performance.",
        ],
        "applications": [
            "PVC pipe extrusion lines",
            "HDPE pipe extrusion lines",
            "Pipe sizing and cooling sections",
            "Replacement sleeves for existing extrusion equipment",
        ],
        "benefits": [
            {"title": "Consistent pipe dimensions", "text": "Precision-machined internal geometry supports stable, repeatable pipe sizing across production runs."},
            {"title": "Efficient heat transfer", "text": "Construction supports effective cooling of the pipe surface as it passes through calibration."},
            {"title": "Wear-resistant construction", "text": "Materials and finishes are selected to suit continuous contact with the moving pipe surface."},
            {"title": "Smooth pipe travel", "text": "Finished internal surfaces support stable, low-disturbance movement through the sleeve."},
            {"title": "Reliable surface finish", "text": "Accurate calibration contact helps maintain the intended outer surface quality of the pipe."},
            {"title": "Custom dimensions", "text": "Sleeves are manufactured to the dimensions and tolerances defined by your application."},
        ],
        "configurations": [
            {"name": "Custom configurations", "note": "Manufactured to your drawing and application requirement", "pending": False},
            {"name": "Conventional water-jacket configuration", "note": "Availability being confirmed — please enquire", "pending": True},
            {"name": "Cool-neck configuration", "note": "Availability being confirmed — please enquire", "pending": True},
        ],
        "specs": [
            {"label": "Pipe application", "value": "PVC / HDPE / as per requirement"},
            {"label": "Inside diameter", "value": "To customer drawing"},
            {"label": "Outside diameter", "value": "To customer drawing"},
            {"label": "Overall length", "value": CUSTOM_VALUE},
            {"label": "Material", "value": "Selected per application requirement"},
            {"label": "Cooling arrangement", "value": "To be confirmed with our team"},
            {"label": "Surface finish", "value": "Precision finished to requirement"},
            {"label": "Required tolerance", "value": "Per approved drawing"},
            {"label": "Drawing or sample reference", "value": "Accepted — PDF, DWG, DXF or physical sample"},
        ],
        "gallery": ["/images/sleeve-family.jpg", "/images/sleeve-installed.jpg", "/images/sleeve-unit.jpg", "/images/sleeve-cad-flow.webp", "/images/sleeve-cad-render.jpeg"],
        "real_photos": True,
        "seo": {
            "title": "Vacuum Calibration Sleeve Manufacturer Ahmedabad | Jaishree Enterprise",
            "description": "Vacuum calibration sleeves manufactured in Ahmedabad for PVC and HDPE pipe extrusion. Custom dimensions, built to drawing, since 1983. Request a quote.",
        },
    },
    {
        "slug": "pistons",
        "name": "Industrial Pistons",
        "tagline": "Custom industrial pistons produced for machinery manufacturers and replacement applications.",
        "image": IMG["components"],
        "order": 2,
        "published": True,
        "overview": [
            "Jaishree Enterprise manufactures custom industrial pistons for machinery builders and plant-maintenance teams that require dependable, dimensionally accurate components.",
            "Every piston is produced to the customer's drawing or sample, with material and dimensions confirmed against the application before production begins.",
        ],
        "applications": [
            "Plastics-processing machinery",
            "Industrial machinery OEM builds",
            "Replacement pistons manufactured to drawing or sample",
            "Plant maintenance and breakdown requirements",
        ],
        "benefits": [
            {"title": "Built-to-drawing manufacturing", "text": "Pistons are produced strictly against the approved drawing, sample or dimensional specification."},
            {"title": "Material customization", "text": "Material selection is supported and confirmed to suit the working conditions of the application."},
            {"title": "Dimensional customization", "text": "Diameters, lengths and features are machined to the specified dimensions and tolerances."},
            {"title": "Inspection and quality", "text": "Components are dimensionally inspected against the drawing before dispatch."},
        ],
        "configurations": [
            {"name": "Single-piece and small-batch production", "note": "Suited to OEM and replacement needs", "pending": False},
            {"name": "Repeat production", "note": "Scheduled batches against a standing drawing", "pending": False},
        ],
        "specs": [
            {"label": "Diameter", "value": "To customer drawing"},
            {"label": "Length", "value": "To customer drawing"},
            {"label": "Material", "value": "Per application requirement"},
            {"label": "Required tolerance", "value": "Per approved drawing"},
            {"label": "Surface finish", "value": "Precision finished to requirement"},
            {"label": "Quantity", "value": "Single piece to repeat batches"},
        ],
        "gallery": [IMG["components"], IMG["drill"], IMG["cnc"]],
        "seo": {
            "title": "Industrial Pistons Manufacturer India | Jaishree Enterprise Ahmedabad",
            "description": "Custom industrial pistons built to drawing for machinery OEMs and replacement applications. Manufactured in Ahmedabad since 1983. Send your drawing for a quote.",
        },
    },
    {
        "slug": "cylinders",
        "name": "Industrial Cylinders",
        "tagline": "Custom industrial cylinders and cylindrical machine components, manufactured to requirement.",
        "image": IMG["drill"],
        "order": 3,
        "published": True,
        "overview": [
            "Jaishree Enterprise produces custom industrial cylinders and cylindrical machine components for equipment manufacturers and maintenance teams.",
            "Components are manufactured from customer drawings, with sizes, materials and configurations confirmed against the application before production.",
        ],
        "applications": [
            "Plastics-processing and extrusion machinery",
            "Metallurgical and thermal-processing equipment",
            "General industrial machinery",
            "Replacement cylindrical components to drawing",
        ],
        "benefits": [
            {"title": "Custom sizes and configurations", "text": "Diameters, lengths and features produced to your specified dimensions."},
            {"title": "Manufactured from customer drawings", "text": "Production follows the approved drawing and application requirements."},
            {"title": "Repair and replacement applications", "text": "Availability being confirmed — please enquire with your requirement.", "pending": True},
            {"title": "Dimensional inspection", "text": "Each component is checked against the drawing before dispatch."},
        ],
        "configurations": [
            {"name": "Custom cylindrical components", "note": "To drawing and application requirement", "pending": False},
        ],
        "specs": [
            {"label": "Outside diameter", "value": "To customer drawing"},
            {"label": "Inside diameter", "value": "To customer drawing"},
            {"label": "Overall length", "value": CUSTOM_VALUE},
            {"label": "Material", "value": "Per application requirement"},
            {"label": "Required tolerance", "value": "Per approved drawing"},
            {"label": "Quantity", "value": "Single piece to repeat batches"},
        ],
        "gallery": [IMG["drill"], IMG["components"], IMG["hero"]],
        "seo": {
            "title": "Industrial Cylinders Manufacturer Gujarat | Jaishree Enterprise",
            "description": "Custom industrial cylinders and cylindrical machine components manufactured in Ahmedabad, Gujarat. Built to customer drawings. Request a quotation.",
        },
    },
    {
        "slug": "custom-components",
        "name": "Custom Engineering Components",
        "tagline": "A flexible engineering partner for low-volume, repeat-production and replacement components.",
        "image": IMG["blueprint"],
        "order": 4,
        "published": True,
        "overview": [
            "Beyond its standard product families, Jaishree Enterprise works as a flexible manufacturing partner for custom precision-machined and fabricated components.",
            "Share a drawing, a sample or a requirement — our team reviews it technically, confirms material and manufacturing approach, and produces the component with dimensional inspection before dispatch.",
        ],
        "applications": [
            "Low-volume and prototype-quantity components",
            "Repeat-production components to a standing drawing",
            "Replacement parts for machinery in service",
            "Components manufactured to customer drawings and samples",
        ],
        "benefits": [
            {"title": "Share your requirement", "text": "Send a drawing, sample or description of the component you need."},
            {"title": "Technical review", "text": "Our team reviews manufacturability, dimensions and application fit."},
            {"title": "Material and manufacturing confirmation", "text": "Material and process approach are confirmed with you before production."},
            {"title": "Production and inspection", "text": "The component is manufactured and dimensionally inspected against the drawing."},
            {"title": "Dispatch", "text": "Finished components are packed and dispatched to your schedule."},
        ],
        "configurations": [
            {"name": "Reverse engineering from sample", "note": "Availability being confirmed — please enquire", "pending": True},
            {"name": "Welding and fabrication work", "note": "Availability being confirmed — please enquire", "pending": True},
        ],
        "specs": [
            {"label": "Component type", "value": CUSTOM_VALUE},
            {"label": "Material", "value": "Per application requirement"},
            {"label": "Dimensions", "value": "To customer drawing or sample"},
            {"label": "Required tolerance", "value": "Per approved drawing"},
            {"label": "Quantity", "value": "Low volume to repeat production"},
        ],
        "gallery": [IMG["blueprint"], IMG["cnc"], IMG["components"]],
        "seo": {
            "title": "Custom Machinery Parts Gujarat | Precision Components | Jaishree Enterprise",
            "description": "Custom precision-machined and fabricated components for OEMs and plant maintenance across Gujarat. Built to drawing since 1983. Request a quote today.",
        },
    },
]

CAPABILITIES = [
    {"id": "cap-custom", "title": "Custom Manufacturing", "description": "Components manufactured to your drawing, sample or stated requirement — from single pieces to scheduled batches.", "icon": "Settings", "status": "confirmed", "order": 1},
    {"id": "cap-print", "title": "Built-to-Print Components", "description": "Production strictly against approved drawings, with dimensions and tolerances followed as specified.", "icon": "FileText", "status": "confirmed", "order": 2},
    {"id": "cap-material", "title": "Material Selection Support", "description": "Guidance on suitable materials for the working conditions of your application, confirmed before production.", "icon": "Layers", "status": "confirmed", "order": 3},
    {"id": "cap-inspection", "title": "Dimensional Inspection", "description": "Every component is checked against the drawing before dispatch.", "icon": "Ruler", "status": "confirmed", "order": 4},
    {"id": "cap-batch", "title": "Small-Batch & Repeat Production", "description": "Low-volume runs and repeat batches against a standing drawing, suited to OEM and maintenance schedules.", "icon": "Repeat", "status": "confirmed", "order": 5},
    {"id": "cap-oem", "title": "OEM & Replacement Components", "description": "Dependable supply of components for original equipment and in-service machinery replacement.", "icon": "Factory", "status": "confirmed", "order": 6},
    {"id": "cap-cnc", "title": "CNC Machining", "description": "Capability being confirmed by the owner — editable placeholder.", "icon": "Cog", "status": "pending", "order": 7},
    {"id": "cap-grinding", "title": "Grinding", "description": "Capability being confirmed by the owner — editable placeholder.", "icon": "CircleDot", "status": "pending", "order": 8},
    {"id": "cap-honing", "title": "Honing", "description": "Capability being confirmed by the owner — editable placeholder.", "icon": "Disc", "status": "pending", "order": 9},
    {"id": "cap-welding", "title": "Welding & Fabrication", "description": "Capability being confirmed by the owner — editable placeholder.", "icon": "Flame", "status": "pending", "order": 10},
]

MILESTONES = [
    {"id": "ms-1983", "year": "1983", "title": "Founded in Ahmedabad", "text": "Jaishree Enterprise is established in Tavdipura, Shahibaug, beginning its work in mechanical engineering and precision fabrication.", "placeholder": False, "order": 1},
    {"id": "ms-2", "year": "—", "title": "Milestone", "text": "Editable milestone — the owner can update this entry with a confirmed date and event from the company's history.", "placeholder": True, "order": 2},
    {"id": "ms-3", "year": "—", "title": "Milestone", "text": "Editable milestone — the owner can update this entry with a confirmed date and event from the company's history.", "placeholder": True, "order": 3},
    {"id": "ms-today", "year": "Today", "title": "Four Decades of Manufacturing", "text": "Jaishree Enterprise continues to support machinery manufacturers, OEMs and plant-maintenance teams with precision components from its Ahmedabad manufacturing base.", "placeholder": False, "order": 4},
]
