import { VerificationToken } from "../../../models/VerificationToken.js";

export class TokenRepository {
  async create(data: { userId: string; token: string; type: string; expiresAt: Date }) {
    await VerificationToken.create(data);
  }

  async findByToken(token: string) {
    return VerificationToken.findOne({ token });
  }

  async markAsUsed(id: string) {
    await VerificationToken.findByIdAndUpdate(id, { usedAt: new Date() });
  }

  async invalidateUserTokens(userId: string, type: string) {
    await VerificationToken.updateMany(
      { userId, type, usedAt: null },
      { usedAt: new Date() }
    );
  }
}
