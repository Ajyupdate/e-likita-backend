import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  profile!: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: string;
    phone?: string;
    address?: object;
  };
}

export class AuthResponseDto {
  @ApiProperty()
  access_token!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
