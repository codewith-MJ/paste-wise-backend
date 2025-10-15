import jwt, { type SignOptions, type Secret } from "jsonwebtoken";

const rawSecret = process.env.JWT_SECRET ?? "";
if (!rawSecret) {
	throw new Error("JWT_SECRET missing");
}

const JWT_SECRET: Secret = rawSecret;
const ACCESS_TTL = Number(process.env.ACCESS_TOKEN_TTL || 900);

type AccessPayload = { sub: string; email: string; name?: string };

const issueAccessToken = (payload: AccessPayload): string => {
	const opts: SignOptions = { algorithm: "HS256", expiresIn: ACCESS_TTL };
	return jwt.sign(payload, JWT_SECRET, opts);
};

const verifyAccessToken = (token: string): AccessPayload => {
	return jwt.verify(token, JWT_SECRET) as AccessPayload;
};

export { issueAccessToken, verifyAccessToken };
