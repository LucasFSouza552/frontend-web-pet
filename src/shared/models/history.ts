import type { IHistoryStatus } from "../types/IHistoryStatus";
import type { IAccount } from "./Account";
import type IPet from "./Pet";


export default interface IHistory {
  id: string;
  type: "adoption" | "sponsorship" | "donation";
  status?: IHistoryStatus;
  pet?: string | IPet | null;
  institution?: string | IAccount | null;
  account: string | IAccount;
  amount?: string;
  externalReference?: string | null;
  createdAt: string;
  updatedAt: string;
}

