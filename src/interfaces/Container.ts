export interface Container {
  id: string;
  userId: string;
  containerId: string;
  name: string;
  domain: Domain;
  image?: string;
  connectedNumber: number | string | null;
  port: number;
  callbackUrl: string | null;
  queue: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  recordId: string;
  name: string;
  url: string;
}
