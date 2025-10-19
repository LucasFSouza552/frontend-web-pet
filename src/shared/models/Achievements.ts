export interface IAchievement {
    id: string;
    name: string;
    description: string;
    type: "donation" | "sponsorship" | "adoption";
    createdAt: Date;
    updatedAt: Date;
}