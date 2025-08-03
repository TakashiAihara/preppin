import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','displayName','profileImage','passwordHash','isEmailVerified','isActive','lastLoginAt','providers','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['id','userId','token','refreshToken','expiresAt','refreshExpiresAt','ipAddress','userAgent','createdAt','updatedAt']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','description','privacy','inviteCode','inviteCodeExpiresAt','settings','createdBy','updatedBy','createdAt','updatedAt']);

export const OrganizationMemberScalarFieldEnumSchema = z.enum(['id','organizationId','userId','role','joinedAt','invitedBy','createdAt','updatedAt']);

export const OrganizationInvitationScalarFieldEnumSchema = z.enum(['id','organizationId','email','role','status','invitedBy','expiresAt','acceptedAt','rejectedAt','createdAt','updatedAt']);

export const InventoryItemScalarFieldEnumSchema = z.enum(['id','organizationId','name','brand','category','quantity','unit','minQuantity','expiryDate','bestBeforeDate','expiryType','storageLocation','price','barcode','asin','productId','tags','images','notes','createdBy','updatedBy','createdAt','updatedAt']);

export const ConsumptionLogScalarFieldEnumSchema = z.enum(['id','inventoryItemId','organizationId','quantity','reason','notes','consumedAt','consumedBy','createdAt','updatedAt']);

export const ActivityLogScalarFieldEnumSchema = z.enum(['id','organizationId','userId','action','entityType','entityId','metadata','ipAddress','userAgent','createdAt']);

export const PasswordResetTokenScalarFieldEnumSchema = z.enum(['id','userId','token','expiresAt','usedAt','createdAt','updatedAt']);

export const EmailVerificationTokenScalarFieldEnumSchema = z.enum(['id','userId','token','expiresAt','verifiedAt','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const UserRoleSchema = z.enum(['ADMIN','EDITOR','VIEWER']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const AuthProviderSchema = z.enum(['EMAIL','GOOGLE','APPLE']);

export type AuthProviderType = `${z.infer<typeof AuthProviderSchema>}`

export const OrganizationPrivacySchema = z.enum(['PUBLIC','PRIVATE']);

export type OrganizationPrivacyType = `${z.infer<typeof OrganizationPrivacySchema>}`

export const InvitationStatusSchema = z.enum(['PENDING','ACCEPTED','REJECTED','EXPIRED']);

export type InvitationStatusType = `${z.infer<typeof InvitationStatusSchema>}`

export const InventoryCategorySchema = z.enum(['FOOD','DAILY_GOODS','MEDICINE','OTHER']);

export type InventoryCategoryType = `${z.infer<typeof InventoryCategorySchema>}`

export const ExpiryTypeSchema = z.enum(['EXPIRY','BEST_BEFORE','BOTH']);

export type ExpiryTypeType = `${z.infer<typeof ExpiryTypeSchema>}`

export const ConsumptionReasonSchema = z.enum(['USED','EXPIRED','DAMAGED','DONATED','OTHER']);

export type ConsumptionReasonType = `${z.infer<typeof ConsumptionReasonSchema>}`

export const ActivityActionSchema = z.enum(['USER_REGISTERED','USER_LOGGED_IN','USER_LOGGED_OUT','USER_UPDATED_PROFILE','ORG_CREATED','ORG_UPDATED','ORG_DELETED','MEMBER_INVITED','MEMBER_JOINED','MEMBER_ROLE_CHANGED','MEMBER_REMOVED','ITEM_CREATED','ITEM_UPDATED','ITEM_DELETED','ITEM_CONSUMED','ITEM_RESTOCKED','EXPIRY_ALERT_SENT','LOW_STOCK_ALERT_SENT']);

export type ActivityActionType = `${z.infer<typeof ActivityActionSchema>}`

export const CurrencySchema = z.enum(['JPY','USD','EUR']);

export type CurrencyType = `${z.infer<typeof CurrencySchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  providers: AuthProviderSchema.array(),
  id: z.string().cuid(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().nullish(),
  passwordHash: z.string().nullish(),
  isEmailVerified: z.boolean(),
  isActive: z.boolean(),
  lastLoginAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().cuid().optional(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  sessions: SessionWithRelations[];
  memberships: OrganizationMemberWithRelations[];
  createdOrganizations: OrganizationWithRelations[];
  updatedOrganizations: OrganizationWithRelations[];
  createdInventoryItems: InventoryItemWithRelations[];
  updatedInventoryItems: InventoryItemWithRelations[];
  consumptionLogs: ConsumptionLogWithRelations[];
  activityLogs: ActivityLogWithRelations[];
  sentInvitations: OrganizationInvitationWithRelations[];
  passwordResetTokens: PasswordResetTokenWithRelations[];
  emailVerificationTokens: EmailVerificationTokenWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  memberships: z.lazy(() => OrganizationMemberWithRelationsSchema).array(),
  createdOrganizations: z.lazy(() => OrganizationWithRelationsSchema).array(),
  updatedOrganizations: z.lazy(() => OrganizationWithRelationsSchema).array(),
  createdInventoryItems: z.lazy(() => InventoryItemWithRelationsSchema).array(),
  updatedInventoryItems: z.lazy(() => InventoryItemWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogWithRelationsSchema).array(),
  sentInvitations: z.lazy(() => OrganizationInvitationWithRelationsSchema).array(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenWithRelationsSchema).array(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenWithRelationsSchema).array(),
}))

// USER OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type UserOptionalDefaultsRelations = {
  sessions: SessionOptionalDefaultsWithRelations[];
  memberships: OrganizationMemberOptionalDefaultsWithRelations[];
  createdOrganizations: OrganizationOptionalDefaultsWithRelations[];
  updatedOrganizations: OrganizationOptionalDefaultsWithRelations[];
  createdInventoryItems: InventoryItemOptionalDefaultsWithRelations[];
  updatedInventoryItems: InventoryItemOptionalDefaultsWithRelations[];
  consumptionLogs: ConsumptionLogOptionalDefaultsWithRelations[];
  activityLogs: ActivityLogOptionalDefaultsWithRelations[];
  sentInvitations: OrganizationInvitationOptionalDefaultsWithRelations[];
  passwordResetTokens: PasswordResetTokenOptionalDefaultsWithRelations[];
  emailVerificationTokens: EmailVerificationTokenOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
  sessions: z.lazy(() => SessionOptionalDefaultsWithRelationsSchema).array(),
  memberships: z.lazy(() => OrganizationMemberOptionalDefaultsWithRelationsSchema).array(),
  createdOrganizations: z.lazy(() => OrganizationOptionalDefaultsWithRelationsSchema).array(),
  updatedOrganizations: z.lazy(() => OrganizationOptionalDefaultsWithRelationsSchema).array(),
  createdInventoryItems: z.lazy(() => InventoryItemOptionalDefaultsWithRelationsSchema).array(),
  updatedInventoryItems: z.lazy(() => InventoryItemOptionalDefaultsWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogOptionalDefaultsWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogOptionalDefaultsWithRelationsSchema).array(),
  sentInvitations: z.lazy(() => OrganizationInvitationOptionalDefaultsWithRelationsSchema).array(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenOptionalDefaultsWithRelationsSchema).array(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenOptionalDefaultsWithRelationsSchema).array(),
}))

// USER PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type UserPartialRelations = {
  sessions?: SessionPartialWithRelations[];
  memberships?: OrganizationMemberPartialWithRelations[];
  createdOrganizations?: OrganizationPartialWithRelations[];
  updatedOrganizations?: OrganizationPartialWithRelations[];
  createdInventoryItems?: InventoryItemPartialWithRelations[];
  updatedInventoryItems?: InventoryItemPartialWithRelations[];
  consumptionLogs?: ConsumptionLogPartialWithRelations[];
  activityLogs?: ActivityLogPartialWithRelations[];
  sentInvitations?: OrganizationInvitationPartialWithRelations[];
  passwordResetTokens?: PasswordResetTokenPartialWithRelations[];
  emailVerificationTokens?: EmailVerificationTokenPartialWithRelations[];
};

export type UserPartialWithRelations = z.infer<typeof UserPartialSchema> & UserPartialRelations

export const UserPartialWithRelationsSchema: z.ZodType<UserPartialWithRelations> = UserPartialSchema.merge(z.object({
  sessions: z.lazy(() => SessionPartialWithRelationsSchema).array(),
  memberships: z.lazy(() => OrganizationMemberPartialWithRelationsSchema).array(),
  createdOrganizations: z.lazy(() => OrganizationPartialWithRelationsSchema).array(),
  updatedOrganizations: z.lazy(() => OrganizationPartialWithRelationsSchema).array(),
  createdInventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  updatedInventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogPartialWithRelationsSchema).array(),
  sentInvitations: z.lazy(() => OrganizationInvitationPartialWithRelationsSchema).array(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenPartialWithRelationsSchema).array(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenPartialWithRelationsSchema).array(),
})).partial()

export type UserOptionalDefaultsWithPartialRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserPartialRelations

export const UserOptionalDefaultsWithPartialRelationsSchema: z.ZodType<UserOptionalDefaultsWithPartialRelations> = UserOptionalDefaultsSchema.merge(z.object({
  sessions: z.lazy(() => SessionPartialWithRelationsSchema).array(),
  memberships: z.lazy(() => OrganizationMemberPartialWithRelationsSchema).array(),
  createdOrganizations: z.lazy(() => OrganizationPartialWithRelationsSchema).array(),
  updatedOrganizations: z.lazy(() => OrganizationPartialWithRelationsSchema).array(),
  createdInventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  updatedInventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogPartialWithRelationsSchema).array(),
  sentInvitations: z.lazy(() => OrganizationInvitationPartialWithRelationsSchema).array(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenPartialWithRelationsSchema).array(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenPartialWithRelationsSchema).array(),
}).partial())

export type UserWithPartialRelations = z.infer<typeof UserSchema> & UserPartialRelations

export const UserWithPartialRelationsSchema: z.ZodType<UserWithPartialRelations> = UserSchema.merge(z.object({
  sessions: z.lazy(() => SessionPartialWithRelationsSchema).array(),
  memberships: z.lazy(() => OrganizationMemberPartialWithRelationsSchema).array(),
  createdOrganizations: z.lazy(() => OrganizationPartialWithRelationsSchema).array(),
  updatedOrganizations: z.lazy(() => OrganizationPartialWithRelationsSchema).array(),
  createdInventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  updatedInventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogPartialWithRelationsSchema).array(),
  sentInvitations: z.lazy(() => OrganizationInvitationPartialWithRelationsSchema).array(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenPartialWithRelationsSchema).array(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenPartialWithRelationsSchema).array(),
}).partial())

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  refreshExpiresAt: z.coerce.date(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// SESSION PARTIAL SCHEMA
/////////////////////////////////////////

export const SessionPartialSchema = SessionSchema.partial()

export type SessionPartial = z.infer<typeof SessionPartialSchema>

// SESSION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SessionOptionalDefaultsSchema = SessionSchema.merge(z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type SessionOptionalDefaults = z.infer<typeof SessionOptionalDefaultsSchema>

// SESSION RELATION SCHEMA
//------------------------------------------------------

export type SessionRelations = {
  user: UserWithRelations;
};

export type SessionWithRelations = z.infer<typeof SessionSchema> & SessionRelations

export const SessionWithRelationsSchema: z.ZodType<SessionWithRelations> = SessionSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

// SESSION OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type SessionOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type SessionOptionalDefaultsWithRelations = z.infer<typeof SessionOptionalDefaultsSchema> & SessionOptionalDefaultsRelations

export const SessionOptionalDefaultsWithRelationsSchema: z.ZodType<SessionOptionalDefaultsWithRelations> = SessionOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// SESSION PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type SessionPartialRelations = {
  user?: UserPartialWithRelations;
};

export type SessionPartialWithRelations = z.infer<typeof SessionPartialSchema> & SessionPartialRelations

export const SessionPartialWithRelationsSchema: z.ZodType<SessionPartialWithRelations> = SessionPartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type SessionOptionalDefaultsWithPartialRelations = z.infer<typeof SessionOptionalDefaultsSchema> & SessionPartialRelations

export const SessionOptionalDefaultsWithPartialRelationsSchema: z.ZodType<SessionOptionalDefaultsWithPartialRelations> = SessionOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type SessionWithPartialRelations = z.infer<typeof SessionSchema> & SessionPartialRelations

export const SessionWithPartialRelationsSchema: z.ZodType<SessionWithPartialRelations> = SessionSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  privacy: OrganizationPrivacySchema,
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().nullish(),
  inviteCode: z.string().nullish(),
  inviteCodeExpiresAt: z.coerce.date().nullish(),
  settings: JsonValueSchema,
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Organization = z.infer<typeof OrganizationSchema>

/////////////////////////////////////////
// ORGANIZATION PARTIAL SCHEMA
/////////////////////////////////////////

export const OrganizationPartialSchema = OrganizationSchema.partial()

export type OrganizationPartial = z.infer<typeof OrganizationPartialSchema>

// ORGANIZATION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const OrganizationOptionalDefaultsSchema = OrganizationSchema.merge(z.object({
  privacy: OrganizationPrivacySchema.optional(),
  id: z.string().cuid().optional(),
  settings: JsonValueSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type OrganizationOptionalDefaults = z.infer<typeof OrganizationOptionalDefaultsSchema>

// ORGANIZATION RELATION SCHEMA
//------------------------------------------------------

export type OrganizationRelations = {
  creator: UserWithRelations;
  updater: UserWithRelations;
  members: OrganizationMemberWithRelations[];
  invitations: OrganizationInvitationWithRelations[];
  inventoryItems: InventoryItemWithRelations[];
  consumptionLogs: ConsumptionLogWithRelations[];
  activityLogs: ActivityLogWithRelations[];
};

export type OrganizationWithRelations = z.infer<typeof OrganizationSchema> & OrganizationRelations

export const OrganizationWithRelationsSchema: z.ZodType<OrganizationWithRelations> = OrganizationSchema.merge(z.object({
  creator: z.lazy(() => UserWithRelationsSchema),
  updater: z.lazy(() => UserWithRelationsSchema),
  members: z.lazy(() => OrganizationMemberWithRelationsSchema).array(),
  invitations: z.lazy(() => OrganizationInvitationWithRelationsSchema).array(),
  inventoryItems: z.lazy(() => InventoryItemWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogWithRelationsSchema).array(),
}))

// ORGANIZATION OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type OrganizationOptionalDefaultsRelations = {
  creator: UserOptionalDefaultsWithRelations;
  updater: UserOptionalDefaultsWithRelations;
  members: OrganizationMemberOptionalDefaultsWithRelations[];
  invitations: OrganizationInvitationOptionalDefaultsWithRelations[];
  inventoryItems: InventoryItemOptionalDefaultsWithRelations[];
  consumptionLogs: ConsumptionLogOptionalDefaultsWithRelations[];
  activityLogs: ActivityLogOptionalDefaultsWithRelations[];
};

export type OrganizationOptionalDefaultsWithRelations = z.infer<typeof OrganizationOptionalDefaultsSchema> & OrganizationOptionalDefaultsRelations

export const OrganizationOptionalDefaultsWithRelationsSchema: z.ZodType<OrganizationOptionalDefaultsWithRelations> = OrganizationOptionalDefaultsSchema.merge(z.object({
  creator: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  updater: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  members: z.lazy(() => OrganizationMemberOptionalDefaultsWithRelationsSchema).array(),
  invitations: z.lazy(() => OrganizationInvitationOptionalDefaultsWithRelationsSchema).array(),
  inventoryItems: z.lazy(() => InventoryItemOptionalDefaultsWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogOptionalDefaultsWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogOptionalDefaultsWithRelationsSchema).array(),
}))

// ORGANIZATION PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type OrganizationPartialRelations = {
  creator?: UserPartialWithRelations;
  updater?: UserPartialWithRelations;
  members?: OrganizationMemberPartialWithRelations[];
  invitations?: OrganizationInvitationPartialWithRelations[];
  inventoryItems?: InventoryItemPartialWithRelations[];
  consumptionLogs?: ConsumptionLogPartialWithRelations[];
  activityLogs?: ActivityLogPartialWithRelations[];
};

export type OrganizationPartialWithRelations = z.infer<typeof OrganizationPartialSchema> & OrganizationPartialRelations

export const OrganizationPartialWithRelationsSchema: z.ZodType<OrganizationPartialWithRelations> = OrganizationPartialSchema.merge(z.object({
  creator: z.lazy(() => UserPartialWithRelationsSchema),
  updater: z.lazy(() => UserPartialWithRelationsSchema),
  members: z.lazy(() => OrganizationMemberPartialWithRelationsSchema).array(),
  invitations: z.lazy(() => OrganizationInvitationPartialWithRelationsSchema).array(),
  inventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogPartialWithRelationsSchema).array(),
})).partial()

export type OrganizationOptionalDefaultsWithPartialRelations = z.infer<typeof OrganizationOptionalDefaultsSchema> & OrganizationPartialRelations

export const OrganizationOptionalDefaultsWithPartialRelationsSchema: z.ZodType<OrganizationOptionalDefaultsWithPartialRelations> = OrganizationOptionalDefaultsSchema.merge(z.object({
  creator: z.lazy(() => UserPartialWithRelationsSchema),
  updater: z.lazy(() => UserPartialWithRelationsSchema),
  members: z.lazy(() => OrganizationMemberPartialWithRelationsSchema).array(),
  invitations: z.lazy(() => OrganizationInvitationPartialWithRelationsSchema).array(),
  inventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogPartialWithRelationsSchema).array(),
}).partial())

export type OrganizationWithPartialRelations = z.infer<typeof OrganizationSchema> & OrganizationPartialRelations

export const OrganizationWithPartialRelationsSchema: z.ZodType<OrganizationWithPartialRelations> = OrganizationSchema.merge(z.object({
  creator: z.lazy(() => UserPartialWithRelationsSchema),
  updater: z.lazy(() => UserPartialWithRelationsSchema),
  members: z.lazy(() => OrganizationMemberPartialWithRelationsSchema).array(),
  invitations: z.lazy(() => OrganizationInvitationPartialWithRelationsSchema).array(),
  inventoryItems: z.lazy(() => InventoryItemPartialWithRelationsSchema).array(),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
  activityLogs: z.lazy(() => ActivityLogPartialWithRelationsSchema).array(),
}).partial())

/////////////////////////////////////////
// ORGANIZATION MEMBER SCHEMA
/////////////////////////////////////////

export const OrganizationMemberSchema = z.object({
  role: UserRoleSchema,
  id: z.string().cuid(),
  organizationId: z.string(),
  userId: z.string(),
  joinedAt: z.coerce.date(),
  invitedBy: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>

/////////////////////////////////////////
// ORGANIZATION MEMBER PARTIAL SCHEMA
/////////////////////////////////////////

export const OrganizationMemberPartialSchema = OrganizationMemberSchema.partial()

export type OrganizationMemberPartial = z.infer<typeof OrganizationMemberPartialSchema>

// ORGANIZATION MEMBER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const OrganizationMemberOptionalDefaultsSchema = OrganizationMemberSchema.merge(z.object({
  role: UserRoleSchema.optional(),
  id: z.string().cuid().optional(),
  joinedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type OrganizationMemberOptionalDefaults = z.infer<typeof OrganizationMemberOptionalDefaultsSchema>

// ORGANIZATION MEMBER RELATION SCHEMA
//------------------------------------------------------

export type OrganizationMemberRelations = {
  organization: OrganizationWithRelations;
  user: UserWithRelations;
};

export type OrganizationMemberWithRelations = z.infer<typeof OrganizationMemberSchema> & OrganizationMemberRelations

export const OrganizationMemberWithRelationsSchema: z.ZodType<OrganizationMemberWithRelations> = OrganizationMemberSchema.merge(z.object({
  organization: z.lazy(() => OrganizationWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
}))

// ORGANIZATION MEMBER OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type OrganizationMemberOptionalDefaultsRelations = {
  organization: OrganizationOptionalDefaultsWithRelations;
  user: UserOptionalDefaultsWithRelations;
};

export type OrganizationMemberOptionalDefaultsWithRelations = z.infer<typeof OrganizationMemberOptionalDefaultsSchema> & OrganizationMemberOptionalDefaultsRelations

export const OrganizationMemberOptionalDefaultsWithRelationsSchema: z.ZodType<OrganizationMemberOptionalDefaultsWithRelations> = OrganizationMemberOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationOptionalDefaultsWithRelationsSchema),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// ORGANIZATION MEMBER PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type OrganizationMemberPartialRelations = {
  organization?: OrganizationPartialWithRelations;
  user?: UserPartialWithRelations;
};

export type OrganizationMemberPartialWithRelations = z.infer<typeof OrganizationMemberPartialSchema> & OrganizationMemberPartialRelations

export const OrganizationMemberPartialWithRelationsSchema: z.ZodType<OrganizationMemberPartialWithRelations> = OrganizationMemberPartialSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type OrganizationMemberOptionalDefaultsWithPartialRelations = z.infer<typeof OrganizationMemberOptionalDefaultsSchema> & OrganizationMemberPartialRelations

export const OrganizationMemberOptionalDefaultsWithPartialRelationsSchema: z.ZodType<OrganizationMemberOptionalDefaultsWithPartialRelations> = OrganizationMemberOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type OrganizationMemberWithPartialRelations = z.infer<typeof OrganizationMemberSchema> & OrganizationMemberPartialRelations

export const OrganizationMemberWithPartialRelationsSchema: z.ZodType<OrganizationMemberWithPartialRelations> = OrganizationMemberSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// ORGANIZATION INVITATION SCHEMA
/////////////////////////////////////////

export const OrganizationInvitationSchema = z.object({
  role: UserRoleSchema,
  status: InvitationStatusSchema,
  id: z.string().cuid(),
  organizationId: z.string(),
  email: z.string(),
  invitedBy: z.string(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().nullish(),
  rejectedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type OrganizationInvitation = z.infer<typeof OrganizationInvitationSchema>

/////////////////////////////////////////
// ORGANIZATION INVITATION PARTIAL SCHEMA
/////////////////////////////////////////

export const OrganizationInvitationPartialSchema = OrganizationInvitationSchema.partial()

export type OrganizationInvitationPartial = z.infer<typeof OrganizationInvitationPartialSchema>

// ORGANIZATION INVITATION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const OrganizationInvitationOptionalDefaultsSchema = OrganizationInvitationSchema.merge(z.object({
  role: UserRoleSchema.optional(),
  status: InvitationStatusSchema.optional(),
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type OrganizationInvitationOptionalDefaults = z.infer<typeof OrganizationInvitationOptionalDefaultsSchema>

// ORGANIZATION INVITATION RELATION SCHEMA
//------------------------------------------------------

export type OrganizationInvitationRelations = {
  organization: OrganizationWithRelations;
  inviter: UserWithRelations;
};

export type OrganizationInvitationWithRelations = z.infer<typeof OrganizationInvitationSchema> & OrganizationInvitationRelations

export const OrganizationInvitationWithRelationsSchema: z.ZodType<OrganizationInvitationWithRelations> = OrganizationInvitationSchema.merge(z.object({
  organization: z.lazy(() => OrganizationWithRelationsSchema),
  inviter: z.lazy(() => UserWithRelationsSchema),
}))

// ORGANIZATION INVITATION OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type OrganizationInvitationOptionalDefaultsRelations = {
  organization: OrganizationOptionalDefaultsWithRelations;
  inviter: UserOptionalDefaultsWithRelations;
};

export type OrganizationInvitationOptionalDefaultsWithRelations = z.infer<typeof OrganizationInvitationOptionalDefaultsSchema> & OrganizationInvitationOptionalDefaultsRelations

export const OrganizationInvitationOptionalDefaultsWithRelationsSchema: z.ZodType<OrganizationInvitationOptionalDefaultsWithRelations> = OrganizationInvitationOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationOptionalDefaultsWithRelationsSchema),
  inviter: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// ORGANIZATION INVITATION PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type OrganizationInvitationPartialRelations = {
  organization?: OrganizationPartialWithRelations;
  inviter?: UserPartialWithRelations;
};

export type OrganizationInvitationPartialWithRelations = z.infer<typeof OrganizationInvitationPartialSchema> & OrganizationInvitationPartialRelations

export const OrganizationInvitationPartialWithRelationsSchema: z.ZodType<OrganizationInvitationPartialWithRelations> = OrganizationInvitationPartialSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  inviter: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type OrganizationInvitationOptionalDefaultsWithPartialRelations = z.infer<typeof OrganizationInvitationOptionalDefaultsSchema> & OrganizationInvitationPartialRelations

export const OrganizationInvitationOptionalDefaultsWithPartialRelationsSchema: z.ZodType<OrganizationInvitationOptionalDefaultsWithPartialRelations> = OrganizationInvitationOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  inviter: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type OrganizationInvitationWithPartialRelations = z.infer<typeof OrganizationInvitationSchema> & OrganizationInvitationPartialRelations

export const OrganizationInvitationWithPartialRelationsSchema: z.ZodType<OrganizationInvitationWithPartialRelations> = OrganizationInvitationSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  inviter: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// INVENTORY ITEM SCHEMA
/////////////////////////////////////////

export const InventoryItemSchema = z.object({
  category: InventoryCategorySchema,
  expiryType: ExpiryTypeSchema,
  id: z.string().cuid(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().nullish(),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().nullish(),
  expiryDate: z.coerce.date().nullish(),
  bestBeforeDate: z.coerce.date().nullish(),
  storageLocation: z.string().nullish(),
  price: JsonValueSchema.nullable(),
  barcode: z.string().nullish(),
  asin: z.string().nullish(),
  productId: z.string().nullish(),
  tags: z.string().array(),
  images: z.string().array(),
  notes: z.string().nullish(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type InventoryItem = z.infer<typeof InventoryItemSchema>

/////////////////////////////////////////
// INVENTORY ITEM PARTIAL SCHEMA
/////////////////////////////////////////

export const InventoryItemPartialSchema = InventoryItemSchema.partial()

export type InventoryItemPartial = z.infer<typeof InventoryItemPartialSchema>

// INVENTORY ITEM OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const InventoryItemOptionalDefaultsSchema = InventoryItemSchema.merge(z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type InventoryItemOptionalDefaults = z.infer<typeof InventoryItemOptionalDefaultsSchema>

// INVENTORY ITEM RELATION SCHEMA
//------------------------------------------------------

export type InventoryItemRelations = {
  organization: OrganizationWithRelations;
  creator: UserWithRelations;
  updater: UserWithRelations;
  consumptionLogs: ConsumptionLogWithRelations[];
};

export type InventoryItemWithRelations = Omit<z.infer<typeof InventoryItemSchema>, "price"> & {
  price?: JsonValueType | null;
} & InventoryItemRelations

export const InventoryItemWithRelationsSchema: z.ZodType<InventoryItemWithRelations> = InventoryItemSchema.merge(z.object({
  organization: z.lazy(() => OrganizationWithRelationsSchema),
  creator: z.lazy(() => UserWithRelationsSchema),
  updater: z.lazy(() => UserWithRelationsSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogWithRelationsSchema).array(),
}))

// INVENTORY ITEM OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type InventoryItemOptionalDefaultsRelations = {
  organization: OrganizationOptionalDefaultsWithRelations;
  creator: UserOptionalDefaultsWithRelations;
  updater: UserOptionalDefaultsWithRelations;
  consumptionLogs: ConsumptionLogOptionalDefaultsWithRelations[];
};

export type InventoryItemOptionalDefaultsWithRelations = Omit<z.infer<typeof InventoryItemOptionalDefaultsSchema>, "price"> & {
  price?: JsonValueType | null;
} & InventoryItemOptionalDefaultsRelations

export const InventoryItemOptionalDefaultsWithRelationsSchema: z.ZodType<InventoryItemOptionalDefaultsWithRelations> = InventoryItemOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationOptionalDefaultsWithRelationsSchema),
  creator: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  updater: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogOptionalDefaultsWithRelationsSchema).array(),
}))

// INVENTORY ITEM PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type InventoryItemPartialRelations = {
  organization?: OrganizationPartialWithRelations;
  creator?: UserPartialWithRelations;
  updater?: UserPartialWithRelations;
  consumptionLogs?: ConsumptionLogPartialWithRelations[];
};

export type InventoryItemPartialWithRelations = Omit<z.infer<typeof InventoryItemPartialSchema>, "price"> & {
  price?: JsonValueType | null;
} & InventoryItemPartialRelations

export const InventoryItemPartialWithRelationsSchema: z.ZodType<InventoryItemPartialWithRelations> = InventoryItemPartialSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  creator: z.lazy(() => UserPartialWithRelationsSchema),
  updater: z.lazy(() => UserPartialWithRelationsSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
})).partial()

export type InventoryItemOptionalDefaultsWithPartialRelations = Omit<z.infer<typeof InventoryItemOptionalDefaultsSchema>, "price"> & {
  price?: JsonValueType | null;
} & InventoryItemPartialRelations

export const InventoryItemOptionalDefaultsWithPartialRelationsSchema: z.ZodType<InventoryItemOptionalDefaultsWithPartialRelations> = InventoryItemOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  creator: z.lazy(() => UserPartialWithRelationsSchema),
  updater: z.lazy(() => UserPartialWithRelationsSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
}).partial())

export type InventoryItemWithPartialRelations = Omit<z.infer<typeof InventoryItemSchema>, "price"> & {
  price?: JsonValueType | null;
} & InventoryItemPartialRelations

export const InventoryItemWithPartialRelationsSchema: z.ZodType<InventoryItemWithPartialRelations> = InventoryItemSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  creator: z.lazy(() => UserPartialWithRelationsSchema),
  updater: z.lazy(() => UserPartialWithRelationsSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogPartialWithRelationsSchema).array(),
}).partial())

/////////////////////////////////////////
// CONSUMPTION LOG SCHEMA
/////////////////////////////////////////

export const ConsumptionLogSchema = z.object({
  reason: ConsumptionReasonSchema,
  id: z.string().cuid(),
  inventoryItemId: z.string(),
  organizationId: z.string(),
  quantity: z.number(),
  notes: z.string().nullish(),
  consumedAt: z.coerce.date(),
  consumedBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ConsumptionLog = z.infer<typeof ConsumptionLogSchema>

/////////////////////////////////////////
// CONSUMPTION LOG PARTIAL SCHEMA
/////////////////////////////////////////

export const ConsumptionLogPartialSchema = ConsumptionLogSchema.partial()

export type ConsumptionLogPartial = z.infer<typeof ConsumptionLogPartialSchema>

// CONSUMPTION LOG OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ConsumptionLogOptionalDefaultsSchema = ConsumptionLogSchema.merge(z.object({
  id: z.string().cuid().optional(),
  consumedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ConsumptionLogOptionalDefaults = z.infer<typeof ConsumptionLogOptionalDefaultsSchema>

// CONSUMPTION LOG RELATION SCHEMA
//------------------------------------------------------

export type ConsumptionLogRelations = {
  inventoryItem: InventoryItemWithRelations;
  organization: OrganizationWithRelations;
  user: UserWithRelations;
};

export type ConsumptionLogWithRelations = z.infer<typeof ConsumptionLogSchema> & ConsumptionLogRelations

export const ConsumptionLogWithRelationsSchema: z.ZodType<ConsumptionLogWithRelations> = ConsumptionLogSchema.merge(z.object({
  inventoryItem: z.lazy(() => InventoryItemWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
}))

// CONSUMPTION LOG OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ConsumptionLogOptionalDefaultsRelations = {
  inventoryItem: InventoryItemOptionalDefaultsWithRelations;
  organization: OrganizationOptionalDefaultsWithRelations;
  user: UserOptionalDefaultsWithRelations;
};

export type ConsumptionLogOptionalDefaultsWithRelations = z.infer<typeof ConsumptionLogOptionalDefaultsSchema> & ConsumptionLogOptionalDefaultsRelations

export const ConsumptionLogOptionalDefaultsWithRelationsSchema: z.ZodType<ConsumptionLogOptionalDefaultsWithRelations> = ConsumptionLogOptionalDefaultsSchema.merge(z.object({
  inventoryItem: z.lazy(() => InventoryItemOptionalDefaultsWithRelationsSchema),
  organization: z.lazy(() => OrganizationOptionalDefaultsWithRelationsSchema),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// CONSUMPTION LOG PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type ConsumptionLogPartialRelations = {
  inventoryItem?: InventoryItemPartialWithRelations;
  organization?: OrganizationPartialWithRelations;
  user?: UserPartialWithRelations;
};

export type ConsumptionLogPartialWithRelations = z.infer<typeof ConsumptionLogPartialSchema> & ConsumptionLogPartialRelations

export const ConsumptionLogPartialWithRelationsSchema: z.ZodType<ConsumptionLogPartialWithRelations> = ConsumptionLogPartialSchema.merge(z.object({
  inventoryItem: z.lazy(() => InventoryItemPartialWithRelationsSchema),
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type ConsumptionLogOptionalDefaultsWithPartialRelations = z.infer<typeof ConsumptionLogOptionalDefaultsSchema> & ConsumptionLogPartialRelations

export const ConsumptionLogOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ConsumptionLogOptionalDefaultsWithPartialRelations> = ConsumptionLogOptionalDefaultsSchema.merge(z.object({
  inventoryItem: z.lazy(() => InventoryItemPartialWithRelationsSchema),
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type ConsumptionLogWithPartialRelations = z.infer<typeof ConsumptionLogSchema> & ConsumptionLogPartialRelations

export const ConsumptionLogWithPartialRelationsSchema: z.ZodType<ConsumptionLogWithPartialRelations> = ConsumptionLogSchema.merge(z.object({
  inventoryItem: z.lazy(() => InventoryItemPartialWithRelationsSchema),
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// ACTIVITY LOG SCHEMA
/////////////////////////////////////////

export const ActivityLogSchema = z.object({
  action: ActivityActionSchema,
  id: z.string().cuid(),
  organizationId: z.string(),
  userId: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  metadata: JsonValueSchema.nullable(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  createdAt: z.coerce.date(),
})

export type ActivityLog = z.infer<typeof ActivityLogSchema>

/////////////////////////////////////////
// ACTIVITY LOG PARTIAL SCHEMA
/////////////////////////////////////////

export const ActivityLogPartialSchema = ActivityLogSchema.partial()

export type ActivityLogPartial = z.infer<typeof ActivityLogPartialSchema>

// ACTIVITY LOG OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ActivityLogOptionalDefaultsSchema = ActivityLogSchema.merge(z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type ActivityLogOptionalDefaults = z.infer<typeof ActivityLogOptionalDefaultsSchema>

// ACTIVITY LOG RELATION SCHEMA
//------------------------------------------------------

export type ActivityLogRelations = {
  organization: OrganizationWithRelations;
  user: UserWithRelations;
};

export type ActivityLogWithRelations = Omit<z.infer<typeof ActivityLogSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & ActivityLogRelations

export const ActivityLogWithRelationsSchema: z.ZodType<ActivityLogWithRelations> = ActivityLogSchema.merge(z.object({
  organization: z.lazy(() => OrganizationWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
}))

// ACTIVITY LOG OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ActivityLogOptionalDefaultsRelations = {
  organization: OrganizationOptionalDefaultsWithRelations;
  user: UserOptionalDefaultsWithRelations;
};

export type ActivityLogOptionalDefaultsWithRelations = Omit<z.infer<typeof ActivityLogOptionalDefaultsSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & ActivityLogOptionalDefaultsRelations

export const ActivityLogOptionalDefaultsWithRelationsSchema: z.ZodType<ActivityLogOptionalDefaultsWithRelations> = ActivityLogOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationOptionalDefaultsWithRelationsSchema),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// ACTIVITY LOG PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type ActivityLogPartialRelations = {
  organization?: OrganizationPartialWithRelations;
  user?: UserPartialWithRelations;
};

export type ActivityLogPartialWithRelations = Omit<z.infer<typeof ActivityLogPartialSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & ActivityLogPartialRelations

export const ActivityLogPartialWithRelationsSchema: z.ZodType<ActivityLogPartialWithRelations> = ActivityLogPartialSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type ActivityLogOptionalDefaultsWithPartialRelations = Omit<z.infer<typeof ActivityLogOptionalDefaultsSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & ActivityLogPartialRelations

export const ActivityLogOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ActivityLogOptionalDefaultsWithPartialRelations> = ActivityLogOptionalDefaultsSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type ActivityLogWithPartialRelations = Omit<z.infer<typeof ActivityLogSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & ActivityLogPartialRelations

export const ActivityLogWithPartialRelationsSchema: z.ZodType<ActivityLogWithPartialRelations> = ActivityLogSchema.merge(z.object({
  organization: z.lazy(() => OrganizationPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// PASSWORD RESET TOKEN SCHEMA
/////////////////////////////////////////

export const PasswordResetTokenSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  usedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PasswordResetToken = z.infer<typeof PasswordResetTokenSchema>

/////////////////////////////////////////
// PASSWORD RESET TOKEN PARTIAL SCHEMA
/////////////////////////////////////////

export const PasswordResetTokenPartialSchema = PasswordResetTokenSchema.partial()

export type PasswordResetTokenPartial = z.infer<typeof PasswordResetTokenPartialSchema>

// PASSWORD RESET TOKEN OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const PasswordResetTokenOptionalDefaultsSchema = PasswordResetTokenSchema.merge(z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type PasswordResetTokenOptionalDefaults = z.infer<typeof PasswordResetTokenOptionalDefaultsSchema>

// PASSWORD RESET TOKEN RELATION SCHEMA
//------------------------------------------------------

export type PasswordResetTokenRelations = {
  user: UserWithRelations;
};

export type PasswordResetTokenWithRelations = z.infer<typeof PasswordResetTokenSchema> & PasswordResetTokenRelations

export const PasswordResetTokenWithRelationsSchema: z.ZodType<PasswordResetTokenWithRelations> = PasswordResetTokenSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

// PASSWORD RESET TOKEN OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type PasswordResetTokenOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type PasswordResetTokenOptionalDefaultsWithRelations = z.infer<typeof PasswordResetTokenOptionalDefaultsSchema> & PasswordResetTokenOptionalDefaultsRelations

export const PasswordResetTokenOptionalDefaultsWithRelationsSchema: z.ZodType<PasswordResetTokenOptionalDefaultsWithRelations> = PasswordResetTokenOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// PASSWORD RESET TOKEN PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type PasswordResetTokenPartialRelations = {
  user?: UserPartialWithRelations;
};

export type PasswordResetTokenPartialWithRelations = z.infer<typeof PasswordResetTokenPartialSchema> & PasswordResetTokenPartialRelations

export const PasswordResetTokenPartialWithRelationsSchema: z.ZodType<PasswordResetTokenPartialWithRelations> = PasswordResetTokenPartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type PasswordResetTokenOptionalDefaultsWithPartialRelations = z.infer<typeof PasswordResetTokenOptionalDefaultsSchema> & PasswordResetTokenPartialRelations

export const PasswordResetTokenOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PasswordResetTokenOptionalDefaultsWithPartialRelations> = PasswordResetTokenOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type PasswordResetTokenWithPartialRelations = z.infer<typeof PasswordResetTokenSchema> & PasswordResetTokenPartialRelations

export const PasswordResetTokenWithPartialRelationsSchema: z.ZodType<PasswordResetTokenWithPartialRelations> = PasswordResetTokenSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// EMAIL VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const EmailVerificationTokenSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  verifiedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type EmailVerificationToken = z.infer<typeof EmailVerificationTokenSchema>

/////////////////////////////////////////
// EMAIL VERIFICATION TOKEN PARTIAL SCHEMA
/////////////////////////////////////////

export const EmailVerificationTokenPartialSchema = EmailVerificationTokenSchema.partial()

export type EmailVerificationTokenPartial = z.infer<typeof EmailVerificationTokenPartialSchema>

// EMAIL VERIFICATION TOKEN OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const EmailVerificationTokenOptionalDefaultsSchema = EmailVerificationTokenSchema.merge(z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type EmailVerificationTokenOptionalDefaults = z.infer<typeof EmailVerificationTokenOptionalDefaultsSchema>

// EMAIL VERIFICATION TOKEN RELATION SCHEMA
//------------------------------------------------------

export type EmailVerificationTokenRelations = {
  user: UserWithRelations;
};

export type EmailVerificationTokenWithRelations = z.infer<typeof EmailVerificationTokenSchema> & EmailVerificationTokenRelations

export const EmailVerificationTokenWithRelationsSchema: z.ZodType<EmailVerificationTokenWithRelations> = EmailVerificationTokenSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

// EMAIL VERIFICATION TOKEN OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type EmailVerificationTokenOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type EmailVerificationTokenOptionalDefaultsWithRelations = z.infer<typeof EmailVerificationTokenOptionalDefaultsSchema> & EmailVerificationTokenOptionalDefaultsRelations

export const EmailVerificationTokenOptionalDefaultsWithRelationsSchema: z.ZodType<EmailVerificationTokenOptionalDefaultsWithRelations> = EmailVerificationTokenOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// EMAIL VERIFICATION TOKEN PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type EmailVerificationTokenPartialRelations = {
  user?: UserPartialWithRelations;
};

export type EmailVerificationTokenPartialWithRelations = z.infer<typeof EmailVerificationTokenPartialSchema> & EmailVerificationTokenPartialRelations

export const EmailVerificationTokenPartialWithRelationsSchema: z.ZodType<EmailVerificationTokenPartialWithRelations> = EmailVerificationTokenPartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type EmailVerificationTokenOptionalDefaultsWithPartialRelations = z.infer<typeof EmailVerificationTokenOptionalDefaultsSchema> & EmailVerificationTokenPartialRelations

export const EmailVerificationTokenOptionalDefaultsWithPartialRelationsSchema: z.ZodType<EmailVerificationTokenOptionalDefaultsWithPartialRelations> = EmailVerificationTokenOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type EmailVerificationTokenWithPartialRelations = z.infer<typeof EmailVerificationTokenSchema> & EmailVerificationTokenPartialRelations

export const EmailVerificationTokenWithPartialRelationsSchema: z.ZodType<EmailVerificationTokenWithPartialRelations> = EmailVerificationTokenSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  memberships: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  createdOrganizations: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  updatedOrganizations: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  createdInventoryItems: z.union([z.boolean(),z.lazy(() => InventoryItemFindManyArgsSchema)]).optional(),
  updatedInventoryItems: z.union([z.boolean(),z.lazy(() => InventoryItemFindManyArgsSchema)]).optional(),
  consumptionLogs: z.union([z.boolean(),z.lazy(() => ConsumptionLogFindManyArgsSchema)]).optional(),
  activityLogs: z.union([z.boolean(),z.lazy(() => ActivityLogFindManyArgsSchema)]).optional(),
  sentInvitations: z.union([z.boolean(),z.lazy(() => OrganizationInvitationFindManyArgsSchema)]).optional(),
  passwordResetTokens: z.union([z.boolean(),z.lazy(() => PasswordResetTokenFindManyArgsSchema)]).optional(),
  emailVerificationTokens: z.union([z.boolean(),z.lazy(() => EmailVerificationTokenFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  sessions: z.boolean().optional(),
  memberships: z.boolean().optional(),
  createdOrganizations: z.boolean().optional(),
  updatedOrganizations: z.boolean().optional(),
  createdInventoryItems: z.boolean().optional(),
  updatedInventoryItems: z.boolean().optional(),
  consumptionLogs: z.boolean().optional(),
  activityLogs: z.boolean().optional(),
  sentInvitations: z.boolean().optional(),
  passwordResetTokens: z.boolean().optional(),
  emailVerificationTokens: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  displayName: z.boolean().optional(),
  profileImage: z.boolean().optional(),
  passwordHash: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.boolean().optional(),
  providers: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  memberships: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  createdOrganizations: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  updatedOrganizations: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  createdInventoryItems: z.union([z.boolean(),z.lazy(() => InventoryItemFindManyArgsSchema)]).optional(),
  updatedInventoryItems: z.union([z.boolean(),z.lazy(() => InventoryItemFindManyArgsSchema)]).optional(),
  consumptionLogs: z.union([z.boolean(),z.lazy(() => ConsumptionLogFindManyArgsSchema)]).optional(),
  activityLogs: z.union([z.boolean(),z.lazy(() => ActivityLogFindManyArgsSchema)]).optional(),
  sentInvitations: z.union([z.boolean(),z.lazy(() => OrganizationInvitationFindManyArgsSchema)]).optional(),
  passwordResetTokens: z.union([z.boolean(),z.lazy(() => PasswordResetTokenFindManyArgsSchema)]).optional(),
  emailVerificationTokens: z.union([z.boolean(),z.lazy(() => EmailVerificationTokenFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  token: z.boolean().optional(),
  refreshToken: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  refreshExpiresAt: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ORGANIZATION
//------------------------------------------------------

export const OrganizationIncludeSchema: z.ZodType<Prisma.OrganizationInclude> = z.object({
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  updater: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  members: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  invitations: z.union([z.boolean(),z.lazy(() => OrganizationInvitationFindManyArgsSchema)]).optional(),
  inventoryItems: z.union([z.boolean(),z.lazy(() => InventoryItemFindManyArgsSchema)]).optional(),
  consumptionLogs: z.union([z.boolean(),z.lazy(() => ConsumptionLogFindManyArgsSchema)]).optional(),
  activityLogs: z.union([z.boolean(),z.lazy(() => ActivityLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrganizationArgsSchema: z.ZodType<Prisma.OrganizationDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationSelectSchema).optional(),
  include: z.lazy(() => OrganizationIncludeSchema).optional(),
}).strict();

export const OrganizationCountOutputTypeArgsSchema: z.ZodType<Prisma.OrganizationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrganizationCountOutputTypeSelectSchema: z.ZodType<Prisma.OrganizationCountOutputTypeSelect> = z.object({
  members: z.boolean().optional(),
  invitations: z.boolean().optional(),
  inventoryItems: z.boolean().optional(),
  consumptionLogs: z.boolean().optional(),
  activityLogs: z.boolean().optional(),
}).strict();

export const OrganizationSelectSchema: z.ZodType<Prisma.OrganizationSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  privacy: z.boolean().optional(),
  inviteCode: z.boolean().optional(),
  inviteCodeExpiresAt: z.boolean().optional(),
  settings: z.boolean().optional(),
  createdBy: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  updater: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  members: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  invitations: z.union([z.boolean(),z.lazy(() => OrganizationInvitationFindManyArgsSchema)]).optional(),
  inventoryItems: z.union([z.boolean(),z.lazy(() => InventoryItemFindManyArgsSchema)]).optional(),
  consumptionLogs: z.union([z.boolean(),z.lazy(() => ConsumptionLogFindManyArgsSchema)]).optional(),
  activityLogs: z.union([z.boolean(),z.lazy(() => ActivityLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORGANIZATION MEMBER
//------------------------------------------------------

export const OrganizationMemberIncludeSchema: z.ZodType<Prisma.OrganizationMemberInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const OrganizationMemberArgsSchema: z.ZodType<Prisma.OrganizationMemberDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationMemberSelectSchema).optional(),
  include: z.lazy(() => OrganizationMemberIncludeSchema).optional(),
}).strict();

export const OrganizationMemberSelectSchema: z.ZodType<Prisma.OrganizationMemberSelect> = z.object({
  id: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  userId: z.boolean().optional(),
  role: z.boolean().optional(),
  joinedAt: z.boolean().optional(),
  invitedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ORGANIZATION INVITATION
//------------------------------------------------------

export const OrganizationInvitationIncludeSchema: z.ZodType<Prisma.OrganizationInvitationInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  inviter: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const OrganizationInvitationArgsSchema: z.ZodType<Prisma.OrganizationInvitationDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationInvitationSelectSchema).optional(),
  include: z.lazy(() => OrganizationInvitationIncludeSchema).optional(),
}).strict();

export const OrganizationInvitationSelectSchema: z.ZodType<Prisma.OrganizationInvitationSelect> = z.object({
  id: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  email: z.boolean().optional(),
  role: z.boolean().optional(),
  status: z.boolean().optional(),
  invitedBy: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  acceptedAt: z.boolean().optional(),
  rejectedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  inviter: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// INVENTORY ITEM
//------------------------------------------------------

export const InventoryItemIncludeSchema: z.ZodType<Prisma.InventoryItemInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  updater: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  consumptionLogs: z.union([z.boolean(),z.lazy(() => ConsumptionLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InventoryItemCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const InventoryItemArgsSchema: z.ZodType<Prisma.InventoryItemDefaultArgs> = z.object({
  select: z.lazy(() => InventoryItemSelectSchema).optional(),
  include: z.lazy(() => InventoryItemIncludeSchema).optional(),
}).strict();

export const InventoryItemCountOutputTypeArgsSchema: z.ZodType<Prisma.InventoryItemCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => InventoryItemCountOutputTypeSelectSchema).nullish(),
}).strict();

export const InventoryItemCountOutputTypeSelectSchema: z.ZodType<Prisma.InventoryItemCountOutputTypeSelect> = z.object({
  consumptionLogs: z.boolean().optional(),
}).strict();

export const InventoryItemSelectSchema: z.ZodType<Prisma.InventoryItemSelect> = z.object({
  id: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  name: z.boolean().optional(),
  brand: z.boolean().optional(),
  category: z.boolean().optional(),
  quantity: z.boolean().optional(),
  unit: z.boolean().optional(),
  minQuantity: z.boolean().optional(),
  expiryDate: z.boolean().optional(),
  bestBeforeDate: z.boolean().optional(),
  expiryType: z.boolean().optional(),
  storageLocation: z.boolean().optional(),
  price: z.boolean().optional(),
  barcode: z.boolean().optional(),
  asin: z.boolean().optional(),
  productId: z.boolean().optional(),
  tags: z.boolean().optional(),
  images: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdBy: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  updater: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  consumptionLogs: z.union([z.boolean(),z.lazy(() => ConsumptionLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InventoryItemCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONSUMPTION LOG
//------------------------------------------------------

export const ConsumptionLogIncludeSchema: z.ZodType<Prisma.ConsumptionLogInclude> = z.object({
  inventoryItem: z.union([z.boolean(),z.lazy(() => InventoryItemArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ConsumptionLogArgsSchema: z.ZodType<Prisma.ConsumptionLogDefaultArgs> = z.object({
  select: z.lazy(() => ConsumptionLogSelectSchema).optional(),
  include: z.lazy(() => ConsumptionLogIncludeSchema).optional(),
}).strict();

export const ConsumptionLogSelectSchema: z.ZodType<Prisma.ConsumptionLogSelect> = z.object({
  id: z.boolean().optional(),
  inventoryItemId: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  quantity: z.boolean().optional(),
  reason: z.boolean().optional(),
  notes: z.boolean().optional(),
  consumedAt: z.boolean().optional(),
  consumedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  inventoryItem: z.union([z.boolean(),z.lazy(() => InventoryItemArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ACTIVITY LOG
//------------------------------------------------------

export const ActivityLogIncludeSchema: z.ZodType<Prisma.ActivityLogInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ActivityLogArgsSchema: z.ZodType<Prisma.ActivityLogDefaultArgs> = z.object({
  select: z.lazy(() => ActivityLogSelectSchema).optional(),
  include: z.lazy(() => ActivityLogIncludeSchema).optional(),
}).strict();

export const ActivityLogSelectSchema: z.ZodType<Prisma.ActivityLogSelect> = z.object({
  id: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  userId: z.boolean().optional(),
  action: z.boolean().optional(),
  entityType: z.boolean().optional(),
  entityId: z.boolean().optional(),
  metadata: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PASSWORD RESET TOKEN
//------------------------------------------------------

export const PasswordResetTokenIncludeSchema: z.ZodType<Prisma.PasswordResetTokenInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const PasswordResetTokenArgsSchema: z.ZodType<Prisma.PasswordResetTokenDefaultArgs> = z.object({
  select: z.lazy(() => PasswordResetTokenSelectSchema).optional(),
  include: z.lazy(() => PasswordResetTokenIncludeSchema).optional(),
}).strict();

export const PasswordResetTokenSelectSchema: z.ZodType<Prisma.PasswordResetTokenSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  token: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  usedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// EMAIL VERIFICATION TOKEN
//------------------------------------------------------

export const EmailVerificationTokenIncludeSchema: z.ZodType<Prisma.EmailVerificationTokenInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const EmailVerificationTokenArgsSchema: z.ZodType<Prisma.EmailVerificationTokenDefaultArgs> = z.object({
  select: z.lazy(() => EmailVerificationTokenSelectSchema).optional(),
  include: z.lazy(() => EmailVerificationTokenIncludeSchema).optional(),
}).strict();

export const EmailVerificationTokenSelectSchema: z.ZodType<Prisma.EmailVerificationTokenSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  token: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  verifiedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  displayName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  profileImage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  passwordHash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isEmailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  lastLoginAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  providers: z.lazy(() => EnumAuthProviderNullableListFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemListRelationFilterSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemListRelationFilterSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogListRelationFilterSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogListRelationFilterSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationListRelationFilterSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenListRelationFilterSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  passwordHash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isEmailVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  lastLoginAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  providers: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberOrderByRelationAggregateInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationOrderByRelationAggregateInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationOrderByRelationAggregateInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemOrderByRelationAggregateInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemOrderByRelationAggregateInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogOrderByRelationAggregateInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogOrderByRelationAggregateInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationOrderByRelationAggregateInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenOrderByRelationAggregateInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  displayName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  profileImage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  passwordHash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isEmailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  lastLoginAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  providers: z.lazy(() => EnumAuthProviderNullableListFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemListRelationFilterSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemListRelationFilterSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogListRelationFilterSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogListRelationFilterSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationListRelationFilterSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenListRelationFilterSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  passwordHash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isEmailVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  lastLoginAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  providers: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  displayName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  profileImage: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  passwordHash: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  isEmailVerified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  lastLoginAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  providers: z.lazy(() => EnumAuthProviderNullableListFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refreshToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  refreshExpiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    token: z.string(),
    refreshToken: z.string()
  }),
  z.object({
    id: z.string().cuid(),
    token: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    refreshToken: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    token: z.string(),
    refreshToken: z.string(),
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    refreshToken: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  refreshExpiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refreshToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  refreshExpiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationWhereInputSchema: z.ZodType<Prisma.OrganizationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => EnumOrganizationPrivacyFilterSchema),z.lazy(() => OrganizationPrivacySchema) ]).optional(),
  inviteCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  settings: z.lazy(() => JsonFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  updater: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationListRelationFilterSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemListRelationFilterSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogListRelationFilterSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogListRelationFilterSchema).optional()
}).strict();

export const OrganizationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  privacy: z.lazy(() => SortOrderSchema).optional(),
  inviteCode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  inviteCodeExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  settings: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  updater: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberOrderByRelationAggregateInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationOrderByRelationAggregateInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemOrderByRelationAggregateInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogOrderByRelationAggregateInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogOrderByRelationAggregateInputSchema).optional()
}).strict();

export const OrganizationWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    inviteCode: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    inviteCode: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  inviteCode: z.string().optional(),
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => EnumOrganizationPrivacyFilterSchema),z.lazy(() => OrganizationPrivacySchema) ]).optional(),
  inviteCodeExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  settings: z.lazy(() => JsonFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  updater: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationListRelationFilterSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemListRelationFilterSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogListRelationFilterSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogListRelationFilterSchema).optional()
}).strict());

export const OrganizationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  privacy: z.lazy(() => SortOrderSchema).optional(),
  inviteCode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  inviteCodeExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  settings: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => EnumOrganizationPrivacyWithAggregatesFilterSchema),z.lazy(() => OrganizationPrivacySchema) ]).optional(),
  inviteCode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  settings: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationMemberWhereInputSchema: z.ZodType<Prisma.OrganizationMemberWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationMemberOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const OrganizationMemberWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationMemberWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    organizationId_userId: z.lazy(() => OrganizationMemberOrganizationIdUserIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    organizationId_userId: z.lazy(() => OrganizationMemberOrganizationIdUserIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  organizationId_userId: z.lazy(() => OrganizationMemberOrganizationIdUserIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const OrganizationMemberOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationMemberOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationMemberCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMemberMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMemberMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationMemberScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationMemberScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationInvitationWhereInputSchema: z.ZodType<Prisma.OrganizationInvitationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationInvitationWhereInputSchema),z.lazy(() => OrganizationInvitationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationInvitationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationInvitationWhereInputSchema),z.lazy(() => OrganizationInvitationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumInvitationStatusFilterSchema),z.lazy(() => InvitationStatusSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  acceptedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  rejectedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  inviter: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationInvitationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  acceptedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rejectedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  inviter: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const OrganizationInvitationWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationInvitationWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => OrganizationInvitationWhereInputSchema),z.lazy(() => OrganizationInvitationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationInvitationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationInvitationWhereInputSchema),z.lazy(() => OrganizationInvitationWhereInputSchema).array() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumInvitationStatusFilterSchema),z.lazy(() => InvitationStatusSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  acceptedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  rejectedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  inviter: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const OrganizationInvitationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationInvitationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  acceptedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rejectedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationInvitationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationInvitationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationInvitationMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationInvitationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationInvitationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationInvitationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationInvitationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationInvitationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationInvitationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationInvitationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumInvitationStatusWithAggregatesFilterSchema),z.lazy(() => InvitationStatusSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  acceptedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  rejectedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const InventoryItemWhereInputSchema: z.ZodType<Prisma.InventoryItemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryItemWhereInputSchema),z.lazy(() => InventoryItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryItemWhereInputSchema),z.lazy(() => InventoryItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  brand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumInventoryCategoryFilterSchema),z.lazy(() => InventoryCategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  minQuantity: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  bestBeforeDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => EnumExpiryTypeFilterSchema),z.lazy(() => ExpiryTypeSchema) ]).optional(),
  storageLocation: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.lazy(() => JsonNullableFilterSchema).optional(),
  barcode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  asin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  productId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  updater: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogListRelationFilterSchema).optional()
}).strict();

export const InventoryItemOrderByWithRelationInputSchema: z.ZodType<Prisma.InventoryItemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  brand: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bestBeforeDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryType: z.lazy(() => SortOrderSchema).optional(),
  storageLocation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  barcode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  asin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  productId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  updater: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogOrderByRelationAggregateInputSchema).optional()
}).strict();

export const InventoryItemWhereUniqueInputSchema: z.ZodType<Prisma.InventoryItemWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => InventoryItemWhereInputSchema),z.lazy(() => InventoryItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryItemWhereInputSchema),z.lazy(() => InventoryItemWhereInputSchema).array() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  brand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumInventoryCategoryFilterSchema),z.lazy(() => InventoryCategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  minQuantity: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  bestBeforeDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => EnumExpiryTypeFilterSchema),z.lazy(() => ExpiryTypeSchema) ]).optional(),
  storageLocation: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.lazy(() => JsonNullableFilterSchema).optional(),
  barcode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  asin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  productId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  updater: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogListRelationFilterSchema).optional()
}).strict());

export const InventoryItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.InventoryItemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  brand: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bestBeforeDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryType: z.lazy(() => SortOrderSchema).optional(),
  storageLocation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  barcode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  asin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  productId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => InventoryItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => InventoryItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InventoryItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InventoryItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => InventoryItemSumOrderByAggregateInputSchema).optional()
}).strict();

export const InventoryItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InventoryItemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryItemScalarWhereWithAggregatesInputSchema),z.lazy(() => InventoryItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryItemScalarWhereWithAggregatesInputSchema),z.lazy(() => InventoryItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  brand: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumInventoryCategoryWithAggregatesFilterSchema),z.lazy(() => InventoryCategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  minQuantity: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  bestBeforeDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => EnumExpiryTypeWithAggregatesFilterSchema),z.lazy(() => ExpiryTypeSchema) ]).optional(),
  storageLocation: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  price: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  barcode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  asin: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  productId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ConsumptionLogWhereInputSchema: z.ZodType<Prisma.ConsumptionLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ConsumptionLogWhereInputSchema),z.lazy(() => ConsumptionLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConsumptionLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConsumptionLogWhereInputSchema),z.lazy(() => ConsumptionLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inventoryItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  reason: z.union([ z.lazy(() => EnumConsumptionReasonFilterSchema),z.lazy(() => ConsumptionReasonSchema) ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  consumedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  consumedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inventoryItem: z.union([ z.lazy(() => InventoryItemScalarRelationFilterSchema),z.lazy(() => InventoryItemWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogOrderByWithRelationInputSchema: z.ZodType<Prisma.ConsumptionLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inventoryItemId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  consumedAt: z.lazy(() => SortOrderSchema).optional(),
  consumedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  inventoryItem: z.lazy(() => InventoryItemOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ConsumptionLogWhereUniqueInputSchema: z.ZodType<Prisma.ConsumptionLogWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ConsumptionLogWhereInputSchema),z.lazy(() => ConsumptionLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConsumptionLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConsumptionLogWhereInputSchema),z.lazy(() => ConsumptionLogWhereInputSchema).array() ]).optional(),
  inventoryItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  reason: z.union([ z.lazy(() => EnumConsumptionReasonFilterSchema),z.lazy(() => ConsumptionReasonSchema) ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  consumedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  consumedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inventoryItem: z.union([ z.lazy(() => InventoryItemScalarRelationFilterSchema),z.lazy(() => InventoryItemWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ConsumptionLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.ConsumptionLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inventoryItemId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  consumedAt: z.lazy(() => SortOrderSchema).optional(),
  consumedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ConsumptionLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ConsumptionLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ConsumptionLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ConsumptionLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ConsumptionLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const ConsumptionLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ConsumptionLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ConsumptionLogScalarWhereWithAggregatesInputSchema),z.lazy(() => ConsumptionLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConsumptionLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConsumptionLogScalarWhereWithAggregatesInputSchema),z.lazy(() => ConsumptionLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  inventoryItemId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  reason: z.union([ z.lazy(() => EnumConsumptionReasonWithAggregatesFilterSchema),z.lazy(() => ConsumptionReasonSchema) ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  consumedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  consumedBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ActivityLogWhereInputSchema: z.ZodType<Prisma.ActivityLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityLogWhereInputSchema),z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogWhereInputSchema),z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumActivityActionFilterSchema),z.lazy(() => ActivityActionSchema) ]).optional(),
  entityType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  entityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ActivityLogOrderByWithRelationInputSchema: z.ZodType<Prisma.ActivityLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  entityType: z.lazy(() => SortOrderSchema).optional(),
  entityId: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ActivityLogWhereUniqueInputSchema: z.ZodType<Prisma.ActivityLogWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ActivityLogWhereInputSchema),z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogWhereInputSchema),z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumActivityActionFilterSchema),z.lazy(() => ActivityActionSchema) ]).optional(),
  entityType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  entityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ActivityLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.ActivityLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  entityType: z.lazy(() => SortOrderSchema).optional(),
  entityId: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ActivityLogCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ActivityLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ActivityLogMinOrderByAggregateInputSchema).optional()
}).strict();

export const ActivityLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ActivityLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumActivityActionWithAggregatesFilterSchema),z.lazy(() => ActivityActionSchema) ]).optional(),
  entityType: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  entityId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PasswordResetTokenWhereInputSchema: z.ZodType<Prisma.PasswordResetTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  usedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.PasswordResetTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  usedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const PasswordResetTokenWhereUniqueInputSchema: z.ZodType<Prisma.PasswordResetTokenWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    token: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    token: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  usedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const PasswordResetTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.PasswordResetTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  usedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PasswordResetTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PasswordResetTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PasswordResetTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const PasswordResetTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PasswordResetTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  usedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const EmailVerificationTokenWhereInputSchema: z.ZodType<Prisma.EmailVerificationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailVerificationTokenWhereInputSchema),z.lazy(() => EmailVerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailVerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailVerificationTokenWhereInputSchema),z.lazy(() => EmailVerificationTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  verifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const EmailVerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.EmailVerificationTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const EmailVerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.EmailVerificationTokenWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    token: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    token: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => EmailVerificationTokenWhereInputSchema),z.lazy(() => EmailVerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailVerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailVerificationTokenWhereInputSchema),z.lazy(() => EmailVerificationTokenWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  verifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const EmailVerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.EmailVerificationTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EmailVerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EmailVerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EmailVerificationTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const EmailVerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EmailVerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EmailVerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailVerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailVerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailVerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailVerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  verifiedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  refreshExpiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  refreshExpiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refreshExpiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refreshExpiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  refreshExpiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refreshExpiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refreshExpiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedOrganizationsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberCreateInputSchema: z.ZodType<Prisma.OrganizationMemberCreateInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutMembershipsInputSchema)
}).strict();

export const OrganizationMemberUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMemberUpdateInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberCreateManyInputSchema: z.ZodType<Prisma.OrganizationMemberCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMemberUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationCreateInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutInvitationsInputSchema),
  inviter: z.lazy(() => UserCreateNestedOneWithoutSentInvitationsInputSchema)
}).strict();

export const OrganizationInvitationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  invitedBy: z.string(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationInvitationUpdateInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutInvitationsNestedInputSchema).optional(),
  inviter: z.lazy(() => UserUpdateOneRequiredWithoutSentInvitationsNestedInputSchema).optional()
}).strict();

export const OrganizationInvitationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationCreateManyInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  invitedBy: z.string(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationInvitationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryItemCreateInputSchema: z.ZodType<Prisma.InventoryItemCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutInventoryItemsInputSchema),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedInventoryItemsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedInventoryItemsInputSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemUncheckedCreateInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemUpdateInputSchema: z.ZodType<Prisma.InventoryItemUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutInventoryItemsNestedInputSchema).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedInventoryItemsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedInventoryItemsNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemCreateManyInputSchema: z.ZodType<Prisma.InventoryItemCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const InventoryItemUpdateManyMutationInputSchema: z.ZodType<Prisma.InventoryItemUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogCreateInputSchema: z.ZodType<Prisma.ConsumptionLogCreateInput> = z.object({
  id: z.string().cuid().optional(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inventoryItem: z.lazy(() => InventoryItemCreateNestedOneWithoutConsumptionLogsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutConsumptionLogsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutConsumptionLogsInputSchema)
}).strict();

export const ConsumptionLogUncheckedCreateInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  inventoryItemId: z.string(),
  organizationId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  consumedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogUpdateInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItem: z.lazy(() => InventoryItemUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional()
}).strict();

export const ConsumptionLogUncheckedUpdateInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogCreateManyInputSchema: z.ZodType<Prisma.ConsumptionLogCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  inventoryItemId: z.string(),
  organizationId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  consumedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogUpdateManyMutationInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityLogCreateInputSchema: z.ZodType<Prisma.ActivityLogCreateInput> = z.object({
  id: z.string().cuid().optional(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutActivityLogsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutActivityLogsInputSchema)
}).strict();

export const ActivityLogUncheckedCreateInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  userId: z.string(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ActivityLogUpdateInputSchema: z.ZodType<Prisma.ActivityLogUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutActivityLogsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutActivityLogsNestedInputSchema).optional()
}).strict();

export const ActivityLogUncheckedUpdateInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityLogCreateManyInputSchema: z.ZodType<Prisma.ActivityLogCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  userId: z.string(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ActivityLogUpdateManyMutationInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenCreateInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  usedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutPasswordResetTokensInputSchema)
}).strict();

export const PasswordResetTokenUncheckedCreateInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  usedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PasswordResetTokenUpdateInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPasswordResetTokensNestedInputSchema).optional()
}).strict();

export const PasswordResetTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenCreateManyInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  usedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PasswordResetTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailVerificationTokenCreateInputSchema: z.ZodType<Prisma.EmailVerificationTokenCreateInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  verifiedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutEmailVerificationTokensInputSchema)
}).strict();

export const EmailVerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  verifiedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EmailVerificationTokenUpdateInputSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutEmailVerificationTokensNestedInputSchema).optional()
}).strict();

export const EmailVerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailVerificationTokenCreateManyInputSchema: z.ZodType<Prisma.EmailVerificationTokenCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  verifiedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EmailVerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailVerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumAuthProviderNullableListFilterSchema: z.ZodType<Prisma.EnumAuthProviderNullableListFilter> = z.object({
  equals: z.lazy(() => AuthProviderSchema).array().optional().nullable(),
  has: z.lazy(() => AuthProviderSchema).optional().nullable(),
  hasEvery: z.lazy(() => AuthProviderSchema).array().optional(),
  hasSome: z.lazy(() => AuthProviderSchema).array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const OrganizationMemberListRelationFilterSchema: z.ZodType<Prisma.OrganizationMemberListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationMemberWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationMemberWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationMemberWhereInputSchema).optional()
}).strict();

export const OrganizationListRelationFilterSchema: z.ZodType<Prisma.OrganizationListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const InventoryItemListRelationFilterSchema: z.ZodType<Prisma.InventoryItemListRelationFilter> = z.object({
  every: z.lazy(() => InventoryItemWhereInputSchema).optional(),
  some: z.lazy(() => InventoryItemWhereInputSchema).optional(),
  none: z.lazy(() => InventoryItemWhereInputSchema).optional()
}).strict();

export const ConsumptionLogListRelationFilterSchema: z.ZodType<Prisma.ConsumptionLogListRelationFilter> = z.object({
  every: z.lazy(() => ConsumptionLogWhereInputSchema).optional(),
  some: z.lazy(() => ConsumptionLogWhereInputSchema).optional(),
  none: z.lazy(() => ConsumptionLogWhereInputSchema).optional()
}).strict();

export const ActivityLogListRelationFilterSchema: z.ZodType<Prisma.ActivityLogListRelationFilter> = z.object({
  every: z.lazy(() => ActivityLogWhereInputSchema).optional(),
  some: z.lazy(() => ActivityLogWhereInputSchema).optional(),
  none: z.lazy(() => ActivityLogWhereInputSchema).optional()
}).strict();

export const OrganizationInvitationListRelationFilterSchema: z.ZodType<Prisma.OrganizationInvitationListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationInvitationWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationInvitationWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationInvitationWhereInputSchema).optional()
}).strict();

export const PasswordResetTokenListRelationFilterSchema: z.ZodType<Prisma.PasswordResetTokenListRelationFilter> = z.object({
  every: z.lazy(() => PasswordResetTokenWhereInputSchema).optional(),
  some: z.lazy(() => PasswordResetTokenWhereInputSchema).optional(),
  none: z.lazy(() => PasswordResetTokenWhereInputSchema).optional()
}).strict();

export const EmailVerificationTokenListRelationFilterSchema: z.ZodType<Prisma.EmailVerificationTokenListRelationFilter> = z.object({
  every: z.lazy(() => EmailVerificationTokenWhereInputSchema).optional(),
  some: z.lazy(() => EmailVerificationTokenWhereInputSchema).optional(),
  none: z.lazy(() => EmailVerificationTokenWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMemberOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.InventoryItemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConsumptionLogOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ConsumptionLogOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityLogOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ActivityLogOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationInvitationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationInvitationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailVerificationTokenOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EmailVerificationTokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  isEmailVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  lastLoginAt: z.lazy(() => SortOrderSchema).optional(),
  providers: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  isEmailVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  lastLoginAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  isEmailVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  lastLoginAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumOrganizationPrivacyFilterSchema: z.ZodType<Prisma.EnumOrganizationPrivacyFilter> = z.object({
  equals: z.lazy(() => OrganizationPrivacySchema).optional(),
  in: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  notIn: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => NestedEnumOrganizationPrivacyFilterSchema) ]).optional(),
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const OrganizationCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  privacy: z.lazy(() => SortOrderSchema).optional(),
  inviteCode: z.lazy(() => SortOrderSchema).optional(),
  inviteCodeExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  privacy: z.lazy(() => SortOrderSchema).optional(),
  inviteCode: z.lazy(() => SortOrderSchema).optional(),
  inviteCodeExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  privacy: z.lazy(() => SortOrderSchema).optional(),
  inviteCode: z.lazy(() => SortOrderSchema).optional(),
  inviteCodeExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumOrganizationPrivacyWithAggregatesFilterSchema: z.ZodType<Prisma.EnumOrganizationPrivacyWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrganizationPrivacySchema).optional(),
  in: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  notIn: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => NestedEnumOrganizationPrivacyWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrganizationPrivacyFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrganizationPrivacyFilterSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const OrganizationScalarRelationFilterSchema: z.ZodType<Prisma.OrganizationScalarRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationMemberOrganizationIdUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.OrganizationMemberOrganizationIdUserIdCompoundUniqueInput> = z.object({
  organizationId: z.string(),
  userId: z.string()
}).strict();

export const OrganizationMemberCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMemberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMemberMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const EnumInvitationStatusFilterSchema: z.ZodType<Prisma.EnumInvitationStatusFilter> = z.object({
  equals: z.lazy(() => InvitationStatusSchema).optional(),
  in: z.lazy(() => InvitationStatusSchema).array().optional(),
  notIn: z.lazy(() => InvitationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => NestedEnumInvitationStatusFilterSchema) ]).optional(),
}).strict();

export const OrganizationInvitationCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationInvitationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  acceptedAt: z.lazy(() => SortOrderSchema).optional(),
  rejectedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationInvitationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationInvitationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  acceptedAt: z.lazy(() => SortOrderSchema).optional(),
  rejectedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationInvitationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationInvitationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  acceptedAt: z.lazy(() => SortOrderSchema).optional(),
  rejectedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumInvitationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumInvitationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => InvitationStatusSchema).optional(),
  in: z.lazy(() => InvitationStatusSchema).array().optional(),
  notIn: z.lazy(() => InvitationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => NestedEnumInvitationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumInvitationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumInvitationStatusFilterSchema).optional()
}).strict();

export const EnumInventoryCategoryFilterSchema: z.ZodType<Prisma.EnumInventoryCategoryFilter> = z.object({
  equals: z.lazy(() => InventoryCategorySchema).optional(),
  in: z.lazy(() => InventoryCategorySchema).array().optional(),
  notIn: z.lazy(() => InventoryCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => NestedEnumInventoryCategoryFilterSchema) ]).optional(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumExpiryTypeFilterSchema: z.ZodType<Prisma.EnumExpiryTypeFilter> = z.object({
  equals: z.lazy(() => ExpiryTypeSchema).optional(),
  in: z.lazy(() => ExpiryTypeSchema).array().optional(),
  notIn: z.lazy(() => ExpiryTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => NestedEnumExpiryTypeFilterSchema) ]).optional(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const InventoryItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryItemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  brand: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  bestBeforeDate: z.lazy(() => SortOrderSchema).optional(),
  expiryType: z.lazy(() => SortOrderSchema).optional(),
  storageLocation: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  barcode: z.lazy(() => SortOrderSchema).optional(),
  asin: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryItemAvgOrderByAggregateInput> = z.object({
  quantity: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryItemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  brand: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  bestBeforeDate: z.lazy(() => SortOrderSchema).optional(),
  expiryType: z.lazy(() => SortOrderSchema).optional(),
  storageLocation: z.lazy(() => SortOrderSchema).optional(),
  barcode: z.lazy(() => SortOrderSchema).optional(),
  asin: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryItemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  brand: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  bestBeforeDate: z.lazy(() => SortOrderSchema).optional(),
  expiryType: z.lazy(() => SortOrderSchema).optional(),
  storageLocation: z.lazy(() => SortOrderSchema).optional(),
  barcode: z.lazy(() => SortOrderSchema).optional(),
  asin: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryItemSumOrderByAggregateInput> = z.object({
  quantity: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumInventoryCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.EnumInventoryCategoryWithAggregatesFilter> = z.object({
  equals: z.lazy(() => InventoryCategorySchema).optional(),
  in: z.lazy(() => InventoryCategorySchema).array().optional(),
  notIn: z.lazy(() => InventoryCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => NestedEnumInventoryCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumInventoryCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumInventoryCategoryFilterSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const EnumExpiryTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumExpiryTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ExpiryTypeSchema).optional(),
  in: z.lazy(() => ExpiryTypeSchema).array().optional(),
  notIn: z.lazy(() => ExpiryTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => NestedEnumExpiryTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumExpiryTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumExpiryTypeFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const EnumConsumptionReasonFilterSchema: z.ZodType<Prisma.EnumConsumptionReasonFilter> = z.object({
  equals: z.lazy(() => ConsumptionReasonSchema).optional(),
  in: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  notIn: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  not: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => NestedEnumConsumptionReasonFilterSchema) ]).optional(),
}).strict();

export const InventoryItemScalarRelationFilterSchema: z.ZodType<Prisma.InventoryItemScalarRelationFilter> = z.object({
  is: z.lazy(() => InventoryItemWhereInputSchema).optional(),
  isNot: z.lazy(() => InventoryItemWhereInputSchema).optional()
}).strict();

export const ConsumptionLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.ConsumptionLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inventoryItemId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  consumedAt: z.lazy(() => SortOrderSchema).optional(),
  consumedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConsumptionLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ConsumptionLogAvgOrderByAggregateInput> = z.object({
  quantity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConsumptionLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ConsumptionLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inventoryItemId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  consumedAt: z.lazy(() => SortOrderSchema).optional(),
  consumedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConsumptionLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.ConsumptionLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inventoryItemId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  consumedAt: z.lazy(() => SortOrderSchema).optional(),
  consumedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConsumptionLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.ConsumptionLogSumOrderByAggregateInput> = z.object({
  quantity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumConsumptionReasonWithAggregatesFilterSchema: z.ZodType<Prisma.EnumConsumptionReasonWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ConsumptionReasonSchema).optional(),
  in: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  notIn: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  not: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => NestedEnumConsumptionReasonWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumConsumptionReasonFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumConsumptionReasonFilterSchema).optional()
}).strict();

export const EnumActivityActionFilterSchema: z.ZodType<Prisma.EnumActivityActionFilter> = z.object({
  equals: z.lazy(() => ActivityActionSchema).optional(),
  in: z.lazy(() => ActivityActionSchema).array().optional(),
  notIn: z.lazy(() => ActivityActionSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => NestedEnumActivityActionFilterSchema) ]).optional(),
}).strict();

export const ActivityLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  entityType: z.lazy(() => SortOrderSchema).optional(),
  entityId: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  entityType: z.lazy(() => SortOrderSchema).optional(),
  entityId: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  entityType: z.lazy(() => SortOrderSchema).optional(),
  entityId: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumActivityActionWithAggregatesFilterSchema: z.ZodType<Prisma.EnumActivityActionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityActionSchema).optional(),
  in: z.lazy(() => ActivityActionSchema).array().optional(),
  notIn: z.lazy(() => ActivityActionSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => NestedEnumActivityActionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityActionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityActionFilterSchema).optional()
}).strict();

export const PasswordResetTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  usedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  usedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  usedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailVerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.EmailVerificationTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailVerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EmailVerificationTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailVerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.EmailVerificationTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCreateprovidersInputSchema: z.ZodType<Prisma.UserCreateprovidersInput> = z.object({
  set: z.lazy(() => AuthProviderSchema).array()
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateWithoutCreatorInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedManyWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationCreateNestedManyWithoutUpdaterInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyUpdaterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemCreateNestedManyWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemCreateNestedManyWithoutUpdaterInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyUpdaterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutUserInputSchema),z.lazy(() => ActivityLogCreateWithoutUserInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationCreateNestedManyWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateNestedManyWithoutInviterInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyInviterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PasswordResetTokenCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema).array(),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PasswordResetTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EmailVerificationTokenCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema).array(),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailVerificationTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateWithoutCreatorInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateNestedManyWithoutUpdaterInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyUpdaterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateNestedManyWithoutUpdaterInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyUpdaterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutUserInputSchema),z.lazy(() => ActivityLogCreateWithoutUserInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyInviterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema).array(),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PasswordResetTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema).array(),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailVerificationTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateprovidersInputSchema: z.ZodType<Prisma.UserUpdateprovidersInput> = z.object({
  set: z.lazy(() => AuthProviderSchema).array().optional(),
  push: z.union([ z.lazy(() => AuthProviderSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateWithoutCreatorInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUpdateManyWithoutUpdaterNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithoutUpdaterNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyUpdaterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutUpdaterInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutUpdaterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.InventoryItemUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryItemUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => InventoryItemUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUpdateManyWithoutUpdaterNestedInputSchema: z.ZodType<Prisma.InventoryItemUpdateManyWithoutUpdaterNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyUpdaterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryItemUpdateManyWithWhereWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUpdateManyWithWhereWithoutUpdaterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutUserInputSchema),z.lazy(() => ActivityLogCreateWithoutUserInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityLogUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ActivityLogUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema),z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateManyWithoutInviterNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutInviterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyInviterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutInviterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutInviterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationInvitationScalarWhereInputSchema),z.lazy(() => OrganizationInvitationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PasswordResetTokenUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema).array(),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PasswordResetTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PasswordResetTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PasswordResetTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PasswordResetTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PasswordResetTokenScalarWhereInputSchema),z.lazy(() => PasswordResetTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema).array(),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailVerificationTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EmailVerificationTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EmailVerificationTokenScalarWhereInputSchema),z.lazy(() => EmailVerificationTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateWithoutCreatorInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutUpdaterNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyUpdaterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutUpdaterInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutUpdaterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryItemUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => InventoryItemUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutUpdaterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyUpdaterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutUpdaterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryItemUpdateManyWithWhereWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUpdateManyWithWhereWithoutUpdaterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutUserInputSchema),z.lazy(() => ActivityLogCreateWithoutUserInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityLogUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ActivityLogUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema),z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutInviterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutInviterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyInviterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutInviterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutInviterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationInvitationScalarWhereInputSchema),z.lazy(() => OrganizationInvitationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema).array(),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PasswordResetTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PasswordResetTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PasswordResetTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PasswordResetTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PasswordResetTokenScalarWhereInputSchema),z.lazy(() => PasswordResetTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema).array(),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailVerificationTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EmailVerificationTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EmailVerificationTokenScalarWhereInputSchema),z.lazy(() => EmailVerificationTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCreatedOrganizationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedOrganizationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedOrganizationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUpdatedOrganizationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedOrganizationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUpdatedOrganizationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumOrganizationPrivacyFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumOrganizationPrivacyFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => OrganizationPrivacySchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedOrganizationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedOrganizationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCreatedOrganizationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUpdateWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatedOrganizationsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedOrganizationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUpdatedOrganizationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUpdatedOrganizationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUpdateWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUpdatedOrganizationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationInvitationScalarWhereInputSchema),z.lazy(() => OrganizationInvitationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.InventoryItemUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryItemUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityLogUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema),z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationInvitationCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),z.lazy(() => OrganizationInvitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationInvitationScalarWhereInputSchema),z.lazy(() => OrganizationInvitationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema).array(),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => InventoryItemCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryItemCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryItemWhereUniqueInputSchema),z.lazy(() => InventoryItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryItemUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema).array(),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => ActivityLogCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema),z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityLogUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema),z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutMembersInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutMembershipsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMembershipsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRoleSchema).optional()
}).strict();

export const OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutMembersNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutMembershipsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutMembershipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMembershipsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMembershipsInputSchema),z.lazy(() => UserUpdateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMembershipsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutInvitationsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInvitationsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInvitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutInvitationsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSentInvitationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSentInvitationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSentInvitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSentInvitationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumInvitationStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumInvitationStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => InvitationStatusSchema).optional()
}).strict();

export const OrganizationUpdateOneRequiredWithoutInvitationsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutInvitationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInvitationsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInvitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutInvitationsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutInvitationsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutInvitationsInputSchema),z.lazy(() => OrganizationUpdateWithoutInvitationsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutInvitationsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutSentInvitationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSentInvitationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSentInvitationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSentInvitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSentInvitationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSentInvitationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSentInvitationsInputSchema),z.lazy(() => UserUpdateWithoutSentInvitationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSentInvitationsInputSchema) ]).optional(),
}).strict();

export const InventoryItemCreatetagsInputSchema: z.ZodType<Prisma.InventoryItemCreatetagsInput> = z.object({
  set: z.string().array()
}).strict();

export const InventoryItemCreateimagesInputSchema: z.ZodType<Prisma.InventoryItemCreateimagesInput> = z.object({
  set: z.string().array()
}).strict();

export const OrganizationCreateNestedOneWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutInventoryItemsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInventoryItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutInventoryItemsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCreatedInventoryItemsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedInventoryItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedInventoryItemsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUpdatedInventoryItemsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedInventoryItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUpdatedInventoryItemsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ConsumptionLogCreateNestedManyWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogCreateNestedManyWithoutInventoryItemInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyInventoryItemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUncheckedCreateNestedManyWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedCreateNestedManyWithoutInventoryItemInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyInventoryItemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumInventoryCategoryFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumInventoryCategoryFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => InventoryCategorySchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumExpiryTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumExpiryTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ExpiryTypeSchema).optional()
}).strict();

export const InventoryItemUpdatetagsInputSchema: z.ZodType<Prisma.InventoryItemUpdatetagsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const InventoryItemUpdateimagesInputSchema: z.ZodType<Prisma.InventoryItemUpdateimagesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutInventoryItemsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutInventoryItemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInventoryItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutInventoryItemsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutInventoryItemsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUpdateWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutInventoryItemsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutCreatedInventoryItemsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCreatedInventoryItemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedInventoryItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedInventoryItemsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCreatedInventoryItemsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUpdateWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatedInventoryItemsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutUpdatedInventoryItemsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUpdatedInventoryItemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedInventoryItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUpdatedInventoryItemsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUpdatedInventoryItemsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUpdateWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUpdatedInventoryItemsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogUpdateManyWithoutInventoryItemNestedInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyWithoutInventoryItemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutInventoryItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyInventoryItemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutInventoryItemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutInventoryItemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConsumptionLogUncheckedUpdateManyWithoutInventoryItemNestedInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateManyWithoutInventoryItemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema).array(),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUpsertWithWhereUniqueWithoutInventoryItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConsumptionLogCreateManyInventoryItemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConsumptionLogWhereUniqueInputSchema),z.lazy(() => ConsumptionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUpdateWithWhereUniqueWithoutInventoryItemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUpdateManyWithWhereWithoutInventoryItemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryItemCreateNestedOneWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemCreateNestedOneWithoutConsumptionLogsInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutConsumptionLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryItemCreateOrConnectWithoutConsumptionLogsInputSchema).optional(),
  connect: z.lazy(() => InventoryItemWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutConsumptionLogsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutConsumptionLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutConsumptionLogsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutConsumptionLogsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutConsumptionLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConsumptionLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutConsumptionLogsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumConsumptionReasonFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumConsumptionReasonFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ConsumptionReasonSchema).optional()
}).strict();

export const InventoryItemUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema: z.ZodType<Prisma.InventoryItemUpdateOneRequiredWithoutConsumptionLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutConsumptionLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryItemCreateOrConnectWithoutConsumptionLogsInputSchema).optional(),
  upsert: z.lazy(() => InventoryItemUpsertWithoutConsumptionLogsInputSchema).optional(),
  connect: z.lazy(() => InventoryItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => InventoryItemUpdateToOneWithWhereWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutConsumptionLogsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutConsumptionLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutConsumptionLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutConsumptionLogsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutConsumptionLogsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutConsumptionLogsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutConsumptionLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutConsumptionLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConsumptionLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutConsumptionLogsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutConsumptionLogsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutConsumptionLogsInputSchema),z.lazy(() => UserUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutConsumptionLogsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutActivityLogsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutActivityLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutActivityLogsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutActivityLogsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutActivityLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivityLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutActivityLogsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumActivityActionFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumActivityActionFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ActivityActionSchema).optional()
}).strict();

export const OrganizationUpdateOneRequiredWithoutActivityLogsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutActivityLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutActivityLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutActivityLogsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutActivityLogsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUpdateWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutActivityLogsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutActivityLogsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutActivityLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutActivityLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivityLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutActivityLogsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutActivityLogsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutActivityLogsInputSchema),z.lazy(() => UserUpdateWithoutActivityLogsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutActivityLogsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPasswordResetTokensInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPasswordResetTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutPasswordResetTokensNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPasswordResetTokensNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPasswordResetTokensInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPasswordResetTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUpdateWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPasswordResetTokensInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutEmailVerificationTokensInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailVerificationTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEmailVerificationTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutEmailVerificationTokensNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutEmailVerificationTokensNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailVerificationTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEmailVerificationTokensInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutEmailVerificationTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUpdateWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEmailVerificationTokensInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumOrganizationPrivacyFilterSchema: z.ZodType<Prisma.NestedEnumOrganizationPrivacyFilter> = z.object({
  equals: z.lazy(() => OrganizationPrivacySchema).optional(),
  in: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  notIn: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => NestedEnumOrganizationPrivacyFilterSchema) ]).optional(),
}).strict();

export const NestedEnumOrganizationPrivacyWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumOrganizationPrivacyWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrganizationPrivacySchema).optional(),
  in: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  notIn: z.lazy(() => OrganizationPrivacySchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => NestedEnumOrganizationPrivacyWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrganizationPrivacyFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrganizationPrivacyFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const NestedEnumInvitationStatusFilterSchema: z.ZodType<Prisma.NestedEnumInvitationStatusFilter> = z.object({
  equals: z.lazy(() => InvitationStatusSchema).optional(),
  in: z.lazy(() => InvitationStatusSchema).array().optional(),
  notIn: z.lazy(() => InvitationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => NestedEnumInvitationStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumInvitationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumInvitationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => InvitationStatusSchema).optional(),
  in: z.lazy(() => InvitationStatusSchema).array().optional(),
  notIn: z.lazy(() => InvitationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => NestedEnumInvitationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumInvitationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumInvitationStatusFilterSchema).optional()
}).strict();

export const NestedEnumInventoryCategoryFilterSchema: z.ZodType<Prisma.NestedEnumInventoryCategoryFilter> = z.object({
  equals: z.lazy(() => InventoryCategorySchema).optional(),
  in: z.lazy(() => InventoryCategorySchema).array().optional(),
  notIn: z.lazy(() => InventoryCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => NestedEnumInventoryCategoryFilterSchema) ]).optional(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumExpiryTypeFilterSchema: z.ZodType<Prisma.NestedEnumExpiryTypeFilter> = z.object({
  equals: z.lazy(() => ExpiryTypeSchema).optional(),
  in: z.lazy(() => ExpiryTypeSchema).array().optional(),
  notIn: z.lazy(() => ExpiryTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => NestedEnumExpiryTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumInventoryCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumInventoryCategoryWithAggregatesFilter> = z.object({
  equals: z.lazy(() => InventoryCategorySchema).optional(),
  in: z.lazy(() => InventoryCategorySchema).array().optional(),
  notIn: z.lazy(() => InventoryCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => NestedEnumInventoryCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumInventoryCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumInventoryCategoryFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedEnumExpiryTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumExpiryTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ExpiryTypeSchema).optional(),
  in: z.lazy(() => ExpiryTypeSchema).array().optional(),
  notIn: z.lazy(() => ExpiryTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => NestedEnumExpiryTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumExpiryTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumExpiryTypeFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumConsumptionReasonFilterSchema: z.ZodType<Prisma.NestedEnumConsumptionReasonFilter> = z.object({
  equals: z.lazy(() => ConsumptionReasonSchema).optional(),
  in: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  notIn: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  not: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => NestedEnumConsumptionReasonFilterSchema) ]).optional(),
}).strict();

export const NestedEnumConsumptionReasonWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumConsumptionReasonWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ConsumptionReasonSchema).optional(),
  in: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  notIn: z.lazy(() => ConsumptionReasonSchema).array().optional(),
  not: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => NestedEnumConsumptionReasonWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumConsumptionReasonFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumConsumptionReasonFilterSchema).optional()
}).strict();

export const NestedEnumActivityActionFilterSchema: z.ZodType<Prisma.NestedEnumActivityActionFilter> = z.object({
  equals: z.lazy(() => ActivityActionSchema).optional(),
  in: z.lazy(() => ActivityActionSchema).array().optional(),
  notIn: z.lazy(() => ActivityActionSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => NestedEnumActivityActionFilterSchema) ]).optional(),
}).strict();

export const NestedEnumActivityActionWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumActivityActionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityActionSchema).optional(),
  in: z.lazy(() => ActivityActionSchema).array().optional(),
  notIn: z.lazy(() => ActivityActionSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => NestedEnumActivityActionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityActionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityActionFilterSchema).optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  refreshExpiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  refreshExpiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationMemberCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMemberUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMemberCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMemberCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.OrganizationMemberCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationMemberCreateManyUserInputSchema),z.lazy(() => OrganizationMemberCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationCreateWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const OrganizationCreateManyCreatorInputEnvelopeSchema: z.ZodType<Prisma.OrganizationCreateManyCreatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationCreateManyCreatorInputSchema),z.lazy(() => OrganizationCreateManyCreatorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationCreateWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutUpdaterInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutUpdaterInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutUpdaterInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema) ]),
}).strict();

export const OrganizationCreateManyUpdaterInputEnvelopeSchema: z.ZodType<Prisma.OrganizationCreateManyUpdaterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationCreateManyUpdaterInputSchema),z.lazy(() => OrganizationCreateManyUpdaterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const InventoryItemCreateWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutInventoryItemsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedInventoryItemsInputSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const InventoryItemCreateManyCreatorInputEnvelopeSchema: z.ZodType<Prisma.InventoryItemCreateManyCreatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InventoryItemCreateManyCreatorInputSchema),z.lazy(() => InventoryItemCreateManyCreatorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const InventoryItemCreateWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemCreateWithoutUpdaterInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutInventoryItemsInputSchema),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedInventoryItemsInputSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemUncheckedCreateWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateWithoutUpdaterInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemCreateOrConnectWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemCreateOrConnectWithoutUpdaterInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema) ]),
}).strict();

export const InventoryItemCreateManyUpdaterInputEnvelopeSchema: z.ZodType<Prisma.InventoryItemCreateManyUpdaterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InventoryItemCreateManyUpdaterInputSchema),z.lazy(() => InventoryItemCreateManyUpdaterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ConsumptionLogCreateWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inventoryItem: z.lazy(() => InventoryItemCreateNestedOneWithoutConsumptionLogsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutConsumptionLogsInputSchema)
}).strict();

export const ConsumptionLogUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  inventoryItemId: z.string(),
  organizationId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ConsumptionLogCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ConsumptionLogCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ConsumptionLogCreateManyUserInputSchema),z.lazy(() => ConsumptionLogCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ActivityLogCreateWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutActivityLogsInputSchema)
}).strict();

export const ActivityLogUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ActivityLogCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ActivityLogCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ActivityLogCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ActivityLogCreateManyUserInputSchema),z.lazy(() => ActivityLogCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationInvitationCreateWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateWithoutInviterInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutInvitationsInputSchema)
}).strict();

export const OrganizationInvitationUncheckedCreateWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedCreateWithoutInviterInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationInvitationCreateOrConnectWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateOrConnectWithoutInviterInput> = z.object({
  where: z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema) ]),
}).strict();

export const OrganizationInvitationCreateManyInviterInputEnvelopeSchema: z.ZodType<Prisma.OrganizationInvitationCreateManyInviterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationInvitationCreateManyInviterInputSchema),z.lazy(() => OrganizationInvitationCreateManyInviterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PasswordResetTokenCreateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  usedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PasswordResetTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  usedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PasswordResetTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PasswordResetTokenCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PasswordResetTokenCreateManyUserInputSchema),z.lazy(() => PasswordResetTokenCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EmailVerificationTokenCreateWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  verifiedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EmailVerificationTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  verifiedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EmailVerificationTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const EmailVerificationTokenCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.EmailVerificationTokenCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EmailVerificationTokenCreateManyUserInputSchema),z.lazy(() => EmailVerificationTokenCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refreshToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  refreshExpiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateManyMutationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMemberScalarWhereInputSchema: z.ZodType<Prisma.OrganizationMemberScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationUpsertWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUpsertWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutCreatorInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const OrganizationUpdateWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUpdateWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutCreatorInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutCreatorInputSchema) ]),
}).strict();

export const OrganizationUpdateManyWithWhereWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithWhereWithoutCreatorInput> = z.object({
  where: z.lazy(() => OrganizationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateManyMutationInputSchema),z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorInputSchema) ]),
}).strict();

export const OrganizationScalarWhereInputSchema: z.ZodType<Prisma.OrganizationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => EnumOrganizationPrivacyFilterSchema),z.lazy(() => OrganizationPrivacySchema) ]).optional(),
  inviteCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  settings: z.lazy(() => JsonFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationUpsertWithWhereUniqueWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUpsertWithWhereUniqueWithoutUpdaterInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUpdaterInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUpdaterInputSchema) ]),
}).strict();

export const OrganizationUpdateWithWhereUniqueWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUpdateWithWhereUniqueWithoutUpdaterInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutUpdaterInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUpdaterInputSchema) ]),
}).strict();

export const OrganizationUpdateManyWithWhereWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithWhereWithoutUpdaterInput> = z.object({
  where: z.lazy(() => OrganizationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateManyMutationInputSchema),z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterInputSchema) ]),
}).strict();

export const InventoryItemUpsertWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUpsertWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutCreatorInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const InventoryItemUpdateWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUpdateWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InventoryItemUpdateWithoutCreatorInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutCreatorInputSchema) ]),
}).strict();

export const InventoryItemUpdateManyWithWhereWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUpdateManyWithWhereWithoutCreatorInput> = z.object({
  where: z.lazy(() => InventoryItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InventoryItemUpdateManyMutationInputSchema),z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorInputSchema) ]),
}).strict();

export const InventoryItemScalarWhereInputSchema: z.ZodType<Prisma.InventoryItemScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryItemScalarWhereInputSchema),z.lazy(() => InventoryItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  brand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumInventoryCategoryFilterSchema),z.lazy(() => InventoryCategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  minQuantity: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  bestBeforeDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => EnumExpiryTypeFilterSchema),z.lazy(() => ExpiryTypeSchema) ]).optional(),
  storageLocation: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.lazy(() => JsonNullableFilterSchema).optional(),
  barcode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  asin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  productId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const InventoryItemUpsertWithWhereUniqueWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUpsertWithWhereUniqueWithoutUpdaterInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutUpdaterInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutUpdaterInputSchema) ]),
}).strict();

export const InventoryItemUpdateWithWhereUniqueWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUpdateWithWhereUniqueWithoutUpdaterInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InventoryItemUpdateWithoutUpdaterInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutUpdaterInputSchema) ]),
}).strict();

export const InventoryItemUpdateManyWithWhereWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUpdateManyWithWhereWithoutUpdaterInput> = z.object({
  where: z.lazy(() => InventoryItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InventoryItemUpdateManyMutationInputSchema),z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterInputSchema) ]),
}).strict();

export const ConsumptionLogUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ConsumptionLogUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ConsumptionLogUpdateWithoutUserInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ConsumptionLogUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ConsumptionLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ConsumptionLogUpdateManyMutationInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ConsumptionLogScalarWhereInputSchema: z.ZodType<Prisma.ConsumptionLogScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConsumptionLogScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConsumptionLogScalarWhereInputSchema),z.lazy(() => ConsumptionLogScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inventoryItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  reason: z.union([ z.lazy(() => EnumConsumptionReasonFilterSchema),z.lazy(() => ConsumptionReasonSchema) ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  consumedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  consumedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ActivityLogUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ActivityLogUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ActivityLogUpdateWithoutUserInputSchema),z.lazy(() => ActivityLogUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ActivityLogUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ActivityLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ActivityLogUpdateManyMutationInputSchema),z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ActivityLogScalarWhereInputSchema: z.ZodType<Prisma.ActivityLogScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema),z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema),z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumActivityActionFilterSchema),z.lazy(() => ActivityActionSchema) ]).optional(),
  entityType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  entityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationInvitationUpsertWithWhereUniqueWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUpsertWithWhereUniqueWithoutInviterInput> = z.object({
  where: z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationInvitationUpdateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedUpdateWithoutInviterInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutInviterInputSchema) ]),
}).strict();

export const OrganizationInvitationUpdateWithWhereUniqueWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateWithWhereUniqueWithoutInviterInput> = z.object({
  where: z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationInvitationUpdateWithoutInviterInputSchema),z.lazy(() => OrganizationInvitationUncheckedUpdateWithoutInviterInputSchema) ]),
}).strict();

export const OrganizationInvitationUpdateManyWithWhereWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateManyWithWhereWithoutInviterInput> = z.object({
  where: z.lazy(() => OrganizationInvitationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationInvitationUpdateManyMutationInputSchema),z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterInputSchema) ]),
}).strict();

export const OrganizationInvitationScalarWhereInputSchema: z.ZodType<Prisma.OrganizationInvitationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationInvitationScalarWhereInputSchema),z.lazy(() => OrganizationInvitationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationInvitationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationInvitationScalarWhereInputSchema),z.lazy(() => OrganizationInvitationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumInvitationStatusFilterSchema),z.lazy(() => InvitationStatusSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  acceptedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  rejectedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PasswordResetTokenUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PasswordResetTokenUpdateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PasswordResetTokenUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PasswordResetTokenUpdateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PasswordResetTokenUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PasswordResetTokenScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PasswordResetTokenUpdateManyMutationInputSchema),z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const PasswordResetTokenScalarWhereInputSchema: z.ZodType<Prisma.PasswordResetTokenScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PasswordResetTokenScalarWhereInputSchema),z.lazy(() => PasswordResetTokenScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenScalarWhereInputSchema),z.lazy(() => PasswordResetTokenScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  usedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EmailVerificationTokenUpdateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => EmailVerificationTokenCreateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => EmailVerificationTokenWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EmailVerificationTokenUpdateWithoutUserInputSchema),z.lazy(() => EmailVerificationTokenUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const EmailVerificationTokenUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => EmailVerificationTokenScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EmailVerificationTokenUpdateManyMutationInputSchema),z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const EmailVerificationTokenScalarWhereInputSchema: z.ZodType<Prisma.EmailVerificationTokenScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailVerificationTokenScalarWhereInputSchema),z.lazy(() => EmailVerificationTokenScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailVerificationTokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailVerificationTokenScalarWhereInputSchema),z.lazy(() => EmailVerificationTokenScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  verifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserCreateWithoutCreatedOrganizationsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCreatedOrganizationsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCreatedOrganizationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedOrganizationsInputSchema) ]),
}).strict();

export const UserCreateWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserCreateWithoutUpdatedOrganizationsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUpdatedOrganizationsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUpdatedOrganizationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedOrganizationsInputSchema) ]),
}).strict();

export const OrganizationMemberCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutMembershipsInputSchema)
}).strict();

export const OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMemberCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.OrganizationMemberCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationMemberCreateManyOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationInvitationCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inviter: z.lazy(() => UserCreateNestedOneWithoutSentInvitationsInputSchema)
}).strict();

export const OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  invitedBy: z.string(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationInvitationCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationInvitationCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.OrganizationInvitationCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationInvitationCreateManyOrganizationInputSchema),z.lazy(() => OrganizationInvitationCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const InventoryItemCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedInventoryItemsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedInventoryItemsInputSchema),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutInventoryItemInputSchema).optional()
}).strict();

export const InventoryItemCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const InventoryItemCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.InventoryItemCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InventoryItemCreateManyOrganizationInputSchema),z.lazy(() => InventoryItemCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ConsumptionLogCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inventoryItem: z.lazy(() => InventoryItemCreateNestedOneWithoutConsumptionLogsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutConsumptionLogsInputSchema)
}).strict();

export const ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  inventoryItemId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  consumedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const ConsumptionLogCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.ConsumptionLogCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ConsumptionLogCreateManyOrganizationInputSchema),z.lazy(() => ConsumptionLogCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ActivityLogCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutActivityLogsInputSchema)
}).strict();

export const ActivityLogUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ActivityLogCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const ActivityLogCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.ActivityLogCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ActivityLogCreateManyOrganizationInputSchema),z.lazy(() => ActivityLogCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutCreatedOrganizationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatedOrganizationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedOrganizationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCreatedOrganizationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCreatedOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatedOrganizationsInputSchema) ]),
}).strict();

export const UserUpdateWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutCreatedOrganizationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCreatedOrganizationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCreatedOrganizationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutUpdatedOrganizationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUpdatedOrganizationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedOrganizationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUpdatedOrganizationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUpdatedOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUpdatedOrganizationsInputSchema) ]),
}).strict();

export const UserUpdateWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutUpdatedOrganizationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUpdatedOrganizationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUpdatedOrganizationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateManyMutationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationInvitationUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationInvitationUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationInvitationCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationInvitationUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationInvitationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationInvitationUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationInvitationUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationInvitationUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationInvitationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationInvitationUpdateManyMutationInputSchema),z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const InventoryItemUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InventoryItemUpdateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const InventoryItemUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InventoryItemUpdateWithoutOrganizationInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const InventoryItemUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => InventoryItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InventoryItemUpdateManyMutationInputSchema),z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const ConsumptionLogUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const ConsumptionLogUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ConsumptionLogUpdateWithoutOrganizationInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const ConsumptionLogUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ConsumptionLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ConsumptionLogUpdateManyMutationInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const ActivityLogUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const ActivityLogUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ActivityLogUpdateWithoutOrganizationInputSchema),z.lazy(() => ActivityLogUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const ActivityLogUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => ActivityLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ActivityLogUpdateManyMutationInputSchema),z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutMembersInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedOrganizationsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema),
  invitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutMembersInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
}).strict();

export const UserCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserCreateWithoutMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutMembershipsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]),
}).strict();

export const OrganizationUpsertWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutMembersInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUpsertWithoutMembershipsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMembershipsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMembershipsInputSchema) ]),
}).strict();

export const UserUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUpdateWithoutMembershipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMembershipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationCreateWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutInvitationsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedOrganizationsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutInvitationsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutInvitationsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInvitationsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInvitationsInputSchema) ]),
}).strict();

export const UserCreateWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserCreateWithoutSentInvitationsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSentInvitationsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSentInvitationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSentInvitationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSentInvitationsInputSchema) ]),
}).strict();

export const OrganizationUpsertWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutInvitationsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutInvitationsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutInvitationsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInvitationsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInvitationsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutInvitationsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutInvitationsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutInvitationsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutInvitationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutInvitationsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutInvitationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSentInvitationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSentInvitationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSentInvitationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSentInvitationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSentInvitationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSentInvitationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSentInvitationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSentInvitationsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSentInvitationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSentInvitationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSentInvitationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationCreateWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutInventoryItemsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedOrganizationsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutInventoryItemsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutInventoryItemsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInventoryItemsInputSchema) ]),
}).strict();

export const UserCreateWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserCreateWithoutCreatedInventoryItemsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCreatedInventoryItemsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCreatedInventoryItemsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedInventoryItemsInputSchema) ]),
}).strict();

export const UserCreateWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserCreateWithoutUpdatedInventoryItemsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUpdatedInventoryItemsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUpdatedInventoryItemsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedInventoryItemsInputSchema) ]),
}).strict();

export const ConsumptionLogCreateWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogCreateWithoutInventoryItemInput> = z.object({
  id: z.string().cuid().optional(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutConsumptionLogsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutConsumptionLogsInputSchema)
}).strict();

export const ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedCreateWithoutInventoryItemInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  consumedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogCreateOrConnectWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogCreateOrConnectWithoutInventoryItemInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema) ]),
}).strict();

export const ConsumptionLogCreateManyInventoryItemInputEnvelopeSchema: z.ZodType<Prisma.ConsumptionLogCreateManyInventoryItemInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ConsumptionLogCreateManyInventoryItemInputSchema),z.lazy(() => ConsumptionLogCreateManyInventoryItemInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationUpsertWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutInventoryItemsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutInventoryItemsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutInventoryItemsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutInventoryItemsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutInventoryItemsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutInventoryItemsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutInventoryItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutInventoryItemsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutInventoryItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUpsertWithoutCreatedInventoryItemsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatedInventoryItemsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatedInventoryItemsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCreatedInventoryItemsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCreatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatedInventoryItemsInputSchema) ]),
}).strict();

export const UserUpdateWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUpdateWithoutCreatedInventoryItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCreatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCreatedInventoryItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUpsertWithoutUpdatedInventoryItemsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUpdatedInventoryItemsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUpdatedInventoryItemsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUpdatedInventoryItemsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUpdatedInventoryItemsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUpdatedInventoryItemsInputSchema) ]),
}).strict();

export const UserUpdateWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUpdateWithoutUpdatedInventoryItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUpdatedInventoryItemsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUpdatedInventoryItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ConsumptionLogUpsertWithWhereUniqueWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUpsertWithWhereUniqueWithoutInventoryItemInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ConsumptionLogUpdateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateWithoutInventoryItemInputSchema) ]),
  create: z.union([ z.lazy(() => ConsumptionLogCreateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedCreateWithoutInventoryItemInputSchema) ]),
}).strict();

export const ConsumptionLogUpdateWithWhereUniqueWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateWithWhereUniqueWithoutInventoryItemInput> = z.object({
  where: z.lazy(() => ConsumptionLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ConsumptionLogUpdateWithoutInventoryItemInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateWithoutInventoryItemInputSchema) ]),
}).strict();

export const ConsumptionLogUpdateManyWithWhereWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyWithWhereWithoutInventoryItemInput> = z.object({
  where: z.lazy(() => ConsumptionLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ConsumptionLogUpdateManyMutationInputSchema),z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutInventoryItemInputSchema) ]),
}).strict();

export const InventoryItemCreateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemCreateWithoutConsumptionLogsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutInventoryItemsInputSchema),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedInventoryItemsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedInventoryItemsInputSchema)
}).strict();

export const InventoryItemUncheckedCreateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemUncheckedCreateWithoutConsumptionLogsInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const InventoryItemCreateOrConnectWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemCreateOrConnectWithoutConsumptionLogsInput> = z.object({
  where: z.lazy(() => InventoryItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutConsumptionLogsInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutConsumptionLogsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedOrganizationsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutConsumptionLogsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutConsumptionLogsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutConsumptionLogsInputSchema) ]),
}).strict();

export const UserCreateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserCreateWithoutConsumptionLogsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutConsumptionLogsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutConsumptionLogsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutConsumptionLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConsumptionLogsInputSchema) ]),
}).strict();

export const InventoryItemUpsertWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemUpsertWithoutConsumptionLogsInput> = z.object({
  update: z.union([ z.lazy(() => InventoryItemUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutConsumptionLogsInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryItemCreateWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUncheckedCreateWithoutConsumptionLogsInputSchema) ]),
  where: z.lazy(() => InventoryItemWhereInputSchema).optional()
}).strict();

export const InventoryItemUpdateToOneWithWhereWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemUpdateToOneWithWhereWithoutConsumptionLogsInput> = z.object({
  where: z.lazy(() => InventoryItemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => InventoryItemUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => InventoryItemUncheckedUpdateWithoutConsumptionLogsInputSchema) ]),
}).strict();

export const InventoryItemUpdateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemUpdateWithoutConsumptionLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutInventoryItemsNestedInputSchema).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedInventoryItemsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedInventoryItemsNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateWithoutConsumptionLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpsertWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutConsumptionLogsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutConsumptionLogsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutConsumptionLogsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutConsumptionLogsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutConsumptionLogsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutConsumptionLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutConsumptionLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserUpsertWithoutConsumptionLogsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutConsumptionLogsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutConsumptionLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConsumptionLogsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutConsumptionLogsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutConsumptionLogsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutConsumptionLogsInputSchema) ]),
}).strict();

export const UserUpdateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserUpdateWithoutConsumptionLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutConsumptionLogsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutConsumptionLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationCreateWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutActivityLogsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatedOrganizationsInputSchema),
  updater: z.lazy(() => UserCreateNestedOneWithoutUpdatedOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutActivityLogsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutActivityLogsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutActivityLogsInputSchema) ]),
}).strict();

export const UserCreateWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserCreateWithoutActivityLogsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutActivityLogsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutActivityLogsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutActivityLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivityLogsInputSchema) ]),
}).strict();

export const OrganizationUpsertWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutActivityLogsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutActivityLogsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutActivityLogsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutActivityLogsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutActivityLogsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutActivityLogsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutActivityLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutActivityLogsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutActivityLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserUpsertWithoutActivityLogsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutActivityLogsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutActivityLogsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutActivityLogsInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivityLogsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutActivityLogsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutActivityLogsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutActivityLogsInputSchema) ]),
}).strict();

export const UserUpdateWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserUpdateWithoutActivityLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutActivityLogsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutActivityLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserCreateWithoutPasswordResetTokensInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPasswordResetTokensInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPasswordResetTokensInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokensInputSchema) ]),
}).strict();

export const UserUpsertWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserUpsertWithoutPasswordResetTokensInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPasswordResetTokensInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokensInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPasswordResetTokensInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPasswordResetTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPasswordResetTokensInputSchema) ]),
}).strict();

export const UserUpdateWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserUpdateWithoutPasswordResetTokensInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPasswordResetTokensInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPasswordResetTokensInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  emailVerificationTokens: z.lazy(() => EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserCreateWithoutEmailVerificationTokensInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutEmailVerificationTokensInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  displayName: z.string(),
  profileImage: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  providers: z.union([ z.lazy(() => UserCreateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedCreateNestedManyWithoutUpdaterInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedCreateNestedManyWithoutInviterInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutEmailVerificationTokensInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailVerificationTokensInputSchema) ]),
}).strict();

export const UserUpsertWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserUpsertWithoutEmailVerificationTokensInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEmailVerificationTokensInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailVerificationTokensInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutEmailVerificationTokensInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutEmailVerificationTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEmailVerificationTokensInputSchema) ]),
}).strict();

export const UserUpdateWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserUpdateWithoutEmailVerificationTokensInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutEmailVerificationTokensInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutEmailVerificationTokensInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isEmailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  lastLoginAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  providers: z.union([ z.lazy(() => UserUpdateprovidersInputSchema),z.lazy(() => AuthProviderSchema).array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  memberships: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  createdOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedOrganizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  createdInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  updatedInventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutUpdaterNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentInvitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutInviterNestedInputSchema).optional(),
  passwordResetTokens: z.lazy(() => PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  refreshExpiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMemberCreateManyUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationCreateManyCreatorInputSchema: z.ZodType<Prisma.OrganizationCreateManyCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationCreateManyUpdaterInputSchema: z.ZodType<Prisma.OrganizationCreateManyUpdaterInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  privacy: z.lazy(() => OrganizationPrivacySchema).optional(),
  inviteCode: z.string().optional().nullable(),
  inviteCodeExpiresAt: z.coerce.date().optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const InventoryItemCreateManyCreatorInputSchema: z.ZodType<Prisma.InventoryItemCreateManyCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const InventoryItemCreateManyUpdaterInputSchema: z.ZodType<Prisma.InventoryItemCreateManyUpdaterInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogCreateManyUserInputSchema: z.ZodType<Prisma.ConsumptionLogCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  inventoryItemId: z.string(),
  organizationId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ActivityLogCreateManyUserInputSchema: z.ZodType<Prisma.ActivityLogCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const OrganizationInvitationCreateManyInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateManyInviterInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PasswordResetTokenCreateManyUserInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  usedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EmailVerificationTokenCreateManyUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  verifiedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refreshExpiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refreshExpiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refreshExpiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateManyWithoutCreatorInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutUpdaterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutUpdaterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  invitations: z.lazy(() => OrganizationInvitationUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  inventoryItems: z.lazy(() => InventoryItemUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  activityLogs: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateManyWithoutUpdaterInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutUpdaterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  privacy: z.union([ z.lazy(() => OrganizationPrivacySchema),z.lazy(() => EnumOrganizationPrivacyFieldUpdateOperationsInputSchema) ]).optional(),
  inviteCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inviteCodeExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryItemUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutInventoryItemsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedInventoryItemsNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateManyWithoutCreatorInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateManyWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryItemUpdateWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUpdateWithoutUpdaterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutInventoryItemsNestedInputSchema).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedInventoryItemsNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateWithoutUpdaterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateManyWithoutUpdaterInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateManyWithoutUpdaterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogUpdateWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItem: z.lazy(() => InventoryItemUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional()
}).strict();

export const ConsumptionLogUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityLogUpdateWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutActivityLogsNestedInputSchema).optional()
}).strict();

export const ActivityLogUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityLogUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationUpdateWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateWithoutInviterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutInvitationsNestedInputSchema).optional()
}).strict();

export const OrganizationInvitationUncheckedUpdateWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateWithoutInviterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationUncheckedUpdateManyWithoutInviterInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateManyWithoutInviterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailVerificationTokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailVerificationTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailVerificationTokenUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.EmailVerificationTokenUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberCreateManyOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  invitedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationInvitationCreateManyOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => InvitationStatusSchema).optional(),
  invitedBy: z.string(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional().nullable(),
  rejectedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const InventoryItemCreateManyOrganizationInputSchema: z.ZodType<Prisma.InventoryItemCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  category: z.lazy(() => InventoryCategorySchema),
  quantity: z.number(),
  unit: z.string(),
  minQuantity: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  bestBeforeDate: z.coerce.date().optional().nullable(),
  expiryType: z.lazy(() => ExpiryTypeSchema),
  storageLocation: z.string().optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.string().optional().nullable(),
  asin: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemCreatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemCreateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.string().optional().nullable(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogCreateManyOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  inventoryItemId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  consumedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ActivityLogCreateManyOrganizationInputSchema: z.ZodType<Prisma.ActivityLogCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  action: z.lazy(() => ActivityActionSchema),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const OrganizationMemberUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inviter: z.lazy(() => UserUpdateOneRequiredWithoutSentInvitationsNestedInputSchema).optional()
}).strict();

export const OrganizationInvitationUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationInvitationUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationInvitationUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => InvitationStatusSchema),z.lazy(() => EnumInvitationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  acceptedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rejectedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryItemUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatedInventoryItemsNestedInputSchema).optional(),
  updater: z.lazy(() => UserUpdateOneRequiredWithoutUpdatedInventoryItemsNestedInputSchema).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumptionLogs: z.lazy(() => ConsumptionLogUncheckedUpdateManyWithoutInventoryItemNestedInputSchema).optional()
}).strict();

export const InventoryItemUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.InventoryItemUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => InventoryCategorySchema),z.lazy(() => EnumInventoryCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bestBeforeDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryType: z.union([ z.lazy(() => ExpiryTypeSchema),z.lazy(() => EnumExpiryTypeFieldUpdateOperationsInputSchema) ]).optional(),
  storageLocation: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  barcode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  asin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  productId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => InventoryItemUpdatetagsInputSchema),z.string().array() ]).optional(),
  images: z.union([ z.lazy(() => InventoryItemUpdateimagesInputSchema),z.string().array() ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItem: z.lazy(() => InventoryItemUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional()
}).strict();

export const ConsumptionLogUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityLogUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutActivityLogsNestedInputSchema).optional()
}).strict();

export const ActivityLogUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityLogUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => ActivityActionSchema),z.lazy(() => EnumActivityActionFieldUpdateOperationsInputSchema) ]).optional(),
  entityType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  entityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogCreateManyInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogCreateManyInventoryItemInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  quantity: z.number(),
  reason: z.lazy(() => ConsumptionReasonSchema),
  notes: z.string().optional().nullable(),
  consumedAt: z.coerce.date().optional(),
  consumedBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConsumptionLogUpdateWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUpdateWithoutInventoryItemInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutConsumptionLogsNestedInputSchema).optional()
}).strict();

export const ConsumptionLogUncheckedUpdateWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateWithoutInventoryItemInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConsumptionLogUncheckedUpdateManyWithoutInventoryItemInputSchema: z.ZodType<Prisma.ConsumptionLogUncheckedUpdateManyWithoutInventoryItemInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.lazy(() => ConsumptionReasonSchema),z.lazy(() => EnumConsumptionReasonFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  consumedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  consumedBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindFirstArgsSchema: z.ZodType<Prisma.OrganizationFindFirstArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindFirstOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindManyArgsSchema: z.ZodType<Prisma.OrganizationFindManyArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationAggregateArgsSchema: z.ZodType<Prisma.OrganizationAggregateArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationGroupByArgsSchema: z.ZodType<Prisma.OrganizationGroupByArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithAggregationInputSchema.array(),OrganizationOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationScalarFieldEnumSchema.array(),
  having: OrganizationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberFindFirstArgsSchema: z.ZodType<Prisma.OrganizationMemberFindFirstArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMemberScalarFieldEnumSchema,OrganizationMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMemberFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationMemberFindFirstOrThrowArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMemberScalarFieldEnumSchema,OrganizationMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMemberFindManyArgsSchema: z.ZodType<Prisma.OrganizationMemberFindManyArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMemberScalarFieldEnumSchema,OrganizationMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMemberAggregateArgsSchema: z.ZodType<Prisma.OrganizationMemberAggregateArgs> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationMemberGroupByArgsSchema: z.ZodType<Prisma.OrganizationMemberGroupByArgs> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithAggregationInputSchema.array(),OrganizationMemberOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationMemberScalarFieldEnumSchema.array(),
  having: OrganizationMemberScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationMemberFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationMemberFindUniqueArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationMemberFindUniqueOrThrowArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationInvitationFindFirstArgsSchema: z.ZodType<Prisma.OrganizationInvitationFindFirstArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  where: OrganizationInvitationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationInvitationOrderByWithRelationInputSchema.array(),OrganizationInvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationInvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationInvitationScalarFieldEnumSchema,OrganizationInvitationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationInvitationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationInvitationFindFirstOrThrowArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  where: OrganizationInvitationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationInvitationOrderByWithRelationInputSchema.array(),OrganizationInvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationInvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationInvitationScalarFieldEnumSchema,OrganizationInvitationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationInvitationFindManyArgsSchema: z.ZodType<Prisma.OrganizationInvitationFindManyArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  where: OrganizationInvitationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationInvitationOrderByWithRelationInputSchema.array(),OrganizationInvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationInvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationInvitationScalarFieldEnumSchema,OrganizationInvitationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationInvitationAggregateArgsSchema: z.ZodType<Prisma.OrganizationInvitationAggregateArgs> = z.object({
  where: OrganizationInvitationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationInvitationOrderByWithRelationInputSchema.array(),OrganizationInvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationInvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationInvitationGroupByArgsSchema: z.ZodType<Prisma.OrganizationInvitationGroupByArgs> = z.object({
  where: OrganizationInvitationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationInvitationOrderByWithAggregationInputSchema.array(),OrganizationInvitationOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationInvitationScalarFieldEnumSchema.array(),
  having: OrganizationInvitationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationInvitationFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationInvitationFindUniqueArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  where: OrganizationInvitationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationInvitationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationInvitationFindUniqueOrThrowArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  where: OrganizationInvitationWhereUniqueInputSchema,
}).strict() ;

export const InventoryItemFindFirstArgsSchema: z.ZodType<Prisma.InventoryItemFindFirstArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  where: InventoryItemWhereInputSchema.optional(),
  orderBy: z.union([ InventoryItemOrderByWithRelationInputSchema.array(),InventoryItemOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryItemScalarFieldEnumSchema,InventoryItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InventoryItemFindFirstOrThrowArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  where: InventoryItemWhereInputSchema.optional(),
  orderBy: z.union([ InventoryItemOrderByWithRelationInputSchema.array(),InventoryItemOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryItemScalarFieldEnumSchema,InventoryItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryItemFindManyArgsSchema: z.ZodType<Prisma.InventoryItemFindManyArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  where: InventoryItemWhereInputSchema.optional(),
  orderBy: z.union([ InventoryItemOrderByWithRelationInputSchema.array(),InventoryItemOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryItemScalarFieldEnumSchema,InventoryItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryItemAggregateArgsSchema: z.ZodType<Prisma.InventoryItemAggregateArgs> = z.object({
  where: InventoryItemWhereInputSchema.optional(),
  orderBy: z.union([ InventoryItemOrderByWithRelationInputSchema.array(),InventoryItemOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InventoryItemGroupByArgsSchema: z.ZodType<Prisma.InventoryItemGroupByArgs> = z.object({
  where: InventoryItemWhereInputSchema.optional(),
  orderBy: z.union([ InventoryItemOrderByWithAggregationInputSchema.array(),InventoryItemOrderByWithAggregationInputSchema ]).optional(),
  by: InventoryItemScalarFieldEnumSchema.array(),
  having: InventoryItemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InventoryItemFindUniqueArgsSchema: z.ZodType<Prisma.InventoryItemFindUniqueArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  where: InventoryItemWhereUniqueInputSchema,
}).strict() ;

export const InventoryItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InventoryItemFindUniqueOrThrowArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  where: InventoryItemWhereUniqueInputSchema,
}).strict() ;

export const ConsumptionLogFindFirstArgsSchema: z.ZodType<Prisma.ConsumptionLogFindFirstArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  where: ConsumptionLogWhereInputSchema.optional(),
  orderBy: z.union([ ConsumptionLogOrderByWithRelationInputSchema.array(),ConsumptionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ConsumptionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ConsumptionLogScalarFieldEnumSchema,ConsumptionLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ConsumptionLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConsumptionLogFindFirstOrThrowArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  where: ConsumptionLogWhereInputSchema.optional(),
  orderBy: z.union([ ConsumptionLogOrderByWithRelationInputSchema.array(),ConsumptionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ConsumptionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ConsumptionLogScalarFieldEnumSchema,ConsumptionLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ConsumptionLogFindManyArgsSchema: z.ZodType<Prisma.ConsumptionLogFindManyArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  where: ConsumptionLogWhereInputSchema.optional(),
  orderBy: z.union([ ConsumptionLogOrderByWithRelationInputSchema.array(),ConsumptionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ConsumptionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ConsumptionLogScalarFieldEnumSchema,ConsumptionLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ConsumptionLogAggregateArgsSchema: z.ZodType<Prisma.ConsumptionLogAggregateArgs> = z.object({
  where: ConsumptionLogWhereInputSchema.optional(),
  orderBy: z.union([ ConsumptionLogOrderByWithRelationInputSchema.array(),ConsumptionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ConsumptionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ConsumptionLogGroupByArgsSchema: z.ZodType<Prisma.ConsumptionLogGroupByArgs> = z.object({
  where: ConsumptionLogWhereInputSchema.optional(),
  orderBy: z.union([ ConsumptionLogOrderByWithAggregationInputSchema.array(),ConsumptionLogOrderByWithAggregationInputSchema ]).optional(),
  by: ConsumptionLogScalarFieldEnumSchema.array(),
  having: ConsumptionLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ConsumptionLogFindUniqueArgsSchema: z.ZodType<Prisma.ConsumptionLogFindUniqueArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  where: ConsumptionLogWhereUniqueInputSchema,
}).strict() ;

export const ConsumptionLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConsumptionLogFindUniqueOrThrowArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  where: ConsumptionLogWhereUniqueInputSchema,
}).strict() ;

export const ActivityLogFindFirstArgsSchema: z.ZodType<Prisma.ActivityLogFindFirstArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereInputSchema.optional(),
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(),ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityLogScalarFieldEnumSchema,ActivityLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ActivityLogFindFirstOrThrowArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereInputSchema.optional(),
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(),ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityLogScalarFieldEnumSchema,ActivityLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityLogFindManyArgsSchema: z.ZodType<Prisma.ActivityLogFindManyArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereInputSchema.optional(),
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(),ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityLogScalarFieldEnumSchema,ActivityLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityLogAggregateArgsSchema: z.ZodType<Prisma.ActivityLogAggregateArgs> = z.object({
  where: ActivityLogWhereInputSchema.optional(),
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(),ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivityLogGroupByArgsSchema: z.ZodType<Prisma.ActivityLogGroupByArgs> = z.object({
  where: ActivityLogWhereInputSchema.optional(),
  orderBy: z.union([ ActivityLogOrderByWithAggregationInputSchema.array(),ActivityLogOrderByWithAggregationInputSchema ]).optional(),
  by: ActivityLogScalarFieldEnumSchema.array(),
  having: ActivityLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivityLogFindUniqueArgsSchema: z.ZodType<Prisma.ActivityLogFindUniqueArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema,
}).strict() ;

export const ActivityLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ActivityLogFindUniqueOrThrowArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenFindFirstArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindFirstArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindFirstOrThrowArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenFindManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindManyArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenAggregateArgsSchema: z.ZodType<Prisma.PasswordResetTokenAggregateArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PasswordResetTokenGroupByArgsSchema: z.ZodType<Prisma.PasswordResetTokenGroupByArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithAggregationInputSchema.array(),PasswordResetTokenOrderByWithAggregationInputSchema ]).optional(),
  by: PasswordResetTokenScalarFieldEnumSchema.array(),
  having: PasswordResetTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PasswordResetTokenFindUniqueArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindUniqueArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindUniqueOrThrowArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const EmailVerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.EmailVerificationTokenFindFirstArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  where: EmailVerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ EmailVerificationTokenOrderByWithRelationInputSchema.array(),EmailVerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailVerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailVerificationTokenScalarFieldEnumSchema,EmailVerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailVerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EmailVerificationTokenFindFirstOrThrowArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  where: EmailVerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ EmailVerificationTokenOrderByWithRelationInputSchema.array(),EmailVerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailVerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailVerificationTokenScalarFieldEnumSchema,EmailVerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailVerificationTokenFindManyArgsSchema: z.ZodType<Prisma.EmailVerificationTokenFindManyArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  where: EmailVerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ EmailVerificationTokenOrderByWithRelationInputSchema.array(),EmailVerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailVerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailVerificationTokenScalarFieldEnumSchema,EmailVerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailVerificationTokenAggregateArgsSchema: z.ZodType<Prisma.EmailVerificationTokenAggregateArgs> = z.object({
  where: EmailVerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ EmailVerificationTokenOrderByWithRelationInputSchema.array(),EmailVerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailVerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailVerificationTokenGroupByArgsSchema: z.ZodType<Prisma.EmailVerificationTokenGroupByArgs> = z.object({
  where: EmailVerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ EmailVerificationTokenOrderByWithAggregationInputSchema.array(),EmailVerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: EmailVerificationTokenScalarFieldEnumSchema.array(),
  having: EmailVerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailVerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.EmailVerificationTokenFindUniqueArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  where: EmailVerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const EmailVerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EmailVerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  where: EmailVerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationCreateArgsSchema: z.ZodType<Prisma.OrganizationCreateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationUpsertArgsSchema: z.ZodType<Prisma.OrganizationUpsertArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
  create: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationCreateManyArgsSchema: z.ZodType<Prisma.OrganizationCreateManyArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationDeleteArgsSchema: z.ZodType<Prisma.OrganizationDeleteArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateArgsSchema: z.ZodType<Prisma.OrganizationUpdateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationUpdateManyArgs> = z.object({
  data: z.union([ OrganizationUpdateManyMutationInputSchema,OrganizationUncheckedUpdateManyInputSchema ]),
  where: OrganizationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationUpdateManyMutationInputSchema,OrganizationUncheckedUpdateManyInputSchema ]),
  where: OrganizationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationDeleteManyArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationMemberCreateArgsSchema: z.ZodType<Prisma.OrganizationMemberCreateArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  data: z.union([ OrganizationMemberCreateInputSchema,OrganizationMemberUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationMemberUpsertArgsSchema: z.ZodType<Prisma.OrganizationMemberUpsertArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  where: OrganizationMemberWhereUniqueInputSchema,
  create: z.union([ OrganizationMemberCreateInputSchema,OrganizationMemberUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationMemberUpdateInputSchema,OrganizationMemberUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationMemberCreateManyArgsSchema: z.ZodType<Prisma.OrganizationMemberCreateManyArgs> = z.object({
  data: z.union([ OrganizationMemberCreateManyInputSchema,OrganizationMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationMemberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationMemberCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationMemberCreateManyInputSchema,OrganizationMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationMemberDeleteArgsSchema: z.ZodType<Prisma.OrganizationMemberDeleteArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberUpdateArgsSchema: z.ZodType<Prisma.OrganizationMemberUpdateArgs> = z.object({
  select: OrganizationMemberSelectSchema.optional(),
  include: OrganizationMemberIncludeSchema.optional(),
  data: z.union([ OrganizationMemberUpdateInputSchema,OrganizationMemberUncheckedUpdateInputSchema ]),
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyArgs> = z.object({
  data: z.union([ OrganizationMemberUpdateManyMutationInputSchema,OrganizationMemberUncheckedUpdateManyInputSchema ]),
  where: OrganizationMemberWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationMemberUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationMemberUpdateManyMutationInputSchema,OrganizationMemberUncheckedUpdateManyInputSchema ]),
  where: OrganizationMemberWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationMemberDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationMemberDeleteManyArgs> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationInvitationCreateArgsSchema: z.ZodType<Prisma.OrganizationInvitationCreateArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  data: z.union([ OrganizationInvitationCreateInputSchema,OrganizationInvitationUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationInvitationUpsertArgsSchema: z.ZodType<Prisma.OrganizationInvitationUpsertArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  where: OrganizationInvitationWhereUniqueInputSchema,
  create: z.union([ OrganizationInvitationCreateInputSchema,OrganizationInvitationUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationInvitationUpdateInputSchema,OrganizationInvitationUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationInvitationCreateManyArgsSchema: z.ZodType<Prisma.OrganizationInvitationCreateManyArgs> = z.object({
  data: z.union([ OrganizationInvitationCreateManyInputSchema,OrganizationInvitationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationInvitationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationInvitationCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationInvitationCreateManyInputSchema,OrganizationInvitationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationInvitationDeleteArgsSchema: z.ZodType<Prisma.OrganizationInvitationDeleteArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  where: OrganizationInvitationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationInvitationUpdateArgsSchema: z.ZodType<Prisma.OrganizationInvitationUpdateArgs> = z.object({
  select: OrganizationInvitationSelectSchema.optional(),
  include: OrganizationInvitationIncludeSchema.optional(),
  data: z.union([ OrganizationInvitationUpdateInputSchema,OrganizationInvitationUncheckedUpdateInputSchema ]),
  where: OrganizationInvitationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationInvitationUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationInvitationUpdateManyArgs> = z.object({
  data: z.union([ OrganizationInvitationUpdateManyMutationInputSchema,OrganizationInvitationUncheckedUpdateManyInputSchema ]),
  where: OrganizationInvitationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationInvitationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationInvitationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationInvitationUpdateManyMutationInputSchema,OrganizationInvitationUncheckedUpdateManyInputSchema ]),
  where: OrganizationInvitationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationInvitationDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationInvitationDeleteManyArgs> = z.object({
  where: OrganizationInvitationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InventoryItemCreateArgsSchema: z.ZodType<Prisma.InventoryItemCreateArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  data: z.union([ InventoryItemCreateInputSchema,InventoryItemUncheckedCreateInputSchema ]),
}).strict() ;

export const InventoryItemUpsertArgsSchema: z.ZodType<Prisma.InventoryItemUpsertArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  where: InventoryItemWhereUniqueInputSchema,
  create: z.union([ InventoryItemCreateInputSchema,InventoryItemUncheckedCreateInputSchema ]),
  update: z.union([ InventoryItemUpdateInputSchema,InventoryItemUncheckedUpdateInputSchema ]),
}).strict() ;

export const InventoryItemCreateManyArgsSchema: z.ZodType<Prisma.InventoryItemCreateManyArgs> = z.object({
  data: z.union([ InventoryItemCreateManyInputSchema,InventoryItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InventoryItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.InventoryItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ InventoryItemCreateManyInputSchema,InventoryItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InventoryItemDeleteArgsSchema: z.ZodType<Prisma.InventoryItemDeleteArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  where: InventoryItemWhereUniqueInputSchema,
}).strict() ;

export const InventoryItemUpdateArgsSchema: z.ZodType<Prisma.InventoryItemUpdateArgs> = z.object({
  select: InventoryItemSelectSchema.optional(),
  include: InventoryItemIncludeSchema.optional(),
  data: z.union([ InventoryItemUpdateInputSchema,InventoryItemUncheckedUpdateInputSchema ]),
  where: InventoryItemWhereUniqueInputSchema,
}).strict() ;

export const InventoryItemUpdateManyArgsSchema: z.ZodType<Prisma.InventoryItemUpdateManyArgs> = z.object({
  data: z.union([ InventoryItemUpdateManyMutationInputSchema,InventoryItemUncheckedUpdateManyInputSchema ]),
  where: InventoryItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InventoryItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.InventoryItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ InventoryItemUpdateManyMutationInputSchema,InventoryItemUncheckedUpdateManyInputSchema ]),
  where: InventoryItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InventoryItemDeleteManyArgsSchema: z.ZodType<Prisma.InventoryItemDeleteManyArgs> = z.object({
  where: InventoryItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ConsumptionLogCreateArgsSchema: z.ZodType<Prisma.ConsumptionLogCreateArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  data: z.union([ ConsumptionLogCreateInputSchema,ConsumptionLogUncheckedCreateInputSchema ]),
}).strict() ;

export const ConsumptionLogUpsertArgsSchema: z.ZodType<Prisma.ConsumptionLogUpsertArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  where: ConsumptionLogWhereUniqueInputSchema,
  create: z.union([ ConsumptionLogCreateInputSchema,ConsumptionLogUncheckedCreateInputSchema ]),
  update: z.union([ ConsumptionLogUpdateInputSchema,ConsumptionLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const ConsumptionLogCreateManyArgsSchema: z.ZodType<Prisma.ConsumptionLogCreateManyArgs> = z.object({
  data: z.union([ ConsumptionLogCreateManyInputSchema,ConsumptionLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ConsumptionLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ConsumptionLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ ConsumptionLogCreateManyInputSchema,ConsumptionLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ConsumptionLogDeleteArgsSchema: z.ZodType<Prisma.ConsumptionLogDeleteArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  where: ConsumptionLogWhereUniqueInputSchema,
}).strict() ;

export const ConsumptionLogUpdateArgsSchema: z.ZodType<Prisma.ConsumptionLogUpdateArgs> = z.object({
  select: ConsumptionLogSelectSchema.optional(),
  include: ConsumptionLogIncludeSchema.optional(),
  data: z.union([ ConsumptionLogUpdateInputSchema,ConsumptionLogUncheckedUpdateInputSchema ]),
  where: ConsumptionLogWhereUniqueInputSchema,
}).strict() ;

export const ConsumptionLogUpdateManyArgsSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyArgs> = z.object({
  data: z.union([ ConsumptionLogUpdateManyMutationInputSchema,ConsumptionLogUncheckedUpdateManyInputSchema ]),
  where: ConsumptionLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ConsumptionLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ConsumptionLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ConsumptionLogUpdateManyMutationInputSchema,ConsumptionLogUncheckedUpdateManyInputSchema ]),
  where: ConsumptionLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ConsumptionLogDeleteManyArgsSchema: z.ZodType<Prisma.ConsumptionLogDeleteManyArgs> = z.object({
  where: ConsumptionLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityLogCreateArgsSchema: z.ZodType<Prisma.ActivityLogCreateArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  data: z.union([ ActivityLogCreateInputSchema,ActivityLogUncheckedCreateInputSchema ]),
}).strict() ;

export const ActivityLogUpsertArgsSchema: z.ZodType<Prisma.ActivityLogUpsertArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema,
  create: z.union([ ActivityLogCreateInputSchema,ActivityLogUncheckedCreateInputSchema ]),
  update: z.union([ ActivityLogUpdateInputSchema,ActivityLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const ActivityLogCreateManyArgsSchema: z.ZodType<Prisma.ActivityLogCreateManyArgs> = z.object({
  data: z.union([ ActivityLogCreateManyInputSchema,ActivityLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ActivityLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityLogCreateManyInputSchema,ActivityLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ActivityLogDeleteArgsSchema: z.ZodType<Prisma.ActivityLogDeleteArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema,
}).strict() ;

export const ActivityLogUpdateArgsSchema: z.ZodType<Prisma.ActivityLogUpdateArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  data: z.union([ ActivityLogUpdateInputSchema,ActivityLogUncheckedUpdateInputSchema ]),
  where: ActivityLogWhereUniqueInputSchema,
}).strict() ;

export const ActivityLogUpdateManyArgsSchema: z.ZodType<Prisma.ActivityLogUpdateManyArgs> = z.object({
  data: z.union([ ActivityLogUpdateManyMutationInputSchema,ActivityLogUncheckedUpdateManyInputSchema ]),
  where: ActivityLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityLogUpdateManyMutationInputSchema,ActivityLogUncheckedUpdateManyInputSchema ]),
  where: ActivityLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityLogDeleteManyArgsSchema: z.ZodType<Prisma.ActivityLogDeleteManyArgs> = z.object({
  where: ActivityLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PasswordResetTokenCreateArgsSchema: z.ZodType<Prisma.PasswordResetTokenCreateArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  data: z.union([ PasswordResetTokenCreateInputSchema,PasswordResetTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const PasswordResetTokenUpsertArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpsertArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
  create: z.union([ PasswordResetTokenCreateInputSchema,PasswordResetTokenUncheckedCreateInputSchema ]),
  update: z.union([ PasswordResetTokenUpdateInputSchema,PasswordResetTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const PasswordResetTokenCreateManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyArgs> = z.object({
  data: z.union([ PasswordResetTokenCreateManyInputSchema,PasswordResetTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PasswordResetTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ PasswordResetTokenCreateManyInputSchema,PasswordResetTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PasswordResetTokenDeleteArgsSchema: z.ZodType<Prisma.PasswordResetTokenDeleteArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenUpdateArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpdateArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  data: z.union([ PasswordResetTokenUpdateInputSchema,PasswordResetTokenUncheckedUpdateInputSchema ]),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenUpdateManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyArgs> = z.object({
  data: z.union([ PasswordResetTokenUpdateManyMutationInputSchema,PasswordResetTokenUncheckedUpdateManyInputSchema ]),
  where: PasswordResetTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PasswordResetTokenUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PasswordResetTokenUpdateManyMutationInputSchema,PasswordResetTokenUncheckedUpdateManyInputSchema ]),
  where: PasswordResetTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PasswordResetTokenDeleteManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenDeleteManyArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EmailVerificationTokenCreateArgsSchema: z.ZodType<Prisma.EmailVerificationTokenCreateArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  data: z.union([ EmailVerificationTokenCreateInputSchema,EmailVerificationTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const EmailVerificationTokenUpsertArgsSchema: z.ZodType<Prisma.EmailVerificationTokenUpsertArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  where: EmailVerificationTokenWhereUniqueInputSchema,
  create: z.union([ EmailVerificationTokenCreateInputSchema,EmailVerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ EmailVerificationTokenUpdateInputSchema,EmailVerificationTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const EmailVerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.EmailVerificationTokenCreateManyArgs> = z.object({
  data: z.union([ EmailVerificationTokenCreateManyInputSchema,EmailVerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailVerificationTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EmailVerificationTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ EmailVerificationTokenCreateManyInputSchema,EmailVerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailVerificationTokenDeleteArgsSchema: z.ZodType<Prisma.EmailVerificationTokenDeleteArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  where: EmailVerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const EmailVerificationTokenUpdateArgsSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateArgs> = z.object({
  select: EmailVerificationTokenSelectSchema.optional(),
  include: EmailVerificationTokenIncludeSchema.optional(),
  data: z.union([ EmailVerificationTokenUpdateInputSchema,EmailVerificationTokenUncheckedUpdateInputSchema ]),
  where: EmailVerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const EmailVerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ EmailVerificationTokenUpdateManyMutationInputSchema,EmailVerificationTokenUncheckedUpdateManyInputSchema ]),
  where: EmailVerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EmailVerificationTokenUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EmailVerificationTokenUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EmailVerificationTokenUpdateManyMutationInputSchema,EmailVerificationTokenUncheckedUpdateManyInputSchema ]),
  where: EmailVerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EmailVerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.EmailVerificationTokenDeleteManyArgs> = z.object({
  where: EmailVerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;