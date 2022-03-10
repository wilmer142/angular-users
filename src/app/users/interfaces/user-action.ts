import { UserActionEnum } from "../enums/user-action.enum";
import { User } from "./user";

export interface UserAction {
    user: User;
    action: UserActionEnum
}
