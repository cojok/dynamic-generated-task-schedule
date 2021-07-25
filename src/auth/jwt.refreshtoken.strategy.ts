// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UserService } from '../user/user.service';

// @Injectable()
// export class JwtRefreshTokenStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refreshtoken',
// ) {
//   constructor(private userService: UserService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromBodyField('accessToken'),
//       ignoreExpiration: true,
//       secretOrKey: 'My Secret Never let outsiders',
//       passReqToCallback: true,
//     });
//   }

//   async validate(req, payload: any) {
//     const user = await this.userService.findOne(payload.username);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     if (req.body.refreshToken != (await user).refreshtoken) {
//       throw new UnauthorizedException();
//     }
//     if (new Date() > new Date((await user).refreshtokenexpires)) {
//       throw new UnauthorizedException();
//     }
//     return { userId: payload.sub, username: payload.username };
//   }
// }
