const fs = require('fs');

function analyzeDependencies(packageJsonPath = './package.json') {
    // Ensure package.json exists
    if (!fs.existsSync(packageJsonPath)) {
        console.error(`Error: ${packageJsonPath} not found. Please ensure you're running this script in the correct directory.`);
        process.exit(1);
    }

    // Read package.json
    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (err) {
        console.error('Error: Unable to parse package.json. Please check the file format.');
        process.exit(1);
    }

    // Combine all dependencies
    const allDependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
    };

    const report = {
        angular: {},
        thirdParty: {},
        critical: [],
        suggestions: [],
    };

    // Analyze Angular core packages
    Object.entries(allDependencies).forEach(([pkg, version]) => {
        if (pkg.startsWith('@angular/')) {
            report.angular[pkg] = {
                currentVersion: version,
                targetVersion: '^18.0.0',
                isCritical: true,
            };
            report.critical.push(`${pkg} needs to be updated from ${version} to ^18.0.0`);
        } else {
            report.thirdParty[pkg] = {
                currentVersion: version,
                needsReview: true,
            };
        }
    });

    // Common known package updates needed for Angular 18
    const knownUpdates = {
        'rxjs': {
            minVersion: '^7.0.0',
            note: 'Required for Angular 18. Major breaking changes from RxJS 5',
        },
        'typescript': {
            minVersion: '~5.2.0',
            note: 'Required for Angular 18',
        },
        'zone.js': {
            minVersion: '~0.14.0',
            note: 'Required for Angular 18',
        },
    };

    // Check for known critical packages
    Object.entries(knownUpdates).forEach(([pkg, info]) => {
        if (allDependencies[pkg]) {
            report.critical.push(`${pkg} needs to be updated to ${info.minVersion} - ${info.note}`);
        }
    });

    // Generate migration suggestions
    report.suggestions = [
        'Review and update RxJS operators to new syntax',
        'Check for deprecated HttpModule usage',
        'Review template syntax for dynamic values in structural directives',
        'Check for ViewEngine-specific code',
        'Review usage of renderers (Renderer to Renderer2)',
        'Check for HttpClient usage instead of Http',
        'Review forms usage for deprecated features',
    ];

    return report;
}

// Generate readable report
function generateReadableReport(report) {
    let output = '📊 Angular Migration Dependency Report\n\n';

    output += '🔷 Angular Core Packages:\n';
    Object.entries(report.angular).forEach(([pkg, info]) => {
        output += `  ${pkg}: ${info.currentVersion} → ${info.targetVersion}\n`;
    });

    output += '\n🔷 Third Party Packages to Review:\n';
    Object.entries(report.thirdParty).forEach(([pkg, info]) => {
        output += `  ${pkg}: ${info.currentVersion}\n`;
    });

    output += '\n⚠️ Critical Updates Required:\n';
    report.critical.forEach(item => {
        output += `  • ${item}\n`;
    });

    output += '\n📝 Migration Suggestions:\n';
    report.suggestions.forEach(suggestion => {
        output += `  • ${suggestion}\n`;
    });

    return output;
}

// Run the analyzer
const report = analyzeDependencies();
console.log(generateReadableReport(report));
