# Personal Site

This repository contains my personal website, deployed using GitHub Pages. The static site content is located in the repository root and is automatically deployed whenever changes are pushed to the `main` branch.

## 🚀 Features

- Static site generated with HTML, CSS, and JavaScript
- Automatic deployment to GitHub Pages via GitHub Actions
- Only the repository root is published as the website

## 📦 Project Structure

```
.
├── index.html            # Static site entry point
├── app.js                # Application JavaScript
├── style.css             # Stylesheet
├── .github/
│   └── workflows/
│       ├── static.yml    # Agenda update workflow
│       └── deploy.yml    # Site deployment workflow
└── README.md
```

## 🛠️ Deployment

- Agenda update: [`.github/workflows/static.yml`](.github/workflows/static.yml) updates the agenda data via a Python script.
- Site deployment: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) generates `config.js` with your `LINEAR_API_KEY` and publishes the repository root to GitHub Pages.

Both workflows run automatically on pushes to `main`. You can also trigger them manually from the Actions tab.

## 📄 Usage

1. Make your changes in the repository root.
2. Commit and push to the `main` branch.
3. Your changes will be automatically published to your GitHub Pages site.

## 🔗 Live Site

View the live site here:  
https://codesapienbe.github.io/me/

## 📝 License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.

### License Summary

- **Attribution**: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial**: You may not use the material for commercial purposes.
- **NoDerivatives**: If you remix, transform, or build upon the material, you may not distribute the modified material.

### Special Conditions

- **Identity Protection**: The content of the resume, including personal information and identity-specific details, is protected and should not be copied or used for impersonation or identity theft.
- **Design and Style Usage**: The design and style elements of the resume (such as CSS styles and layout) can be freely used and adapted for personal or educational purposes, provided that the original content is not replicated.

For more details, visit: [Creative Commons License](https://creativecommons.org/licenses/by-nc-nd/4.0/)
