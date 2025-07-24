
export type Format = 'MP3' | 'MP4';

export interface QualityOption {
    label: string;
    value: string;
}

export interface QualityOptions {
    MP3: QualityOption[];
    MP4: QualityOption[];
}

export interface VideoDetails {
    id: string;
    title: string;
    author: string;
    thumbnail: string;
    duration: number; // in seconds
}

export interface Download {
    id: string;
    title:string;
    format: Format;
    quality: string;
    timestamp: Date;
}
