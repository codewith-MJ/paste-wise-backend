import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET missing");

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: JWT_SECRET,
			algorithms: ["HS256"],
		},
		(payload, done) => done(null, payload)
	)
);

export default passport;
