# コード規約・開発標準

## 概要

備蓄管理アプリケーションの開発における統一されたコード規約とベストプラクティス。Flutter、TypeScript、gRPC、DDD/Clean Architectureに対応した包括的な開発標準。

## 全般的な原則

### 1. 型安全性ファースト
- すべてのコードで型安全性を最優先
- `any`型の使用禁止（やむを得ない場合は`unknown`を使用）
- Protocol Buffersによる厳密な型定義
- Dartでの`dynamic`型使用最小化

### 2. 関数型プログラミング指向
- イミュータブルなデータ構造を優先
- 副作用の最小化
- 純粋関数の推奨
- Result型（neverthrow）によるエラーハンドリング

### 3. 簡潔性の原則
- 記述量は最小限に抑制（パフォーマンス影響がない限り）
- `function`より`const`によるアロー関数を推奨
- コメントは最小限、型とシグネチャで意図を表現
- セルフドキュメンティングコードを目指す
- **ただし、if文やswitch文では必ずブロック`{}`を使用（可読性と安全性のため）**
- **関数・メソッドは25行以内に必ず収める（可読性と保守性のため）**
- **Production code内で`let`は極力使用しない（`const`優先）**
- **分割代入を積極的に活用して記述量削減**
- **関数の引数も分割代入で受け取り、扱いやすくする**
- **`then`チェーンは極力使わず、`async/await`で統一する**

### 4. テスト駆動開発（TDD）
- すべての機能にテストを必須
- テストファーストの開発アプローチ
- 単体テスト・統合テスト・E2Eテストの3層構造
- **テストファイル命名規則**:
  - `*.spec.ts` - 単体テスト（モック使用、単独機能テスト）
  - `*.test.ts` - 結合テスト（モック最小限、実際の依存関係使用）

### 5. ドキュメント自動生成原則
- **すべてのAs-Is系ドキュメントは自動生成で作成する**
- 手動でのドキュメント作成・更新は禁止
- コードと仕様の乖離を防止
- 継続的な最新状態維持

#### As-Is系ドキュメントの定義と自動生成ツール

```typescript
// ✅ 良い例: 自動生成されるAs-Is系ドキュメント

// 1. API仕様書 - OpenAPI/Swagger自動生成
/**
 * @swagger
 * /api/inventory/items:
 *   get:
 *     summary: 備蓄品一覧取得
 *     parameters:
 *       - name: organizationId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 備蓄品一覧
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 */
export const getInventoryItems = async (request: GetInventoryItemsRequest) => {
  // 実装
}

// 2. 型定義ドキュメント - TypeDoc自動生成
/**
 * 備蓄品エンティティ
 * @example
 * ```typescript
 * const item = InventoryItem.create({
 *   name: "米",
 *   quantity: 10,
 *   unit: "kg"
 * })
 * ```
 */
export class InventoryItem {
  /**
   * 備蓄品を消費する
   * @param amount - 消費量
   * @param reason - 消費理由
   * @returns 消費記録またはエラー
   */
  public consume(amount: number, reason?: string): Result<ConsumptionRecord, ConsumeError> {
    // 実装
  }
}

// 3. データベーススキーマドキュメント - Prisma自動生成
// prisma/schema.prisma からERD自動生成
model InventoryItem {
  id             String   @id @default(cuid())
  organizationId String   @map("organization_id")
  name           String
  quantity       Float
  unit           String
  expiryDate     DateTime? @map("expiry_date")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id])
  
  @@map("inventory_items")
}

// 4. アーキテクチャ図 - Mermaidダイアグラム自動生成
/**
 * @mermaid
 * graph TD
 *   A[React Web Admin] --> B[Hono BFF]
 *   C[Flutter Mobile] --> D[Hono RPC Services]
 *   B --> D
 *   D --> E[NestJS Microservices]
 *   E --> F[PostgreSQL]
 *   E --> G[Valkey Cache]
 */

// 5. テストカバレッジレポート - Jest/Vitest自動生成
// package.json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "docs:coverage": "vitest run --coverage --reporter=html"
  }
}
```

#### 自動生成設定例

```yaml
# .github/workflows/docs.yml - GitHub Actions自動生成
name: Generate Documentation
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # 1. API仕様書生成 (OpenAPI)
      - name: Generate OpenAPI Docs
        run: |
          pnpm run build:api-docs
          
      # 2. 型定義ドキュメント生成 (TypeDoc)  
      - name: Generate TypeScript Docs
        run: |
          pnpm run docs:typedoc
          
      # 3. データベース仕様書生成 (Prisma)
      - name: Generate Database Docs
        run: |
          pnpm run docs:db-schema
          
      # 4. テストカバレッジレポート生成
      - name: Generate Test Coverage
        run: |
          pnpm run test:coverage
          
      # 5. アーキテクチャ図生成 (Mermaid)
      - name: Generate Architecture Diagrams
        run: |
          pnpm run docs:mermaid

      # 6. 統合ドキュメントサイト構築 (VitePress/Docusaurus)
      - name: Build Documentation Site
        run: |
          pnpm run docs:build
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/dist
```

```json
// package.json - 自動生成スクリプト設定
{
  "scripts": {
    // API仕様書自動生成
    "build:api-docs": "swagger-jsdoc -d swagger.config.js apps/**/*.ts -o docs/api/openapi.json",
    "serve:api-docs": "swagger-ui-serve docs/api/openapi.json",
    
    // 型定義ドキュメント自動生成
    "docs:typedoc": "typedoc --options typedoc.json",
    
    // データベーススキーマドキュメント自動生成
    "docs:db-schema": "prisma generate && prisma-docs generate",
    "docs:erd": "prisma-erd-generator",
    
    // テストカバレッジレポート自動生成
    "test:coverage": "vitest run --coverage --reporter=html --reporter=json-summary",
    
    // アーキテクチャ図自動生成
    "docs:mermaid": "mmdc -i docs/architecture.mmd -o docs/architecture.svg",
    
    // 統合ドキュメント構築
    "docs:build": "vitepress build docs",
    "docs:dev": "vitepress dev docs",
    
    // CI/CD用: 全ドキュメント自動生成
    "docs:generate-all": "pnpm run build:api-docs && pnpm run docs:typedoc && pnpm run docs:db-schema && pnpm run test:coverage && pnpm run docs:mermaid",
    
    // デプロイ前チェック: ドキュメント最新性確認
    "docs:verify": "node scripts/verify-docs-freshness.js"
  },
  "devDependencies": {
    "@swagger-api/swagger-ui": "^4.19.0",
    "swagger-jsdoc": "^6.2.8",
    "typedoc": "^0.25.0",
    "prisma-docs-generator": "^0.7.0",
    "prisma-erd-generator": "^1.11.2",
    "@mermaid-js/mermaid-cli": "^10.6.0",
    "vitepress": "^1.0.0"
  }
}
```

#### 禁止事項・ルール

```typescript
// ❌ 悪い例: 手動でのAs-Is系ドキュメント作成・更新

// 1. 手動API仕様書作成 (禁止)
// docs/api/manual-api-spec.md ❌
/**
 * ## POST /api/inventory/items
 * 手動で書かれたAPI仕様書
 * パラメータ:
 * - name: string (必須)
 * - quantity: number (必須)
 * ...
 */

// 2. 手動データベース仕様書作成 (禁止)  
// docs/database/manual-schema.md ❌
/**
 * ## inventory_items テーブル
 * | カラム名 | 型 | 説明 |
 * |---------|----|----- |
 * | id | string | 主キー |
 * ...
 */

// 3. 手動アーキテクチャ図作成 (禁止)
// 手動で描いたDraw.io、Figma等のアーキテクチャ図 ❌

// 4. 手動テストカバレッジレポート (禁止)
// 手動で作成したテスト結果サマリー ❌

// ✅ 正しいアプローチ: 自動生成ツールによる生成
// - OpenAPI/Swagger: APIスキーマから自動生成
// - TypeDoc: TypeScriptコードから自動生成  
// - Prisma: データベーススキーマから自動生成
// - Mermaid: コード内コメントから自動生成
// - Jest/Vitest: テスト実行結果から自動生成
```

#### 継続的ドキュメント維持

```typescript
// ✅ 良い例: ドキュメント鮮度チェック自動化
// scripts/verify-docs-freshness.js
export const verifyDocsFreshness = async () => {
  const codeLastModified = await getLastModifiedTime('src/**/*.ts')
  const docsLastGenerated = await getLastModifiedTime('docs/generated/**/*')
  
  if (codeLastModified > docsLastGenerated) {
    throw new Error(
      'Documentation is outdated. Run `pnpm docs:generate-all` to update.'
    )
  }
  
  console.log('✅ Documentation is up to date')
}

// lefthook.yml - コミット時ドキュメント鮮度チェック
pre-commit:
  commands:
    docs-freshness:
      run: pnpm docs:verify
      
pre-push:
  commands:
    regenerate-docs:
      run: pnpm docs:generate-all
```

## TypeScript コード規約

### ファイル・ディレクトリ命名規則

```typescript
// ✅ 良い例: ケバブケース必須
// ディレクトリでレイヤーが表現されている場合、ファイル名にレイヤー接尾辞は不要
src/
├── domain/
│   ├── inventory-items/
│   │   ├── inventory-item.ts          // ✅ エンティティ
│   │   ├── inventory-item-factory.ts  // ✅ ファクトリー
│   │   └── consumption-record.ts      // ✅ 値オブジェクト
│   ├── users/
│   │   ├── user.ts                    // ✅ ユーザーエンティティ
│   │   └── user-authentication.ts     // ✅ ユーザー認証ドメインサービス
│   └── organizations/
│       ├── organization.ts            // ✅ 組織エンティティ
│       └── organization-member.ts     // ✅ 組織メンバー値オブジェクト
├── application/
│   ├── use-cases/
│   │   ├── create-inventory-item.ts   // ✅ UseCase
│   │   ├── update-user-profile.ts     // ✅ UseCase
│   │   └── invite-organization-member.ts // ✅ UseCase
│   └── services/
│       ├── notification-service.ts    // ✅ アプリケーションサービス（例外的に.service.ts）
│       └── email-service.ts           // ✅ アプリケーションサービス（例外的に.service.ts）
├── infrastructure/
│   ├── database/
│   │   ├── inventory-repository.ts    // ✅ リポジトリ実装
│   │   ├── user-repository.ts         // ✅ リポジトリ実装
│   │   └── organization-repository.ts // ✅ リポジトリ実装
│   └── external-apis/
│       ├── barcode-api-client.ts      // ✅ 外部API クライアント
│       └── amazon-product-api.ts      // ✅ 外部API クライアント
└── presentation/
    ├── grpc/
    │   ├── inventory-grpc-service.ts   // ✅ gRPCサービス（例外的に.service.ts）
    │   └── user-grpc-service.ts        // ✅ gRPCサービス（例外的に.service.ts）
    └── controllers/
        ├── inventory-controller.ts     // ✅ コントローラー（例外的に.controller.ts）
        └── user-controller.ts          // ✅ コントローラー（例外的に.controller.ts）

// ❌ 悪い例: ディレクトリでレイヤーが分かるのに冗長な接尾辞
src/
├── domain/
│   ├── inventory-items/
│   │   ├── inventory-item.entity.ts    // ❌ .entity.ts は不要
│   │   └── inventory-service.domain.ts // ❌ .domain.ts は不要
│   └── users/
│       └── user.entity.ts              // ❌ .entity.ts は不要
├── application/
│   ├── use-cases/
│   │   └── create-item.usecase.ts      // ❌ .usecase.ts は不要
│   └── services/
│       └── notification.service.ts     // ❌ ここでは.tsのみでOK
└── infrastructure/
    └── database/
        └── inventory.repository.ts     // ❌ .repository.ts は不要

// ❌ 悪い例: camelCase や PascalCase
src/
├── inventoryItems/                     // ❌ camelCase は使わない
├── UserManagement/                     // ❌ PascalCase は使わない
└── organization_management/            // ❌ snake_case は使わない

// ✅ 例外: 技術的な区別が必要な場合のみ接尾辞を使用
src/
├── application/
│   └── services/
│       ├── email.service.ts            // ✅ サービス層では技術的区別として.service.ts可
│       └── sms.service.ts              // ✅ サービス層では技術的区別として.service.ts可
└── presentation/  
    ├── grpc/
    │   └── inventory.grpc.ts           // ✅ 通信プロトコル区別として.grpc.ts可
    └── rest/
        └── inventory.rest.ts           // ✅ 通信プロトコル区別として.rest.ts可
```

### 命名規約

```typescript
// ✅ 良い例: 命名規約
// 変数名: camelCase（名詞）
const inventoryItems = []
const currentUser = {}

// 関数名・メソッド名: camelCase + 動詞で始める
const calculateExpiryDate = () => {}      // ✅ calculate（動詞）
const getUserById = () => {}              // ✅ get（動詞）
const createInventoryItem = () => {}      // ✅ create（動詞）
const updateUserProfile = () => {}        // ✅ update（動詞）
const deleteOrganization = () => {}       // ✅ delete（動詞）
const validateInput = () => {}            // ✅ validate（動詞）
const processPayment = () => {}           // ✅ process（動詞）
const sendNotification = () => {}         // ✅ send（動詞）
const parseInventoryData = () => {}       // ✅ parse（動詞）
const formatDate = () => {}               // ✅ format（動詞）

// boolean変数: is, has, can, should, will などの接頭語を使用
const isAuthenticated = true
const hasPermission = false
const canEdit = true
const shouldRefresh = false
const willExpire = true
const isLoading = false
const hasExpired = true
const canDelete = false
const shouldNotify = true
const willUpdate = false

// クラス名: PascalCase
class InventoryItem {}
class UserAuthentication {}
class OrganizationMember {}

// Reactコンポーネント名: PascalCase + named export必須（default export禁止）
export const InventoryItemCard = () => {}     // ✅ PascalCase + named export
export const UserProfileForm = () => {}       // ✅ PascalCase + named export
export const OrganizationMemberList = () => {} // ✅ PascalCase + named export
export const ExpiryStatusBadge = () => {}     // ✅ PascalCase + named export
export const LoadingSpinner = () => {}        // ✅ PascalCase + named export

// 型名: PascalCase
type UserId = Opaque<string, 'UserId'>
type CreateInventoryItemRequest = {}
type ExpiryStatus = 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'CAUTION' | 'SAFE'

// インターフェース: 具体的な名前、Iプレフィックス・***Interface接尾辞は禁止
type InventoryRepository = {  // ✅ 具体的な名前
  findById: (id: string) => Promise<InventoryItem | null>
  save: (item: InventoryItem) => Promise<void>
}

type UserNotificationService = {  // ✅ 具体的な名前
  sendEmail: (userId: string, message: string) => Promise<void>
  sendPush: (userId: string, notification: PushNotification) => Promise<void>
}

// ❌ 悪い例: Reactコンポーネントのdefault export使用
const inventoryItemCard = () => {} // ❌ camelCase（PascalCaseにすべき）
export default inventoryItemCard   // ❌ default export禁止

export default () => {}            // ❌ 匿名default export禁止

const InventoryItem = () => {}     // ❌ コンポーネント名が曖昧
export default InventoryItem       // ❌ default export禁止

// import時に異なる名前を使える（一貫性が保てない）
// import MyInventoryCard from './inventory-item-card'  // ❌ 異なる名前でimport可能

// ❌ 悪い例: 関数名が動詞で始まらない（名詞的な命名）
const expiryDate = () => {}        // ❌ calculateExpiryDateにすべき
const userById = () => {}          // ❌ getUserByIdにすべき
const inventoryItem = () => {}     // ❌ createInventoryItemにすべき
const userProfile = () => {}       // ❌ updateUserProfileにすべき
const organization = () => {}      // ❌ deleteOrganizationにすべき
const input = () => {}             // ❌ validateInputにすべき
const payment = () => {}           // ❌ processPaymentにすべき
const notification = () => {}      // ❌ sendNotificationにすべき
const inventoryData = () => {}     // ❌ parseInventoryDataにすべき
const date = () => {}              // ❌ formatDateにすべき

// ❌ 悪い例: boolean変数の曖昧な命名
const authenticated = true         // ❌ isAuthenticatedにすべき
const permission = false           // ❌ hasPermissionにすべき
const edit = true                  // ❌ canEditにすべき
const refresh = false              // ❌ shouldRefreshにすべき
const expire = true                // ❌ willExpireにすべき
const loading = false              // ❌ isLoadingにすべき
const expired = true               // ❌ hasExpiredにすべき
const visible = false              // ❌ isVisibleにすべき
const enabled = true               // ❌ isEnabledにすべき

// ❌ 悪い例: インターフェースの曖昧な命名
interface IRepository {}           // ❌ Iプレフィックス禁止
interface RepositoryInterface {}   // ❌ ***Interface接尾辞禁止
interface Repository {}            // ❌ 抽象的すぎる
```

### 型定義規約

```typescript
// ✅ 良い例: Union型でEnum代替（推奨）
export type ExpiryStatus = 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'CAUTION' | 'SAFE' | 'NO_EXPIRY'
export type InventoryCategory = 'FOOD' | 'MEDICINE' | 'DAILY_NECESSITIES' | 'EMERGENCY_SUPPLIES' | 'OTHER'
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'
export type ExpiryType = 'EXPIRY_DATE' | 'BEST_BEFORE_DATE' | 'NO_EXPIRY'

// ReadonlyArray for immutable arrays
export type CreateInventoryItemRequest = {
  readonly name: string
  readonly brand?: string
  readonly category: InventoryCategory
  readonly quantity: number
  readonly unit: string
  readonly minQuantity?: number
  readonly expiryDate?: Date
  readonly bestBeforeDate?: Date
  readonly expiryType: ExpiryType
  readonly storageLocation?: string
  readonly price?: Money
  readonly barcode?: string
  readonly asin?: string
  readonly tags: ReadonlyArray<string>        // ✅ ReadonlyArray for immutable data
  readonly images: ReadonlyArray<string>      // ✅ ReadonlyArray for immutable data
  readonly notes?: string
}

// type-fest活用で複雑な型定義を簡潔に
import type { Opaque, RequireAtLeastOne, PartialDeep, SetOptional } from 'type-fest'

export type UserId = Opaque<string, 'UserId'>
export type OrganizationId = Opaque<string, 'OrganizationId'>
export type InventoryItemId = Opaque<string, 'InventoryItemId'>

// 関数引数の型は必ず抽出して定義
export type CalculateExpiryStatusParams = {
  readonly expiryDate: Date
  readonly currentDate?: Date
}

export type CreateInventoryItemParams = {
  readonly organizationId: OrganizationId
  readonly userId: UserId
  readonly name: string
  readonly category: InventoryCategory
  readonly quantity: number
  readonly unit: string
  readonly expiryType: ExpiryType
  readonly tags?: ReadonlyArray<string>
}

export type UpdateInventoryItemParams = SetOptional<
  CreateInventoryItemParams,
  'organizationId' | 'userId'
> & {
  readonly id: InventoryItemId
}

// ✅ 良い例: typeを優先（interfaceより）
export type InventoryRepository = {
  findById: (id: InventoryItemId) => Promise<InventoryItem | null>
  findByOrganization: (orgId: OrganizationId) => Promise<ReadonlyArray<InventoryItem>>
  save: (item: InventoryItem) => Promise<void>
  delete: (id: InventoryItemId) => Promise<void>
}

export type UserAuthenticationService = {
  authenticate: (params: AuthenticateUserParams) => Promise<AuthenticationResult>
  refreshToken: (params: RefreshTokenParams) => Promise<TokenPair>
  revokeToken: (params: RevokeTokenParams) => Promise<void>
}

// RequireAtLeastOne for flexible parameters
export type SearchInventoryItemsParams = RequireAtLeastOne<{
  readonly name?: string
  readonly category?: InventoryCategory
  readonly barcode?: string
  readonly tags?: ReadonlyArray<string>
}, 'name' | 'category' | 'barcode' | 'tags'>

// ❌ 悪い例: Enum使用（Union型を推奨）
export enum BadExpiryStatus {  // ❌ Enumは避ける
  EXPIRED = 'EXPIRED',
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING'
}

// ❌ 悪い例: 可変配列（ReadonlyArrayを使うべき）
export type BadCreateRequest = {
  tags: string[]              // ❌ 変更予期されない配列はReadonlyArrayで
  images: Array<string>       // ❌ 変更予期されない配列はReadonlyArrayで
}

// ❌ 悪い例: interfaceの使用（typeを優先）
export interface BadRepository {  // ❌ typeを優先
  findById: (id: string) => Promise<any>
}

// ❌ 悪い例: 複雑な型定義（type-festを使うべき）
export type BadComplexType = {
  [K in keyof SomeType]: SomeType[K] extends string 
    ? SomeType[K] | null 
    : SomeType[K] extends number 
    ? SomeType[K] | undefined 
    : SomeType[K]
}  // ✅ type-festのPartialDeepやSetOptionalを使うべき

// ❌ 悪い例: 引数の型をインラインで定義
export const badFunction = (
  params: {  // ❌ 引数の型はextractして定義すべき
    name: string
    age: number
    email?: string
  }
) => {}

// ✅ 良い例: 型の組み合わせ（type-fest活用）
export type BaseInventoryItem = {
  readonly id: InventoryItemId
  readonly organizationId: OrganizationId
  readonly name: string
  readonly category: InventoryCategory
  readonly quantity: number
  readonly unit: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type InventoryItemWithExpiry = BaseInventoryItem & {
  readonly expiryDate?: Date
  readonly bestBeforeDate?: Date
  readonly expiryType: ExpiryType
}

export type InventoryItemSummary = Pick<InventoryItemWithExpiry, 'id' | 'name' | 'quantity' | 'expiryDate'>
export type CreateInventoryItemData = Omit<BaseInventoryItem, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateInventoryItemData = PartialDeep<CreateInventoryItemData> & {
  readonly id: InventoryItemId
}
```

### 環境変数規約（Zod型安全性）

```typescript
// ✅ 良い例: Zodによる環境変数の型安全な取得
import { z } from 'zod'

// 環境変数スキーマ定義
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().min(1).max(65535),
  SMTP_USER: z.string().email(),
  SMTP_PASSWORD: z.string(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().or(z.array(z.string())).default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15分
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
})

// 型推論でEnvironmentConfig型を自動生成
export type EnvironmentConfig = z.infer<typeof envSchema>

// 環境変数パース関数
export const parseEnvironmentVariables = (): EnvironmentConfig => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      
      throw new Error(`Invalid environment configuration:\n${missingVars}`)
    }
    throw error
  }
}

// 設定オブジェクト（シングルトン）
export const config = parseEnvironmentVariables()

// 使用例
export const createDatabaseConnection = () => {
  return createConnection({
    url: config.DATABASE_URL,  // ✅ 型安全でバリデーション済み
    ssl: config.NODE_ENV === 'production'
  })
}

export const createJwtService = () => {
  return new JwtService({
    secret: config.JWT_SECRET,           // ✅ 型安全、最小長チェック済み
    expiresIn: config.JWT_EXPIRES_IN,    // ✅ 型安全
  })
}

// アプリケーション層での使用例
export const createEmailService = (): EmailService => {
  return new SmtpEmailService({
    host: config.SMTP_HOST,              // ✅ 型安全
    port: config.SMTP_PORT,              // ✅ 型安全、数値型保証
    user: config.SMTP_USER,              // ✅ 型安全、email形式検証済み
    password: config.SMTP_PASSWORD,      // ✅ 型安全
  })
}

// 開発環境固有の設定
export const isDevelopment = config.NODE_ENV === 'development'
export const isProduction = config.NODE_ENV === 'production'
export const isTest = config.NODE_ENV === 'test'

// ❌ 悪い例: 生の環境変数アクセス（型安全性なし）
const badDatabaseUrl = process.env.DATABASE_URL  // ❌ string | undefined、バリデーションなし
const badPort = process.env.PORT                 // ❌ string | undefined、数値変換なし
const badJwtSecret = process.env.JWT_SECRET      // ❌ undefined可能性、長さチェックなし

// ❌ 悪い例: 実行時の型変換エラーリスク
const veryBadPort = parseInt(process.env.PORT!)  // ❌ NaN可能性、型安全性なし
const veryBadCorsOrigin = JSON.parse(process.env.CORS_ORIGIN || '[]')  // ❌ 解析エラーリスク

// ✅ 良い例: 環境別設定ファイル分割
// config/development.ts
export const developmentEnvSchema = envSchema.extend({
  DEBUG_SQL: z.coerce.boolean().default(true),
  HOT_RELOAD: z.coerce.boolean().default(true),
  API_DOCS_ENABLED: z.coerce.boolean().default(true),
})

// config/production.ts  
export const productionEnvSchema = envSchema.extend({
  HTTPS_ONLY: z.coerce.boolean().default(true),
  TRUST_PROXY: z.coerce.boolean().default(true),
  COMPRESSION_ENABLED: z.coerce.boolean().default(true),
  CLUSTER_WORKERS: z.coerce.number().min(1).default(4),
})

// config/test.ts
export const testEnvSchema = envSchema.extend({
  TEST_DATABASE_URL: z.string().url(),
  PARALLEL_TESTS: z.coerce.boolean().default(true),
  TEST_TIMEOUT: z.coerce.number().default(30000),
})

// 環境に応じたスキーマ選択
const getEnvSchema = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return developmentEnvSchema
    case 'production':
      return productionEnvSchema
    case 'test':
      return testEnvSchema
    default:
      return envSchema
  }
}

export const environmentConfig = getEnvSchema().parse(process.env)
```

### エラーハンドリング規約

```typescript
// ✅ 良い例: neverthrow Result型での簡潔なエラーハンドリング
import { Result, ok, err } from 'neverthrow'

export type CreateInventoryItemError = 
  | 'VALIDATION_ERROR'
  | 'PERMISSION_DENIED'
  | 'ORGANIZATION_NOT_FOUND'
  | 'DUPLICATE_BARCODE'

export const createInventoryItem = async (
  request: CreateInventoryItemRequest
): Promise<Result<InventoryItem, CreateInventoryItemError>> => {
  const validationResult = validateCreateRequest(request)
  if (validationResult.isErr()) {
    return err('VALIDATION_ERROR')
  }

  try {
    const item = await inventoryRepository.create(request)
    return ok(item)
  } catch (error) {
    if (error instanceof PermissionError) {
      return err('PERMISSION_DENIED')
    }
    if (error instanceof DuplicateBarcodeError) {
      return err('DUPLICATE_BARCODE')
    }
    throw error
  }
}

// neverthrowの場合はチェーンも許可（関数型スタイル）
const validateAndCreate = (request: CreateInventoryItemRequest) =>
  validateCreateRequest(request)
    .andThen(() => inventoryRepository.create(request))
    .mapErr(mapToCreateItemError)

// ❌ 悪い例: 冗長なエラーハンドリング
export async function createItem(request: any): Promise<any> {
  try {
    // 何をしているかわからない
    return await repository.create(request);
  } catch (error) {
    // 意味のないエラーメッセージ
    throw new Error('Something went wrong');
  }
}
```

### 非同期処理規約（async/await優先）

```typescript
// ✅ 良い例: async/await で統一
export const fetchInventoryItems = async ({
  organizationId,
  filters = {},
  pagination = { page: 1, limit: 20 }
}: {
  organizationId: OrganizationId
  filters?: InventoryFilters
  pagination?: Pagination
}): Promise<Result<PaginatedItems<InventoryItem>, FetchError>> => {
  try {
    // 複数の非同期処理を順次実行
    const organization = await organizationRepository.findById(organizationId)
    if (!organization) {
      return err('ORGANIZATION_NOT_FOUND')
    }

    const items = await inventoryRepository.findByFilters({
      organizationId,
      filters,
      pagination
    })

    const total = await inventoryRepository.countByFilters({
      organizationId,
      filters
    })

    return ok({ items, total, pagination })
  } catch (error) {
    logger.error('Failed to fetch inventory items', { error, organizationId })
    return err('INTERNAL_ERROR')
  }
}

// 並列処理の場合はPromise.allと組み合わせ
export const fetchInventoryWithStats = async (organizationId: OrganizationId) => {
  try {
    const [items, stats, alerts] = await Promise.all([
      inventoryRepository.findAll(organizationId),
      inventoryRepository.getStats(organizationId),
      inventoryRepository.getExpiryAlerts(organizationId)
    ])

    return ok({ items, stats, alerts })
  } catch (error) {
    return err('FETCH_FAILED')
  }
}

// ❌ 悪い例: thenチェーンの使用
export const badFetchInventoryItems = (organizationId: string) => {
  return organizationRepository.findById(organizationId)
    .then(organization => {
      if (!organization) {
        throw new Error('Organization not found')
      }
      return inventoryRepository.findByOrganization(organizationId)
    })
    .then(items => {
      return inventoryRepository.countByOrganization(organizationId)
        .then(total => ({ items, total }))
    })
    .catch(error => {
      // エラーハンドリングが複雑になる
      console.error(error)
      throw error
    })
}

// ❌ 悪い例: ネストした複雑なthenチェーン
export const veryBadExample = () => {
  return fetchUser()
    .then(user => {
      return fetchOrganization(user.organizationId)
        .then(org => {
          return fetchInventory(org.id)
            .then(items => {
              return processItems(items)
                .then(processed => {
                  // 深いネストで可読性が悪い
                  return { user, org, items: processed }
                })
            })
        })
    })
    .catch(error => {
      // どこでエラーが発生したか分からない
      throw error
    })
}
```

### 関数定義規約（25行制限 + 分割代入活用 + let最小化）

```typescript
// ✅ 良い例: 25行以内 + 分割代入 + const のみ使用
export const calculateExpiryStatus = ({
  expiryDate,
  currentDate = new Date()
}: CalculateExpiryStatusParams): ExpiryStatus => {
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilExpiry < 0) {
    return 'EXPIRED'
  }
  if (daysUntilExpiry <= 3) {
    return 'CRITICAL'
  }
  if (daysUntilExpiry <= 7) {
    return 'WARNING'
  }
  if (daysUntilExpiry <= 30) {
    return 'CAUTION'
  }
  return 'SAFE'
} // ✅ 20行 - 25行以内でOK

// 分割代入で複数の値を返す
export const parseInventoryItem = (data: unknown) => {
  const { id, name, quantity, expiryDate } = data as RawInventoryData
  const isValid = id && name && quantity >= 0
  
  return { 
    item: isValid ? { id, name, quantity, expiryDate } : null,
    isValid 
  }
}

// 引数の分割代入でコードを簡潔に + boolean変数の適切な命名
export const createInventoryItem = async ({
  name,
  quantity,
  unit,
  organizationId,
  expiryDate,
  ...optionalFields
}: CreateInventoryItemRequest): Promise<Result<InventoryItem, CreateError>> => {
  // letを使わず、constで値を作成 + boolean変数には適切な接頭語
  const validatedName = name.trim()
  const normalizedQuantity = Math.max(0, quantity)
  const hasExpiryDate = Boolean(expiryDate)           // ✅ has接頭語
  const isValidQuantity = normalizedQuantity > 0      // ✅ is接頭語
  const canCreateItem = validatedName && isValidQuantity  // ✅ can接頭語
  
  if (!canCreateItem) {
    return err('VALIDATION_ERROR')
  }
  
  const item = {
    name: validatedName,
    quantity: normalizedQuantity,
    unit,
    organizationId,
    expiryDate: hasExpiryDate ? expiryDate : undefined,
    ...optionalFields
  }
  
  return await inventoryRepository.create(item)
}

// 配列・オブジェクトの分割代入
export const processInventoryItems = (items: InventoryItem[]) => {
  const [first, second, ...rest] = items
  const { length } = items
  
  // map内でも分割代入
  const processed = items.map(({ id, name, quantity }) => ({
    id,
    displayName: name.toUpperCase(),
    inStock: quantity > 0
  }))
  
  return { first, second, rest, total: length, processed }
}

// ❌ 悪い例: letの多用、分割代入を使わない
export const badExample = (request: CreateRequest) => {
  let name = request.name  // letを使用
  let quantity = request.quantity
  let unit = request.unit
  
  if (name) {
    name = name.trim()  // 再代入
  }
  
  let result = null  // letを使用
  if (quantity > 0) {
    result = { name: name, quantity: quantity }  // 冗長
  }
  
  return result
}

// ❌ 悪い例: 25行を超える長大な関数
export const badCreateInventoryItem = async (request: CreateRequest) => {
  // 40行超えの長大な関数（悪い例）
  let validationErrors = []
  
  // バリデーション処理（10行）
  if (!request.name || request.name.trim().length === 0) {
    validationErrors.push('Name is required')
  }
  if (request.quantity < 0) {
    validationErrors.push('Quantity must be positive')
  }
  if (request.expiryType === 'EXPIRY' && !request.expiryDate) {
    validationErrors.push('Expiry date required for expiry type')
  }
  
  // 権限チェック処理（8行）
  const user = await getUserById(request.userId)
  if (!user) {
    throw new Error('User not found')
  }
  const organization = await getOrganizationById(request.organizationId)
  if (!organization.hasWritePermission(user.id)) {
    throw new Error('Permission denied')
  }
  
  // データベース保存処理（10行）
  const item = new InventoryItem({
    id: generateId(),
    name: request.name.trim(),
    quantity: request.quantity,
    organizationId: request.organizationId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  await database.save(item)
  
  // 通知処理（8行）
  const members = await getOrganizationMembers(request.organizationId)
  for (const member of members) {
    await sendNotification(member.id, {
      type: 'ITEM_CREATED',
      itemId: item.id,
      itemName: item.name
    })
  }
  
  return item
} // ❌ 45行超え - 25行制限違反

// ✅ 良い例: 25行制限を守るために関数分割
export const createInventoryItem = async ({
  organizationId,
  userId,
  ...itemData
}: CreateInventoryItemParams): Promise<Result<InventoryItem, CreateError>> => {
  const validationResult = validateItemData(itemData)
  if (validationResult.isErr()) {
    return err('VALIDATION_ERROR')
  }

  const permissionResult = await checkCreatePermission({ organizationId, userId })
  if (permissionResult.isErr()) {
    return err('PERMISSION_DENIED')
  }

  const item = createItemEntity({ organizationId, ...itemData })
  const saveResult = await saveInventoryItem(item)
  if (saveResult.isErr()) {
    return err('SAVE_FAILED')
  }

  await notifyOrganizationMembers({ organizationId, item })
  return ok(item)
} // ✅ 18行 - 25行以内でOK

// 分割された小さな関数群（それぞれ25行以内）
const validateItemData = (data: CreateItemData): Result<void, ValidationError> => {
  if (!data.name?.trim()) {
    return err(new ValidationError('Name is required'))
  }
  if (data.quantity < 0) {
    return err(new ValidationError('Quantity must be positive'))
  }
  if (data.expiryType === 'EXPIRY' && !data.expiryDate) {
    return err(new ValidationError('Expiry date required'))
  }
  return ok(undefined)
} // ✅ 11行

const checkCreatePermission = async ({
  organizationId,
  userId
}: CheckPermissionParams): Promise<Result<void, PermissionError>> => {
  const user = await userRepository.findById(userId)
  if (!user) {
    return err(new PermissionError('User not found'))
  }
  
  const organization = await organizationRepository.findById(organizationId)
  if (!organization?.hasWritePermission(userId)) {
    return err(new PermissionError('Permission denied'))
  }
  
  return ok(undefined)
} // ✅ 13行

const createItemEntity = (data: CreateItemEntityData): InventoryItem => {
  return new InventoryItem({
    id: InventoryItemId.generate(),
    organizationId: data.organizationId,
    name: data.name.trim(),
    quantity: data.quantity,
    unit: data.unit,
    expiryType: data.expiryType,
    expiryDate: data.expiryDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
} // ✅ 12行

const saveInventoryItem = async (
  item: InventoryItem
): Promise<Result<void, SaveError>> => {
  try {
    await inventoryRepository.save(item)
    return ok(undefined)
  } catch (error) {
    logger.error('Failed to save inventory item', { error, itemId: item.id })
    return err(new SaveError('Database save failed'))
  }
} // ✅ 8行

const notifyOrganizationMembers = async ({
  organizationId,
  item
}: NotifyMembersParams): Promise<void> => {
  const members = await organizationRepository.getMembers(organizationId)
  const notifications = members.map(member => ({
    userId: member.id,
    type: 'ITEM_CREATED' as const,
    data: { itemId: item.id, itemName: item.name }
  }))
  
  await notificationService.sendBatch(notifications)
} // ✅ 9行

// ✅ 良い例: DDD エンティティ
export class InventoryItem {
  private constructor(
    private readonly _id: InventoryItemId,
    private readonly _organizationId: OrganizationId,
    private _name: string,
    private _quantity: number,
    private readonly _unit: string,
    private _expiryDate?: Date,
    private _bestBeforeDate?: Date,
    private readonly _expiryType: ExpiryType,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  public static create(props: CreateInventoryItemProps): Result<InventoryItem, ValidationError> {
    // バリデーション
    if (props.name.trim().length === 0) {
      return err(new ValidationError('Name cannot be empty'));
    }
    if (props.quantity < 0) {
      return err(new ValidationError('Quantity cannot be negative'));
    }

    return ok(new InventoryItem(
      props.id,
      props.organizationId,
      props.name.trim(),
      props.quantity,
      props.unit,
      props.expiryDate,
      props.bestBeforeDate,
      props.expiryType,
      new Date(),
      new Date()
    ));
  }

  // ゲッター（読み取り専用）
  public get id(): InventoryItemId { return this._id; }
  public get name(): string { return this._name; }
  public get quantity(): number { return this._quantity; }

  // ビジネスロジック
  public consume(amount: number): Result<void, ConsumeError> {
    if (amount <= 0) {
      return err(new ConsumeError('Amount must be positive'));
    }
    if (amount > this._quantity) {
      return err(new ConsumeError('Insufficient quantity'));
    }

    this._quantity -= amount;
    this._updatedAt = new Date();
    return ok(undefined);
  }

  public getExpiryStatus(currentDate: Date = new Date()): ExpiryStatus {
    return calculateExpiryStatus(this._expiryDate || this._bestBeforeDate!, currentDate);
  }
}
```

### インポート規約

```typescript
// ✅ 良い例: インポート順序
// 1. Node.js標準ライブラリ
import { readFile } from 'fs/promises';
import { join } from 'path';

// 2. 外部ライブラリ
import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';
import { Injectable } from '@nestjs/common';

// 3. 内部パッケージ（@repo/）
import { InventoryItem } from '@repo/shared-types';
import { ValidationError } from '@repo/error-handling';

// 4. 相対インポート（近い順）
import { InventoryRepository } from '../repositories/inventory.repository';
import { OrganizationService } from '../services/organization.service';
import './inventory-item.entity';

// ❌ 悪い例: 順序がバラバラ
import { InventoryRepository } from '../repositories/inventory.repository';
import { z } from 'zod';
import { readFile } from 'fs/promises';
import { InventoryItem } from '@repo/shared-types';
```

## React コンポーネント規約

### Reactコンポーネント命名・エクスポート規約

```typescript
// ✅ 良い例: PascalCase + named export
export const InventoryItemCard = ({ item }: InventoryItemCardProps) => {
  return (
    <div className="inventory-item-card">
      <h3>{item.name}</h3>
      <p>数量: {item.quantity} {item.unit}</p>
    </div>
  )
}

export const UserProfileForm = ({ user, onSubmit }: UserProfileFormProps) => {
  const handleSubmit = (data: UserProfileData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* フォーム要素 */}
    </form>
  )
}

export const ExpiryStatusBadge = ({ status }: ExpiryStatusBadgeProps) => {
  const getBadgeColor = (status: ExpiryStatus) => {
    switch (status) {
      case 'EXPIRED': return 'bg-red-500'
      case 'CRITICAL': return 'bg-orange-500'
      case 'WARNING': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <span className={`badge ${getBadgeColor(status)}`}>
      {status}
    </span>
  )
}

// ✅ 良い例: import時も同じ名前を強制
import { InventoryItemCard, UserProfileForm, ExpiryStatusBadge } from './components'

// ❌ 悪い例: default export使用
const inventoryItemCard = ({ item }) => {  // ❌ camelCase
  return <div>{item.name}</div>
}
export default inventoryItemCard          // ❌ default export

export default ({ item }) => {            // ❌ 匿名default export
  return <div>{item.name}</div>
}

const InventoryCard = ({ item }) => {     // ❌ 名前が曖昧
  return <div>{item.name}</div>
}
export default InventoryCard              // ❌ default export

// ❌ 悪い例: import時に異なる名前が使える（一貫性がない）
import MyCard from './inventory-item-card'      // ❌ 異なる名前でimport可能
import ItemCard from './inventory-item-card'    // ❌ 異なる名前でimport可能
import Whatever from './inventory-item-card'    // ❌ 全く違う名前も可能
```

### Reactコンポーネント型定義規約

```typescript
// ✅ 良い例: コンポーネントpropsの型定義
export type InventoryItemCardProps = {
  readonly item: InventoryItem
  readonly onEdit?: (item: InventoryItem) => void
  readonly onDelete?: (id: InventoryItemId) => void
  readonly className?: string
  readonly isSelected?: boolean
}

export type UserProfileFormProps = {
  readonly user: User
  readonly onSubmit: (data: UserProfileData) => Promise<void>
  readonly isLoading?: boolean
  readonly validationErrors?: ReadonlyArray<ValidationError>
}

export type ExpiryStatusBadgeProps = {
  readonly status: ExpiryStatus
  readonly size?: 'sm' | 'md' | 'lg'
  readonly variant?: 'solid' | 'outline'
}

// ✅ 良い例: コンポーネントで使用する内部型
type InventoryItemCardState = {
  readonly isExpanded: boolean
  readonly isHovered: boolean
}

type FormValidationState = {
  readonly isValid: boolean
  readonly errors: ReadonlyArray<string>
  readonly touchedFields: ReadonlySet<string>
}

// ❌ 悪い例: 型定義なし・any使用
export const BadComponent = ({ item, onEdit, onDelete }: any) => {  // ❌ any型
  return <div>{item.name}</div>
}

export const AnotherBadComponent = ({ item, onEdit, onDelete }) => {  // ❌ 型定義なし
  return <div>{item.name}</div>
}
```

### Reactコンポーネント実装規約

```typescript
// ✅ 良い例: 完全なReactコンポーネント実装
export const InventoryItemCard = ({
  item,
  onEdit,
  onDelete,
  className = '',
  isSelected = false
}: InventoryItemCardProps) => {
  // ✅ 状態管理（必要な場合）
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // ✅ イベントハンドラー（動詞で始める）
  const handleExpandToggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const handleEditClick = useCallback(() => {
    onEdit?.(item)
  }, [item, onEdit])

  const handleDeleteClick = useCallback(() => {
    onDelete?.(item.id)
  }, [item.id, onDelete])

  // ✅ 計算値（メモ化）
  const expiryStatus = useMemo(() => {
    return calculateExpiryStatus({
      expiryDate: item.expiryDate,
      currentDate: new Date()
    })
  }, [item.expiryDate])

  const cardClasses = useMemo(() => {
    return [
      'inventory-item-card',
      className,
      isSelected && 'selected',
      isHovered && 'hovered',
      expiryStatus === 'EXPIRED' && 'expired'
    ].filter(Boolean).join(' ')
  }, [className, isSelected, isHovered, expiryStatus])

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-header">
        <h3 className="item-name">{item.name}</h3>
        <ExpiryStatusBadge status={expiryStatus} />
      </div>
      
      <div className="card-body">
        <p className="quantity">
          数量: {item.quantity} {item.unit}
        </p>
        
        {isExpanded && (
          <div className="expanded-details">
            {item.brand && <p>ブランド: {item.brand}</p>}
            {item.storageLocation && <p>保管場所: {item.storageLocation}</p>}
            {item.notes && <p>メモ: {item.notes}</p>}
          </div>
        )}
      </div>
      
      <div className="card-actions">
        <button 
          type="button"
          onClick={handleExpandToggle}
          className="expand-button"
        >
          {isExpanded ? '折りたたむ' : '詳細を見る'}
        </button>
        
        {onEdit && (
          <button
            type="button"
            onClick={handleEditClick}
            className="edit-button"
          >
            編集
          </button>
        )}
        
        {onDelete && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="delete-button"
          >
            削除
          </button>
        )}
      </div>
    </div>
  )
}
```

### React Custom Hook規約

```typescript
// ✅ 良い例: useプレフィックス + camelCase
export const useInventoryItems = (organizationId: OrganizationId) => {
  const [items, setItems] = useState<ReadonlyArray<InventoryItem>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await inventoryApi.getItems({ organizationId })
      if (response.isOk()) {
        setItems(response.value)
      } else {
        setError(new Error(response.error))
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return { items, isLoading, error, refetch: fetchItems }
}

export const useExpiryStatus = (item: InventoryItem) => {
  return useMemo(() => {
    return calculateExpiryStatus({
      expiryDate: item.expiryDate,
      currentDate: new Date()
    })
  }, [item.expiryDate])
}

export const useFormValidation = <T>(
  initialValues: T,
  validationSchema: z.ZodSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const validateField = useCallback((fieldName: string, value: unknown) => {
    try {
      validationSchema.pick({ [fieldName]: true }).parse({ [fieldName]: value })
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error.errors[0]?.message || 'Invalid value'
        }))
      }
    }
  }, [validationSchema])

  const updateField = useCallback((fieldName: string, value: unknown) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    setTouchedFields(prev => new Set(prev).add(fieldName))
    validateField(fieldName, value)
  }, [validateField])

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0
  }, [errors])

  return {
    values,
    errors,
    touchedFields,
    isValid,
    updateField,
    setValues,
    reset: () => {
      setValues(initialValues)
      setErrors({})
      setTouchedFields(new Set())
    }
  }
}

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
    setValue(prev => {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prevValue: T) => T)(prev)
        : newValue

      try {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error storing value in localStorage:`, error)
      }

      return valueToStore
    })
  }, [key])

  return [value, setStoredValue] as const
}

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ❌ 悪い例: useプレフィックスなし・PascalCase使用
export const InventoryItems = (organizationId: string) => {  // ❌ useプレフィックスなし・PascalCase
  // フック実装
}

export const getExpiryStatus = (item: InventoryItem) => {     // ❌ useプレフィックスなし
  // フック実装
}

export const FormValidation = () => {                        // ❌ useプレフィックスなし・PascalCase
  // フック実装
}

export const localStorage_hook = () => {                     // ❌ snake_case
  // フック実装
}

export const UseDebounce = () => {                          // ❌ PascalCase
  // フック実装
}
```

## Flutter/Dart コード規約

### ファイル・ディレクトリ命名規則

```dart
// ✅ 良い例
// ファイル名: snake_case
inventory_item.dart
user_authentication_service.dart
organization_member_entity.dart

// ディレクトリ名: snake_case
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   └── network/
├── data/
│   ├── datasources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
└── presentation/
    ├── pages/
    ├── widgets/
    └── providers/
```

### クラス・関数定義規約

```dart
// ✅ 良い例: Clean Architecture エンティティ
class InventoryItem extends Equatable {
  const InventoryItem({
    required this.id,
    required this.organizationId,
    required this.name,
    required this.quantity,
    required this.unit,
    required this.expiryType,
    required this.createdAt,
    required this.updatedAt,
    this.brand,
    this.category = InventoryCategory.other,
    this.minQuantity,
    this.expiryDate,
    this.bestBeforeDate,
    this.storageLocation,
    this.price,
    this.barcode,
    this.asin,
    this.tags = const [],
    this.images = const [],
    this.notes,
  });

  final String id;
  final String organizationId;
  final String name;
  final String? brand;
  final InventoryCategory category;
  final double quantity;
  final String unit;
  final double? minQuantity;
  final DateTime? expiryDate;
  final DateTime? bestBeforeDate;
  final ExpiryType expiryType;
  final String? storageLocation;
  final Money? price;
  final String? barcode;
  final String? asin;
  final List<String> tags;
  final List<String> images;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  // ビジネスロジック
  ExpiryStatus getExpiryStatus([DateTime? currentDate]) {
    final now = currentDate ?? DateTime.now();
    final targetDate = expiryDate ?? bestBeforeDate;
    
    if (targetDate == null) return ExpiryStatus.noExpiry;
    
    final daysUntilExpiry = targetDate.difference(now).inDays;
    
    if (daysUntilExpiry < 0) return ExpiryStatus.expired;
    if (daysUntilExpiry <= 3) return ExpiryStatus.critical;
    if (daysUntilExpiry <= 7) return ExpiryStatus.warning;
    if (daysUntilExpiry <= 30) return ExpiryStatus.caution;
    return ExpiryStatus.safe;
  }

  bool get isLowStock => minQuantity != null && quantity <= minQuantity!;

  // Copyメソッド
  InventoryItem copyWith({
    String? id,
    String? organizationId,
    String? name,
    String? brand,
    InventoryCategory? category,
    double? quantity,
    String? unit,
    double? minQuantity,
    DateTime? expiryDate,
    DateTime? bestBeforeDate,
    ExpiryType? expiryType,
    String? storageLocation,
    Money? price,
    String? barcode,
    String? asin,
    List<String>? tags,
    List<String>? images,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return InventoryItem(
      id: id ?? this.id,
      organizationId: organizationId ?? this.organizationId,
      name: name ?? this.name,
      brand: brand ?? this.brand,
      category: category ?? this.category,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      minQuantity: minQuantity ?? this.minQuantity,
      expiryDate: expiryDate ?? this.expiryDate,
      bestBeforeDate: bestBeforeDate ?? this.bestBeforeDate,
      expiryType: expiryType ?? this.expiryType,
      storageLocation: storageLocation ?? this.storageLocation,
      price: price ?? this.price,
      barcode: barcode ?? this.barcode,
      asin: asin ?? this.asin,
      tags: tags ?? this.tags,
      images: images ?? this.images,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
## Hono RPC 規約

### Zodスキーマ定義規約

```typescript
// ✅ 良い例: 明確な命名とコメント
import { z } from 'zod';

// 備蓄品エンティティスキーマ
// 備蓄品の完全な情報を表現
export const InventoryItemSchema = z.object({
  id: z.string().describe('備蓄品ID'),
  organizationId: z.string().describe('組織ID'),
  name: z.string().min(1).max(100).describe('商品名'),
  brand: z.string().optional().describe('ブランド名（オプション）'),
  category: InventoryCategorySchema.describe('カテゴリ'),
  quantity: z.number().min(0).describe('数量'),
  unit: z.string().min(1).describe('単位'),
  minQuantity: z.number().min(0).optional().describe('最小在庫数（オプション）'),
  expiryDate: z.date().optional().describe('消費期限（オプション）'),
  bestBeforeDate: z.date().optional().describe('賞味期限（オプション）'),
  expiryType: ExpiryTypeSchema.describe('期限タイプ'),
  storageLocation: z.string().optional().describe('保管場所（オプション）'),
  price: MoneySchema.optional().describe('価格（オプション）'),
  barcode: z.string().optional().describe('バーコード（オプション）'),
  asin: z.string().optional().describe('ASIN（オプション）'),
  tags: z.array(z.string()).default([]).describe('タグ'),
  images: z.array(z.string()).default([]).describe('画像URL'),
  notes: z.string().optional().describe('メモ（オプション）'),
  createdBy: z.string().describe('作成者ID'),
  updatedBy: z.string().describe('更新者ID'),
  createdAt: z.date().describe('作成日時'),
  updatedAt: z.date().describe('更新日時'),
});

// 備蓄品作成リクエストスキーマ
export const CreateItemRequestSchema = z.object({
  organizationId: z.string().describe('組織ID（必須）'),
  name: z.string().min(1).max(100).describe('商品名（必須）'),
  brand: z.string().optional().describe('ブランド名'),
  category: InventoryCategorySchema.describe('カテゴリ（必須）'),
  quantity: z.number().min(0).describe('数量（必須）'),
  unit: z.string().min(1).describe('単位（必須）'),
  minQuantity: z.number().min(0).optional().describe('最小在庫数'),
  expiryDate: z.date().optional().describe('消費期限'),
  bestBeforeDate: z.date().optional().describe('賞味期限'),
  expiryType: ExpiryTypeSchema.describe('期限タイプ（必須）'),
  storageLocation: z.string().optional().describe('保管場所'),
  price: MoneySchema.optional().describe('価格'),
  barcode: z.string().optional().describe('バーコード'),
  asin: z.string().optional().describe('ASIN'),
  tags: z.array(z.string()).default([]).describe('タグ'),
  notes: z.string().optional().describe('メモ'),
});

// カスタムバリデーション例
export const CreateItemRequestWithValidationSchema = CreateItemRequestSchema
  .refine(
    (data) => {
      // 消費期限タイプの場合は消費期限が必須
      if (data.expiryType === 'EXPIRY' && !data.expiryDate) {
        return false;
      }
      // 賞味期限タイプの場合は賞味期限が必須
      if (data.expiryType === 'BEST_BEFORE' && !data.bestBeforeDate) {
        return false;
      }
      // 両方タイプの場合は両方必須
      if (data.expiryType === 'BOTH' && (!data.expiryDate || !data.bestBeforeDate)) {
        return false;
      }
      return true;
    },
    {
      message: 'Expiry date is required based on expiry type',
      path: ['expiryDate'],
    }
  );

// ❌ 悪い例: 曖昧な命名とバリデーション不足
const BadItemSchema = z.object({
  id: z.string(),
  data: z.any(),
  stuff: z.array(z.string()),
});
```

### ウィジェット規約

```dart
// ✅ 良い例: 単一責任のウィジェット
class InventoryItemCard extends ConsumerWidget {
  const InventoryItemCard({
    super.key,
    required this.item,
    this.onTap,
    this.onConsume,
    this.onEdit,
  });

  final InventoryItem item;
  final VoidCallback? onTap;
  final VoidCallback? onConsume;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final expiryStatus = item.getExpiryStatus();
    
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(theme),
              const SizedBox(height: 8),
              _buildDetails(theme),
              const SizedBox(height: 8),
              _buildActions(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Row(
      children: [
        Expanded(
          child: Text(
            item.name,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        ExpiryStatusBadge(status: item.getExpiryStatus()),
      ],
    );
  }

  Widget _buildDetails(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (item.brand != null)
          Text(
            item.brand!,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        Text(
          '${item.quantity} ${item.unit}',
          style: theme.textTheme.bodyLarge?.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
        if (item.storageLocation != null)
          Text(
            '保管場所: ${item.storageLocation}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
      ],
    );
  }

  Widget _buildActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        if (onConsume != null)
          TextButton.icon(
            onPressed: onConsume,
            icon: const Icon(Icons.remove_circle_outline),
            label: const Text('消費'),
          ),
        if (onEdit != null)
          TextButton.icon(
            onPressed: onEdit,
            icon: const Icon(Icons.edit_outlined),
            label: const Text('編集'),
          ),
      ],
    );
  }
}

// ❌ 悪い例: 責任が多すぎるウィジェット
class ComplexInventoryWidget extends StatefulWidget {
  // 複数の責任を持つウィジェット
  // - データ取得
  // - 状態管理
  // - UI表示
  // - ビジネスロジック
}
```

## gRPC・Protocol Buffers 規約

### .proto ファイル規約

```protobuf
// ✅ 良い例: 明確な命名とコメント
syntax = "proto3";

package inventory.inventory;

import "common.proto";
import "google/protobuf/timestamp.proto";

option dart_package = "inventory_grpc";

// 備蓄品管理サービス
// 備蓄品のCRUD操作、検索、消費記録を提供
service InventoryService {
  // 備蓄品一覧取得
  rpc ListItems(ListItemsRequest) returns (ListItemsResponse);
  
  // 備蓄品詳細取得
  rpc GetItem(GetItemRequest) returns (InventoryItem);
  
  // 備蓄品作成
  rpc CreateItem(CreateItemRequest) returns (InventoryItem);
  
  // 備蓄品更新
  rpc UpdateItem(UpdateItemRequest) returns (InventoryItem);
  
  // 備蓄品削除
  rpc DeleteItem(DeleteItemRequest) returns (common.Empty);
  
  // 備蓄品消費記録
  rpc ConsumeItem(ConsumeItemRequest) returns (ConsumeItemResponse);
  
  // 備蓄品検索
  rpc SearchItems(SearchItemsRequest) returns (SearchItemsResponse);
  
  // 期限切れ近商品取得
  rpc GetExpiringItems(GetExpiringItemsRequest) returns (GetExpiringItemsResponse);
}

// 備蓄品エンティティ
message InventoryItem {
  string id = 1;                                    // 備蓄品ID
  string organization_id = 2;                       // 組織ID
  string name = 3;                                  // 商品名
  string brand = 4;                                 // ブランド名（オプション）
  common.InventoryCategory category = 5;            // カテゴリ
  double quantity = 6;                              // 数量
  string unit = 7;                                  // 単位
  double min_quantity = 8;                          // 最小在庫数（オプション）
  google.protobuf.Timestamp expiry_date = 9;        // 消費期限（オプション）
  google.protobuf.Timestamp best_before_date = 10;  // 賞味期限（オプション）
  common.ExpiryType expiry_type = 11;               // 期限タイプ
  string storage_location = 12;                     // 保管場所（オプション）
  common.Money price = 13;                          // 価格（オプション）
  string barcode = 14;                              // バーコード（オプション）
  string asin = 15;                                 // ASIN（オプション）
  repeated string tags = 16;                        // タグ
  repeated string images = 17;                      // 画像URL
  string notes = 18;                                // メモ（オプション）
  string created_by = 19;                           // 作成者ID
  string updated_by = 20;                           // 更新者ID
  google.protobuf.Timestamp created_at = 21;        // 作成日時
  google.protobuf.Timestamp updated_at = 22;        // 更新日時
}

// 備蓄品作成リクエスト
message CreateItemRequest {
  string organization_id = 1;                       // 組織ID（必須）
  string name = 2;                                  // 商品名（必須）
  string brand = 3;                                 // ブランド名
  common.InventoryCategory category = 4;            // カテゴリ（必須）
  double quantity = 5;                              // 数量（必須）
  string unit = 6;                                  // 単位（必須）
  double min_quantity = 7;                          // 最小在庫数
  google.protobuf.Timestamp expiry_date = 8;        // 消費期限
  google.protobuf.Timestamp best_before_date = 9;   // 賞味期限
  common.ExpiryType expiry_type = 10;               // 期限タイプ（必須）
  string storage_location = 11;                     // 保管場所
  common.Money price = 12;                          // 価格
  string barcode = 13;                              // バーコード
  string asin = 14;                                 // ASIN
  repeated string tags = 15;                        // タグ
  string notes = 16;                                // メモ
}

// ❌ 悪い例: 曖昧な命名とコメント不足
message Item {
  string id = 1;
  string data = 2;
  repeated string stuff = 3;
}
```

### gRPC エラーハンドリング規約

```typescript
// ✅ 良い例: 簡潔なgRPCサーバー
import { status } from '@grpc/grpc-js'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class InventoryGrpcService {
  createItem = async (request: CreateItemRequest): Promise<InventoryItem> => {
    const validationResult = await this.validateCreateRequest(request)
    if (validationResult.isErr()) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Validation failed',
        details: validationResult.error,
      })
    }

    const hasPermission = await this.checkPermission(
      request.organizationId,
      context.userId,
      'write'
    )
    if (!hasPermission) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Insufficient permissions',
      })
    }

    const result = await this.inventoryService.createItem(request)
    return result.match(
      (item) => item,
      (error) => {
        throw new RpcException(this.mapErrorToRpcException(error))
      }
    )
  }

  private mapErrorToRpcException = (error: CreateInventoryItemError) => {
    const errorMap = {
      ORGANIZATION_NOT_FOUND: { code: status.NOT_FOUND, message: 'Organization not found' },
      DUPLICATE_BARCODE: { code: status.ALREADY_EXISTS, message: 'Barcode already exists' },
    }
    return errorMap[error] || { code: status.INTERNAL, message: 'Internal server error' }
  }
}
```

```dart
// ✅ 良い例: Flutter Hono RPCクライアント
class InventoryRepositoryImpl implements InventoryRepository {
  @override
  Future<Either<InventoryFailure, InventoryItem>> createItem(
    CreateInventoryItemRequest request,
  ) async {
    try {
      final response = await _honoRpcClient.post<Map<String, dynamic>>(
        '/items',
        body: {
          'organizationId': request.organizationId,
          'name': request.name,
          'category': request.category.name.toUpperCase(),
          'quantity': request.quantity,
          'unit': request.unit,
          'expiryType': request.expiryType.name.toUpperCase(),
          // その他のフィールド
        },
        fromJson: (json) => json,
      );
      
      final item = InventoryItemModel.fromJson(response).toEntity();
      return Right(item);
    } on HonoRpcException catch (e) {
      return Left(_mapHonoRpcErrorToFailure(e));
    } catch (e) {
      return Left(const InventoryFailure.unexpected());
    }
  }

  InventoryFailure _mapHonoRpcErrorToFailure(HonoRpcException error) {
    switch (error.statusCode) {
      case 401:
        return const InventoryFailure.unauthenticated();
      case 403:
        return const InventoryFailure.permissionDenied();
      case 404:
        return const InventoryFailure.organizationNotFound();
      case 400:
        return InventoryFailure.validationError(error.message);
      case 409:
        return const InventoryFailure.duplicateBarcode();
      default:
        return const InventoryFailure.serverError();
    }
  }
}
```

## DDD/Clean Architecture 規約

### ディレクトリ構造

```
src/
├── domain/                     # ドメイン層
│   ├── entities/              # エンティティ
│   ├── value-objects/         # 値オブジェクト
│   ├── aggregates/            # 集約
│   ├── repositories/          # リポジトリインターフェース
│   ├── services/              # ドメインサービス
│   └── events/                # ドメインイベント
├── application/               # アプリケーション層
│   ├── use-cases/             # ユースケース
│   ├── services/              # アプリケーションサービス
│   ├── ports/                 # ポート（インターフェース）
│   └── dto/                   # データ転送オブジェクト
├── infrastructure/            # インフラ層
│   ├── database/              # データベース実装
│   ├── external-apis/         # 外部API実装
│   ├── messaging/             # メッセージング実装
│   └── repositories/          # リポジトリ実装
└── presentation/              # プレゼンテーション層
    ├── controllers/           # コントローラー
    ├── grpc/                  # gRPCサービス
    └── dto/                   # プレゼンテーション用DTO
```

### エンティティ規約

```typescript
// ✅ 良い例: DDD エンティティ
export class InventoryItem {
  private constructor(
    private readonly _id: InventoryItemId,
    private readonly _organizationId: OrganizationId,
    private _props: InventoryItemProps,
    private _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // ファクトリーメソッド
  public static create(
    props: CreateInventoryItemProps,
    id?: InventoryItemId
  ): Result<InventoryItem, ValidationError[]> {
    const errors: ValidationError[] = [];

    // バリデーション
    if (props.name.trim().length === 0) {
      errors.push(new ValidationError('Name cannot be empty'));
    }
    if (props.quantity < 0) {
      errors.push(new ValidationError('Quantity cannot be negative'));
    }
    if (props.expiryType === ExpiryType.EXPIRY && !props.expiryDate) {
      errors.push(new ValidationError('Expiry date is required for expiry type'));
    }

    if (errors.length > 0) {
      return err(errors);
    }

    const itemId = id || InventoryItemId.generate();
    const now = new Date();

    return ok(new InventoryItem(
      itemId,
      props.organizationId,
      {
        name: props.name.trim(),
        brand: props.brand?.trim(),
        category: props.category,
        quantity: props.quantity,
        unit: props.unit,
        minQuantity: props.minQuantity,
        expiryDate: props.expiryDate,
        bestBeforeDate: props.bestBeforeDate,
        expiryType: props.expiryType,
        storageLocation: props.storageLocation?.trim(),
        price: props.price,
        barcode: props.barcode,
        asin: props.asin,
        tags: [...props.tags],
        images: [...props.images],
        notes: props.notes?.trim(),
      },
      now,
      now
    ));
  }

  // 再構築メソッド（永続化からの復元用）
  public static reconstitute(
    id: InventoryItemId,
    organizationId: OrganizationId,
    props: InventoryItemProps,
    createdAt: Date,
    updatedAt: Date
  ): InventoryItem {
    return new InventoryItem(id, organizationId, props, createdAt, updatedAt);
  }

  // ゲッター
  public get id(): InventoryItemId { return this._id; }
  public get organizationId(): OrganizationId { return this._organizationId; }
  public get name(): string { return this._props.name; }
  public get quantity(): number { return this._props.quantity; }

  // ✅ 良い例: メソッド名も動詞で始める
  public consume(amount: number, reason?: string): Result<ConsumptionRecord, ConsumeError> {
    if (amount <= 0) {
      return err(new ConsumeError('Amount must be positive'));
    }
    if (amount > this._props.quantity) {
      return err(new ConsumeError('Insufficient quantity'));
    }

    this._props.quantity -= amount;
    this._updatedAt = new Date();

    // ドメインイベント発行
    this.addDomainEvent(new InventoryItemConsumedEvent(
      this._id,
      this._organizationId,
      amount,
      reason,
      new Date()
    ));

    return ok(new ConsumptionRecord(
      ConsumptionRecordId.generate(),
      this._id,
      amount,
      reason,
      new Date()
    ));
  }

  public updateQuantity(newQuantity: number): Result<void, ValidationError> {  // ✅ update（動詞）
    if (newQuantity < 0) {
      return err(new ValidationError('Quantity cannot be negative'));
    }

    this._props.quantity = newQuantity;
    this._updatedAt = new Date();

    return ok(undefined);
  }

  public getExpiryStatus(currentDate: Date = new Date()): ExpiryStatus {      // ✅ get（動詞）
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    if (!targetDate) return ExpiryStatus.NO_EXPIRY;

    const daysUntilExpiry = Math.ceil(
      (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) return ExpiryStatus.EXPIRED;
    if (daysUntilExpiry <= 3) return ExpiryStatus.CRITICAL;
    if (daysUntilExpiry <= 7) return ExpiryStatus.WARNING;
    if (daysUntilExpiry <= 30) return ExpiryStatus.CAUTION;
    return ExpiryStatus.SAFE;
  }

  public calculateDaysUntilExpiry(currentDate: Date = new Date()): number {   // ✅ calculate（動詞）
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    if (!targetDate) return Infinity;
    
    return Math.ceil(
      (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  public markAsConsumed(amount: number, reason?: string): void {              // ✅ mark（動詞）
    this._props.quantity = Math.max(0, this._props.quantity - amount);
    this._updatedAt = new Date();
    // 消費記録をドメインイベントとして発行
    this.addDomainEvent(new ItemConsumedEvent(this.id, amount, reason));
  }

  public restockItem(amount: number): Result<void, ValidationError> {        // ✅ restock（動詞）
    if (amount <= 0) {
      return err(new ValidationError('Restock amount must be positive'));
    }

    this._props.quantity += amount;
    this._updatedAt = new Date();
    return ok(undefined);
  }

  // ✅ 良い例: boolean メソッド名も適切な接頭語
  public isLowStock(): boolean {
    return this._props.minQuantity !== undefined && 
           this._props.quantity <= this._props.minQuantity;
  }

  public hasExpired(currentDate: Date = new Date()): boolean {
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    return targetDate ? targetDate < currentDate : false;
  }

  public canBeConsumed(amount: number): boolean {
    return amount > 0 && amount <= this._props.quantity;
  }

  public shouldAlert(): boolean {
    const isExpiringSoon = this.getExpiryStatus() === ExpiryStatus.CRITICAL;
    const isLowOnStock = this.isLowStock();
    return isExpiringSoon || isLowOnStock;
  }

  public willExpireWithin(days: number): boolean {
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    if (!targetDate) return false;
    
    const daysUntilExpiry = Math.ceil(
      (targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= days && daysUntilExpiry >= 0;
  }
}
```

### ユースケース規約

```typescript
// ✅ 良い例: 分割代入を活用した簡潔なユースケース
@Injectable()
export class CreateInventoryItemUseCase {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {}

  execute = async ({
    organizationId,
    userId,
    barcode,
    ...itemData
  }: CreateInventoryItemCommand): Promise<Result<InventoryItemDto, CreateInventoryItemError>> => {
    // 組織と権限チェック
    const organization = await this.organizationRepository.findById(organizationId)
    if (!organization) {
      return err('ORGANIZATION_NOT_FOUND')
    }
    if (!organization.hasWritePermission(userId)) {
      return err('PERMISSION_DENIED')
    }

    // バーコード重複チェック
    if (barcode) {
      const existingItem = await this.inventoryRepository.findByBarcode(
        organizationId,
        barcode
      )
      if (existingItem) {
        return err('DUPLICATE_BARCODE')
      }
    }

    // アイテム作成
    const itemResult = InventoryItem.create({ 
      organizationId, 
      barcode, 
      ...itemData 
    })
    if (itemResult.isErr()) {
      return err('VALIDATION_ERROR')
    }

    // 永続化とイベント発行
    const { value: item } = itemResult
    const { id } = item
    
    await this.inventoryRepository.save(item)
    await this.eventBus.publishAll(item.getDomainEvents())

    this.logger.log(`Inventory item created: ${id}`, {
      itemId: id,
      organizationId,
      userId,
    })

    return ok(InventoryItemDto.fromEntity(item))
  }
}
```

## テスト規約

### テストファイル命名規則

```typescript
// ✅ 単体テスト: *.spec.ts
// - モックを積極的に使用
// - 単一クラス/関数の振る舞いをテスト
// - 外部依存を全てモック化
inventory-item.entity.spec.ts
create-inventory-item.usecase.spec.ts
inventory.repository.spec.ts

// ✅ 結合テスト: *.test.ts  
// - モックは最小限（外部API、データベースのみ）
// - 複数コンポーネントの連携をテスト
// - 実際の依存関係を使用
inventory-service.test.ts
inventory-grpc.test.ts
create-item-flow.test.ts
```

### 単体テスト規約（*.spec.ts - モック使用）

```typescript
// ✅ 良い例: inventory-item.entity.spec.ts - 単体テスト with モック
describe('InventoryItem', () => {
  describe('Given valid props', () => {
    const props: CreateInventoryItemProps = {
      organizationId: OrganizationId.generate(),
      name: 'Test Item',
      category: InventoryCategory.FOOD,
      quantity: 10,
      unit: '個',
      expiryType: ExpiryType.BEST_BEFORE,
      bestBeforeDate: new Date('2024-12-31'),
      tags: ['test', 'food'],
    }
    
    describe('When creating inventory item', () => {
      let result: Result<InventoryItem, ValidationError>
      
      beforeEach(() => {
        result = InventoryItem.create(props)
      })
      
      describe('Then should create item successfully', () => {
        it('returns ok result', () => {
          expect(result.isOk()).toBe(true)
        })
        
        it('has correct name', () => {
          expect(result.value.name).toBe('Test Item')
        })
        
        it('has correct quantity', () => {
          expect(result.value.quantity).toBe(10)
        })
        
        it('has correct tags', () => {
          expect(result.value.tags).toEqual(['test', 'food'])
        })
      })
    })
  })

  describe('Given empty name', () => {
    const props: CreateInventoryItemProps = {
      organizationId: OrganizationId.generate(),
      name: '',
      category: InventoryCategory.FOOD,
      quantity: 10,
      unit: '個',
      expiryType: ExpiryType.BEST_BEFORE,
      tags: [],
    }
    
    describe('When creating inventory item', () => {
      let result: Result<InventoryItem, ValidationError>
      
      beforeEach(() => {
        result = InventoryItem.create(props)
      })
      
      describe('Then should return validation error', () => {
        it('returns error result', () => {
          expect(result.isErr()).toBe(true)
        })
        
        it('contains name validation message', () => {
          expect(result.error).toContainEqual(
            expect.objectContaining({
              message: 'Name cannot be empty',
            })
          )
        })
      })
    })
  })

  describe('Given item with quantity 10', () => {
    let item: InventoryItem
    
    beforeEach(() => {
      item = createTestInventoryItem({ quantity: 10 })
    })
    
    describe('When consuming 3 items', () => {
      let result: Result<ConsumptionRecord, ConsumeError>
      
      beforeEach(() => {
        result = item.consume(3, 'Daily use')
      })
      
      describe('Then should consume successfully', () => {
        it('returns ok result', () => {
          expect(result.isOk()).toBe(true)
        })
        
        it('reduces quantity to 7', () => {
          expect(item.quantity).toBe(7)
        })
        
        it('records consumption amount', () => {
          expect(result.value.amount).toBe(3)
        })
        
        it('records consumption reason', () => {
          expect(result.value.reason).toBe('Daily use')
        })
      })
    })

    describe('When consuming more than available', () => {
      let result: Result<ConsumptionRecord, ConsumeError>
      
      beforeEach(() => {
        item = createTestInventoryItem({ quantity: 5 })
        result = item.consume(10)
      })
      
      describe('Then should return error', () => {
        it('returns error result', () => {
          expect(result.isErr()).toBe(true)
        })
        
        it('has insufficient quantity message', () => {
          expect(result.error.message).toBe('Insufficient quantity')
        })
        
        it('does not change quantity', () => {
          expect(item.quantity).toBe(5)
        })
      })
    })
  })
})

const createTestInventoryItem = (overrides: Partial<CreateInventoryItemProps> = {}): InventoryItem => {
  const defaultProps: CreateInventoryItemProps = {
    organizationId: OrganizationId.generate(),
    name: 'Test Item',
    category: InventoryCategory.FOOD,
    quantity: 10,
    unit: '個',
    expiryType: ExpiryType.BEST_BEFORE,
    tags: [],
  }

  const props = { ...defaultProps, ...overrides }
  const result = InventoryItem.create(props)
  
  if (result.isErr()) {
    throw new Error(`Failed to create test item: ${result.error}`)
  }
  
  return result.value
}
```

### 結合テスト規約（*.test.ts - モック最小限）

```typescript
// ✅ 良い例: create-inventory-item.test.ts - 結合テスト（実際の依存関係使用）
describe('CreateInventoryItem Integration', () => {
  let inventoryRepository: InventoryRepository
  let organizationRepository: OrganizationRepository
  let eventBus: EventBus
  let useCase: CreateInventoryItemUseCase
  
  beforeEach(() => {
    // 実際のリポジトリ実装を使用（インメモリDB）
    inventoryRepository = new InventoryRepositoryImpl(inMemoryDb)
    organizationRepository = new OrganizationRepositoryImpl(inMemoryDb)
    eventBus = new EventBusImpl()
    
    // UseCaseは実際の依存関係で初期化
    useCase = new CreateInventoryItemUseCase(
      inventoryRepository,
      organizationRepository,
      eventBus,
      logger
    )
  })
  
  describe('Given valid organization and user permissions', () => {
    let organization: Organization
    let command: CreateInventoryItemCommand
    
    beforeEach(async () => {
      // 実際にデータを作成
      organization = await organizationRepository.save(
        Organization.create({
          name: 'Test Org',
          ownerId: 'user-123'
        })
      )
      
      command = {
        organizationId: organization.id,
        userId: 'user-123',
        name: 'Test Item',
        category: InventoryCategory.FOOD,
        quantity: 10,
        unit: '個',
      }
    })
    
    describe('When creating inventory item', () => {
      let result: Result<InventoryItemDto, CreateInventoryItemError>
      
      beforeEach(async () => {
        result = await useCase.execute(command)
      })
      
      describe('Then should create item in repository', () => {
        it('returns ok result', () => {
          expect(result.isOk()).toBe(true)
        })
        
        it('persists item in repository', async () => {
          const savedItem = await inventoryRepository.findById(result.value.id)
          expect(savedItem).toBeDefined()
        })
        
        it('publishes domain event', () => {
          expect(eventBus.getPublishedEvents()).toHaveLength(1)
        })
        
        it('creates item with correct data', async () => {
          const savedItem = await inventoryRepository.findById(result.value.id)
          expect(savedItem.name).toBe('Test Item')
        })
      })
    })
  })
})

// ❌ 悪い例: *.test.ts なのに過度なモック使用
describe('Bad Integration Test', () => {
  let mockRepo: jest.Mock  // 結合テストでモックを使いすぎ
  let mockEventBus: jest.Mock
  
  beforeEach(() => {
    mockRepo = jest.fn()
    mockEventBus = jest.fn()
    // これは単体テスト（*.spec.ts）でやるべき
  })
})
```

### 単体テスト vs 結合テストの使い分け

```typescript
// inventory-item.entity.spec.ts - 単体テスト
describe('InventoryItem Entity Unit Test', () => {
  // エンティティのビジネスロジックのみテスト
  // 外部依存なし、モックなし
})

// inventory.repository.spec.ts - 単体テスト  
describe('InventoryRepository Unit Test', () => {
  let mockPrisma: DeepMockProxy<PrismaClient>
  
  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>()  // Prismaをモック
  })
  
  // リポジトリのロジックのみテスト
})

// create-inventory-usecase.spec.ts - 単体テスト
describe('CreateInventoryItemUseCase Unit Test', () => {
  let mockInventoryRepo: jest.Mocked<InventoryRepository>
  let mockOrgRepo: jest.Mocked<OrganizationRepository>
  
  beforeEach(() => {
    // 全ての依存をモック化
    mockInventoryRepo = createMock<InventoryRepository>()
    mockOrgRepo = createMock<OrganizationRepository>()
  })
  
  // UseCaseのオーケストレーションロジックのみテスト
})

// inventory-service.test.ts - 結合テスト
describe('InventoryService Integration Test', () => {
  // 実際のリポジトリ、UseCase、サービスを使用
  // データベースはインメモリDBまたはテストコンテナ
  // 外部APIのみモック
})
```

### Flutter テスト規約（Given-When-Then + Rails風ネスト構造 + 1 expect per test）

```dart
// ✅ 良い例: Given-When-Then形式 + 1つのtestWidgetsに1つのexpect (RSpec風)
void main() {
  group('InventoryItemCard', () {
    late InventoryItem testItem

    setUp(() {
      testItem = const InventoryItem(
        id: 'test-id',
        organizationId: 'org-id',
        name: 'Test Item',
        quantity: 10,
        unit: '個',
        expiryType: ExpiryType.bestBefore,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      )
    })

    group('Given inventory item with basic data', () {
      group('When widget is rendered', () {
        group('Then should display item information correctly', () {
          testWidgets('shows item name', (tester) async {
            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(item: testItem),
                ),
              ),
            )

            expect(find.text('Test Item'), findsOneWidget)
          })
          
          testWidgets('shows item quantity', (tester) async {
            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(item: testItem),
                ),
              ),
            )

            expect(find.text('10 個'), findsOneWidget)
          })
        })
      })

      group('When card is tapped', () {
        group('Then should call onTap callback', () {
          testWidgets('invokes onTap with true', (tester) async {
            bool wasTapped = false
            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(
                    item: testItem,
                    onTap: () => wasTapped = true,
                  ),
                ),
              ),
            )

            await tester.tap(find.byType(InventoryItemCard))
            await tester.pumpAndSettle()

            expect(wasTapped, isTrue)
          })
        })
      })
    })

    group('Given item expiring in 2 days', () {
      group('When widget is rendered', () {
        group('Then should show expiry status badge', () {
          testWidgets('displays ExpiryStatusBadge widget', (tester) async {
            final expiringItem = testItem.copyWith(
              expiryDate: DateTime.now().add(const Duration(days: 2)),
            )

            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(item: expiringItem),
                ),
              ),
            )

            expect(find.byType(ExpiryStatusBadge), findsOneWidget)
          })
        })
      })
    })
  })
}
```

## コミット・ブランチ規約

### コミットメッセージ規約

```bash
# ✅ 良い例: Conventional Commits
feat(inventory): add barcode scanning functionality
fix(auth): resolve token refresh issue
docs(api): update gRPC service documentation
test(inventory): add unit tests for InventoryItem entity
refactor(database): optimize inventory query performance
chore(deps): update Flutter dependencies

# 詳細な例
feat(inventory): implement expiry date management

- Add support for both expiry date and best-before date
- Implement expiry status calculation logic
- Add expiry alerts for items nearing expiration
- Update UI to display appropriate expiry warnings

Closes #123

# ❌ 悪い例
fix bug
update code
add feature
```

### ブランチ命名規約

```bash
# ✅ 良い例
feature/inventory-barcode-scanning
feature/auth-token-refresh
fix/inventory-quantity-validation
fix/grpc-connection-timeout
hotfix/critical-auth-vulnerability
release/v1.2.0
chore/update-dependencies

# ❌ 悪い例
new-feature
bug-fix
temp
test-branch
```

## パフォーマンス・セキュリティ規約

### パフォーマンス規約

```typescript
// ✅ 良い例: 効率的なデータベースクエリ
export class InventoryRepository {
  async findItemsWithExpiry(
    organizationId: OrganizationId,
    days: number
  ): Promise<InventoryItem[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    // インデックスを活用した効率的なクエリ
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        organizationId: organizationId.value,
        OR: [
          {
            expiryDate: {
              lte: futureDate,
            },
          },
          {
            bestBeforeDate: {
              lte: futureDate,
            },
          },
        ],
      },
      orderBy: [
        { expiryDate: 'asc' },
        { bestBeforeDate: 'asc' },
      ],
      // 必要なフィールドのみ選択
      select: {
        id: true,
        name: true,
        quantity: true,
        unit: true,
        expiryDate: true,
        bestBeforeDate: true,
        expiryType: true,
      },
    });

    return items.map(item => this.toDomain(item));
  }
}

// ❌ 悪い例: 非効率なクエリ
export class BadInventoryRepository {
  async findItemsWithExpiry(organizationId: string): Promise<any[]> {
    // 全件取得してアプリケーション側でフィルタリング（非効率）
    const allItems = await this.prisma.inventoryItem.findMany({
      where: { organizationId },
    });

    return allItems.filter(item => {
      // 複雑な計算をアプリケーション側で実行
      const daysUntilExpiry = calculateDaysUntilExpiry(item);
      return daysUntilExpiry <= 30;
    });
  }
}
```

```dart
// ✅ 良い例: Flutter パフォーマンス最適化
class InventoryListWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inventoryItems = ref.watch(inventoryItemsProvider);

    return inventoryItems.when(
      data: (items) => ListView.builder(
        // パフォーマンス最適化
        itemCount: items.length,
        itemExtent: 120, // 固定高さでスクロール性能向上
        cacheExtent: 1000, // キャッシュ範囲拡大
        itemBuilder: (context, index) {
          final item = items[index];
          return InventoryItemCard(
            key: ValueKey(item.id), // 効率的な再描画
            item: item,
            onTap: () => _navigateToDetail(context, item),
          );
        },
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => ErrorWidget(error),
    );
  }
}

// ❌ 悪い例: パフォーマンスを考慮しない実装
class BadInventoryListWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: fetchAllItems(), // 毎回再取得
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Column(
            children: snapshot.data!.map((item) => 
              ExpensiveWidget(item: item) // 重い処理を含むウィジェット
            ).toList(),
          );
        }
        return CircularProgressIndicator();
      },
    );
  }
}
```

### セキュリティ規約

```typescript
// ✅ 良い例: セキュアな実装
@Injectable()
export class InventoryGrpcService {
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  async createItem(
    request: CreateItemRequest,
    context: GrpcContext
  ): Promise<InventoryItem> {
    // 1. 入力値検証
    const validationResult = await this.validateInput(request);
    if (validationResult.isErr()) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid input',
      });
    }

    // 2. 認証・認可チェック
    const userId = context.getUser().id;
    const hasPermission = await this.authService.checkPermission(
      userId,
      request.organizationId,
      'inventory:write'
    );
    
    if (!hasPermission) {
      // セキュリティログ記録
      this.securityLogger.warn('Unauthorized inventory access attempt', {
        userId,
        organizationId: request.organizationId,
        action: 'create_item',
        ip: context.getClientIp(),
      });
      
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Insufficient permissions',
      });
    }

    // 3. 入力値サニタイゼーション
    const sanitizedRequest = {
      ...request,
      name: this.sanitizer.sanitize(request.name),
      notes: request.notes ? this.sanitizer.sanitize(request.notes) : undefined,
    };

    // 4. ビジネスロジック実行
    const result = await this.inventoryService.createItem(sanitizedRequest);
    
    // 5. 監査ログ記録
    this.auditLogger.info('Inventory item created', {
      userId,
      organizationId: request.organizationId,
      itemId: result.id,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  private async validateInput(request: CreateItemRequest): Promise<Result<void, ValidationError[]>> {
    const schema = z.object({
      organizationId: z.string().uuid(),
      name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_]+$/), // 安全な文字のみ
      quantity: z.number().min(0).max(999999),
      unit: z.string().min(1).max(20),
      // その他のバリデーション
    });

    try {
      schema.parse(request);
      return ok(undefined);
    } catch (error) {
      return err([new ValidationError('Invalid input format')]);
    }
  }
}

// ❌ 悪い例: セキュリティを考慮しない実装
@Injectable()
export class BadInventoryService {
  async createItem(request: any): Promise<any> {
    // 入力値検証なし
    // 認証・認可チェックなし
    // SQLインジェクション脆弱性
    const query = `INSERT INTO inventory_items (name, quantity) VALUES ('${request.name}', ${request.quantity})`;
    return await this.database.query(query);
  }
}
```

## まとめ

この規約に従うことで：

1. **型安全性**: コンパイル時エラー検出、ランタイムエラー削減
2. **簡潔性**: 最小限の記述量、セルフドキュメンティングコード
3. **保守性**: 一貫したコード構造、理解しやすいアーキテクチャ
4. **テスタビリティ**: 
   - Given-When-Then構造、Rails風ネストによる明確なテスト
   - `*.spec.ts` = 単体テスト（モック使用）
   - `*.test.ts` = 結合テスト（実依存関係使用）
5. **パフォーマンス**: const + アロー関数、効率的なクエリ
6. **セキュリティ**: 入力値検証、認証・認可、監査ログ
7. **スケーラビリティ**: DDD/Clean Architectureによる拡張性

**開発原則**:
- `function`より`const` + アロー関数を優先
- コメントより型とシグネチャで意図を表現
- 記述量は最小限（パフォーマンス影響がない限り）
- **if文・switch文では必ずブロック`{}`を使用**
- **関数・メソッドは25行以内に必ず収める（長い場合は分割）**
- **`then`チェーンは極力使わず、`async/await`で統一**
- **ファイル名は必ずケバブケース、ディレクトリでレイヤー表現時は接尾辞不要**
- **変数名・関数名はcamelCase、クラス・型名はPascalCase**
- **関数名・メソッド名は動詞で始める（action-oriented naming）**
- **boolean変数は`is`、`has`、`can`、`should`、`will`などの接頭語を使用**
- **ReactコンポーネントはPascalCase + named export（default export禁止）**
- **Custom Hookはuseプレフィックス + camelCase**
- **インターフェースは具体名、`I`プレフィックス・`***Interface`接尾辞禁止**
- **Enumは避けUnion型で表現、配列は`ReadonlyArray`推奨**
- **`interface`より`type`を優先、`type-fest`活用で複雑な型を簡潔に**
- **関数引数の型は抽出して定義、環境変数は`zod`で型安全に取得**
- **すべてのAs-Is系ドキュメントは自動生成（手動作成・更新禁止）**
- Given-When-Thenによる明確なテスト構造
- **1つのitに1つのexpect（RSpec風）**
- **`*.spec.ts` = 単体テスト（モック積極使用）**
- **`*.test.ts` = 結合テスト（モック最小限）**

すべての開発者がこの規約を遵守し、コードレビューで品質を担保することで、高品質で保守性の高い備蓄管理アプリケーションを構築できます。