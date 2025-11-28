# NestJS Users CRUD Application

## Overview

This is my implementation of a user management system using NestJS. The application handles CRUD operations for users with role-based permissions and group management. I've also implemented the bonus permission guard system for enhanced security.

[Repo Link](https://github.com/amanrai31/NestJS)

---

## Getting Started

### What You'll Need
- Node.js (I'm using v16+)
- npm

### Setup

First, let's get NestJS CLI and create the project:

```bash
npm i -g @nestjs/cli
nest new users-crud-app
cd users-crud-app
```

Then install the validation packages:

```bash
npm install class-validator class-transformer
```

### How I Organized the Code

```
src/
├── constants/
│   ├── users.data.ts          # User data that was provided
│   ├── roles.data.ts          # Roles with permissions
│   └── groups.data.ts         # Available groups
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── guards/
│   │   └── permission.guard.ts   # For the bonus part
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.module.ts
└── main.ts
```

---

## Implementation

### Setting Up the Base Data

I started by creating the constants files with the data that was provided.

**src/constants/users.data.ts**

```typescript
export interface User {
  id: number;
  name: string;
  roles: string[];
  groups: string[];
}

export const USERS: User[] = [
  { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 2, name: "Grabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 3, name: "Alex Xavier", roles: ["PERSONAL"], groups: ["GROUP_2"] },
  { id: 4, name: "Jarvis Khan", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_2"] },
  { id: 5, name: "Martines Polok", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1"] },
  { id: 6, name: "Gabriela Wozniak", roles: ["VIEWER", "PERSONAL"], groups: ["GROUP_1"] }
];
```

**src/constants/groups.data.ts**

```typescript
export const GROUPS = ["GROUP_1", "GROUP_2"];
```

**src/constants/roles.data.ts**

For the bonus implementation, I structured roles with their permissions:

```typescript
export interface Role {
  name: string;
  code: string;
  permissions: string[];
}

export const ROLES: Role[] = [
  { name: "Admin", code: "ADMIN", permissions: ["CREATE", "VIEW", "EDIT", "DELETE"] },
  { name: "Personal", code: "PERSONAL", permissions: [] },
  { name: "Viewer", code: "VIEWER", permissions: ["VIEW"] }
];

export const PERMISSIONS = ["CREATE", "VIEW", "EDIT", "DELETE"];
```

---

### DTOs for Validation

**src/users/dto/create-user.dto.ts**

I used class-validator decorators to handle the validation requirements:

```typescript
import { IsString, IsNotEmpty, IsArray, ArrayMinSize, MaxLength, ArrayNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  roles: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  groups: string[];
}
```

**src/users/dto/update-user.dto.ts**

For updates, everything is optional since it's a partial update:

```typescript
import { IsString, IsArray, MaxLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsArray()
  groups?: string[];
}
```

---

### The Service Layer

**src/users/users.service.ts**

This is where the main logic lives. I'm using an in-memory array to store users:

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USERS, User } from '../constants/users.data';
import { ROLES } from '../constants/roles.data';
import { GROUPS } from '../constants/groups.data';

@Injectable()
export class UsersService {
  private users: User[] = [...USERS];
  private nextId: number = 7;

  create(createUserDto: CreateUserDto): User {
    // Making sure roles are valid
    const validRoleCodes = ROLES.map(r => r.code);
    const invalidRoles = createUserDto.roles.filter(role => !validRoleCodes.includes(role));
    if (invalidRoles.length > 0) {
      throw new BadRequestException(`Invalid roles: ${invalidRoles.join(', ')}`);
    }

    // Same check for groups
    const invalidGroups = createUserDto.groups.filter(group => !GROUPS.includes(group));
    if (invalidGroups.length > 0) {
      throw new BadRequestException(`Invalid groups: ${invalidGroups.join(', ')}`);
    }

    const newUser: User = {
      id: this.nextId++,
      ...createUserDto
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validate roles if they're being updated
    if (updateUserDto.roles) {
      const validRoleCodes = ROLES.map(r => r.code);
      const invalidRoles = updateUserDto.roles.filter(role => !validRoleCodes.includes(role));
      if (invalidRoles.length > 0) {
        throw new BadRequestException(`Invalid roles: ${invalidRoles.join(', ')}`);
      }
    }

    // Validate groups if they're being updated
    if (updateUserDto.groups) {
      const invalidGroups = updateUserDto.groups.filter(group => !GROUPS.includes(group));
      if (invalidGroups.length > 0) {
        throw new BadRequestException(`Invalid groups: ${invalidGroups.join(', ')}`);
      }
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto
    };

    return this.users[userIndex];
  }

  remove(id: number): void {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }

  // This was an interesting one - finding users that an admin can manage
  findManagedUsers(managerId: number): User[] {
    const manager = this.findOne(managerId);

    // Only admins can manage users
    if (!manager.roles.includes('ADMIN')) {
      return [];
    }

    // Return users who share at least one group with the manager
    return this.users.filter(user => {
      if (user.id === managerId) return false;
      return user.groups.some(group => manager.groups.includes(group));
    });
  }

  // Helper method for the permission guard
  getUserPermissions(userId: number): string[] {
    const user = this.findOne(userId);
    const permissions = new Set<string>();

    user.roles.forEach(roleCode => {
      const role = ROLES.find(r => r.code === roleCode);
      if (role) {
        role.permissions.forEach(permission => permissions.add(permission));
      }
    });

    return Array.from(permissions);
  }
}
```

---

### The Permission Guard (Bonus Part)

**src/users/guards/permission.guard.ts**

This was the bonus challenge. I created a guard that checks permissions based on user roles:

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';

export const PERMISSION_KEY = 'permission';

// Custom decorator to mark endpoints with required permissions
export const Permission = (permission: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PERMISSION_KEY, permission, descriptor.value);
    return descriptor;
  };
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      PERMISSION_KEY,
      context.getHandler()
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = parseInt(request.headers.authorization);

    if (!userId || isNaN(userId)) {
      throw new ForbiddenException('Invalid authorization header');
    }

    try {
      const userPermissions = this.usersService.getUserPermissions(userId);
      
      if (!userPermissions.includes(requiredPermission)) {
        throw new ForbiddenException('Not allowed to perform action due to insufficient permissions.');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Not allowed to perform action due to insufficient permissions.');
    }
  }
}
```

---

### The Controller

**src/users/users.controller.ts**

Here's where I wired everything together:

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionGuard, Permission } from './guards/permission.guard';

@Controller('users')
@UseGuards(PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permission('CREATE')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permission('VIEW')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @Permission('EDIT')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permission('DELETE')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Get('managed/:id')
  @Permission('VIEW')
  findManagedUsers(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findManagedUsers(id);
  }
}
```

---

### Module Setup

**src/users/users.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PermissionGuard],
  exports: [UsersService]
})
export class UsersModule {}
```

**src/app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

---

### Main Entry Point

**src/main.ts**

I enabled global validation here so the DTOs work automatically:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
```

---

## Testing It Out

Start the server:

```bash
npm run start:dev
```

### Creating a User

This works because user 1 (John Doe) has the ADMIN role:

```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "roles": ["PERSONAL"],
    "groups": ["GROUP_1"]
  }'
```

This fails because user 6 (Gabriela) only has VIEWER role:

```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: 6" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "roles": ["PERSONAL"],
    "groups": ["GROUP_1"]
  }'
```

You'll get: `"Not allowed to perform action due to insufficient permissions."`

### Getting All Users

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: 1"
```

### Updating a User

```bash
curl -X PATCH http://localhost:3000/users/2 \
  -H "Authorization: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gabriel Monroe Updated"
  }'
```

### Deleting a User

```bash
curl -X DELETE http://localhost:3000/users/2 \
  -H "Authorization: 1"
```

### Getting Managed Users

This is where it gets interesting. Let me show you the different cases:

**User 5 (Martines) - ADMIN in GROUP_1:**

```bash
curl -X GET http://localhost:3000/users/managed/5 \
  -H "Authorization: 1"
```

Returns users in GROUP_1:
```json
[
  { "id": 1, "name": "John Doe", "roles": ["ADMIN", "PERSONAL"], "groups": ["GROUP_1", "GROUP_2"] },
  { "id": 2, "name": "Grabriel Monroe", "roles": ["PERSONAL"], "groups": ["GROUP_1", "GROUP_2"] },
  { "id": 6, "name": "Gabriela Wozniak", "roles": ["VIEWER", "PERSONAL"], "groups": ["GROUP_1"] }
]
```

**User 4 (Jarvis) - ADMIN in GROUP_2:**

```bash
curl -X GET http://localhost:3000/users/managed/4 \
  -H "Authorization: 1"
```

Returns users in GROUP_2:
```json
[
  { "id": 1, "name": "John Doe", "roles": ["ADMIN", "PERSONAL"], "groups": ["GROUP_1", "GROUP_2"] },
  { "id": 2, "name": "Grabriel Monroe", "roles": ["PERSONAL"], "groups": ["GROUP_1", "GROUP_2"] },
  { "id": 3, "name": "Alex Xavier", "roles": ["PERSONAL"], "groups": ["GROUP_2"] }
]
```

**User 3 (Alex) - Not an ADMIN:**

```bash
curl -X GET http://localhost:3000/users/managed/3 \
  -H "Authorization: 1"
```

Returns empty array since Alex doesn't have ADMIN role:
```json
[]
```

---

## What I Learned

Working on this project helped me understand:

1. **NestJS validation system** - The class-validator decorators make validation really clean and declarative
2. **Guards and metadata** - Using the Reflector to read custom decorators was new to me but really powerful
3. **Role-based access control** - Implementing the permission system showed me how to structure authorization properly
4. **In-memory data management** - Though simple, it was good practice for state management

The trickiest part was definitely the managed users logic - making sure that admins only see users in their shared groups. I had to think through the filter logic carefully.

---

## Possible Improvements

If I had more time, I'd add:
- A real database instead of in-memory storage
- JWT tokens for proper authentication
- Unit tests for the service methods
- E2E tests for the endpoints
- Better error messages
- Logging

---

## Wrapping Up

All the required endpoints are working:
- POST `/users` with full validation
- GET `/users`
- PATCH `/users/:id`
- DELETE `/users/:id`
- GET `/users/managed/:id`

Plus the bonus permission guard system that maps permissions to endpoints based on user roles.

The app is ready to run and all the test cases from the requirements are working as expected!
