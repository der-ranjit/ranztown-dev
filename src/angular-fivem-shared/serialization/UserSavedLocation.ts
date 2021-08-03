export interface UserSavedLocation {
    userId: string;
    locationName: string;
    description: string;
    x: number;
    y: number;
    z: number;
    heading: number;
    /* relative to resource root */
    previewFilePath: string;
}
