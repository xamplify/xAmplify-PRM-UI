const fs = require('fs');
const { exec } = require('child_process');

// Load package.json
const packageJsonPath = './package.json';

if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: package.json not found in the project root.');
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Extract Angular-related dependencies and devDependencies
const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
};

const angularPackages = Object.keys(dependencies).filter(dep =>
    dep.startsWith('@angular') || dep === 'typescript' || dep === 'rxjs'
);

if (angularPackages.length === 0) {
    console.log('No Angular-related dependencies found in package.json.');
    process.exit(0);
}

console.log('Analyzing Angular-related dependencies...\n');

// Function to check package version
const checkPackageVersion = (packageName, currentVersion) => {
    exec(`npm show ${packageName} version`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error checking version for ${packageName}:`, stderr.trim());
            return;
        }

        const latestVersion = stdout.trim();
        if (currentVersion === latestVersion) {
            console.log(`${packageName} is up to date (v${currentVersion}).`);
        } else {
            console.log(
                `${packageName} is outdated (current: v${currentVersion}, latest: v${latestVersion}).`
            );
        }
    });
};

// Check each Angular-related dependency
angularPackages.forEach(packageName => {
    const currentVersion = dependencies[packageName];
    checkPackageVersion(packageName, currentVersion);
});
