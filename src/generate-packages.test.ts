import { createPackageJSON, createReadme, getLicenseFileText } from "./generate-packages";
import { Registry } from "./lib/common";
import { TypingsData, TypingsDataRaw, License, AllPackages } from "./lib/packages";
import { testo } from "./util/test";
import { createMockDT } from "./mocks"
function createRawPackage(license: License): TypingsDataRaw {
    return {
        libraryName: "jquery",
        typingsPackageName: "jquery",
        dependencies: [],
        testDependencies: [],
        pathMappings: [],
        contributors: [{ name: "A", url: "b@c.d", githubUsername: "e" }],
        libraryMajorVersion: 1,
        libraryMinorVersion: 0,
        minTsVersion: "3.0",
        typesVersions: [],
        files: ["index.d.ts", "jquery.test.ts"],
        license,
        packageJsonDependencies: [],
        contentHash: "11",
        projectName: "jquery.org",
        globals: [],
        declaredModules: ["juqery"],
    }
}
testo({
    mitLicenseText() {
        const typing = new TypingsData(createRawPackage(License.MIT), /*isLatest*/ true);
        expect(getLicenseFileText(typing)).toEqual(expect.stringContaining("MIT License"));
    },
    apacheLicenseText() {
        const typing = new TypingsData(createRawPackage(License.Apache20), /*isLatest*/ true);
        expect(getLicenseFileText(typing)).toEqual(expect.stringContaining("Apache License, Version 2.0"));
    },
    basicReadme() {
        const typing = new TypingsData(createRawPackage(License.Apache20), /*isLatest*/ true);
        expect(createReadme(typing, Registry.NPM)).toEqual(expect.stringContaining("This package contains type definitions for"));
    },
    githubReadme() {
        const typing = new TypingsData(createRawPackage(License.Apache20), /*isLatest*/ true);
        expect(createReadme(typing, Registry.Github)).toEqual(expect.stringContaining("npm install --save @testtypepublishing/"));
    },
    readmeContainsProjectName() {
        const typing = new TypingsData(createRawPackage(License.Apache20), /*isLatest*/ true);
        expect(createReadme(typing, Registry.NPM)).toEqual(expect.stringContaining("jquery.org"));
    },
    readmeNoDependencies() {
        const typing = new TypingsData(createRawPackage(License.Apache20), /*isLatest*/ true);
        expect(createReadme(typing, Registry.NPM)).toEqual(expect.stringContaining("Dependencies: none"));
    },
    readmeNoGlobals() {
        const typing = new TypingsData(createRawPackage(License.Apache20), /*isLatest*/ true);
        expect(createReadme(typing, Registry.NPM)).toEqual(expect.stringContaining("Global values: none"));
    },
    async basicPackageJson() {
        const packages = await AllPackages.read(createMockDT());
        const typing = new TypingsData(createRawPackage(License.MIT), /*isLatest*/ true);
        expect(createPackageJSON(typing, "1.0", packages, Registry.NPM)).toEqual(`{
    "name": "@types/jquery",
    "version": "1.0",
    "description": "TypeScript definitions for jquery",
    "license": "MIT",
    "contributors": [
        {
            "name": "A",
            "url": "b@c.d",
            "githubUsername": "e"
        }
    ],
    "main": "",
    "types": "index",
    "repository": {
        "type": "git",
        "url": "https://github.com/DefinitelyTyped/DefinitelyTyped.git",
        "directory": "types/jquery"
    },
    "scripts": {},
    "dependencies": {},
    "typesPublisherContentHash": "11",
    "typeScriptVersion": "3.0"
}`);
    },
    async githubPackageJsonName() {
        const packages = await AllPackages.read(createMockDT());
        const typing = new TypingsData(createRawPackage(License.MIT), /*isLatest*/ true);
        expect(createPackageJSON(typing, "1.0", packages, Registry.Github)).toEqual(
            expect.stringContaining('"name": "@testtypepublishing/jquery"'));
    },
    async githubPackageJsonRegistry() {
        const packages = await AllPackages.read(createMockDT());
        const typing = new TypingsData(createRawPackage(License.MIT), /*isLatest*/ true);
        const s = createPackageJSON(typing, "1.0", packages, Registry.Github);
        expect(s).toEqual(expect.stringContaining('publishConfig'));
        expect(s).toEqual(expect.stringContaining('"registry": "https://npm.pkg.github.com/"'));
    },
});
