import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  } catch {
    throw new Error('비밀번호 해싱 중 오류가 발생했습니다.');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    return false; // 에러 발생 시 인증 실패로 처리
  }
};
