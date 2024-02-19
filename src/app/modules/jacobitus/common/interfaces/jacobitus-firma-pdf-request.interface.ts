export interface IJacobitusFirmaPdfRequest {
  slot: number;
  pin: string;
  alias: string;
  pdf: string;
  image?: string;
  point?: {
    x: number;
    y: number;
  };
}
