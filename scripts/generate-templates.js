#!/usr/bin/env node

/**
 * This script creates basic university templates that can be inserted into the database
 * when it becomes available. It generates the JSON data for the templates.
 */

const templates = [
  {
    title: "Modern University Template",
    description: "A clean, modern design perfect for contemporary universities",
    status: "active",
    category: "landing",
    content: [
      {
        blockType: "university-hero",
        title: "Welcome to Our University",
        subtitle: "Discover excellence in education and innovation",
        style: "default"
      },
      {
        blockType: "university-about",
        title: "About Our University",
        layout: "side-by-side",
        stats: [
          { number: "10,000+", label: "Students", description: "From around the world" },
          { number: "500+", label: "Faculty", description: "Expert educators" },
          { number: "100+", label: "Programs", description: "Diverse offerings" },
          { number: "50+", label: "Years", description: "Of excellence" }
        ]
      },
      {
        blockType: "university-programs",
        title: "Our Programs",
        subtitle: "Explore our diverse range of academic offerings",
        layout: "grid"
      },
      {
        blockType: "university-contact",
        title: "Contact Us",
        layout: "side-by-side",
        showContactForm: true
      }
    ]
  },
  {
    title: "Classic University Template",
    description: "A traditional, elegant design for established institutions",
    status: "active",
    category: "landing",
    content: [
      {
        blockType: "university-hero",
        title: "Excellence in Education Since 1850",
        subtitle: "Building tomorrow's leaders through quality education",
        style: "centered"
      },
      {
        blockType: "university-about",
        title: "Our Heritage",
        layout: "image-top"
      },
      {
        blockType: "university-programs",
        title: "Academic Excellence",
        layout: "list"
      },
      {
        blockType: "university-contact",
        title: "Visit Our Campus",
        layout: "stacked"
      }
    ]
  },
  {
    title: "Tech University Template",
    description: "A cutting-edge design for technology-focused institutions",
    status: "active",
    category: "landing",
    content: [
      {
        blockType: "university-hero",
        title: "Innovation Starts Here",
        subtitle: "Leading the future of technology and research",
        style: "overlay"
      },
      {
        blockType: "university-programs",
        title: "Technology Programs",
        subtitle: "Cutting-edge curriculum for the digital age",
        layout: "carousel"
      },
      {
        blockType: "university-about",
        title: "Why Choose Tech University",
        layout: "centered"
      },
      {
        blockType: "university-contact",
        title: "Connect With Us",
        layout: "form-only"
      }
    ]
  },
  {
    title: "Liberal Arts Template",
    description: "An artistic, creative design for liberal arts colleges",
    status: "active",
    category: "landing",
    content: [
      {
        blockType: "university-hero",
        title: "Cultivating Creative Minds",
        subtitle: "Where art, culture, and learning converge",
        style: "left"
      },
      {
        blockType: "university-about",
        title: "Our Story",
        layout: "side-by-side"
      },
      {
        blockType: "university-programs",
        title: "Creative Programs",
        layout: "grid"
      },
      {
        blockType: "university-contact",
        title: "Join Our Community",
        layout: "info-only"
      }
    ]
  }
];

console.log("University Templates JSON Data:");
console.log(JSON.stringify(templates, null, 2));

// Also save to a file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'university-templates-seed.json');
fs.writeFileSync(outputPath, JSON.stringify(templates, null, 2));

console.log(`\nTemplates saved to: ${outputPath}`);
console.log("\nTo import these templates into your database, you can:");
console.log("1. Use Payload CMS admin interface");
console.log("2. Import via API calls");
console.log("3. Use a database migration script");