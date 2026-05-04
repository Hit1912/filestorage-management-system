import { Router } from 'express';
import { updateUserController } from '../../controllers/user.controller';

const userRoutes = Router();

userRoutes.patch('/update', updateUserController);

export default userRoutes;
