import { User } from "../../../models/User.js";

export class AuthRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByGoogleId(googleId: string) {
    return User.findOne({ googleId });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    clinicId?: string;
  }) {
    return User.create(data);
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    await User.findByIdAndUpdate(id, { refreshToken });
  }

  async verifyEmail(id: string) {
    await User.findByIdAndUpdate(id, { isVerified: true });
  }

  async updatePassword(id: string, passwordHash: string) {
    await User.findByIdAndUpdate(id, { passwordHash });
  }

  async updateProfile(id: string, data: { name?: string; email?: string }) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }
}
