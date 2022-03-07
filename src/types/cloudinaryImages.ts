export interface Images {
  resources: Resource[];
  next_cursor: string;
  rate_limit_allowed: number;
  rate_limit_reset_at: null;
  rate_limit_remaining: number;
}

export interface Resource {
  asset_id: string;
  public_id: string;
  format: Format;
  version: number;
  resource_type: ResourceType;
  type: Type;
  created_at: Date;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
}

export enum Format {
  PNG = `png`,
}

export enum ResourceType {
  Image = `image`,
}

export enum Type {
  Upload = `upload`,
}
