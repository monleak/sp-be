import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import CRUDController from './base/crud.controller';
import UserService from '@services/users.service';

class UsersController extends CRUDController<User, CreateUserDto, CreateUserDto, UserService> {
  public constructor() {
    const service = new UserService();
    super(service);
  }
}

// class UsersController {
//   public userService = new userService();

//   public getUsers = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const findAllUsersData: User[] = await this.userService.findAll();

//       res.status(200).json({ data: findAllUsersData, message: 'findAll' });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public getUserById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = Number(req.params.id);
//       const findOneUserData: User = await this.userService.findById(userId);

//       res.status(200).json({ data: findOneUserData, message: 'findOne' });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userData: CreateUserDto = req.body;
//       const createUserData: User = await this.userService.create(userData);

//       res.status(201).json({ data: createUserData, message: 'created' });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public updateUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = Number(req.params.id);
//       const userData: CreateUserDto = req.body;
//       const updateUserData: User = await this.userService.update(userId, userData);

//       res.status(200).json({ data: updateUserData, message: 'updated' });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = Number(req.params.id);
//       const deleteUserData: User = await this.userService.delete(userId);

//       res.status(200).json({ data: deleteUserData, message: 'deleted' });
//     } catch (error) {
//       next(error);
//     }
//   };
// }

export default UsersController;