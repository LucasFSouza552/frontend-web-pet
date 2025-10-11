export interface IAchievement {
    name: string;
    description: string;
    type: "donation" | "sponsorship" | "adoption";
    createdAt: Date;
    updatedAt: Date;
}