import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VehicleType {
  @Field(() => Int)
  VehicleTypeId: number;

  @Field()
  VehicleTypeName: string;
}

@ObjectType()
export class Vehicle {
  @Field(() => Int)
  Make_ID: number;

  @Field()
  Make_Name: string;

  @Field(() => [VehicleType])
  VehicleTypes: VehicleType[];
}