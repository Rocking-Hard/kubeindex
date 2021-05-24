import packageInfo from '../../package.json';

export const environment = {
    version: packageInfo.version,
    production: false,
    cloudguardUrl: "http://localhost:3000/api/v1",
    harborUrl: "",
}