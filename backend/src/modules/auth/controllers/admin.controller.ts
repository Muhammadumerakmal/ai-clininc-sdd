import { Request, Response, NextFunction } from "express";
import { User } from "../../../models/User.js";
import { sendSuccess } from "../../../shared/response.js";
import { hashPassword } from "../services/password.service.js";

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role as string | undefined;

    const where = role ? { role } : {};

    const [users, total] = await Promise.all([
      User.find(where)
        .skip(skip)
        .limit(limit)
        .select("id email name role isVerified isActive createdAt")
        .sort({ createdAt: -1 }),
      User.countDocuments(where),
    ]);

    sendSuccess(res, {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name, role, clinicId } = req.body;
    const passwordHash = await hashPassword(password);

    const user = await User.create({ email, passwordHash, name, role, clinicId });
    sendSuccess(res, { id: user.id, email: user.email, name: user.name, role: user.role }, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const user = await User.findById(id).select("id email name role isVerified isActive clinicId createdAt updatedAt");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { name, email, role, isActive } = req.body;
    const data: Record<string, unknown> = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (role) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;

    const user = await User.findByIdAndUpdate(id, data, { new: true }).select("id email name role isActive");
    sendSuccess(res, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await User.findByIdAndUpdate(id, { isActive: false });
    sendSuccess(res, {}, "User deactivated successfully");
  } catch (error) {
    next(error);
  }
}
