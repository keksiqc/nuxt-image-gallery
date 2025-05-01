export interface BlobObject {
  pathname: string;
  key?: string;
}

export interface ImageFilter {
  contrast: number;
  blur: number;
  invert: number;
  saturate: number;
  hueRotate: number;
  sepia: number;
}