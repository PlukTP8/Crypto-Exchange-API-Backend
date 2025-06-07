// types/express/index.d.ts
import { UserAttributes } from '../../models/User'; // หรือ type user ที่คุณต้องการ
import {User} from "../../models/User";
interface User {
  user_id: number;
  email: string;
}


declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes; 
    }
  }
}

export {};