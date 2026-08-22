export const IMG = {
  hero: "https://images.pexels.com/photos/31970889/pexels-photo-31970889.jpeg?auto=compress&cs=tinysrgb&w=1600",
  components: "https://images.pexels.com/photos/185545/pexels-photo-185545.jpeg?auto=compress&cs=tinysrgb&w=1600",
  cnc: "https://images.unsplash.com/photo-1713371398484-cc4e4f6a262a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  blueprint: "https://images.pexels.com/photos/13083354/pexels-photo-13083354.jpeg?auto=compress&cs=tinysrgb&w=1600",
  facility: "https://images.pexels.com/photos/6034676/pexels-photo-6034676.jpeg?auto=compress&cs=tinysrgb&w=1600",
  drill: "https://images.pexels.com/photos/47091/drill-milling-milling-machine-drilling-47091.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

export const COMPANY = {
  name: "Jaishree Enterprise",
  email: "jaishreeenterprise@yahoo.com",
  indiamart: "https://www.indiamart.com/jaishree-enterprise-ahmedabad/",
  addressLines: ["328-5, Devjipura, Dudheshwar", "Ahmedabad, Gujarat 380004, India"],
  founded: "1983",
};

export const NAV_LINKS = [
  { label: "Home", to: "/", testid: "nav-home" },
  {
    label: "Products",
    to: "/products",
    testid: "nav-products",
    children: [
      { label: "Vacuum Calibration Sleeves", to: "/products/vacuum-calibration-sleeves", testid: "nav-product-sleeves" },
      { label: "Pistons", to: "/products/pistons", testid: "nav-product-pistons" },
      { label: "Cylinders", to: "/products/cylinders", testid: "nav-product-cylinders" },
      { label: "Custom Components", to: "/products/custom-components", testid: "nav-product-custom" },
    ],
  },
  { label: "Industries", to: "/industries", testid: "nav-industries" },
  { label: "Capabilities & Quality", to: "/capabilities", testid: "nav-capabilities" },
  { label: "About Us", to: "/about", testid: "nav-about" },
  { label: "Our History", to: "/history", testid: "nav-history" },
  { label: "Contact", to: "/contact", testid: "nav-contact" },
];

export const PRODUCT_OPTIONS = [
  "Vacuum Calibration Sleeves",
  "Industrial Pistons",
  "Industrial Cylinders",
  "Custom Engineering Components",
  "Other / Custom Requirement",
];

export const EXPERIENCE = [
  "Windsor Machines Limited",
  "Ingersoll Rand",
  "Rollepaal, Netherlands",
  "Milacron",
  "Inductotherm",
];

export const INDUSTRIES = [
  {
    id: "pipe-extrusion",
    title: "Plastic Extrusion & Pipe Manufacturing",
    text: "Vacuum calibration sleeves and extrusion-line components that support dimensional accuracy, cooling performance and reliable pipe surface finish.",
  },
  {
    id: "plastics-machinery",
    title: "Plastic-Processing Machinery",
    text: "Precision components for machinery builders who need dependable fit, repeatable dimensions and responsive supply.",
  },
  {
    id: "metallurgical",
    title: "Metallurgical & Thermal-Processing Equipment",
    text: "Machined and fabricated components for metallurgical and thermal-processing equipment, built to the approved drawing.",
  },
  {
    id: "industrial-oem",
    title: "Industrial OEMs",
    text: "Built-to-print components supplied to original equipment manufacturers as single pieces, small batches or repeat production.",
  },
  {
    id: "plant-maintenance",
    title: "Plant Maintenance & Replacement Components",
    text: "Replacement components manufactured to drawing or sample, helping maintenance teams return equipment to service with the correct dimensional fit.",
  },
  {
    id: "gidc-msme",
    title: "GIDC-Based MSME Manufacturers",
    text: "Responsive local support for manufacturers across Gujarat's GIDC industrial clusters — from one-off requirements to scheduled supply.",
  },
];

export const FAQS_SLEEVES = [
  {
    q: "Can you manufacture a calibration sleeve to our pipe dimensions?",
    a: "Yes. Sleeves are manufactured to your drawing or stated dimensions. Share the pipe application, inside and outside diameters, length and required tolerance, and our team will confirm manufacturability.",
  },
  {
    q: "Which pipe materials are your sleeves used for?",
    a: "Our sleeves support PVC and HDPE pipe extrusion applications. For other materials, share your requirement and we will review it.",
  },
  {
    q: "What information should we send for a quotation?",
    a: "A drawing or sample reference is ideal. Otherwise share pipe application, dimensions, material preference, quantity and required delivery date through the enquiry form.",
  },
  {
    q: "Do you manufacture replacement sleeves for existing lines?",
    a: "Yes. Replacement sleeves can be manufactured to the original drawing or to a sample from your existing equipment.",
  },
];

export const MARQUEE_ITEMS = [
  "Vacuum Calibration Sleeves",
  "Industrial Pistons",
  "Industrial Cylinders",
  "Custom Precision Components",
  "Built-to-Drawing Manufacturing",
  "PVC & HDPE Extrusion",
  "Ahmedabad · Gujarat",
  "Since 1983",
];
