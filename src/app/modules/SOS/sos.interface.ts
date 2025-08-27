
export interface ISOSRequest extends Document {
  userId: string;
  latitude: number;
  longitude: number;
  address: string;
  emergencyContacts: { name: string; phone: string }[];
  status: "active" | "resolved";
  createdAt: Date;
}