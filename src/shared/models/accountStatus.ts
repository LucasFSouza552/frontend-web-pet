import type { IAccountAchievement } from "./AccountAchievement";
import type { IAchievement } from "./Achievements";

export interface IAccountStatus {
    postCount: number;
    achievements: IAchievement[];
}